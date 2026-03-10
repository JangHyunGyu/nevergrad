import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

sections = {
    'sea':     ("## 1. 캐릭터 — 한세아", "## 2. 캐릭터 — 박은수",   "5.5등신", "6.5등신"),
    'eunsu':   ("## 2. 캐릭터 — 박은수", "## 3. 캐릭터 — 이설화",   "5.5등신", "7등신"),
    'seolhwa': ("## 3. 캐릭터 — 이설화", "## 4. 캐릭터 — 최유나",   "5.5등신", "7등신"),
    'yuna':    ("## 4. 캐릭터 — 최유나", "## 5. 캐릭터 — 강리인",   "5.5등신", "6.5등신"),
    'riin':    ("## 5. 캐릭터 — 강리인", "## 6. 배경",               "5.5등신", "7등신"),
}

new_content = content
for char, (sec_start, sec_end, old, new) in sections.items():
    start_idx = new_content.index(sec_start)
    end_idx   = new_content.index(sec_end)
    section   = new_content[start_idx:end_idx]
    count     = section.count(old)
    section   = section.replace(old, new)
    new_content = new_content[:start_idx] + section + new_content[end_idx:]
    print(f"✓ {char}: {old} → {new} ({count}개)")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
