# Manual reveal cooldown — 2026-10-15

Clicking during ordinary text reveal still completes the current line immediately.
That manual completion starts a 250ms dialogue input cooldown, measured after the
full text is written and before completion callbacks run. Mouse, background taps,
touch and Enter/Space dialogue input use the same guard.

Input during the cooldown is discarded without extending the deadline or being
queued. Natural completion adds no wait. New dialogue and cancellation clear the
deadline, including scene loads and save restoration. Existing ending, horror and
messenger-indicator skip locks are preserved. Delivered messenger text gets the
same cooldown when manually completed.

The guard uses a monotonic performance clock where available and creates no new
timers. Scenario text, choices, scoring, localization, art and visible layout are
unchanged. No Korean dialogue, prompts, comments or log messages were rewritten.

Validation:

- `npm run check`: passed, including all 79 unit tests and five new cooldown cases
- Focused browser checks: six cases at 1280×800 and 844×390 with mouse/touch/keyboard
- Boundary checks: input at 249ms is ignored; a fresh input at 250ms advances
- Existing first-line, lifecycle and continuity checks: all 15 passed
- Before/after comparison at 1280×800 and 844×390: identical content, geometry,
  computed text styles and screenshots (zero changed pixels in both comparisons)
- All eight HTML entry points update only the two changed runtime script versions

Runtime query version: `20261015-skip-cooldown`.

Visual baseline: `c9e2bf6`. Native PNG captures and comparison data are retained
locally under `_workspace/skip-ui-comparison`. The implementation and regression
tests already published in `087ac18` are preserved; this record completes their
validation handoff. No CSS or authored scenario changes are included.
