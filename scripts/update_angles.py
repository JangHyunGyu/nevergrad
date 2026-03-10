import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 캐릭터별 각도 고정값
ANGLES = {
    'sea':     "몸체 정면에서 약 15도 왼쪽으로 비스듬히 선 자세, 얼굴은 정면을 향해 약 10도 오른쪽으로 기울어진 각도,",
    'eunsu':   "몸체 정면에서 약 10도 오른쪽으로 비스듬히 선 자세, 얼굴은 정면에서 약 10도 오른쪽으로 기울어진 각도,",
    'riin':    "몸체 정면에서 약 10도 왼쪽으로 비스듬히 선 자세, 얼굴은 정면에서 살짝 아래를 향하는 각도,",
    'yuna':    "몸체 정면에서 살짝 안쪽으로 모은 자세, 얼굴은 정면에서 약 5도 왼쪽 아래를 향하는 각도,",
    'seolhwa': "몸체 완벽한 정면 직립 자세, 얼굴은 완벽한 정면을 직시하는 각도,",
}

# 각 캐릭터 섹션에서 삽입 앵커 (캐릭터 기본 설명 바로 뒤)
ANCHORS = {
    'sea':     ("## 1. 캐릭터 — 한세아", "## 2. 캐릭터 — 박은수",
                "연애 시뮬레이션 아트, 귀여운 한국인 여고생,"),
    'eunsu':   ("## 2. 캐릭터 — 박은수", "## 3. 캐릭터 — 이설화",
                "연애 시뮬레이션 아트, 아름다운 한국인 여성 20대 중반,"),
    'seolhwa': ("## 3. 캐릭터 — 이설화", "## 4. 캐릭터 — 최유나",
                "연애 시뮬레이션 아트, 신비로운 한국인 소녀,"),
    'yuna':    ("## 4. 캐릭터 — 최유나", "## 5. 캐릭터 — 강리인",
                "연애 시뮬레이션 아트, 조용한 한국인 여고생,"),
    'riin':    ("## 5. 캐릭터 — 강리인", "## 6. 배경",
                "연애 시뮬레이션 아트, 우아한 한국인 여성 20대 후반,"),
}

new_content = content
for char, (sec_start, sec_end, anchor) in ANCHORS.items():
    start_idx = new_content.index(sec_start)
    end_idx   = new_content.index(sec_end)
    section   = new_content[start_idx:end_idx]

    angle     = ANGLES[char]
    insertion = anchor + " " + angle
    count     = section.count(anchor)
    section   = section.replace(anchor, insertion)

    new_content = new_content[:start_idx] + section + new_content[end_idx:]
    print(f"✓ {char}: {count}개 앵커에 각도 삽입")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
