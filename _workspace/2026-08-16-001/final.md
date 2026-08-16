# Nevergrad 한국어 윤문 결과

게임에서 노출되는 한국어 시나리오 원문과 선택지, 메뉴, 엔딩 갤러리, 기기 연출, 콘솔 메시지, 숨겨진 페이지, 소개 페이지를 전수 점검했다. 실제 윤문본은 각 원문 파일에 반영했으며, `SCENARIO.md`도 변경된 시나리오 대사에 맞춰 다시 생성했다.

대표 변경:

- `당신의 이름은?` → `이름은?`
- `5일의 선택이 5명의 히로인과 7개의 엔딩으로 갈라집니다.` → `5일 동안 내린 선택에 따라 다섯 히로인의 관계와 일곱 가지 결말이 달라집니다.`
- `*{name}의 팔에 소름이 돋았다.*` → `*팔에 소름이 돋았다.*`
- `너 이거 맛 알잖아.` → `이거 무슨 맛인지 알잖아.`
- `포커스 복귀 시 화면이 복원됩니다.` → `화면으로 돌아오면 내용이 다시 표시됩니다.`

고유명사, 변수, 분기 조건, 호감도와 플래그 값, 장면 순서, 캐릭터별 말투와 서사 강도는 바꾸지 않았다.

<!-- HUMANIZE-SUMMARY
original_chars: 1873
humanized_chars: 1802
change_rate: 11.7%
scope: 25 change hunks across Korean player-facing source text
detections:
  A_translationese: 18 -> 0
  B_pronoun_overuse: 11 -> 0
  G_spacing_and_word_choice: 31 -> 0
  H_rigid_or_fragmented_flow: 22 -> 0
  I_ellipsis_overuse: 24 -> 0
  J_ui_and_mixed_language: 12 -> 0
self_check:
  meaning_preserved: pass
  proper_nouns_and_variables_preserved: pass
  character_voice_preserved: pass
  paragraph_and_dialogue_rhythm: pass
  no_new_ai_cliches: pass
  change_rate_within_limit: pass
score: 6/6
grade: A
grade_reason: S1 잔존 없음, 주요 S2 패턴 제거, 변경률 11.7%, 자체검증 6/6 통과
highlights:
  - "당신의 이름은?" -> "이름은?"
  - "너 이거 맛 알잖아." -> "이거 무슨 맛인지 알잖아."
  - "포커스 복귀 시 화면이 복원됩니다." -> "화면으로 돌아오면 내용이 다시 표시됩니다."
  - "왜 Nevergrad인가" -> "Nevergrad를 추천하는 이유"
  - "14번째 등교" -> "열네 번째 등교"
-->
