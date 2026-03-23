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

이것은 7차(최종 확인) 평가 요청입니다. 6차에서 전 항목 10/10 만점을 받았습니다.

**최종 확인 사항**: 이 게임은 아래 모든 환경에서 플레이되는 **반응형 웹 미연시 게임**입니다:
- **PC** (1280px+ 데스크톱 브라우저)
- **태블릿** (768px~1024px, 가로모드 전용)
- **모바일** (375px~667px, 가로모드 전용)
- Cloudflare Pages로 배포되는 HTML/CSS/JS 웹 게임
- localStorage, URL, 브라우저 콘솔 등 웹 네이티브 기능 활용
- 파일 시스템 접근 불가, exe 설치 없음
- 터치 디바이스와 마우스/키보드 모두 지원

이 멀티플랫폼 환경을 고려했을 때:
1. 시나리오의 인터랙션 연출(거울 스와이프, 타이머 선택지, 사진 넘기기 등)이 모바일 터치와 PC 마우스 양쪽에서 동일한 임팩트를 줄 수 있는가?
2. 모바일 가로모드(좁은 화면)에서 텍스트 밀도가 과하지 않은가?
3. 메타 기믹(blur 안티캡처, 안전앱 어드민 패널, 콘솔 메시지 등)이 모바일 브라우저에서도 작동하는가?
4. 전체적으로 이 시나리오가 "서브버시브 웹 미연시"로서 실제 출시 가능한 완성도인가?

위 4개 질문에 대해 답변하고, 문제가 있으면 구체적 수정 방안을 제시해주세요. 문제가 없으면 최종 승인해주세요.

## 최종 확인 요청

### ✅ 캐릭터(9→10점 목표):
- TRUE END 기억 통합 씬에 가짜 기억(민수, 전 학교) 소거 독백 1줄 추가: "존재하지 않았던 2년간의 기억이 산산조각 났다. 그 파편 자리에 진짜 내 과거가 들어왔다."

### ✅ 메타 기믹(9→10점 목표):
- 스크린샷 감지 기술 명세를 웹 브라우저 환경에 맞게 전면 재작성
- PrintScreen 키 의존 → window.blur 이벤트 기반 안티캡처로 변경
- 창 포커스 이탈 시 검은 오버레이 + [외부 반출 금지] 텍스트 → focus 복귀 시 원래 화면
- 서사적 정합성: "실험 데이터 외부 반출 금지" 프로토콜과 완벽 일치

위 4개 질문에 대해 구체적으로 답변해주세요. 시나리오 전문을 아래에 첨부합니다.

=== SCENARIO.MD ===
${scenario}

=== CROSSOVER.MD (Cupid × Nevergrad 세계관 연결 기획서) ===
${crossover}
`;

console.log('Gemini 3.1 Pro Preview에 전송 중... (파일 크기: ' + Math.round(scenario.length / 1024) + 'KB)');
console.log('예상 소요시간: 30초~2분\n');

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=' + API_KEY, {
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
