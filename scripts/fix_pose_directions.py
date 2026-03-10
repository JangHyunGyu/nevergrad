import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Sea (6 instances) — 한 손을 허리에
    (
        "한 손을 허리에 얹고 다른 손은 옆에 자연스럽게 든",
        "오른손을 허리에 얹고 왼손은 옆에 자연스럽게 든"
    ),
    # sea_yandere — 리본
    (
        "한쪽 리본이 풀려 반쯤 내려옴",
        "오른쪽 리본이 풀려 반쯤 내려옴"
    ),
    # eunsu_obsessed — 렌즈
    (
        "한쪽 렌즈에 금",
        "오른쪽 렌즈에 금"
    ),
    # eunsu_dark — 눈 가림
    (
        "한쪽 눈을 가림",
        "오른쪽 눈을 가림"
    ),
    # seolhwa_fade — 손 뻗기
    (
        "한 손을 앞으로 뻗으며",
        "오른손을 앞으로 뻗으며"
    ),
    # seolhwa_sad — 얼굴 한쪽
    (
        "얼굴 한쪽을 커튼처럼 덮어 오른쪽 눈을 가림",
        "얼굴 오른쪽을 커튼처럼 덮어 오른쪽 눈을 가림"
    ),
    # riin_seductive — 어깨
    (
        "가운이 한쪽 어깨에서 살짝 벗겨져",
        "가운이 왼쪽 어깨에서 살짝 벗겨져"
    ),
    # yuna_cry — 손
    (
        "한 손을 얼굴 가까이 가져간 자세",
        "오른손을 얼굴 가까이 가져간 자세"
    ),
]

new_content = content
for old, new in replacements:
    count = new_content.count(old)
    new_content = new_content.replace(old, new)
    status = "✓" if count else "✗"
    print(f"{status} {count}개: {old[:50]}")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
