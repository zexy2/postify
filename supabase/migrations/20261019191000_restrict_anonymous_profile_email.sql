-- Prevent unauthenticated visitors from harvesting profile emails.
-- Keep public author display fields readable without granting email.
-- Authenticated cross-account email reads require a separate server-side
-- authorization design before real-user onboarding.
revoke select on public.profiles from anon;
grant select (id, username, full_name, avatar_url, bio, website, location, role, created_at, updated_at)
  on public.profiles to anon;
