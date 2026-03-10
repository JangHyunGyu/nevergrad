import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # eunsu_gentle — 후광 효과 제거 (캐릭터 고유 X, 환경적)
    (
        "따뜻함과 애정이 가득한 눈빛 동공이 살짝 확대됨, 뒤에서 비치는 은은한 후광 효과,",
        "따뜻함과 애정이 가득한 눈빛 동공이 살짝 확대됨,"
    ),
    # yuna_determined — 머리카락 빛 라인 제거
    (
        "뒤에서 비치는 영웅적인 역광 금빛 조명 머리카락 윤곽에 빛 라인",
        "뒤에서 비치는 영웅적인 역광 금빛 조명"
    ),
    # riin_seductive — 얼굴 윤곽 금빛 라인 제거
    (
        "따뜻한 앰버-골드 톤 역광 조명 얼굴 윤곽에 금빛 라인",
        "따뜻한 앰버-골드 톤 부드러운 조명"
    ),
]

new_content = content
for old, new in replacements:
    count = new_content.count(old)
    new_content = new_content.replace(old, new)
    status = "✓" if count else "✗"
    print(f"{status} {count}개: {old[:60]}")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
