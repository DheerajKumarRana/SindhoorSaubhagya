-- 7. Shortlist Table
create table public.shortlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  shortlisted_profile_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, shortlisted_profile_id)
);

alter table public.shortlist enable row level security;

create policy "Users can view own shortlist"
  on public.shortlist for select
  using ( auth.uid() = user_id );

create policy "Users can add to own shortlist"
  on public.shortlist for insert
  with check ( auth.uid() = user_id );

create policy "Users can remove from own shortlist"
  on public.shortlist for delete
  using ( auth.uid() = user_id );


-- 8. Profile Views Table
create table public.profile_views (
  id uuid default gen_random_uuid() primary key,
  viewer_id uuid references auth.users not null,
  viewed_profile_id uuid references public.profiles(id) not null,
  viewed_at timestamp with time zone default now()
);

alter table public.profile_views enable row level security;

create policy "Users can insert their own views"
  on public.profile_views for insert
  with check ( auth.uid() = viewer_id );

create policy "Users can see who viewed them"
  on public.profile_views for select
  using ( auth.uid() = viewed_profile_id );

-- 9. Notifications Table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'shortlist', 'view', 'request_received', 'request_accepted'
  message text not null,
  data jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using ( auth.uid() = user_id );

create policy "Users can update own notifications"
  on public.notifications for update
  using ( auth.uid() = user_id );

-- 10. Admin Users Table
create table public.admin_users (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

alter table public.admin_users enable row level security;

-- Only service role can manage admins initially, or specific policy
-- For now, let's allow read if you differ from user_id (conceptual, usually restricted)

-- 11. Notification Triggers

-- Trigger for Shortlist
create or replace function public.handle_shortlist_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, message, data)
  values (
    new.shortlisted_profile_id,
    'shortlist',
    'Someone shortlisted your profile!',
    jsonb_build_object('shortlisted_by', new.user_id)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_shortlist_added
  after insert on public.shortlist
  for each row execute function public.handle_shortlist_notification();

-- Trigger for Profile View
create or replace function public.handle_profile_view_notification()
returns trigger as $$
begin
  -- Optional: check if notification already exists for today to avoid spam?
  -- For MVP, just insert
  if new.viewer_id != new.viewed_profile_id then
      insert into public.notifications (user_id, type, message, data)
      values (
        new.viewed_profile_id,
        'view',
        'Someone viewed your profile!',
        jsonb_build_object('viewed_by', new.viewer_id)
      );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_viewed
  after insert on public.profile_views
  for each row execute function public.handle_profile_view_notification();
