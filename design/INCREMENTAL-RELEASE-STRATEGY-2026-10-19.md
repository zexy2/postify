# Postify — progressive release and safe preview strategy

**Status:** User agreed "tamam devam edelim" after proposed staged releases (preview → minimum safe public slice → optional authenticated capabilities). This records a workflow and conditions, NOT approval to push, publish, merge, migrate or deploy.

## Release lanes

1. **Isolated coding/review lane:** Work in existing Oracle task worktree; main and production untouched. Build/test exact candidate on Node24. Screenshots are actual coded browser state, not AI imagery.
2. **Private preview:** External URL only after separate approval and access controls, no production data, defined expiry and preview config. Localhost preview is not staging signoff.
3. **Public v1 read-only slice:** Home, discovery, post reading, public About/Contact only after scoped visual acceptance. Backend capability/verification status must be true. Exclude unfinished auth/edit/admin/write features through tested, explicit gates; hidden link alone never suffices as authorization.
4. **Authenticated increments:** Editor, profiles, correction, knowledge/admin only after separate Supabase staging A/B/C OAuth, RLS/CRUD and storage role verification and owner approval.
5. **Gates per release:** Exact SHA CI, relevant snapshot decision, keyboard/native WCAG2.2 AA, mobile performance and field CWV where available, secure config, owner GO, production smoke/rollback. Never silently update snapshot goldens.

## First increment (this turn)

- Scoped modern editorial About + Contact under CD-016 and approved CD-003 PL-01; preserve actual routes, public contact channels, localized copy. Do NOT fabricate a contact form or submission action. Approved global PL-01/Home/Article/Author remain unchanged.
- Build a real React/CSS candidate in isolated branch; inspect actual local Chromium mobile/desktop light/dark views. Preserve reduced-motion and minimum 44px targets.
- 81 historical screenshots including eight About/Contact cases remain owner-pending; CD-014 is exploration, not pixel approval.

## Release boundary

No Git push/remote PR merge, external URL preview, hosted staging/prod database operations or deployment without separately authorized gate. Production still NO-GO pending real RLS/OAuth, visual decisions, manual AT and mobile performance.
