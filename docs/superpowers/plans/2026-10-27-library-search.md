# Library Search Implementation Plan

**Goal:** Add local search to the existing study library without changing its layout or hosting model.

**Architecture:** The generator escapes title, category and description into each card's data-search attribute. library.js applies keyword matching and category matching together. Search controls remain hidden until JavaScript initializes.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, Node generator, Playwright CLI.

- [ ] Create a browser regression check for searching 数学 and observe failure before implementation.
- [ ] Update templates/library.html with a labelled search input and clear button, above collection-summary; update scripts/build-notes.cjs to emit escaped search text and change cache versions.
- [ ] Update library.js to trim/lowercase/split words, require every word to match data-search, combine category, show contextual empty results, and clear without losing category.
- [ ] Append responsive search styles to styles.css and regenerate with `node scripts/build-notes.cjs`.
- [ ] Validate desktop/mobile matching, whitespace, category intersection, no results, clear, safe special characters, and no-JavaScript fallback using Playwright CLI.
- [ ] Compare remote blob hashes, upload only changed files, commit with expected main head, sync dist, and verify successful Pages deployment plus public-site search.
