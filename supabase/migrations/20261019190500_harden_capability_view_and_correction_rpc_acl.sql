-- Staging security advisor follow-up: close unintended anonymous execution
-- of privileged correction transitions. Authenticated calls still require
-- function-internal actor authorization and need real A/B testing.

alter view public.knowledge_backend_capabilities set (security_invoker = true);

-- Supabase can assign explicit default EXECUTE to anon, so revoking only
-- from PUBLIC does not clear the direct anon grant.
revoke execute on function public.withdraw_correction_suggestion(uuid) from anon;
revoke execute on function public.resolve_correction_suggestion(uuid,text,text) from anon;
