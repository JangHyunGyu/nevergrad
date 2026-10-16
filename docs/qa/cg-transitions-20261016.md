# CG transitions — 2026-10-16

CG entry now takes 1.5 seconds and exit takes 1 second. A change between two different CGs uses a 1-second exit followed by a 1.5-second entry. Dialogue, choices and silent auto-advance start after the image has loaded and the transition has completed. Click/touch/keyboard advance is discarded during that interval.

The same CG remains visible between dialogue nodes. Gallery CGs and existing `cg_` cinematic backgrounds receive this treatment; gallery membership and unlock rules are unchanged. A scene may explicitly request a hard cut with `cgTransition: false`. Existing horror/ending typing locks remain in place.

Temporary visual layers, animations, timers and dialogue visibility are restored on completion or interruption. Scene lifecycle ownership prevents delayed dialogue from an abandoned scene. New-game cleanup releases transition state. Identical resolved image URLs skip redundant background animation; previous GSAP background covers cannot overwrite a CG after arrival.

Validation:

- `npm run check`: passed, including 113 unit tests and zero validator errors.
- CG transition browser tests: 6 passed at 1280×800, 1024×768, 768×1024, 375×812 and 667×375, including rapid clicks, deferred dialogue, repeated CGs, replacement, interruption and hard cuts.
- Existing ending artwork/gallery tests: 3 passed, covering story rendering, unlocks, native artwork and expressions.
- Existing dialogue cooldown, first-line rendering and lifecycle browser tests: 13 passed.
- Background identity refinement: all 6 transition tests passed again.
- Normal-scene before/after screenshots: all 5 viewports pixel-identical. Existing layout, text, controls and composition remain unchanged outside the requested transition.

Evidence is retained under `_workspace/cg-*.log` and `_workspace/cg-transitions/`. Browser screenshots remain in `test-results/`.

Timing revision: all CG entrances, including replacement CGs and endings, use 1,500 ms. Exit remains 1,000 ms. The six CG transition browser cases were rerun at the revised timing; artwork and settled UI remain unchanged.
