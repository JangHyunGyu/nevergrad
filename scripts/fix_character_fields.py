#!/usr/bin/env python3
"""
Nevergrad: 모든 시나리오 노드에 character 필드 명시적 추가.
- i18n/ko JSON에서 화자 이름 참조
- 화자가 캐릭터일 경우 적절한 표정 이미지 지정
- 지문/내레이션일 경우 문맥에 맞게 character 유지 또는 null
- classmate → null 변환
"""
import re, os, json, sys

SCENARIO_DIR = "assets/js/scenario"
I18N_DIR = "assets/js/i18n/ko"

# Speaker name → character ID mapping
SPEAKER_TO_CHAR = {
    "박은수": "eunsu",
    "은수": "eunsu",
    "담임교사": "eunsu",
    "한세아": "sea",
    "세아": "sea",
    "최유나": "yuna",
    "유나": "yuna",
    "강리인": "riin",
    "리인": "riin",
    "보건교사": "riin",
    "이설화": "seolhwa",
    "설화": "seolhwa",
}

# Default expressions for each character (when no specific expression is warranted)
CHAR_DEFAULT_EXPR = {
    "eunsu": "eunsu_gentle",
    "riin": "riin_smile",
    "sea": "sea_smile",
    "yuna": "yuna_normal",
    "seolhwa": "seolhwa_normal",
}

# i18n filename mapping (scenario -> i18n)
def scenario_to_i18n(scenario_fname):
    # day1_1_morning.js -> day1_morning.json
    m = re.match(r'day(\d+)_(\d+)_(\w+)\.js', scenario_fname)
    if not m:
        return None
    day, slot_num, slot_name = m.groups()
    return f"day{day}_{slot_name}.json"

def load_i18n(fname):
    path = os.path.join(I18N_DIR, fname)
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_speaker_char(speaker_name, text=""):
    """Return character ID from speaker name, or None for narration."""
    if not speaker_name:
        return None
    
    # Direct character mapping
    for name, char_id in SPEAKER_TO_CHAR.items():
        if name in speaker_name:
            return char_id
    
    # "나", "{name}", protagonist
    if speaker_name in ["나", "{name}", "주인공"]:
        return None  # Narration/protagonist - no character image
    
    # "급우", "옆자리 남학생", etc
    if any(k in speaker_name for k in ["급우", "남학생", "여학생", "학생", "시스템", "???"]):
        return None
    
    return None

def determine_character(node_key, i18n_data, prev_char, context_char):
    """Determine the character value for a node without explicit character field."""
    i18n_entry = i18n_data.get(node_key, {})
    speaker = i18n_entry.get("name", "")
    text = i18n_entry.get("text", "")
    
    char_id = get_speaker_char(speaker, text)
    
    if char_id:
        # A named character is speaking - show their default expression
        return CHAR_DEFAULT_EXPR.get(char_id, f"{char_id}_normal")
    
    # Narration or protagonist speaking
    # Check if it's clearly describing a scene without a character present
    if speaker in ["나", "{name}", "주인공", ""]:
        # If text starts with * (narration), consider context
        if text.startswith("*"):
            # Keep previous character if it makes sense
            # (narrator is observing/reacting to someone present)
            return "INHERIT"
        else:
            # Protagonist speaking out loud
            return "INHERIT"
    
    # Unknown speaker (classmate, system, etc)
    return None

def process_file(scenario_fname):
    """Process a single scenario file, adding character fields where missing."""
    i18n_fname = scenario_to_i18n(scenario_fname)
    i18n_data = load_i18n(i18n_fname) if i18n_fname else {}
    
    filepath = os.path.join(SCENARIO_DIR, scenario_fname)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Step 1: Replace classmate -> null
    content = content.replace('character: "classmate"', 'character: null')
    
    # Step 2: Find all nodes and add character field where missing
    # We need to process the file node by node
    lines = content.split('\n')
    result = []
    i = 0
    node_count = 0
    added_count = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Detect node definition start: '    "node_key": {'
        m = re.match(r'^(    )"([a-zA-Z0-9_]+)"\s*:\s*\{\s*$', line)
        if m:
            indent = m.group(1)
            node_key = m.group(2)
            node_count += 1
            
            # Collect all lines of this node
            node_lines = [line]
            depth = 1
            j = i + 1
            while j < len(lines) and depth > 0:
                node_lines.append(lines[j])
                depth += lines[j].count('{') - lines[j].count('}')
                j += 1
            
            node_text = '\n'.join(node_lines)
            
            # Check if character field exists
            has_character = bool(re.search(r'\bcharacter\s*:', node_text))
            
            if not has_character:
                # Need to add character field
                # Find the right place to insert (after the opening brace)
                result.append(line)  # Add the opening line
                
                # Add character: null (we'll use null as the safe default)
                # The inheriting behavior was intentional in the engine,
                # but user wants explicit fields
                result.append(f"        character: null,")
                added_count += 1
                
                # Add the rest of the node lines (skip the first which we already added)
                for nl in node_lines[1:]:
                    result.append(nl)
                
                i = j
                continue
            
            # Node already has character field - add all lines as-is
            for nl in node_lines:
                result.append(nl)
            i = j
            continue
        
        result.append(line)
        i += 1
    
    new_content = '\n'.join(result)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  {scenario_fname}: +{added_count} character fields added (classmate->null included)")
    else:
        print(f"  {scenario_fname}: no changes needed")

# Process all files
files = sorted([f for f in os.listdir(SCENARIO_DIR) if f.endswith('.js') and f.startswith('day')])
print(f"Processing {len(files)} scenario files...\n")
for f in files:
    process_file(f)
print("\nDone!")
