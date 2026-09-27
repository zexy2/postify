-- Suggested Corrections: private patch-style contribution workflow.
-- Suggestions never mutate a post automatically. Contributors can submit one
-- pending proposal per post; only the post author/admin can accept or reject it.

create table if not exists public.post_correction_suggestions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'technical'
    check (kind in ('technical','version','clarity','source','other')),
  summary text not null
    check (length(trim(summary)) between 8 and 280),
  proposed_change text not null
    check (length(trim(proposed_change)) between 16 and 4000),
  environment text not null default ''
    check (length(environment) <= 500),
  source_urls jsonb not null default '[]'::jsonb
    check (jsonb_typeof(source_urls) = 'array' and jsonb_array_length(source_urls) <= 5),
  status text not null default 'pending'
    check (status in ('pending','accepted','rejected','withdrawn')),
  resolution_note text not null default ''
    check (length(resolution_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create unique index if not exists post_correction_suggestions_one_pending_per_user_post
  on public.post_correction_suggestions(post_id,user_id)
  where status='pending';
create index if not exists post_correction_suggestions_post_queue_idx
  on public.post_correction_suggestions(post_id,status,created_at desc);
create index if not exists post_correction_suggestions_user_idx
  on public.post_correction_suggestions(user_id,created_at desc);

create or replace function public.correction_source_urls_valid(input jsonb)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
declare
  item jsonb;
  source text;
begin
  if jsonb_typeof(input) <> 'array' or jsonb_array_length(input) > 5 then return false; end if;
  for item in select value from jsonb_array_elements(input) loop
    if jsonb_typeof(item) <> 'string' then return false; end if;
    source := item #>> '{}';
    if length(source) > 1000 or source !~* '^https?://' then return false; end if;
  end loop;
  return true;
end;
$$;

alter table public.post_correction_suggestions
  drop constraint if exists post_correction_suggestions_safe_sources_check;
alter table public.post_correction_suggestions
  add constraint post_correction_suggestions_safe_sources_check
  check (public.correction_source_urls_valid(source_urls));

alter table public.post_correction_suggestions enable row level security;

-- Public capability metadata contains no user/content data. Deploys use it to
-- fail closed when the migration chain is only partially applied.
create or replace view public.knowledge_backend_capabilities as
select
  2::integer as schema_version,
  true::boolean as evidence_ready,
  true::boolean as corrections_ready;

-- Only the contributor and the affected post owner/admin can see raw proposals.
drop policy if exists "correction participants read" on public.post_correction_suggestions;
create policy "correction participants read"
on public.post_correction_suggestions for select to authenticated
using (
  auth.uid()=user_id
  or exists(
    select 1 from public.posts p
    where p.id=post_id
      and (p.author_id=auth.uid() or exists(select 1 from public.profiles where id=auth.uid() and role='admin'))
  )
);

-- A contributor can suggest a correction only for somebody else's published post.
drop policy if exists "contributors submit correction" on public.post_correction_suggestions;
create policy "contributors submit correction"
on public.post_correction_suggestions for insert to authenticated
with check (
  auth.uid()=user_id
  and status='pending'
  and resolution_note=''
  and resolved_at is null
  and exists(
    select 1 from public.posts p
    where p.id=post_id and p.is_published=true and p.author_id is distinct from auth.uid()
  )
);

-- No direct UPDATE/DELETE grant is exposed. State transitions go through
-- narrowly-scoped functions so neither party can rewrite the proposal body.
create or replace function public.withdraw_correction_suggestion(target_suggestion_id uuid)
returns public.post_correction_suggestions
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.post_correction_suggestions;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select * into target from public.post_correction_suggestions where id=target_suggestion_id;
  if target.id is null then raise exception 'suggestion not found'; end if;
  if target.user_id <> auth.uid() then raise exception 'not authorized'; end if;
  if target.status <> 'pending' then raise exception 'suggestion is not pending'; end if;

  update public.post_correction_suggestions
  set status='withdrawn', updated_at=now(), resolved_at=now()
  where id=target.id
  returning * into target;
  return target;
end;
$$;

create or replace function public.resolve_correction_suggestion(
  target_suggestion_id uuid,
  decision text,
  note text default ''
)
returns public.post_correction_suggestions
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.post_correction_suggestions;
  post_owner uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if decision not in ('accepted','rejected') then raise exception 'invalid decision'; end if;

  select * into target
  from public.post_correction_suggestions
  where id=target_suggestion_id;

  if target.id is null then raise exception 'suggestion not found'; end if;
  select p.author_id into post_owner from public.posts p where p.id=target.post_id;
  if not (
    post_owner=auth.uid()
    or exists(select 1 from public.profiles where id=auth.uid() and role='admin')
  ) then raise exception 'not authorized'; end if;
  if target.status <> 'pending' then raise exception 'suggestion is not pending'; end if;

  update public.post_correction_suggestions
  set status=decision,
      resolution_note=left(coalesce(note,''),1000),
      updated_at=now(),
      resolved_at=now()
  where id=target.id
  returning * into target;
  return target;
end;
$$;

revoke all on public.post_correction_suggestions from anon;
revoke all on public.post_correction_suggestions from authenticated;
grant select,insert on public.post_correction_suggestions to authenticated;
grant select on public.knowledge_backend_capabilities to anon, authenticated;

revoke all on function public.withdraw_correction_suggestion(uuid) from public;
revoke all on function public.resolve_correction_suggestion(uuid,text,text) from public;
grant execute on function public.withdraw_correction_suggestion(uuid) to authenticated;
grant execute on function public.resolve_correction_suggestion(uuid,text,text) to authenticated;
