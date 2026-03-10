import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # ── 환경 조명 제거 (캐릭터 스프라이트에 창문 빛 패턴 구워지면 안됨) ──
    (
        "따뜻한 골드-앰버 톤 조명 얼굴에 창문 빛 패턴",
        "따뜻한 골드-앰버 톤 부드러운 확산 조명"
    ),

    # ── 나이 제거 ────────────────────────────────────────────────
    # 한세아 17세
    (
        "귀여운 한국인 여고생 17세,",
        "귀여운 한국인 여고생,"
    ),
    # 최유나 16세
    (
        "조용한 한국인 여고생 16세,",
        "조용한 한국인 여고생,"
    ),
    # 이설화 17세
    (
        "신비로운 한국인 소녀 17세,",
        "신비로운 한국인 소녀,"
    ),
]

new_content = content
for old, new in replacements:
    count = new_content.count(old)
    new_content = new_content.replace(old, new)
    status = "✓" if count else "✗"
    print(f"{status} {count}개: {old}")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
