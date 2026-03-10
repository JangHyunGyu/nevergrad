import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# ============================================================
# 표준 교복 정의 (글로벌 선호 1위: 네이비 블레이저 + 타탄체크)
# ============================================================
UNIFORM_BASE = "네이비 블레이저 교복 재킷(가슴에 골드 엠블럼 배지), 흰색 칼라 셔츠, 빨간 리본 타이, 네이비-레드 타탄체크 플리츠 미니스커트, 흰색 무릎 양말"
UNIFORM_SHORT = "네이비 블레이저 교복, 빨간 리본 타이, 타탄체크 플리츠 스커트"

# 유나 기본 (가디건 위에 교복)
YUNA_UNIFORM = "교복(흰색 칼라 셔츠, 빨간 리본 타이, 네이비-레드 타탄체크 플리츠 스커트) 위에 크림색 오버사이즈 니트 가디건 손끝만 살짝 보이는 모에소데"

# ============================================================
# 교체 패턴 목록 (기존 세일러복 관련 표현 → 블레이저 교복)
# ============================================================
replacements = [
    # sea_normal (가장 상세한 버전)
    (
        "네이비 칼라와 빨간 리본 타이의 흰색 세일러복 플리츠 스커트 상단 살짝 보임",
        UNIFORM_BASE
    ),
    # sea_smile
    (
        "흰색 세일러복 빨간 리본 타이,",
        f"{UNIFORM_SHORT},"
    ),
    # sea_sad
    (
        "흰색 세일러복 빨간 리본 타이,",
        f"{UNIFORM_SHORT},"
    ),
    # sea_cry (리본 젖음 묘사 포함)
    (
        "흰색 세일러복 빨간 리본이 눈물에 살짝 젖음,",
        f"{UNIFORM_SHORT}, 리본 타이가 눈물에 살짝 젖음,"
    ),
    # sea_yandere (얼룩 묘사 포함)
    (
        "흰색 세일러복에 미세한 붉은 얼룩,",
        "네이비 블레이저 교복에 미세한 붉은 얼룩, 빨간 리본 타이,"
    ),
    # 나머지 sea (흰색 세일러복만 있는 것들)
    (
        "흰색 세일러복,",
        f"{UNIFORM_SHORT},"
    ),
    # yuna_normal (교복 언급 있는 버전)
    (
        "교복 위에 소매가 너무 긴 크림색 니트 가디건 손끝만 살짝 보이는 모에소데, 목에 걸린 빈티지 필름 카메라 검은 가죽 스트랩,",
        f"{YUNA_UNIFORM}, 목에 걸린 빈티지 필름 카메라 검은 가죽 스트랩,"
    ),
    # yuna_smile
    (
        "크림색 오버사이즈 가디건 모에소데, 카메라 스트랩,",
        f"{YUNA_UNIFORM}, 카메라 스트랩,"
    ),
    # yuna_shy
    (
        "크림색 오버사이즈 가디건 모에소데, 카메라 스트랩,",
        f"{YUNA_UNIFORM}, 카메라 스트랩,"
    ),
    # yuna_desperate, yuna_cry, yuna_determined (크림색 가디건 카메라 스트랩)
    (
        "크림색 가디건 카메라 스트랩,",
        f"{YUNA_UNIFORM}, 카메라 스트랩,"
    ),
    # yuna_scared (크림색 가디건만)
    (
        "크림색 가디건,",
        f"{YUNA_UNIFORM},"
    ),
    # yuna_weak (찢어진 교복)
    (
        "찢어지고 더러워진 교복 가디건 없음,",
        "찢어지고 더러워진 블레이저 교복(타탄체크 스커트 찢김) 가디건 없음,"
    ),
]

new_content = content
for old, new in replacements:
    count = new_content.count(old)
    new_content = new_content.replace(old, new)
    if count:
        print(f"✓ {count}개 교체: '{old[:40]}...'")
    else:
        print(f"✗ 미발견: '{old[:40]}...'")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
