import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# 주요 섹션(##) 경계 찾기
major_idx = [i for i, line in enumerate(lines) if line.startswith('## ')]

def get_section_lines(start_idx):
    pos = major_idx.index(start_idx)
    end = major_idx[pos+1] if pos+1 < len(major_idx) else len(lines)
    return lines[start_idx:end]

def parse_subsections(sec_lines):
    sub_starts = [i for i, line in enumerate(sec_lines) if line.startswith('### ')]
    first_sub = sub_starts[0] if sub_starts else len(sec_lines)
    header = sec_lines[:first_sub]
    blocks = {}
    for idx, start in enumerate(sub_starts):
        end = sub_starts[idx+1] if idx+1 < len(sub_starts) else len(sec_lines)
        key = sec_lines[start].replace('### ', '').strip()
        blocks[key] = sec_lines[start:end]
    return header, blocks

# 전체 섹션 파싱
sections = {}
for mi in major_idx:
    sec_lines = get_section_lines(mi)
    title = lines[mi]
    header, blocks = parse_subsections(sec_lines)
    sections[title] = {'header': header, 'blocks': blocks}

# ==============================
# 게임 진행 순서 정의
# ==============================

CHAR_SECTION_ORDER = [
    '## 3. 캐릭터 — 한세아 (반장)',
    '## 1. 캐릭터 — 박은수 (담임교사)',
    '## 5. 캐릭터 — 이설화 (수수께끼의 소녀)',
    '## 4. 캐릭터 — 최유나 (사진부)',
    '## 2. 캐릭터 — 강리인 (보건교사)',
]

CHAR_IMG_ORDER = {
    '## 3. 캐릭터 — 한세아 (반장)': [
        'sea_smile.png',    # Day 1 Morning
        'sea_shy.png',      # Day 1 Morning
        'sea_sad.png',      # Day 1 Afterschool
        'sea_normal.png',
        'sea_cry.png',      # Day 2 Afterschool
        'sea_serious.png',  # Day 3 Lunch
        'sea_yandere.png',  # Day 3 Afterschool
        'sea_angry.png',
        'sea_hurt.png',
        'sea_dark.png',
    ],
    '## 1. 캐릭터 — 박은수 (담임교사)': [
        'eunsu_smile.png',    # Day 1 Morning
        'eunsu_normal.png',   # Day 1 Afterschool
        'eunsu_serious.png',  # Day 3 Afterschool
        'eunsu_obsessed.png', # Day 3 Night
        'eunsu_gentle.png',   # Day 4 Morning
        'eunsu_cold.png',     # Day 4 Morning
        'eunsu_dark.png',     # Day 5 Morning
        'eunsu_shy.png',
        'eunsu_close.png',
        'eunsu_angry.png',
    ],
    '## 5. 캐릭터 — 이설화 (수수께끼의 소녀)': [
        'seolhwa_normal.png', # Day 1 Morning
        'seolhwa_fade.png',   # Day 2 Afterschool
        'seolhwa_ghost.png',  # Day 2 Night
        'seolhwa_sad.png',    # Day 3 Night
        'seolhwa_smile.png',  # True End
    ],
    '## 4. 캐릭터 — 최유나 (사진부)': [
        'yuna_scared.png',    # Day 1 Lunch
        'yuna_smile.png',     # Day 1 Lunch
        'yuna_normal.png',    # Day 1 Afterschool
        'yuna_determined.png',# Day 5 Lunch
        'yuna_shy.png',
        'yuna_desperate.png',
        'yuna_cry.png',
        'yuna_weak.png',
    ],
    '## 2. 캐릭터 — 강리인 (보건교사)': [
        'riin_smile.png',     # Day 1 Lunch
        'riin_normal.png',    # Day 1 Afterschool
        'riin_seductive.png', # Day 2 Lunch
        'riin_cold.png',      # Day 2 Afterschool
        'riin_dark.png',      # Day 3 Night
        'riin_close.png',
        'riin_pleased.png',
    ],
}

