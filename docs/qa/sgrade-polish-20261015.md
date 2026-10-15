# Nevergrad 시나리오·연출 개선 기록 — 2026-10-15

첨부 지시서의 다섯 작업을 순서대로 반영했다. 작업 기준은 `main`의 `f4d64ec`이며, 기존 250ms 수동 대사 넘김 보호를 유지했다.

## 변경 내용

| 작업 | 반영 내용 |
| --- | --- |
| Day 1~2 | 31개 장면 추가. 세아의 점심·방과 후 장면에 각각 4개 노드를 연결하고, 은수의 버스·진로·수업 상담, 리인의 휴식·차 배려, 유나의 고양이 농담을 보강했다. Day 1의 눈을 깜빡이지 않는 묘사는 빈 캔을 굴리며 답을 기다리는 행동으로 교체했다. |
| 사진 대조 | #07과 #13에서 포커스와 대조 버튼을 표시한다. 버튼을 누르면 두 사진이 나란히 나오며 눈꼬리·코 위치를 짚는다. 기존 전체 사진 확인과 완료 동작을 유지한다. |
| Day 4 추리 | 어드민 기록과 거울 확인 뒤 왼손 필적, #07의 외부 접촉 기록, 설화의 빈 반사상을 연결하는 2단 선택을 추가했다. 오답에는 관찰을 되짚는 문장을 제공하며 모두 본편에 합류한다. 정답마다 설화 동기화 +2, 합계 최대 +4다. 추리 중 거울 연출도 유지한다. |
| 화자별 질감 | 표시 중인 인물 대신 실제 화자 ID를 전달한다. 은수는 중음·정돈된 간격, 세아는 고음·후반 불규칙 간격, 설화는 저역 통과 필터와 `pan: -0.45`, 문서는 디지털 비프를 사용한다. 리인·유나에도 별도 음색을 둔다. |
| Day 5 호흡 | 세아 복도 장면의 세 노드를 자동 진행하고, 지하 문서 아홉 노드에 20~120ms의 출력 간격을 적용한다. 리인의 대사는 즉시 출력하며, 셔터 충격과 후속 선택 문구는 400ms 정지 뒤 출력한다. |
| 관찰자 로그 | `day5_observer_4`~`8`을 에디나 재단 외부 감사·모니터링 세션의 권한, 접촉 집계, 행동 대조, 판정 보류 기록으로 다시 썼다. 기존 모든 플레이스홀더를 언어별·노드별로 대조해 보존했다. |

사진 원본 두 장은 손이 나오지 않는 얼굴 구도다. 존재하지 않는 손이나 점을 덧그리지 않고, 실제 보이는 눈꼬리·코 위치를 대조한다. 원본 이미지와 해상도는 그대로다. 사진 덱의 실제 진입은 기존 `day3_lunch_rooftop_5`가 담당하므로 그 연결을 유지했다. Day 3 방과 후와 Day 4 점심 파일에는 불필요한 중복 열람을 추가하지 않았다.

음원은 두 오실레이터, 필터, 감쇠 엔벌로프로 합성한다. 틱은 최소 70ms 간격이며 SFX·마스터 음소거를 따른다. 자연 완료·수동 완료·장면 변경·새 게임·전체 SFX 정지 때 음원 연결을 해제한다. 일시정지 중에는 새 글자나 틱이 출력되지 않는다. 메신저에도 화자·출력 옵션이 전달된다.

## 한국어 점검

`humanize-korean` Codex monolith 절차와 `D:\workspace\im-not-ai` quick rules를 적용했다. 추가 장면은 초안을 먼저 확정한 뒤 문체를 점검했고, 요청에 따른 내용 재작성과 문체 수정을 구분했다. 모든 한국어 원문·초안·최종문·점검 결과는 [전체 기록](sgrade-korean-review-20261015.json)에 있다. 총 43개 대사·지문 항목과 사진 대조 설명 1개다.

| 점검 대상 | 점검 전 | 최종문·처리 |
| --- | --- | --- |
| A-18, 방과 후 동행 | 내가 가방을 고쳐 메는 동안 난간에 기대 기다렸다. | 내가 가방을 고쳐 멜 때까지 난간에 기대 기다렸다. |
| A-18, 서류 정리 | 세아가 서류 모서리에 손가락을 대고 기다렸다. 내가 종이를 맞추자 그제야 집게를 끼웠다. | 세아가 서류 모서리를 손가락으로 누른 채 기다렸다. 내가 종이를 맞추자 집게를 끼웠다. |
| I-2, 추리 | 지금 내 눈에 보인다는 사실만으로 여기 있다는 증거가 되지는 않는다. | 지금 내 눈에 보인다고 여기 있다는 증거가 되지는 않는다. |
| Day 1 연출 재작성 | 세아는 웃는 얼굴로 대답을 기다린다. 눈은 한 번도 깜빡이지 않는다. | 세아가 내 대답을 기다리며 빈 캔을 두 손으로 굴렸다. |
| 관찰자 로그 재작성 | 내 기록? | 접속 권한: 감사·모니터링 / 세션 상태: 접속 유지 / 피험자 접촉 권한: 없음 |
| 관찰자 로그 재작성 | 박은수 — 13회 관찰 / {name}의 관찰자 — {play_time} / 판정 보류 | 연구 책임자 박은수의 13회 관찰과 #13 외부 열람 세션을 대조. 관찰 지속 패턴 일치, 자동 판정 보류 |

