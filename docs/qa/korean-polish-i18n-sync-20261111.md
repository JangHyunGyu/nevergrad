# 한국어 시나리오 전면 윤문·개연성 보정 및 8개 국어 동기화 검수 기록 — 2026-11-11

## 1. 작업 범위 및 준수 기준

- **대상 기준 문서 및 시나리오**: `SCENARIO.md`(Day 1~5, 7개 엔딩·에필로그·후일담, 아카이브 프리퀄 Cycle #07·#12), `assets/js/i18n/ko/day*.json`(20개 파일), `assets/js/scenario/speakers.js`, `assets/js/scenario/day1_{2_lunch,3_afterschool,4_night}.js`, `assets/js/scenario/day4_3_afterschool.js`.
- **다국어 동기화 대상**: `en`, `ja`, `es`, `fr`, `de`, `pt`, `zh` 7개 언어 × 20개 파일 = 140개 JSON 파일.
- **고정 구간 보존**: `docs/qa/phase2-fixed-copy-20261016.json`에 잠긴 Phase 2 고정 한국어 텍스트 **288개 ID는 0건 수정(100% 원문 보존)** 및 오프닝 첫 줄(`day1_opening_1`: `*4월.*`) 원형 유지.
- **UI·SEO 비가시성 원칙**: HTML, CSS, SEO 메타데이터, 이미지, 오디오, `prompts.js`, `I18nManager.js` 쿼리 버전 및 기존 테스트 기대치는 일절 수정하지 않음.

---

## 2. `im-not-ai` (`humanize-korean`) 진단 및 검증 게이트 결과

- **워크스페이스**: `_workspace/2026-11-11-001-d1bc/` (Git 미추적)
- **초기 계측 (`00_metrics.json`)**:
  - 분량: `132,375자` (`6,814문장`), 경로: `heavy`, 위험도 등급: `low` (`risk_score: 1`)
  - 구조 진단: 단문 서술 반복(`da_streak_rate: 123`), 대구(`antithesis_count: 10`), 어휘·종결 다양성 저하
- **최종 검증 게이트 (`verify_gates.py`, `restore_modality.py`, `strip_injected_commas.py`)**:
  - **[P0 문자 변경률]**: `6.8%` (`0.0676`, 경고 임계 30% 미만) — **OK**
  - **[P1 목표 달성]**: `N/A` (구조 진단 기반 윤문)
  - **[P2 대구 축소]**: `C-8 대구 10 → 8` — **OK**
  - **[P3 Golden Gate]**: 수치 주입·각주·인용·경어법 이상 `0건` — **PASS**
  - **[P4 문장 터치율]**: `16.9%` (`1,154 / 6,814문장`)
  - **[P5 서법 보존]**: 서법 소실 `0문장` (`restore_modality.py` 복원 필요 `0건`) — **OK**
  - **주입 쉼표 검사 (`strip_injected_commas.py`)**: 연결어미 뒤 기계적 쉼표 주입 `0건` — **OK**
  - **최종 판정**: `완료. 경로 heavy / 변경률 6.8% / 등급 low / 자체검증 6/6 통과` (`gate: OK — 수렴`)

---

## 3. 시나리오 연결·시간순·화자 정합성 보정 내역

### 3.1 시나리오 그래프 보정 및 감사 계약(`expansion.sceneContracts`) 구간 문맥 브리지
1. **`SCENARIO.md` 공간 설정 통일**: 본문 3층 비상구·비상계단 묘사와 일치하도록 구관 개요를 `2층 벽돌 건물`에서 `3층 벽돌 건물`(+ 3층 비상계단·비상구)로 정정.
2. **Day 1 점심·방과후·밤 연결 보정 (`day1_2_lunch.js`, `day1_3_afterschool.js`, `day1_4_night.js`)**:
   - 세아 도시락 나눔(`sea_share_1..4`)을 이어폰 대화 종료 뒤가 아닌 식사 직후(`sea_14` 뒤)로 이동.
   - 리인 양호실 휴식 대화(`riin_rest_1..3`)를 잠든 뒤가 아닌 입실 직후(`riin_12` 뒤)로 이동.
   - 은수 진로 조사서 조언(`eunsu_counsel_1..3`)을 교무실을 나선 뒤가 아닌 상담 도중(`eunsu_9` 뒤)으로 이동.
   - 첫날 밤 사진 확인 문자 분기 조건을 `met_yuna`에서 실제 폴라로이드 수령 플래그(`received_yuna_photo`)로 정정하고, `day1_history_callback_4` 연결 복원 및 실내 독백 17개 노드의 불필요한 `messengerDelay` 제거.
3. **Day 4 크로스오버 스프라이트 정합성 보정 (`day4_3_afterschool.js`)**:
   - Day 4 유나 지하 격리 설정과 충돌하던 복도 스킵 구간(`day4_xover_yuna_skip`, `skip_met`, `skip_2`)의 유나 스프라이트(`character`)를 `null`로 제거하고 빈 사진부 복도/어제의 잔상으로 서술 통일.
4. **감사 계약(`expansion.sceneContracts`) 고정 10개 연결 구간 문맥 브리지 (8개 국어 동시 반영)**:
   - 기존 런타임 감사 계약(`docs/qa/expansion-20261016.json`)의 그래프 연결을 그대로 보존하면서 시간순·동선 어색함이 발생하던 10개 경계 지문을 자연스럽게 연결:
     - `day2_morning_pen_1` / `deja4_6`: 교실 입실 후 가방을 내려놓고 필기구를 확인한 뒤 자리에 앉아 아까 복도 자판기 이야기를 마저 덧붙이도록 연결.
     - `day3_morning_classroom_4`: 1교시 종료 후 쉬는 시간에도 정적이 풀리지 않는 장면으로 전환해 수업 이중 시작 인상 제거.
     - `day3_after_sea_choice` / `day3_after_eunsu_4`·`5`: 세아의 재질문 시선 회수 및 은수가 문가 기척을 돌아본 뒤 상담 끝에 통화하러 복도로 나가는 순서로 정돈.
     - `day4_after_sea_2`·`3`: 문을 잠근 직후 증거 확인 용건을 꺼내고 증거 제시 후 대화를 이어가는 흐름으로 보정.
     - `ESCAPE`, `RESIST`, `CAGE(은수)`, `FORGET`, `GHOST`, `COMPLICIT` 엔딩 에필로그 진입문(`_epilogue_1` / `forget_epilogue_25`): 각각 석 달 전 첫 버스 회상, 탈출하던 그날 새벽, 의자에 남기로 한 직후, 다음 날 아침 알람까지 남은 흔적, 그날 새벽 비상계단 난간, 서명 직후의 시작으로 시점을 명시해 시간 역전 혼선을 해소.

### 3.2 화자 매핑 정정 (`assets/js/scenario/speakers.js` — 총 67건)
- 순수 지문(`*...*`) 노드에 히로인 화자 이름이 붙어 있던 58개 노드를 모두 `"me"`로 통일.
- 대사 화자 전도 9건 정정: `day1_lunch_sea_29`(`"me"`), `day2_morning_pres_4`(`"me"`), `day2_after_sea_19`(`"me"`), `day2_after_sea_22`(`"me"`), `day3_night_seolhwa_4b`(`"window_girl"`), `day3_night_ghost_ok`(`"me"`), `day4_xover_yuna_skip_2`(`"me"`), `day5_morning_rescue_6`(`"yuna_full"`), `day5_lunch_left_3`(`"me"`).

---

## 4. 한국어 윤문 대표 원문 → 최종문 대조표

| 분류 | Scene ID | 원문 (`before`) | 최종문 (`after`) | 보정 사유 |
|---|---|---|---|---|
| 개연성 (도보 통학) | `day1_after_eunsu_counsel_2` | `그건 아침에 잘못 타서 외웠어요.` | `집이 바로 근처라 등굣길은 아침에 걸어오면서 외웠어요.` | 도보 등교 설정과 충돌하던 버스 오승 대사 수정 |
| 개연성 (안전 앱 연표) | `day1_night_app_1` | `홈 화면 구석에 낮에 교문 안내문 큐알(QR)로 받아 둔 가설치 아이콘이 떠 있었다. 파란 방패 아래에 한울 안전 앱이라고 적혀 있었다.` | `홈 화면 구석에 입학 안내문 QR 코드로 받아 둔 가설치 아이콘이 떠 있었다. 파란 방패 아래에 '학생 안전 앱'이라고 적혀 있었다.` | 학교명 오류(`한울` → 학생 안전 앱) 및 1일차 가설치 연표 정돈 |
| 개연성 (보건실 층수) | `day5_morning_true_ft_yuna` | `그래. 보건실은 본관 2층이야. 같이 가자. 부축해줄게.` | `그래. 보건실은 본관 1층이잖아. 같이 가자. 부축해줄게.` | 본관 1층 보건실 설정과 층수 일치 |
| 개연성 (설화 머리색) | `day5_archive_cycle07_3` | `설화는 살아 있었다. 복도 등을 지나칠 때마다 머리카락의 은빛이 어깨 위에서 움직였다.` | `설화는 살아 있었다. 복도 등을 지나칠 때마다 흑갈색 머리카락이 어깨 위에서 흔들렸다.` | 설화 아트워크(`흑갈색`)와 불일치하던 은발 오기 수정 |
| 개연성 (설화 실명 시점) | `day5_lunch_seolhwa_26` | `*눈가에 맺힌 빛이 형광등 아래서 잠깐 흔들렸다. 물기인지 빛인지 구분되지 않는다.*\n\n이설화. 지금 불러도 되지?` | `*형광등 아래서 설화의 윤곽이 미세하게 흔들렸다.*\n\n그 이름, 이제 안 틀려. 문밖으로 나가서도 잊지 않을게.` | TRUE 엔딩(`day5_ending_true_14~16`) 최초 실명 호명 연출 보존 |
| 비초자연 원칙 (환각 묘사) | `day3_night_seolhwa_11` | `*손끝이 뺨 앞에서 흐려진다. 창밖 가로등 빛이 손등을 그대로 통과한다.*\n\n손이… 점점 안 보여.` | `*초점이 안 잡히듯 손끝 윤곽이 겹쳐 흔들린다. 형광등 바로 아래인데 바닥에 설화의 그림자가 없다.*\n\n손이 흐려져. 어디 가는 거야?` | 물리적 투과 묘사를 약물·기억 기반 시각 환각 단서로 교체 |
| 비초자연 원칙 (물리 흔적) | `day5_ending_ghost_epilogue_1` | `비상계단 난간에 손자국이 두 개 남았다. 설화가 잡은 쪽에는 물기가 없었다.` | `그날 새벽 비상계단 난간에는 내 왼손이 짚은 자국 하나만 남았었다. 설화가 서 있던 쪽 난간 위로는 새벽이슬이 그대로 맺혀 있었다.` | 환각인 설화가 물리적 손자국을 남기지 않도록 수정 및 회상 시점 명시 |
| 화자·경어법 (`E-7`) | `day1_night_eunsu_msg_2` | `첫날 어땠어요? 교실 찾느라 많이 걸었죠.` | `첫날 수업은 어땠어? 교실 찾느라 많이 걸었지.` | 담임 은수의 학생 상대 반말 톤 일관성 유지 |
| 화자·경어법 (`E-7`) | `day5_morning_rescue_6` | `알겠어요. 먼저 풀어요.` (`me`) | `네. 끈부터 풀어 주세요.` (`yuna_full`) | 결박 해제 장면의 실제 발화자(유나) 및 후배 존댓말 복원 |
| 번역체·기계적 지문 해소 | `day1_lunch_sea_29` | `*음악 이야기, 유튜브 이야기. 이어폰 선이 책상 가운데 느슨하게 걸린 채 점심시간이 거의 끝나 있었다.*\n\n벌써 점심 끝나가네. 이어폰 고마워.` | `*음악 이야기와 평소 보던 영상 이야기를 나누는 사이 예비종 칠 시간이 다 되었다.*\n\n벌써 점심 끝나가네. 이어폰 빌려줘서 고마워.` | 명사 나열형 번역체 지문 정리 및 주인공 화자 시점 명확화 |
| 크로스오버 정합성 | `day4_xover_yuna_1` | `*교실을 나서려는데 유나가 복도에 서 있다. 기다리고 있었다.*\n\n기다렸어? 복도에서 얘기해도 괜찮아? 네가 먼저 찾아오니까 무슨 일 생긴 것 같아서.` | `*교실 문을 나서다 멈칫했다. 텅 빈 복도 모퉁이에 어제 서 있던 유나의 잔상이 겹쳐 스친다.*\n\n유나야? 복도에서 얘기해도 괜찮아? 네가 먼저 불러 세우니까 무슨 일 생긴 것 같아서.` | Day 4 유나 지하 격리 상태와 모순되지 않도록 잔상 연출로 전환 |

---

## 5. 8개 국어 동기화 및 전체 검증 결과

1. **다국어 동기화 (`en`, `ja`, `es`, `fr`, `de`, `pt`, `zh` — 140개 JSON 파일)**:
   - 모든 변경 키에 대해 외곽 `*...*` 강조 경계, 문단 수(`\n\n`), `{name}` 플레이스홀더, 선택지 개수(`choices.length`), 한글 잔존 `0건`, 포르투갈어 오역 패턴(`professoraa`, `Parque Seojin`, `Parque Jaewon`) `0건` 검증 완료.
   - 캐릭터 어조 및 핵심 단서 통일: 일본어 유나 `先輩` + `です/ます`체, 은수 교사 반말 톤, `Seojin` 고유명사, `Seolhwa` 흑갈색 머리, Day 1 가설치 → Day 2 스마트 캠퍼스 모듈 등록 → Day 4 숨김 프로필 연표 전 언어 일치.
2. **정적·단위·에셋 검증 (`100% 통과`)**:
   - `node scripts/check-syntax.js`: `213 files OK`
   - `node scripts/sync-home-metadata.cjs --check`: 8개 언어 홈 메타데이터 일치
   - `node validate.js`: `3,338 / 3,338 scenes reachable`, `orphans: 0`, `Endings: 7/7`, `0 errors, 0 warnings`
   - `node scripts/i18n-check.js`: `0 missing, 0 extra, 0 type mismatches, 0 files missing, 0 overlay scenes missing, 0 mojibake, 0 placeholder warnings`
   - `node scripts/sync-scenario-md-dialogue.js --check`: `3,285 text entries, 279 choices OK`
   - `npm test`: **`130 / 130 passed (0 failed)`**
   - `npm run audit:assets`: **`165 / 165 decodedFiles (0 failures)`**
3. **Playwright E2E 검증 (`25개 스펙 전체 확인`)**:
   - 시나리오·다국어·라우팅·엔딩·UI 스펙 **24개 파일 전체(277개 테스트) 100% 통과** (`crossing`, `day3-transition`, `day5-routing`, `day5-ending-payoffs`, `expansion`, `ending-art`, `expression-matching`, `first-line-dialogue`, `game-lifecycle`, `initial-paint`, `localization-review`, `painted-ui`, `phase2-polish`, `release-gimmicks`, `release-panels`, `responsive-ui`, `review-regressions`, `scenario-continuity`, `scenario-copy`, `seo-metadata`, `serious-expression-art`, `sgrade-polish`, `cg-transitions`, `dialogue-skip-cooldown`, `scene-media-audit` 중 2/3 케이스 포함).
   - **기존 범위 외 불일치 보고 (`Strict User-Requested Scope` 준수)**: `tests/e2e/scene-media-audit.spec.js`의 첫 번째 케이스에서 이번 작업과 무관한 기존 커밋 `f4f58a90`(`assets/js/scenario/day3_4_night.js`, 2026-11-01)이 `day3_night_end`의 `changeDay`/`changeSlot`을 압박 시퀀스 말미로 이동하면서 과거 스냅샷 `docs/qa/expansion-20261016.json`과 생긴 기존 불일치 1건만 확인되었으며, 지침에 따라 임의 수정이나 테스트 약화 없이 원상태 보존 및 보고함(이번 수정 범위의 계약 불일치는 `0건`).
