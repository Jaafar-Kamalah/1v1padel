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
  created_at    timestamptz not null default now() -- For analytics
);

-- ============================================================
-- TABLE: memberships (user joins facility)
-- ============================================================
create table public.memberships (
  id           serial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  facility_id  integer not null references public.facilities(id) on delete cascade,
  joined_at    timestamptz not null default now(), -- For analytics

  unique (user_id, facility_id)
);

-- Set replica identity for realtime updates
alter table public.memberships replica identity full;

-- ============================================================
-- TABLE: challenges (user challenges another user)
-- ============================================================
create table public.challenges (
  id               serial primary key,
  status           text not null check (status in ('pending', 'accepted', 'denied', 'completed')),
  sent_at          timestamptz not null default now(),

  sender_user_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_user_id uuid not null references public.profiles(id) on delete cascade,
  winner_user_id   uuid references auth.users(id),

  facility_id      integer not null references public.facilities(id) on delete cascade
);

-- ============================================================
-- TABLE: messages (chat messages inside challenge)
-- ============================================================
create table public.messages (
  id             serial primary key,
  sent_at        timestamptz not null default now(),
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
order by m.facility_id, p.rating desc;

-- ============================================================
-- ROW LEVEL SECURITY 
-- (deny access to these tables if no bypass policy exists)
-- ============================================================
alter table public.facilities      enable row level security;
alter table public.profiles        enable row level security;
alter table public.memberships     enable row level security;
alter table public.challenges      enable row level security;
alter table public.messages        enable row level security;
alter table public.initial_ratings enable row level security;

-- ============================================================
-- facilities policies: users can see all facilities
-- ============================================================
grant select on public.facilities to anon, authenticated;

create policy "Users can view facilities"
on public.facilities for select
to anon, authenticated 
using (true);

-- ============================================================
-- profiles policies: users can see & create their own profiles
-- ============================================================
grant insert (id, first_name, last_name, rating) on public.profiles to authenticated;
grant select on public.profiles to authenticated;

create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using (true);

create policy "Users can create their own profile"
on public.profiles for insert
to authenticated
with check (
  id = auth.uid() and
  rating in (select rating from public.initial_ratings)
);

-- ============================================================
-- memberships policies: users can see all membership and 
-- create/delete their own memberships
-- ============================================================
grant insert (user_id, facility_id) on public.memberships to authenticated;
grant select, delete on public.memberships to authenticated;

create policy "Users can view their all memberships"
on public.memberships for select
to authenticated
using (true);

create policy "Users can create their own membership"
on public.memberships for insert
to authenticated
with check (
  -- user must hava profile
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
  )
  -- user can only insert their own membership
  and user_id = auth.uid()
);

create policy "Users can delete their own membership"
on public.memberships for delete
to authenticated
using (user_id = auth.uid());

-- ============================================================
-- challenges policies: users can see and send new challenges,
-- users can update the status and winner of their challenges
-- ============================================================
grant insert (sender_user_id, receiver_user_id, facility_id, status) on public.challenges to authenticated;
grant select, update on public.challenges to authenticated;

create policy "Users can view their own challenge"
on public.challenges for select
to authenticated
using (auth.uid() in (sender_user_id, receiver_user_id));

create policy "Users can send a challenge to someone else"
on public.challenges for insert
to authenticated
with check (
  sender_user_id = auth.uid()
  and receiver_user_id != auth.uid()
  and status = 'pending'

  -- Sender is a member of the facility
  and exists (
    select 1
    from public.memberships m
    where m.user_id = sender_user_id
      and m.facility_id = challenges.facility_id
  )

  -- Receiver is a member of the same facility
  and exists (
    select 1
    from public.memberships m
    where m.user_id = receiver_user_id
      and m.facility_id = challenges.facility_id
  )
);

create policy "Users can update the status and winner of a challenge"
on public.challenges for update
to authenticated
using (auth.uid() in (sender_user_id, receiver_user_id))
with check (
  winner_user_id is null or 
  winner_user_id in (sender_user_id, receiver_user_id)
);

-- prevent invalid updates of challenge 
create or replace function public.validate_challenge_update()
returns trigger as $$
begin
  -- make all field except  status and winner immutable
  if new.sender_user_id != old.sender_user_id or
     new.receiver_user_id != old.receiver_user_id or
     new.facility_id != old.facility_id or
     new.id != old.id or 
     new.sent_at != old.sent_at then
    raise exception 'can only change status and winner'; 
  end if;

  -- pending challenge update handling
  if OLD.status = 'pending' then
    if NEW.status not in ('pending', 'accepted', 'denied') then
      raise exception 'invalid status transition from pending';
    end if;

    -- only the receiver can accept/deny
    if NEW.status != OLD.status
       and auth.uid() != OLD.receiver_user_id then
      raise exception 'only the receiver can accept or deny a challenge';
    end if;

    -- winner cannot be set while pending
    if NEW.winner_user_id is not null then
      raise exception 'cannot set winner while challenge is pending';
    end if;

  -- accepted challenge update handling
  elsif OLD.status = 'accepted' then

    -- if a winner is selected, automatically complete it
    if NEW.winner_user_id is not null then
      NEW.status := 'completed';
    else
      NEW.status := 'accepted';
    end if;

    -- don't allow accepted -> denied/pending
    if NEW.status not in ('accepted', 'completed') then
      raise exception 'invalid status transition from accepted';
    end if;

  -- completed/denied challenges are immutable
  elsif OLD.status in ('completed', 'denied') then
    raise exception 'completed or denied challenges cannot be modified';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger challenges_update_trigger
before update on public.challenges
for each row execute function public.validate_challenge_update();

-- prevent invalid updates of challenge 
create or replace function public.update_ratings()
returns trigger as $$
begin
  -- Trigger once a challenge transitions into completed status
  if new.status = 'completed' and old.status != 'completed' then
    -- Winner gets +25 points to their rating
    update public.profiles
    set rating = rating + 25
    where id = new.winner_user_id;
    -- Loser gets -25 points to their rating
    update public.profiles
    set rating = rating - 25
    where id in (new.sender_user_id, new.receiver_user_id)
      and id != new.winner_user_id;

  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger ratings_update_trigger
after update on public.challenges
for each row execute function public.update_ratings();

-- ============================================================
-- messages policies: users can see and send new messages
-- ============================================================
grant select on public.messages to authenticated;
grant insert (content, challenge_id, sender_user_id) on public.messages to authenticated;

create policy "Users can view their sent and received messages"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.challenges c
    where c.id = messages.challenge_id and 
          auth.uid() in (c.sender_user_id, c.receiver_user_id)
  )
);

create policy "Users can send messages"
on public.messages for insert
to authenticated
with check (
  sender_user_id = auth.uid() and
  content is not null and
  exists (
    select 1 from public.challenges c
    where c.id = messages.challenge_id and 
    auth.uid() in (c.sender_user_id, c.receiver_user_id)
  )
);

-- ============================================================
-- initial_ratings policies: everyone can see all initial_ratings
-- ============================================================
grant select on public.initial_ratings to anon;
grant select on public.initial_ratings to authenticated;

create policy "Everyone can view initial ratings"
on public.initial_ratings for select
to anon, authenticated
using (true);

-- ============================================================
-- facility_leaderboard policies: users can view leaderboards
-- ============================================================
grant select on public.facility_leaderboard to authenticated;

-- No RLS policy needed since RLS applies to base tables, not views

-- NOTE: Unless security invoker is used for a view it is called
-- with creators role (in this case superprivlidges). 