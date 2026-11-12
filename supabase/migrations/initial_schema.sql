-- =============================================================================
-- Project:     PawBuddies
-- Migration:   20261106000000_initial_schema.sql
-- Date:        2026-11-06
-- Description: Initial schema for the PawBuddies pet-products e-commerce.
--              Replaces the hardcoded product array in FeaturedProducts.tsx and
--              the in-memory cart (CartContext.tsx) with persistent tables:
--                categories   -> product grouping for navigation and filters
--                products     -> public catalog
--                profiles     -> one row per auth user (1:1 with auth.users)
--                orders       -> one row per checkout (1:N with users)
--                order_items  -> resolves the N:M between orders and products
--
-- Security model (least privilege):
--   * Anonymous visitors can only READ active products and categories.
--   * Logged-in users can read/update their own profile and read their own orders.
--   * Orders are NEVER inserted directly from the frontend. Checkout goes through
--     the create_order() function, which recalculates prices server-side so a
--     user cannot tamper with prices or totals from the browser.
--   * Catalog writes (products/categories) have no client policy at all: they are
--     managed from the Supabase dashboard or with the service_role key.
--
-- Run order: this file first, then supabase/seed.sql.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Shared helpers
-- -----------------------------------------------------------------------------

-- Generic trigger function that keeps updated_at in sync on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger helper: stamps updated_at with the current time on every update.';


