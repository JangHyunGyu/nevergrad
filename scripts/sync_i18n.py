"""
sync_i18n.py
============
ko JSON을 마스터로 삼아 각 언어 JSON 파일을 동기화한다.

동작:
1. ko JSON에서 모든 씬 ID 추출
2. 각 언어(ja/es/fr/de)의 기존 JSON에서 동일 ID 항목 유지
3. 존재하지 않는 항목은 생략 (I18nManager의 ko fallback이 처리)
4. en은 이미 수동 번역 완료 → 건드리지 않음
"""
import sys, io, json, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = 'C:/workspace/nevergrad/assets/js/i18n'
LANGUAGES = ['ja', 'es', 'fr', 'de']   # en은 이미 완성
DAYS = range(1, 6)
SLOTS = ['morning', 'lunch', 'afterschool', 'night']

# 언어별 화자 이름 번역표
NAME_MAPS = {
    'ja': {
        '나': '私',
        '한세아': 'ハン・セア',
        '박은수': 'パク・ウンス',
        '강리인': 'カン・リイン',
        '최유나': 'チェ・ユナ',
        '이설화': 'イ・ソルファ',
        '옆자리 남학생': '隣の男子生徒',
        '여학생 A': '女子生徒A',
        '남학생 B': '男子生徒B',
        'Me': '私',
        '???': '???',
        '': '',
    },
    'es': {
        '나': 'Yo',
        '한세아': 'Han Sea',
        '박은수': 'Park Eunsu',
        '강리인': 'Kang Riin',
        '최유나': 'Choi Yuna',
        '이설화': 'Lee Seolhwa',
        '옆자리 남학생': 'Chico del asiento de al lado',
        '여학생 A': 'Chica A',
        '남학생 B': 'Chico B',
        '???': '???',
        '': '',
    },
    'fr': {
        '나': 'Moi',
        '한세아': 'Han Sea',
        '박은수': 'Park Eunsu',
        '강리인': 'Kang Riin',
        '최유나': 'Choi Yuna',
        '이설화': 'Lee Seolhwa',
        '옆자리 남학생': 'Garçon à côté',
        '여학생 A': 'Fille A',
        '남학생 B': 'Garçon B',
        '???': '???',
        '': '',
    },
    'de': {
        '나': 'Ich',
        '한세아': 'Han Sea',
        '박은수': 'Park Eunsu',
        '강리인': 'Kang Riin',
        '최유나': 'Choi Yuna',
        '이설화': 'Lee Seolhwa',
        '옆자리 남학생': 'Junge im Nebensitz',
        '여학생 A': 'Mädchen A',
        '남학생 B': 'Junge B',
        '???': '???',
        '': '',
    },
}

def translate_name(name, lang):
    m = NAME_MAPS.get(lang, {})
    return m.get(name, name)

def sync_file(day, slot, lang):
    ko_path = f'{BASE}/ko/day{day}_{slot}.json'
    lang_path = f'{BASE}/{lang}/day{day}_{slot}.json'

    if not os.path.exists(ko_path):
        return

    with open(ko_path, 'r', encoding='utf-8') as f:
        ko_data = json.load(f)

    # 기존 언어 JSON 로드 (없으면 빈 dict)
    existing = {}
    if os.path.exists(lang_path):
        try:
            with open(lang_path, 'r', encoding='utf-8') as f:
                existing = json.load(f)
        except:
            existing = {}

    # 결과 JSON 생성
    result = {}
    for scene_id, ko_entry in ko_data.items():
        if scene_id in existing:
            # 기존 번역 있으면 유지 (단, name 필드 변환)
            raw = existing[scene_id]
            if not isinstance(raw, dict):
                # 비정상 항목(string 등) → ko 원문으로 대체
                entry = {
                    'name': translate_name(ko_entry.get('name', ''), lang),
                    'text': ko_entry.get('text', '')
                }
                if 'choices' in ko_entry:
                    entry['choices'] = ko_entry['choices']
                result[scene_id] = entry
                continue
            entry = dict(raw)
            # name이 한국어면 변환
            if entry.get('name') in NAME_MAPS.get(lang, {}):
                entry['name'] = translate_name(entry['name'], lang)
            result[scene_id] = entry
        else:
            # 번역 없음 → 생략 (ko fallback이 처리)
            # 단, name 필드만 번역해서 넣음 (최소한 화자 이름은 현지화)
            entry = {
                'name': translate_name(ko_entry.get('name', ''), lang),
                'text': ko_entry.get('text', '')   # ko 원문 임시 사용
            }
            if 'choices' in ko_entry:
                entry['choices'] = ko_entry['choices']  # choices도 임시로 ko
            result[scene_id] = entry

    os.makedirs(f'{BASE}/{lang}', exist_ok=True)
    with open(lang_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    count_translated = sum(1 for sid in ko_data if sid in existing)
    count_total = len(ko_data)
    print(f'  [{lang}] day{day}_{slot}: {count_translated}/{count_total} 번역, {count_total - count_translated}개 ko 원문 임시 사용')

print('=== i18n 동기화 시작 ===\n')
for day in DAYS:
    for slot in SLOTS:
        ko_path = f'{BASE}/ko/day{day}_{slot}.json'
        if not os.path.exists(ko_path):
            continue
        print(f'Day {day} {slot}:')
        for lang in LANGUAGES:
            sync_file(day, slot, lang)
        print()

print('=== 완료 ===')