문체 점검: A-18 **2→0**, I-2 **1→0**, C-11·D-14·E-7·J-3 **0→0**. 감정 직접 서술, 공포 상투어, 말줄임표 남용, 메타 선택지 설명은 추가하지 않았다. 자체검증 **6/6**, 등급 **B**. 문체 수정률이 A등급의 하한인 10%보다 낮아서 B로 기록했다. 독립적인 정밀 평가는 Claude Code strict 5인 절차를 권장한다.

`verify_change_rate.py` 결과: **0.7%, OK**. 비교 대상은 새 초안과 최종문이며, 지시서가 요구한 내용 재작성은 원래 문구와 별도로 기록했다. 원문과 결과는 `_workspace/2026-10-15-001/01_input.txt`, `final.md`에 보존했다.

## 검증

- 지정 순서: `node scripts/check-syntax.js` → `node scripts/i18n-check.js` → `node scripts/sync-scenario-md-dialogue.js` → `node validate.js`
- 8개 언어 키·자료형·선택지 수·플레이스홀더 일치
- 정적 시나리오 2,134개, 도달 2,134개, 고립 노드 0개, 엔딩 7/7
- 브라우저 실제 시나리오 2,143개: 기존 `causality_overlays.js`의 9개 추가 장면 포함
- `validate.js`: 에러 0개. 참고 경고 12개는 기존과 동일하며, 이 중 9개는 별도 런타임 오버레이 장면의 키다.
- 단위 테스트: 86개 통과
- 브라우저 전체 검사: **166개 전부 통과**. 보완 대상 22개도 별도 재검사 통과

갤러리 이미지 검사는 표시 여부만 확인한 직후 크기를 읽던 방식에서 실제 로드·크기 조건을 기다리도록 바꿨다. 화자 음원 검사는 음소거 직후의 새 음원 생성을 확인하며, 오디오 처리 시점과 별개로 설정값도 확인하도록 보완했다.

## 화면 비교

1280×800, 1024×768, 768×1024, 375×812, 667×375에서 타이틀과 기존 대사 화면을 비교했다. 기존 커밋의 JS·CSS를 응답하는 기준 화면과 수정 화면에서 애니메이션 시점을 고정하고 일시적인 안내 토스트를 제외했다. **10개 비교 모두 픽셀 차이 0**, 대사창·퀵 메뉴·화자 이름의 위치·크기·글꼴·색상도 동일하다. [비교 수치](sgrade-visual-regression-20261015.json)

새 사진 대조 모달은 같은 다섯 너비에서 직접 조작했고, 비교 버튼 높이 44px 이상과 화면 내부 배치를 확인했다. 감사 로그 6·8번은 모바일 가로 667×375에서 8개 언어 모두 대사창이 화면 안에 들어온다. 기본 레이아웃·폰트·기존 컨트롤은 변경하지 않았다.

화면 비교 재현:

```powershell
node scripts/capture-polish-baseline.cjs reference _workspace/sgrade-20261015 f4d64ec
node scripts/capture-polish-baseline.cjs stable _workspace/sgrade-20261015
```

## 수정 파일

총 80개 파일을 수정·추가했다. 파일별 목록은 아래와 같다. HTML 8개 진입점과 i18n 로더는 바뀐 파일의 캐시 버전만 `20261015-sgrade`로 갱신했다. 정적 사이트이므로 별도 번들 빌드 단계는 없으며, 문법·시나리오·브라우저 검사를 거쳐 배포한다.

<details>
<summary>수정·추가 파일 80개</summary>

