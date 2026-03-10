"""
Translation helper: applies French translations to FR JSON files.
Replaces Korean-text entries using predefined French translations.
"""
import json, re, sys

def has_korean(text):
    return bool(re.search(r'[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]', str(text)))

name_map = {
    'Me': 'Moi',
    'Han Sea': 'Han Sea',
    'Teacher': 'Professeure',
    'Homeroom Teacher': 'Professeure principale',
    '???': '???',
    'Park Eunsu': 'Park Eunsu',
    'Lee Seolhwa': 'Lee Seolhwa',
    'Kang Riin': 'Kang Riin',
    'Choi Yuna': 'Choi Yuna',
    'Yuna': 'Yuna',
    'Riin': 'Riin',
    'Girl A': 'Fille A',
    'Boy B': 'Garcon B',
    'Boy next seat': 'Garcon a cote',
}

def apply_translations(filename, translations):
    fr_path = f'assets/js/i18n/fr/{filename}'
    en_path = f'assets/js/i18n/en/{filename}'

    with open(fr_path, encoding='utf-8') as f:
        fr = json.load(f)
    with open(en_path, encoding='utf-8') as f:
        en = json.load(f)

    updated = 0
    for key, fr_val in fr.items():
        needs = (has_korean(fr_val.get('text','')) or has_korean(fr_val.get('name','')) or
                 any(has_korean(c) for c in fr_val.get('choices',[])))
        if not needs:
            continue
        if key in translations:
            fr[key] = translations[key]
            updated += 1
        else:
            en_val = en.get(key, {})
            en_name = en_val.get('name', '')
            fr_name_new = name_map.get(en_name, en_name)
            fr[key] = {'name': fr_name_new, 'text': '[TODO: ' + en_val.get('text','') + ']'}
            if 'choices' in en_val:
                fr[key]['choices'] = en_val['choices']
            print(f'NO_TRANS for {key}')

    with open(fr_path, 'w', encoding='utf-8') as f:
        json.dump(fr, f, ensure_ascii=False, indent=2)

    remaining = len(re.findall(r'[\uac00-\ud7af]', open(fr_path, encoding='utf-8').read()))
    print(f'{filename}: updated {updated}, Korean remaining: {remaining}')

if __name__ == '__main__':
    if len(sys.argv) > 1:
        print('Usage: import and call apply_translations()')

