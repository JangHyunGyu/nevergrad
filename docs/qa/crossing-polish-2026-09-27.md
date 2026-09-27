# Cupid / Nevergrad crossing polish — 2026-09-27

This follow-up reviews the two pill exits and their arrival/departure interfaces.

## Changes

- Keep the crossing screen opaque during navigation. Gate arrivals open horizontally; lab arrivals open vertically. Reduced motion removes both animations.
- Show the source/destination cycle numbers, enlarge the mobile CG, remove duplicate background faces and inherited decorative button frames, and give long localized buttons a stable two-column layout.
- Await save completion, block duplicate departures, contain focus while saving, cancel pending navigation when the dialog closes, and restore controls/focus/audio after navigation failure or history restoration.
- Keep choices usable when artwork fails to load.
- Retain the transferred name through Nevergrad's title detour without overwriting a player edit; retain the arrival-specific title lineup after consuming the URL marker.
- Keep the Korean Cupid arrival in Korean even when the browser or an older saved preference uses another language.
- Apply the crossing shock to backgrounds only. Consecutive lab dialogue retains one continuous reveal; repeated sound and long vibration bursts are removed.

## Verification

- Cupid: `npm test`, `npm run cache:check` (47 tests), build metadata/structure, scenario sync/check and Korean text check passed.
- Nevergrad: `npm run check` passed, including 42 unit tests and scenario/i18n consistency checks.
- Crossing browser suites: Cupid 30 / Nevergrad 31 passed. Eight viewport sizes, all seven languages, rotation/dynamic heights, saved and fresh arrivals, keyboard, reduced motion, failed/async saves, cancelled departures, navigation failure, missing art, transferred names, and Korean locale precedence.
- Local two-origin Japanese round trip passed: player-driven navigation, shared completion, name/language transfer, saved return, and no automatic redirect loop.
- Visually reviewed the actual 320px/390px phone and 1440px desktop interfaces. Fixed German saved-button overflow and Japanese dynamic-height overflow found during review.
- Shared `cross-world.js` copies are byte-identical. Cupid asset version `2.9.270`, service-worker cache `cupid-v3.3.189`; Nevergrad changed scripts use `20260927-crossing-polish`.

## Korean review

Full diagnosis, contextual review and a separate independent final review covered 42 entries: 16 shared strings, 12 Cupid dialogue entries plus 2 choices, and 10 Nevergrad dialogue entries plus 2 choices. All 42 were matched back to the runtime files. No new prose was required and no further necessary wording corrections were found in this bounded scope. Meaning, character voices, pill sensations, hand position and the transitions were reviewed directly rather than inferred from automated scores.

Gate exit 0; change rate 0%; grade B; self-check 6/6. The single-chunk heavy-route advisory was retained in the review record. The grade reflects the unchanged wording, not a claim that a score proves naturalness. Original/final text, diagnosis, independent review and gate logs are retained in `D:/workspace/_workspace/crossing-polish-20260927-review`.

## Scope and assets

The review does not claim a new full-game content or extended E2E audit. Earlier unrelated extended-suite failures remain documented in the preceding release record. Existing project CGs were recomposed; no new generated assets were added because the repository-required Higgsfield MCP was unavailable.

## Subsequent pill-choice correction requested by the user

The preceding 42-entry naturalness review missed a gameplay expectation: both options must select one of the two pills, as in Cupid. The old black option explicitly refused the pill. Accepting that internally consistent refusal did not satisfy the intended two-pill choice.

The choice is now `분홍 알약 / 검은 알약`. Selecting black explicitly swallows it, produces a cold sensation and leaves the player in Nevergrad before the cabinet question. Pink still crosses to Cupid. Three fields were updated in all seven languages; labels exactly match Cupid, route targets and gameplay values are unchanged, and SCENARIO.md was regenerated. The new authored Korean received a fresh diagnosis/contextual rewrite/independent review, recorded separately in `D:/workspace/_workspace/crossing-pill-choice-review`; the previous unchanged-text map is historical rather than the acceptance record for these three revised fields.

A regression checks the two named pill choices and their route targets in all languages. Browser tests click both real choices and verify swallowing followed by the intended local continuation or crossing dialog. The I18nManager script and JSON request versions use `20260927-pill-choice` to replace cached refusal text.
