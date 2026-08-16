-- ============================================================
-- TABLE: facilities
-- ============================================================
create table public.facilities (
  id          serial primary key,
  name        text not null,
  address     text not null,
  image_url   text not null default 'https://cdn.pixabay.com/photo/2024/09/11/09/04/padel-9039323_1280.jpg'
);

insert into public.facilities (name, address, image_url)
values
  ('Nordic Wellness Linköping Tornby Padel', 'Fröstorpsgatan 10, Linköping', 'https://assets.matchi.se/archive/2022/03/thumb_ae073ee112b48cbd025a020a1d9774fc.jpg'),
  ('Alfa Padel & Co', 'Industrigatan 5, Linköping', 'https://assets.matchi.se/archive/2023/04/thumb_f448d8b5ead524f9b857174c2e2d4ebd.jpg'),
  ('Torvinge Padel Arena', 'Idögatan 8, Linköping', 'https://assets.matchi.se/archive/2023/10/thumb_310d812d143b2903dd86d8c82d83164f.jpg'),
  ('Peking Padel Norrköping', 'Kiselgatan 33, Norrköping', 'https://assets.matchi.se/archive/2023/03/thumb_0d76cdd8454f033f96c38d669eac4847.jpg');


-- ============================================================
-- TABLE: profiles (extends auth.users)
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  rating integer not null default 1000,
  created_at    timestamptz default now() -- For analytics
);

-- ============================================================
-- TABLE: memberships (user joins facility)
-- ============================================================
create table public.memberships (
  id           serial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  facility_id  integer not null references public.facilities(id) on delete cascade,
  joined_at    timestamptz default now(), -- For analytics

  unique (user_id, facility_id)
);

-- ============================================================
-- TABLE: challenges (user challenges another user)
-- ============================================================
create table public.challenges (
  id               serial primary key,
  status           text not null check (status in ('pending', 'accepted', 'denied', 'completed')),
  sent_at          timestamptz default now(),

  sender_user_id   uuid not null references auth.users(id) on delete cascade,
  receiver_user_id uuid not null references auth.users(id) on delete cascade,
  winner_user_id   uuid references auth.users(id),

  facility_id      integer not null references public.facilities(id) on delete cascade
);

-- ============================================================
-- TABLE: messages (chat messages inside challenge)
-- ============================================================
create table public.messages (
  id             serial primary key,
  sent_at        timestamptz default now(),
  content        text not null,

  challenge_id   integer not null references public.challenges(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade
);

-- ============================================================
-- TABLE: initial_ratings 
-- (the allowed ratings when creating a profile)
-- ============================================================
create table public.initial_ratings (
  rating integer primary key
);

insert into public.initial_ratings (rating)
values (500), (750), (1000), (1250), (1500);

-- ============================================================
-- VIEW: facility_leaderboard 
-- ============================================================
create view public.facility_leaderboard as
select
  m.facility_id,
  m.user_id,
  p.first_name,
  p.last_name,
  p.rating
from public.memberships m
join public.profiles p on p.id = m.user_id
order by m.facility_id, m.rating desc;