# Recent crossover copy and continuity audit — 2026-09-27

Scope: Cupid `57359877^..e215565c` and Nevergrad `a3f75fe^..6f6611c`. Reviewed all 66 changed Korean content fields (including names, choices, 16 shared modal strings and the inline experiment notice), their adjacent route context, and six additional legacy runtime overrides. This is a recent-change audit, not a full audit of every line in either game. HTML Korean alt labels were unchanged; JS comment-only additions were excluded.

Diagnosis, contextual rewriting and independent final review used humanize-korean heavy mode. Run: `D:/workspace/_workspace/2026-09-27-002-4232`. Original, manifest, 72-field coverage, diagnosis, manuscript, rewrite notes and final-review record are retained there. The tool recommended a light route based on zero pattern hits; the explicit contextual review requirement took precedence. One deterministic chunk was reassembled, with no reassembly warnings.

## Changes

Nine canonical Korean fields changed and were synchronized across all seven languages. Languages without a corresponding honorific distinction retain an already suitable question.

| Scene | Before | After |
|---|---|---|
| morning2_yuna_seen.text | ...너 전에도 여기 온 적 있어? | ...너 전학 오기 전에도 여기 온 적 있어? |
| nurse_perfect_pills_pink_3.text | *이불 속에서 손가락이 다시 맞닿는다. 스탠드는 여전히 켜져 있다.* | *이불 속에서 손가락이 다시 맞닿는다.* |
| nurse_perfect_pills_black_1.text | *검은 알약을 삼킨다. 단맛은 나지 않고 목 안이 차가워진다.* | *검은 알약을 삼키자 목 안이 차가워진다.* |
| nurse_perfect_pills_black_ask.text | 맛이 이상해. | 목이 왜 이렇게 차갑지? |
| day3_morning_photo_back.text | *사진 조각을 뒤집었다. 찢어진 가장자리부터 손가락으로 훑어 봤다.* | *사진 조각을 뒤집어 뒷면을 살폈다. 날짜가 희미하게 적혀 있다.* |
| day5_lunch_pills_ask.text | 이게 뭐야? | 이게 뭐예요? |
| day5_lunch_pills_pink_2.text | *보건실 천장이 흐릿해진다. 바닥을 짚으려 손을 뻗었는데 어느새 차가운 교문을 붙잡고 있다. 신발 밑창에는 짓밟힌 꽃잎이 붙어 있다.* | *보건실 천장이 흐릿해진다. 바닥을 짚으려 손을 뻗었는데 어느새 차가운 교문을 붙잡고 있다. 발밑에는 짓밟힌 꽃잎이 흩어져 있다.* |
| day5_lunch_pills_pink_3.text | *교문 너머에서 등교 종이 울린다. 교복 소매를 내려다본다. 4월, 전학 첫날에 입었던 옷이다.* | *교문 너머에서 등교 종이 울린다. 교복 소매를 내려다본다.* |
| day5_lunch_pills_black_ask.text | 캐비닛 안에는 뭐가 있어? | 캐비닛 안에는 뭐가 있어요? |

The black-pill route no longer compares its taste to an unchosen pill. The pink route no longer announces that the lamp remains on. The protagonist no longer infers an exact date from an ordinary uniform or observes a hidden shoe sole without looking at it. The photo-back choice now actually examines the back and preserves the faint date already present in the old runtime text. No date value was invented. Questions to Riin retain the surrounding student-to-teacher register; the short self-directed “달다.” remains unchanged.

Context justified keeping the unchanged group-chat read count, Minsu’s three sentences, the hand remaining in position during the actual transformation, and the system’s explicit first-day destination notice. These were not removed merely because they contain comparison or continuity language.

## Runtime defects

`FaviconManager` synchronously loaded `causality_i18n_overlays.js`; its loadDay/loadAll wrappers overwrote six reviewed JSON entries with older Korean/English prose. The new browser regression first failed on all six exact mismatches. Removed only the duplicated day2/day3 entries, retaining the unrelated overlay content.

Independent final review also found that `causality_overlays.js` skipped photo_1 after photo_look on the assumption that the old text had already pocketed the photo. Removed that redundant route override. Both photo inspection branches now reach photo_1 (pocket the photo) once, then photo_2 (look inside the locker).

Updated the I18n and overlay bootloader cache references to `20260927-context-review`; Cupid asset version `2.9.271`, service-worker cache `cupid-v3.3.190`.

## Verification

- Independent final review: all 72 fields; no further text edits. Its pending runtime integration check was subsequently resolved by the seven-language browser tests. Final manuscript matches canonical source fields.
- Required heavy-mode gates before/after finalization: exit 0, change rate 3.25% including stable IDs; this metric is not proof of natural prose. One summary block; original and pre-finalization manuscript retained.
- Cupid: build, scenario sync/check, text check and cache check (47 tests) passed.
- Nevergrad: scenario sync and `npm run check` passed (43 unit tests; existing validator warnings remain).
- Crossover E2E: Cupid 30 and Nevergrad 33 passed. Eight viewport sizes from 320×568 to 1440×900, portrait/landscape, dynamic height, all seven languages, reduced motion, keyboard, storage errors and both pill choices.
- New real-browser regression: seven languages passed. Confirms canonical text after loadAll and loadDay reload, actual DOM text in all six affected scenes, and clicks through both photo branches to photo_1 then photo_2. The final route check was rerun after removing the stale route overlay.
- Reviewed 320×568 Korean and French screenshots: dialogue remains legible without clipping; the photo-back date is visible.

Production verification is performed after pushing main; live-source evidence is retained in the external run directory rather than claimed before deployment.
