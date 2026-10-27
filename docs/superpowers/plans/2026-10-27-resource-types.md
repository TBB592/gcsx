# Resource Types Implementation Plan

**Goal:** Add the approved content categories while preserving the existing design.

**Architecture:** Generate data-type on cards and actual per-type counts; combine type, course-area and search filtering in library.js. Use hidden course subcategory controls, expanded by course/area navigation.

**Tech Stack:** Static HTML/CSS/JS, Node generator, Playwright CLI.

- [ ] Run verify-categories.js before changes and confirm missing course category failure.
- [ ] Extend generator validation and labels for courses/course-guide/campus-life, default existing notes to courses; emit actual category counts and escaped search metadata.
- [ ] Update template with four primary categories and nested science/humanities buttons; update empty states and mobile wrapping styles.
- [ ] Generate pages and verify category/search interactions at 360px/1280px. Confirm all original reading links remain available.
- [ ] Document future type/area configuration. Publish only changed files with expected branch head and verify Pages plus public category behavior.
