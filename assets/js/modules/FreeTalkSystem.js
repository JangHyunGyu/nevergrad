/**
 * ============================================================================
 * FreeTalkSystem.js - AI 프리톡 시스템 (Placeholder)
 * ============================================================================
 *
 * 캐릭터와의 자유 대화를 AI로 생성합니다.
 * 프롬프트 설계 완료 후 구현 예정.
 *
 * [핵심 차별점 - 기존 CUPID vs Nevergrad]
 * - CUPID: 캐릭터가 솔직한 감정을 표현
 * - Nevergrad: 캐릭터가 "연기"하고 있음. 표면 대사와 속내가 다름.
 *   Phase 2에서는 AI 응답에 [INNER: ...] 태그로 속내가 노출되기 시작.
 */

class FreeTalkSystem {
    constructor(stateManager) {
        this.state = stateManager;
        this.endpoint = CONFIG.API_ENDPOINT;
        this.maxTurns = 3;
        this.currentTurns = 0;
    }

    // TODO: 프롬프트 설계 후 구현
    // - buildSystemPrompt(charId, context)
    // - sendMessage(userMessage)
    // - parseResponse(response) → { text, expression, trust, danger }
    // - Phase 2: inner thought 노출 로직
}