BG_ORDER = [
    # Day 1 Morning
    'cherry_blossom.png',
    'school_gate.png',
    'hallway.png',
    'classroom.png',
    # Day 1 Lunch
    'library.png',
    'nurse_office.png',
    'rooftop.png',
    # Day 1 Afterschool
    'classroom_empty.png',
    'teacher_office.png',
    'school_gate_evening.png',
    # Day 1 Night
    'home.png',
    'black.png',
    # Day 2 Morning
    'room_morning.png',
    # Day 2 Night
    'corridor_dark.png',
    # Day 3 Morning
    'corridor.png',
    # Day 4 Lunch
    'old_building.png',
    # Day 5 Lunch
    'stairway.png',
    'exit_door.png',
    # Day 5 Night
    'garden.png',
    # 미사용
    'classroom_evening.png',
    'faculty_office.png',
    'gym.png',
    'basement.png',
    'outside_school.png',
    'street.png',
    'night_rain.png',
    'school_night.png',
    'school_dark.png',
    'school_dawn.png',
    'sunset_outside.png',
    'room_night.png',
]

REFERENCED_BG = set([
    'cherry_blossom.png', 'school_gate.png', 'hallway.png', 'classroom.png',
    'library.png', 'nurse_office.png', 'rooftop.png', 'classroom_empty.png',
    'teacher_office.png', 'school_gate_evening.png', 'home.png', 'black.png',
    'room_morning.png', 'corridor_dark.png', 'corridor.png', 'old_building.png',
    'stairway.png', 'exit_door.png', 'garden.png',
])

# ==============================
# 새 파일 조립
# ==============================
out = []

# 파일 헤더 (## 전까지)
out.extend(lines[:major_idx[0]])

new_num = 1

# 캐릭터 섹션
for sec_key in CHAR_SECTION_ORDER:
    if sec_key not in sections:
        print(f"WARNING: 섹션 없음 — {sec_key}")
        continue

    sec = sections[sec_key]
    new_header = re.sub(r'## \d+\.', f'## {new_num}.', sec['header'][0])
    out.append(new_header)
    out.extend(sec['header'][1:])

    img_order = CHAR_IMG_ORDER.get(sec_key, [])
    blocks = sec['blocks']
    added = set()

    for img_name in img_order:
        if img_name in blocks:
            out.extend(blocks[img_name])
            added.add(img_name)

    # 순서 목록에 없는 블록 뒤에 추가
    for img_name, block in blocks.items():
        if img_name not in added:
            out.extend(block)
            print(f"  미순서 블록 추가: {img_name}")

    new_num += 1

# 배경 섹션
bg_key = '## 6. 배경'
if bg_key in sections:
    bg = sections[bg_key]
    new_header = re.sub(r'## \d+\.', f'## {new_num}.', bg['header'][0])
    out.append(new_header)
    out.extend(bg['header'][1:])

    bg_blocks = bg['blocks']
    added_bg = set()
    unreferenced_started = False

    for bg_name in BG_ORDER:
        if bg_name in bg_blocks:
            if bg_name not in REFERENCED_BG and not unreferenced_started:
                out.append('')
                out.append('> **아래 배경들은 현재 시나리오에서 참조되지 않음 (나중에 생성)**')
                out.append('')
                unreferenced_started = True
            out.extend(bg_blocks[bg_name])
            added_bg.add(bg_name)

    for bg_name, block in bg_blocks.items():
        if bg_name not in added_bg:
            out.extend(block)
            print(f"  미순서 배경 블록 추가: {bg_name}")

    new_num += 1

# BGM, SFX (순서 유지, 번호만 업데이트)
for sec_title in ['## 7. BGM — Suno AI 프롬프트', '## 8. SFX (효과음) — Suno AI 프롬프트']:
    if sec_title in sections:
        sec = sections[sec_title]
        new_header = re.sub(r'## \d+\.', f'## {new_num}.', sec['header'][0])
        out.append(new_header)
        out.extend(sec['header'][1:])
        for block in sec['blocks'].values():
            out.extend(block)
        new_num += 1

# 저장
with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print(f"\n완료! 총 ### 블록 수: {chr(10).join(out).count(chr(10) + '### ')}")