-- -----------------------------------------------------------------------------
-- 1. categories
-- -----------------------------------------------------------------------------
create table public.categories (
  id          uuid        primary key default gen_random_uuid(), -- Surrogate key
  slug        text        not null unique,                        -- URL-safe key, e.g. 'alimento'
  name        text        not null,                               -- Display name shown in the UI
  description text,                                               -- Optional marketing copy
  sort_order  integer     not null default 0,                     -- Controls menu ordering
  created_at  timestamptz not null default now(),                 -- Audit timestamp
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on table  public.categories            is 'Product groups used for navigation and filtering.';
comment on column public.categories.slug       is 'Lowercase, hyphenated identifier used in URLs.';
comment on column public.categories.sort_order is 'Lower numbers appear first in menus.';


-- -----------------------------------------------------------------------------
-- 2. products
-- -----------------------------------------------------------------------------
create table public.products (
  id          uuid          primary key default gen_random_uuid(),       -- Surrogate key
  sku         text          not null unique,                              -- Business key (legacy ids p1..p4 kept here)
  category_id uuid          references public.categories (id)
                            on delete set null,                           -- FK: 1 category -> N products
  name        text          not null check (length(trim(name)) > 0),      -- Product name, never blank
  description text,                                                       -- Long description for detail page
  price       numeric(10,2) not null check (price >= 0),                  -- Current retail price (USD)
  image_path  text,                                                       -- Object path inside the product-images bucket
  tag         text,                                                       -- Badge shown on the card ('Nuevo', 'Best seller')
  stock       integer       not null default 0 check (stock >= 0),        -- Units available
  is_featured boolean       not null default false,                       -- Shown in the "Destacados" section
  is_active   boolean       not null default true,                        -- Soft-delete / hide from catalog
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

comment on table  public.products             is 'Public product catalog. Replaces the hardcoded array in FeaturedProducts.tsx.';
comment on column public.products.sku         is 'Stable business identifier. Legacy frontend ids (p1..p4) are preserved here.';
comment on column public.products.price       is 'Current retail price in USD. Historical prices live in order_items.unit_price.';
comment on column public.products.image_path  is 'Path inside the public "product-images" Storage bucket, e.g. product-food.png.';
comment on column public.products.is_featured is 'True for products rendered in the featured section of the home page.';
comment on column public.products.is_active   is 'Inactive products are hidden from the storefront but kept for order history.';

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 3. profiles (1:1 with auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id               uuid        primary key
                               references auth.users (id) on delete cascade, -- PK and FK: exactly one profile per user
  full_name        text,                                                     -- Customer display name
  phone            text,                                                     -- Contact phone for delivery
  shipping_address text,                                                     -- Default delivery address
  city             text,                                                     -- Used for shipping estimates
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table  public.profiles    is 'Customer data that does not belong in auth.users. Created automatically on sign-up.';
comment on column public.profiles.id is 'Same value as auth.users.id, which enforces the 1:1 relationship.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Automatically create an empty profile whenever a new auth user signs up.
-- SECURITY DEFINER is required because the auth schema runs as a different role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Creates a profiles row for each new auth.users row (sign-up hook).';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 4. orders (1:N with users)
-- -----------------------------------------------------------------------------
create table public.orders (
  id               uuid          primary key default gen_random_uuid(),
  user_id          uuid          not null
                                 references auth.users (id) on delete cascade, -- FK: 1 user -> N orders
  status           text          not null default 'pending'
                                 check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total            numeric(10,2) not null default 0 check (total >= 0),         -- Sum of order_items, set by create_order()
  currency         text          not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  shipping_address text,                                                        -- Snapshot of the address at checkout
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now()
);

comment on table  public.orders                  is 'One row per checkout. Replaces the in-memory cart once the user pays.';
comment on column public.orders.status           is 'Lifecycle: pending -> paid -> shipped -> delivered, or cancelled.';
comment on column public.orders.total            is 'Computed server-side by create_order(); never trusted from the client.';
comment on column public.orders.shipping_address is 'Copied at checkout so later profile edits do not rewrite history.';

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 5. order_items (junction table for the N:M orders <-> products)
-- -----------------------------------------------------------------------------
create table public.order_items (
  id         uuid          primary key default gen_random_uuid(),
  order_id   uuid          not null references public.orders (id) on delete cascade,     -- Deleting an order removes its lines
  product_id uuid          not null references public.products (id) on delete restrict, -- Cannot delete a product that was sold
  quantity   integer       not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),                             -- Price snapshot at purchase time
  created_at timestamptz   not null default now(),
  constraint order_items_order_product_unique unique (order_id, product_id)            -- One line per product per order
);

comment on table  public.order_items            is 'Junction table resolving the N:M relationship between orders and products.';
comment on column public.order_items.unit_price is 'Intentional denormalization: historical price, independent of future price changes.';


-- -----------------------------------------------------------------------------
-- 6. Indexes
-- -----------------------------------------------------------------------------
-- Category filter on the storefront ("show me all toys").
create index products_category_id_idx on public.products (category_id);

-- Featured section only scans the small set of active featured products.
create index products_featured_idx on public.products (is_featured) where is_active;

-- "My orders" page: newest orders of a single user.
create index orders_user_created_idx on public.orders (user_id, created_at desc);

-- Foreign keys are not indexed automatically in PostgreSQL.
create index order_items_order_id_idx   on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);


-- -----------------------------------------------------------------------------
-- 7. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- categories: public read. Without it, the storefront menu would be empty.
-- No write policy on purpose: categories are managed from the dashboard.
create policy "Categories are publicly readable"
  on public.categories for select
  to anon, authenticated
  using (true);

-- products: public read of ACTIVE products only. Without the is_active filter,
-- hidden or discontinued products would leak into the storefront.
-- No write policy on purpose: only the dashboard/service_role edits the catalog.
create policy "Active products are publicly readable"
  on public.products for select
  to anon, authenticated
  using (is_active);

-- profiles: owner-only read. Without it, any user could read everyone's
-- phone numbers and addresses.
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- profiles: owner-only update. WITH CHECK prevents re-assigning the row to
-- another user id. No INSERT policy: handle_new_user() creates the row.
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- orders: owner-only read. Without it, users could see other customers' purchases.
-- No INSERT/UPDATE/DELETE policies: orders are created by create_order() and
-- status changes happen server-side (dashboard, webhooks, Edge Functions).
create policy "Users can read their own orders"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- order_items: readable only if the parent order belongs to the user.
-- Without it, order lines (and what other people bought) would be exposed.
create policy "Users can read items of their own orders"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = (select auth.uid())
    )
  );


-- -----------------------------------------------------------------------------
-- 8. Explicit grants (RLS filters rows; grants decide which commands exist at all)
-- -----------------------------------------------------------------------------
-- Supabase grants ALL on new public tables to anon/authenticated by default.
-- Revoke first, then grant back only what the frontend actually needs.
revoke all on public.categories, public.products, public.profiles,
              public.orders, public.order_items from anon, authenticated;

