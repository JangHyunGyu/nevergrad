const fs = require('fs');
require('dotenv').config({ path: '../.env.txt' });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('.env 파일에 GEMINI_API_KEY를 입력하세요.');
  console.error('발급: https://aistudio.google.com/apikey');
  process.exit(1);
}

const scenario = fs.readFileSync('./SCENARIO.md', 'utf-8');
const crossover = fs.readFileSync('./CROSSOVER.md', 'utf-8');

const prompt = `당신은 비주얼 노벨 시나리오 전문 평론가입니다. 서브버시브 VN(DDLC, Omori, Undertale류) 장르에 정통합니다.

다음은 "졸업하지 못한 교실 (Nevergrad)"이라는 서브버시브 비주얼 노벨의 시나리오 전문과 크로스오버 기획서입니다.

이 게임의 핵심 구조:
- Day 1~2는 순수 로맨스 미연시로 위장
- Day 3부터 장르가 전환되어 SF 심리 스릴러/호러로 변모
- 주인공은 13번째로 기억이 지워진 실험 피험자
- 설화라는 캐릭터는 실제로 존재했던 인물의 "환각"
- TRUE END 이후 메타 포스트크레딧에서 플레이어 자신이 "관찰자=은수"였다는 반전
- Cupid라는 별도 게임과 LocalStorage 크로스오버

아래 7개 항목에 대해 냉정하게 평가해주세요. 칭찬보다는 약점과 개선점을 중심으로:

1. 위장의 품질 (가짜 장르가 진짜처럼 보이는가) /10
2. 전환의 충격 (장르가 깨지는 순간의 임팩트) /10
3. 전복 후의 깊이 (깨진 후에도 서사가 유지되는가) /10
4. DDLC 대비 독자성 /10
5. 메타 연출의 창의성 /10
6. 대사 퀄리티 /10
7. 캐릭터 아크 /10

각 항목 점수 + 근거 + 구체적 개선점을 제시하고,
종합 평점과 "서브버시브 VN 역사에서 이 게임의 위치"를 평가해주세요.

=== SCENARIO.MD ===
${scenario}

=== CROSSOVER.MD (Cupid × Nevergrad 세계관 연결 기획서) ===
${crossover}
`;

console.log('Gemini 3.1 Pro에 전송 중... (파일 크기: ' + Math.round(scenario.length / 1024) + 'KB)');
console.log('예상 소요시간: 30초~2분\n');

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=' + API_KEY, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 16384
    }
  })
}).then(r => r.json()).then(data => {
  if (data.error) {
    console.error('API 에러:', data.error.message);
    return;
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) {
    console.log('='.repeat(60));
    console.log('  Gemini 3.1 Pro 평가 결과');
    console.log('='.repeat(60));
    console.log(text);
    fs.writeFileSync('./GEMINI_REVIEW.md', text, 'utf-8');
    console.log('\n결과가 GEMINI_REVIEW.md에 저장되었습니다.');
  } else {
    console.log('응답:', JSON.stringify(data, null, 2));
  }
}).catch(err => {
  console.error('요청 실패:', err.message);
});