- `SCENARIO.md`
- `assets/css/glitch.css`
- `assets/js/i18n/de/day1_afterschool.json`
- `assets/js/i18n/de/day1_lunch.json`
- `assets/js/i18n/de/day2_afterschool.json`
- `assets/js/i18n/de/day2_lunch.json`
- `assets/js/i18n/de/day4_night.json`
- `assets/js/i18n/de/day5_night.json`
- `assets/js/i18n/en/day1_afterschool.json`
- `assets/js/i18n/en/day1_lunch.json`
- `assets/js/i18n/en/day2_afterschool.json`
- `assets/js/i18n/en/day2_lunch.json`
- `assets/js/i18n/en/day4_night.json`
- `assets/js/i18n/en/day5_night.json`
- `assets/js/i18n/es/day1_afterschool.json`
- `assets/js/i18n/es/day1_lunch.json`
- `assets/js/i18n/es/day2_afterschool.json`
- `assets/js/i18n/es/day2_lunch.json`
- `assets/js/i18n/es/day4_night.json`
- `assets/js/i18n/es/day5_night.json`
- `assets/js/i18n/fr/day1_afterschool.json`
- `assets/js/i18n/fr/day1_lunch.json`
- `assets/js/i18n/fr/day2_afterschool.json`
- `assets/js/i18n/fr/day2_lunch.json`
- `assets/js/i18n/fr/day4_night.json`
- `assets/js/i18n/fr/day5_night.json`
- `assets/js/i18n/ja/day1_afterschool.json`
- `assets/js/i18n/ja/day1_lunch.json`
- `assets/js/i18n/ja/day2_afterschool.json`
- `assets/js/i18n/ja/day2_lunch.json`
- `assets/js/i18n/ja/day4_night.json`
- `assets/js/i18n/ja/day5_night.json`
- `assets/js/i18n/ko/day1_afterschool.json`
- `assets/js/i18n/ko/day1_lunch.json`
- `assets/js/i18n/ko/day2_afterschool.json`
- `assets/js/i18n/ko/day2_lunch.json`
- `assets/js/i18n/ko/day4_night.json`
- `assets/js/i18n/ko/day5_night.json`
- `assets/js/i18n/pt/day1_afterschool.json`
- `assets/js/i18n/pt/day1_lunch.json`
- `assets/js/i18n/pt/day2_afterschool.json`
- `assets/js/i18n/pt/day2_lunch.json`
- `assets/js/i18n/pt/day4_night.json`
- `assets/js/i18n/pt/day5_night.json`
- `assets/js/i18n/zh/day1_afterschool.json`
- `assets/js/i18n/zh/day1_lunch.json`
- `assets/js/i18n/zh/day2_afterschool.json`
- `assets/js/i18n/zh/day2_lunch.json`
- `assets/js/i18n/zh/day4_night.json`
- `assets/js/i18n/zh/day5_night.json`
- `assets/js/modules/AudioManager.js`
- `assets/js/modules/DialogueSystem.js`
- `assets/js/modules/GameEngine.js`
- `assets/js/modules/GlitchSystemAdvanced.js`
- `assets/js/modules/I18nManager.js`
- `assets/js/scenario/day1_2_lunch.js`
- `assets/js/scenario/day1_3_afterschool.js`
- `assets/js/scenario/day2_2_lunch.js`
- `assets/js/scenario/day2_3_afterschool.js`
- `assets/js/scenario/day4_4_night.js`
- `assets/js/scenario/day5_1_morning.js`
- `assets/js/scenario/day5_2_lunch.js`
- `assets/js/scenario/day5_4_night.js`
- `assets/js/scenario/speakers.js`
- `de/index.html`
- `docs/qa/scene-media-audit-2026-10-08.json`
- `docs/qa/sgrade-korean-review-20261015.json`
- `docs/qa/sgrade-polish-20261015.md`
- `docs/qa/sgrade-visual-regression-20261015.json`
- `en/index.html`
- `es/index.html`
- `fr/index.html`
- `index.html`
- `ja/index.html`
- `pt/index.html`
- `scripts/capture-polish-baseline.cjs`
- `tests/e2e/ending-art.spec.js`
- `tests/e2e/sgrade-polish.spec.js`
- `tests/voice-texture.test.js`
- `zh/index.html`

</details>

## 최종 결과

- 문법 검사 128개 파일 통과, 8개 언어 동기화 통과, `SCENARIO.md` 일치
- `validate.js` 에러 0개, 단위 테스트 86/86, 브라우저 테스트 166/166 통과
- 기존 화면 10개 비교의 픽셀 차이 0, 한국어 점검 6/6·B등급·문체 변경률 0.7%
- 게시 브랜치: `main`
- 운영 주소: <https://nevergrad.archerlab.dev>
- 배포 커밋·상태와 운영 검증 영수증은 작업 종료 시 별도로 기록한다. 운영 검증은 변경 파일 63개의 해시와 8개 언어의 화자·로그·사진 비교 동작을 대조한다. 로컬 영수증 경로: `_workspace/sgrade-20261015/production-result.json`
