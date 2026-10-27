# Scenario translation synchronization — 2026-10-27

Korean source commit: `4a5ca6b5e3b333085beb035489fadbd1cdecd501`.

The 201 changed Korean nodes are synchronized into English, Japanese, Spanish,
French, German, Brazilian Portuguese, and Simplified Chinese: 1,407 translated
node updates across 133 JSON files. Each source edit changes one paragraph.
The corresponding translated paragraph was rewritten from Korean; unchanged
paragraphs, choice text, choice ordering, node IDs, and game logic were preserved.
The Korean files and `SCENARIO.md` remain unchanged in this translation release.

The opening now preserves the left-hand detail, the unfamiliar bell that the
protagonist's steps already follow, and the glance toward the corridor before
checking the map. The safety-app chronology is consistent: a provisional QR
download on Day 1, formal student registration and the Smart Campus module on
Day 2, then discovery of an unrequested hidden administrator profile on Day 4.
The Day 4 line no longer denies installing the app itself.

The implementing assistant authored and compared the translations against the
Korean changes. No external native-speaker review was performed. The source and
translation hashes, all 201 file/node references, and per-language character
counts are in `translation-sync-20261027.json`. Its generation check verifies
that every target node changed, all choices and unchanged paragraphs stayed
identical, and no other localization nodes changed.

The translation request version and the I18nManager script URL on all eight
entry pages use `20261027-i18n-sync` so returning browsers request the new copy.
The existing metadata test follows the new script version. Seven additional
regression tests cover the opening clues and the app's installation chronology.

## Verification

- `npm run check`: syntax, metadata, scenario graph, localization, scenario
  Markdown synchronization, and existing unit tests passed.
- Final `npm test`: 123 passed, zero failures or skips.
- `npm run test:e2e`: 246 passed, exit code 0. The runner took 33 minutes,
  including slow Day 5 route traversal and cleanup of its temporary trace
  resources. The last audio test also passed an isolated rerun while that
  cleanup finished. No test assertion or timeout was weakened.
- `node scripts/i18n-check.js`: zero missing/extra keys, type mismatches,
  missing files or overlay scenes, mojibake, or placeholder warnings.
- `node scripts/sync-scenario-md-dialogue.js --check`: 3,285 text entries and
  279 choices synchronized.
- Custom Chromium checks at 1440×900 and 390×844 in all eight languages:
  all 201 nodes match the JSON after both `loadAll` and `loadDay`; five changed
  scenes per view render the expected text, with no horizontal dialogue-box
  overflow or page errors (80 rendered scene checks).
- Title-screen comparisons against the original Git source show no visible
  design change. Twelve of 16 comparisons are pixel-identical. Four mobile
  comparisons have only 32 color-channel rounding differences, at most 2/255,
  at the existing top-button shadow edges. Raw measurements are recorded in
  `translation-sync-20261027-browser.json`. CSS, images, visible home copy,
  layout, controls, and game behavior were not edited.

Production publication uses the committed `main` branch after verifying a clean
working tree and `HEAD == origin/main`. Post-publication file hashes and runtime
checks are recorded under `tmp/i18n-sync-20261027/` alongside the local
screenshots and command logs. That directory is excluded from Git.
