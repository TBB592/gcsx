# VitePress content publishing implementation

Goal: Preserve the campus UI and legacy URLs while letting PDF and Markdown content drive the site.

Architecture: VitePress custom theme renders existing PDF layouts and Markdown pages; a validated content catalog lives in TBB592/gcsx-content. GitHub Actions checks fixed content revisions, caches PDF previews, builds and deploys a complete Pages artifact atomically.

- [ ] Add failing catalog tests for human-readable metadata, traversal, duplicate slugs and Markdown support.
- [ ] Add content validation and cached content preparation using Poppler. Preserve three published PDF byte hashes and paths.
- [ ] Add VitePress custom theme and safe Markdown pages, preserving legacy CSS, scripts and navigation.
- [ ] Verify actual content build, warm cache, search, filters, mobile/desktop, first/last PDF pages, old links and Markdown fixture.
- [ ] Create content repo containing only previously published PDFs and an explicit catalog/maintenance guide.
- [ ] Add hourly/manual/push workflow with content revision check, cache and Pages artifact deployment. Publish code and switch Pages after validation.
- [ ] Verify cloud build and public pages, document maintenance and rollback.
