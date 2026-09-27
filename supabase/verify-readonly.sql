-- Migration + seed sonrası yalnızca okuma yapan smoke testleri.

select id, slug, category, cover_image_url, reading_time, is_published
from public.posts
where is_published = true
order by published_at desc;

select p.slug, t.locale, t.title, left(t.body, 120) as body_preview
from public.posts p
join public.post_translations t on t.post_id = p.id::text
where p.is_published = true
order by p.slug, t.locale;

select c.id, c.post_id, c.author_id, c.content, c.created_at
from public.comments c
join public.posts p on p.id = c.post_id
where p.is_published = true
order by c.created_at desc
limit 20;

select
  (select count(*) from public.posts where is_published = true) as published_posts,
  (select count(*) from public.comments) as comments,
  (select count(distinct author_id) from public.posts where is_published = true) as authors;

-- Safe feature capability metadata; contains no contributor/content rows.
select schema_version, evidence_ready, corrections_ready
from public.knowledge_backend_capabilities;

-- Suggested Corrections raw rows stay private. Verify only schema/function presence here.
select table_name
from information_schema.tables
where table_schema='public' and table_name='post_correction_suggestions';

select proname
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and proname in ('withdraw_correction_suggestion','resolve_correction_suggestion')
order by proname;
