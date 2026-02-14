-- 1. Connection Requests Table
create table if not exists public.connection_requests (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users not null,
  receiver_id uuid references public.profiles(id) not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(sender_id, receiver_id)
);

alter table public.connection_requests enable row level security;

-- RLS Policies
create policy "Users can see requests they sent or received"
  on public.connection_requests for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can send requests"
  on public.connection_requests for insert
  with check ( auth.uid() = sender_id );

create policy "Users can update requests they received (accept/reject)"
  on public.connection_requests for update
  using ( auth.uid() = receiver_id );

create policy "Users can delete their own sent requests"
  on public.connection_requests for delete
  using ( auth.uid() = sender_id );

-- 2. Triggers for Notifications

-- Notification when request is SENT
create or replace function public.handle_connection_request_sent()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, message, data)
  values (
    new.receiver_id,
    'request_received',
    'You have received a new connection request!',
    jsonb_build_object('sender_id', new.sender_id)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_connection_request_sent
  after insert on public.connection_requests
  for each row execute function public.handle_connection_request_sent();

-- Notification when request is ACCEPTED
create or replace function public.handle_connection_request_accepted()
returns trigger as $$
begin
  if new.status = 'accepted' and old.status = 'pending' then
    insert into public.notifications (user_id, type, message, data)
    values (
      new.sender_id,
      'request_accepted',
      'Your connection request was accepted!',
      jsonb_build_object('accepted_by', new.receiver_id)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_connection_request_accepted
  after update on public.connection_requests
  for each row execute function public.handle_connection_request_accepted();
