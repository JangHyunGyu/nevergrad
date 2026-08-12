# Repository Agent Rules

## Main-Only Git and Deployment (Permanent)
- 이 저장소에서는 브랜치를 새로 만들지 않는다.
- 모든 `git commit`, `git push`, 운영 배포는 반드시 `main` 브랜치에서만 수행한다.
- 현재 브랜치가 `main`이 아니면 커밋·푸시·배포를 중단하고 사용자에게 알린다. 기능 브랜치나 `agent/*` 브랜치에서 작업을 게시하지 않는다.
- 커밋 직전과 푸시 직전에 각각 `git branch --show-current`로 `main`인지 다시 확인한다.
- 운영 배포 직전에는 작업 트리가 깨끗하고 `HEAD`가 `origin/main`과 같은지 확인한다.
- 별도 브랜치나 Pull Request를 만들지 않고 `main`에 직접 커밋하고 푸시한다.

## Korean Dialogue and Narration (Permanent)
- 한국어 대사·지문을 새로 쓰거나 수정할 때는 항상 `humanize-korean` 스킬과 로컬 `D:\workspace\im-not-ai`의 quick rules를 먼저 참고한다.
- 유치하거나 오글거리는 선언, 감정의 직접 설명, 상투적인 신체 반응, 추상적인 공포 비유, 말줄임표·강조·기계적 단문 병렬의 남발을 금지한다.
- 감정은 인물의 짧은 구어와 관찰 가능한 행동·사물·소리로 드러내고, 인물별 말투와 장면의 정보량을 유지한다.
- 의미·사건·인과관계·수치·고유명사·직접 인용·플레이스홀더는 보존하며, 수정 뒤에는 한국어 원본과 `SCENARIO.md` 동기화 및 검증을 수행한다.