grant select on public.categories, public.products         to anon, authenticated;
grant select on public.profiles, public.orders, public.order_items to authenticated;
grant update (full_name, phone, shipping_address, city) on public.profiles to authenticated;


-- -----------------------------------------------------------------------------
-- 9. Checkout function
-- -----------------------------------------------------------------------------
-- Creates an order from the cart in a single transaction.
-- Input example: '[{"product_id": "<uuid>", "quantity": 2}]'
-- Prices come from the products table, never from the client payload.
create or replace function public.create_order(
  p_items            jsonb,
  p_shipping_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id  uuid := auth.uid();
  v_order_id uuid;
  v_missing  integer;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to place an order';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'The cart is empty';
  end if;

  -- Normalize the payload: merge duplicate products and validate quantities.
  -- Clean up if create_order() already ran earlier in this same transaction.
  if to_regclass('pg_temp.cart_lines') is not null then
    drop table pg_temp.cart_lines;
  end if;
  create temporary table cart_lines on commit drop as
  select (item ->> 'product_id')::uuid    as product_id,
         sum((item ->> 'quantity')::int)  as quantity
  from jsonb_array_elements(p_items) as item
  group by 1;

  if exists (select 1 from pg_temp.cart_lines where quantity is null or quantity <= 0) then
    raise exception 'Every item needs a positive quantity';
  end if;

  -- Reject unknown or inactive products.
  select count(*) into v_missing
  from pg_temp.cart_lines c
  left join public.products p on p.id = c.product_id and p.is_active
  where p.id is null;

  if v_missing > 0 then
    raise exception 'Cart contains % unavailable product(s)', v_missing;
  end if;

  -- Lock the product rows first so concurrent checkouts cannot oversell.
  perform 1
  from public.products p
  join pg_temp.cart_lines c on c.product_id = p.id
  for update of p;

  -- Make sure there is enough stock for every line.
  if exists (
    select 1
    from pg_temp.cart_lines c
    join public.products p on p.id = c.product_id
    where p.stock < c.quantity
  ) then
    raise exception 'Not enough stock for one or more products';
  end if;

  insert into public.orders (user_id, shipping_address)
  values (
    v_user_id,
    coalesce(p_shipping_address,
             (select pr.shipping_address from public.profiles pr where pr.id = v_user_id))
  )
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, quantity, unit_price)
  select v_order_id, c.product_id, c.quantity, p.price
  from pg_temp.cart_lines c
  join public.products p on p.id = c.product_id;

  update public.products p
  set stock = p.stock - c.quantity
  from pg_temp.cart_lines c
  where p.id = c.product_id;

  update public.orders o
  set total = (select sum(oi.quantity * oi.unit_price)
               from public.order_items oi
               where oi.order_id = v_order_id)
  where o.id = v_order_id;

  return v_order_id;
end;
$$;

comment on function public.create_order(jsonb, text) is
  'Checkout entry point: validates the cart, snapshots prices, decrements stock and returns the new order id.';

-- Only signed-in users may call checkout.
revoke execute on function public.create_order(jsonb, text) from public, anon;
grant  execute on function public.create_order(jsonb, text) to authenticated;


-- -----------------------------------------------------------------------------
-- 10. Storage bucket for product images
-- -----------------------------------------------------------------------------
-- Public bucket: anyone can download images via their public URL.
-- Uploads are done from the dashboard, so no INSERT policy is defined.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;


-- =============================================================================
-- SIGUIENTES PASOS / NEXT STEPS
-- -----------------------------------------------------------------------------
-- 1. Storage: upload product-food.png, product-toy.png, product-collar.png and
--    product-bed.png (from src/assets/) to the "product-images" bucket.
-- 2. Auth: enable Email provider in Authentication > Providers. For local
--    testing, create a user in Authentication > Users > Add user with the email
--    test@pawbuddies.dev, then run supabase/seed.sql to get sample orders.
-- 3. Frontend: build image URLs with
--    supabase.storage.from('product-images').getPublicUrl(product.image_path)
--    and place orders with supabase.rpc('create_order', { p_items: [...] }).
-- 4. Payments: when a payment provider is added, move status from 'pending'
--    to 'paid' from an Edge Function webhook, never from the browser.
-- =============================================================================
