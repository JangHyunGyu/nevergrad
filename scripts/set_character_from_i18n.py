#!/usr/bin/env python3
"""
Phase 2: i18n에서 화자 정보를 읽고, character: null인 노드 중
명시적으로 캐릭터 이미지가 필요한 노드를 업데이트.

규칙:
- 캐릭터가 말하는 노드 → 해당 캐릭터 이미지 (이전 노드에서 이미 설정됐으면 유지)
- "나"/{name} 지문/대사 → null 유지 (캐릭터 제거)
- 급우/시스템 → null 유지
"""
import re, os, json

SCENARIO_DIR = "assets/js/scenario"
I18N_DIR = "assets/js/i18n/ko"

SPEAKER_TO_CHAR = {
    "박은수": "eunsu", "은수": "eunsu", "담임교사": "eunsu",
    "한세아": "sea", "세아": "sea",
    "최유나": "yuna", "유나": "yuna",
    "강리인": "riin", "리인": "riin", "보건교사": "riin",
    "이설화": "seolhwa", "설화": "seolhwa",
    "급우A": None, "급우B": None, "옆자리 남학생": None,
    "나": None, "{name}": None, "시스템": None, "???": None,
}

CHAR_DEFAULT = {
    "eunsu": "eunsu_gentle",
    "riin": "riin_smile",
    "sea": "sea_smile",
    "yuna": "yuna_normal",
    "seolhwa": "seolhwa_normal",
}

def scenario_to_i18n(fname):
    m = re.match(r'day(\d+)_(\d+)_(\w+)\.js', fname)
    if not m: return None
    return f"day{m.group(1)}_{m.group(3)}.json"

def get_char_for_speaker(name):
    if not name: return None
    for k, v in SPEAKER_TO_CHAR.items():
        if k in name:
            return v
    return None

def process_file(scenario_fname):
    i18n_fname = scenario_to_i18n(scenario_fname)
    i18n = {}
    if i18n_fname:
        path = os.path.join(I18N_DIR, i18n_fname)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                i18n = json.load(f)
    
    filepath = os.path.join(SCENARIO_DIR, scenario_fname)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # For each node that has character: null and the i18n shows a character speaking,
    # update to the appropriate character expression
    # We need to track flow order and what character was previously shown
    
    # Extract ordered list of node keys by their position in file
    node_order = []
    for m in re.finditer(r'^    "([a-zA-Z0-9_]+)"\s*:\s*\{', content, re.MULTILINE):
        node_order.append((m.group(1), m.start()))
    
    # For each node, extract its character value
    node_chars = {}
    for node_key, pos in node_order:
        # Find node content
        depth = 0
        end = pos
        for k, ch in enumerate(content[pos:], pos):
            if ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = k
                    break
        node_content = content[pos:end+1]
        
        # Extract character value
        cm = re.search(r'character:\s*("([^"]+)"|null)', node_content)
        if cm:
            if cm.group(2):
                node_chars[node_key] = cm.group(2)
            else:
                node_chars[node_key] = None
    
    # Now determine which null characters should be updated
    prev_char = None
    updates = {}
    
    for node_key, pos in node_order:
        current_char = node_chars.get(node_key, None)
        
        if current_char is not None and current_char != "null":
            prev_char = current_char
            continue
        
        # Node has character: null
        # Check i18n to see who's speaking
        i18n_entry = i18n.get(node_key, {})
        speaker = i18n_entry.get("name", "")
        text = i18n_entry.get("text", "")
        
        char_id = get_char_for_speaker(speaker)
        
        if char_id:
            # A named character is speaking, but character is null
            # This needs to be updated
            # Use the previous expression for this character if available, else default
            if prev_char and prev_char.startswith(char_id + "_"):
                new_char = prev_char  # Keep same expression
            else:
                new_char = CHAR_DEFAULT.get(char_id, f"{char_id}_normal")
            updates[node_key] = new_char
            prev_char = new_char
        else:
            # Narration, protagonist, or classmate - keep null
            # But track flow: null means character disappears
            prev_char = None
    
    # Apply updates
    for node_key, new_char in updates.items():
        # Find the specific character: null in this node and replace it
        pattern = (
            r'(    "' + re.escape(node_key) + r'"\s*:\s*\{[^}]*?)'
            r'character:\s*null'
        )
        def replacer(m):
            return m.group(1) + f'character: "{new_char}"'
        
        new_content = re.sub(pattern, replacer, content, count=1, flags=re.DOTALL)
        if new_content != content:
            content = new_content
            changes += 1
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  {scenario_fname}: {changes} nodes updated (null -> character)")
    else:
        print(f"  {scenario_fname}: no updates needed")

files = sorted([f for f in os.listdir(SCENARIO_DIR) if f.endswith('.js') and f.startswith('day')])
print(f"Phase 2: Setting character from i18n for {len(files)} files...\n")
for f in files:
    process_file(f)
print("\nDone!")
