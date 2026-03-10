import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 캐릭터별 얼굴 비율 정의
FACE = {
    'sea':     "얼굴 폭의 35% 크기의 크고 동그란 눈, 눈 하나 너비의 눈 간격, 콧날만 살짝 표현된 아주 작은 코, 얼굴 폭의 20% 크기의 작고 귀여운 입술",
    'eunsu':   "얼굴 폭의 28% 크기의 크고 아몬드형 눈, 눈 하나 너비의 눈 간격, 섬세한 콧날의 작은 코, 얼굴 폭의 20% 크기의 부드러운 입술",
    'riin':    "얼굴 폭의 27% 크기의 가늘고 긴 고양이형 눈, 눈 하나 너비의 눈 간격, 날카로운 콧날의 작은 코, 얼굴 폭의 18% 크기의 가는 입술",
    'yuna':    "얼굴 폭의 30% 크기의 크고 처진 눈꼬리의 눈, 눈 하나 너비의 눈 간격, 콧날만 표현된 작은 코, 얼굴 폭의 20% 크기의 작은 입술",
    'seolhwa': "얼굴 폭의 32% 크기의 크고 초점 없는 눈, 눈 하나 너비의 눈 간격, 거의 표현되지 않는 극도로 작은 코, 얼굴 폭의 16% 크기의 창백하고 작은 입술",
}

# 섹션 경계 찾기
sections = {
    'sea':     ("## 1. 캐릭터 — 한세아", "## 2. 캐릭터 — 박은수"),
    'eunsu':   ("## 2. 캐릭터 — 박은수", "## 3. 캐릭터 — 이설화"),
    'seolhwa': ("## 3. 캐릭터 — 이설화", "## 4. 캐릭터 — 최유나"),
    'yuna':    ("## 4. 캐릭터 — 최유나", "## 5. 캐릭터 — 강리인"),
    'riin':    ("## 5. 캐릭터 — 강리인", "## 6. 배경"),
}

OLD = "큰 표현력 있는 눈, 5.5등신, DDLC 스타일"
# → "큰 표현력 있는 눈" 부분을 캐릭터별 비율로 교체하고 뒤 부분 유지

new_content = content
for char, (sec_start, sec_end) in sections.items():
    start_idx = new_content.index(sec_start)
    end_idx   = new_content.index(sec_end)

    section = new_content[start_idx:end_idx]
    new_str  = f"{FACE[char]}, 5.5등신, DDLC 스타일"
    section_updated = section.replace(OLD, new_str)

    count = section.count(OLD)
    new_content = new_content[:start_idx] + section_updated + new_content[end_idx:]
    print(f"✓ {char}: {count}개 교체")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
