-- Stage-vetted Postify RLS defense in depth.
-- A user may create/update their own public profile but must never assign
-- themselves moderator/admin through a browser client.
-- Trusted server-side role administration requires a separately reviewed path.

revoke insert, update on public.profiles from anon, authenticated;

-- Auth fallback upsert writes ordinary profile attributes only. These grants
-- intentionally exclude role/id changes during UPDATE and role on INSERT.
grant insert (id, email, username, full_name, avatar_url, bio, website, location)
  on public.profiles to authenticated;
grant update (email, username, full_name, avatar_url, bio, website, location, updated_at)
  on public.profiles to authenticated;

-- The profile owner still needs the existing id-based RLS policies; column
-- privileges are an additional barrier, never a substitute for RLS.
