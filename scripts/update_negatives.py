import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 추가할 네거티브 항목
PARTICLE_NEG = "파티클 효과, 빛 입자, 이펙트, 후광, 광선 효과, 빛줄기"

# 설화 섹션 범위 파악 (설화는 제외)
seolhwa_start = content.index("## 3. 캐릭터 — 이설화")
seolhwa_end   = content.index("## 4. 캐릭터 — 최유나")

# 설화 이전 + 이후 구간에서 네거티브 교체
def add_particle_neg(text):
    # 표준 네거티브 (끝에 추가)
    text = text.replace(
        "배경 포함, 전신, 하반신 포함\n```",
        f"배경 포함, 전신, 하반신 포함, {PARTICLE_NEG}\n```"
    )
    return text

before_seolhwa = content[:seolhwa_start]
seolhwa_block  = content[seolhwa_start:seolhwa_end]
after_seolhwa  = content[seolhwa_end:]

before_fixed = add_particle_neg(before_seolhwa)
after_fixed  = add_particle_neg(after_seolhwa)

new_content = before_fixed + seolhwa_block + after_fixed

# 검증
orig_count = content.count("배경 포함, 전신, 하반신 포함\n```")
new_count  = new_content.count(PARTICLE_NEG)
seolhwa_neg_count = seolhwa_block.count("배경 포함, 전신, 하반신 포함")

print(f"원본 네거티브 블록 수: {orig_count}")
print(f"설화 섹션 내 네거티브 수 (미변경): {seolhwa_neg_count}")
print(f"파티클 네거티브 추가된 수: {new_count}")

with open('C:/workspace/nevergrad/PROMPTS_READY.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n완료!")
