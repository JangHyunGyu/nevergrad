#!/usr/bin/env python3
"""Generate all character expression images using Gemini 3.1 Flash with normal as reference."""
import urllib.request
import json
import base64
import os
import time
import sys

API_KEY = 'AIzaSyCCx_tOgSGRPg3A_dORFHHAoLak_I1bT5c'
BASE_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'images', 'characters')
URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={API_KEY}'

CHARACTERS = {
    'eunsu': {
        'ref': 'eunsu_normal.png',
        'base_desc': '긴 생머리 흑발, 따뜻한 갈색 눈, 아이보리 피부, 얇은 은테 안경, 크림색 블라우스에 네이비 가디건, 네이비 펜슬 스커트, 진주 귀걸이, 20대 중반 여교사',
        'expressions': {
            'eunsu_smile': '따뜻하고 포근한 모성적 미소, 입꼬리가 부드럽게 올라감, 눈이 초승달처럼 살짝 감김, 다정하고 안심시키는 표정, 양볼에 자연스러운 핑크빛 혈색. 조명: 부드러운 핑크-골드 톤 따뜻한 조명.',
            'eunsu_gentle': '부드럽고 자상한 표정, 입술이 살짝 벌어진 채 미소, 촉촉한 윤기의 깊은 애정의 눈빛, 동공이 살짝 확대됨, 따뜻함과 애정이 가득. 조명: 부드러운 골드 톤 조명.',
            'eunsu_shy': '시선이 오른쪽 아래를 향하며 회피, 양 볼과 귀 끝까지 퍼지는 진한 홍조, 입술을 살짝 깨물고 있는 모습, 당황하면서도 은근히 기뻐하는 복잡한 표정. 조명: 부드러운 핑크톤 조명.',
            'eunsu_serious': '미소가 완전히 사라진 진지한 표정, 입술을 일자로 꽉 다문 모습, 눈이 날카롭게 변하고 눈꼬리가 미세하게 올라감, 전문적이고 권위있는 담임교사 분위기. 조명: 중립적이고 평탄한 조명.',
            'eunsu_close': '극단적 클로즈업 구도 얼굴이 화면의 80% 차지, 의미심장한 미소 입꼬리 한쪽이 살짝 더 올라감, 금빛 하이라이트 동공이 크게 확대됨, 플레이어를 직접 바라보는 시선, 앞으로 살짝 몸을 기울인 자세. 조명: 따뜻한 앰버 톤 조명.',
            'eunsu_angry': '깊이 찡그린 미간, 꽉 다문 입술 입꼬리가 아래로, 눈이 날카롭게 변하고 눈꼬리가 올라감, 강렬하게 정면을 쏘아보는 날카로운 눈빛, 흑발이 분노로 미세하게 흔들림. 조명: 아래에서 올라오는 붉은 톤 극적인 언더라이팅.',
            'eunsu_cold': '일체의 미소 없는 무표정 일자로 다문 입술, 따뜻함이 사라진 어두운 갈색 눈 하이라이트가 작아지고 차가워짐, 피부가 평소보다 창백, 가늘게 뜬 계산적인 눈빛, 눈 밑에 미세한 다크서클 그림자. 조명: 푸른 톤의 차가운 형광 조명.',
            'eunsu_obsessed': '비정상적으로 크게 뜬 눈에 바늘구멍처럼 수축된 극소 동공 눈동자에 붉은 빛 반사, 귀까지 찢어질 듯 넓은 미소 이빨이 전부 보임, 고개를 왼쪽으로 30도 부자연스럽게 기울임, 안경이 비뚤어지고 한쪽 렌즈에 금, 흐트러지고 엉킨 머리카락, 블라우스 칼라 흐트러지고 가디건이 벗겨짐, 얼굴에 땀방울. 조명: 아래에서 올라오는 강렬한 빨강-흰색 언더라이팅.',
            'eunsu_dark': '긴 생머리가 얼굴 오른쪽을 커튼처럼 덮어 오른쪽 눈을 가림, 보이는 왼쪽 눈만 어둠 속에서 붉은빛으로 희미하게 빛남, 얼굴 오른쪽 절반이 깊은 그림자에 완전히 가려짐, 입꼬리가 부자연스럽게 살짝 올라간 음흉한 미소, 가디건 어깨가 한쪽으로 흘러내림. 조명: 왼쪽에서 비치는 어두운 보라-진홍 역광.',
            'eunsu_warm': '부드럽고 자상한 표정, 입술이 살짝 벌어진 채 미소, 촉촉한 윤기의 깊은 애정의 눈빛, 따뜻함과 애정이 가득한 눈빛, 동공이 살짝 확대됨. 조명: 부드러운 골드 톤 조명.',
        }
    },
    'sea': {
        'ref': 'sea_normal.png',
        'base_desc': '밤색 트윈테일에 분홍 리본, 헤이즐-그린 눈, 복숭아빛 피부, 코 위 주근깨, 분홍 별 헤어핀, 네이비 블레이저 교복, 빨간 리본 타이, 타탄체크 스커트, 여고생',
        'expressions': {
            'sea_smile': '환하게 빛나는 활짝 핀 미소 치아가 보임, 눈이 초승달처럼 감기며 별 하이라이트가 더 밝아짐, 양볼이 더욱 상기됨, 밝고 활기찬 분위기. 조명: 따뜻한 금빛 햇살 조명.',
            'sea_shy': '눈이 왼쪽 아래를 향하며 시선 회피 속눈썹 사이로 슬쩍 올려봄, 양 볼 귀 끝 목까지 진하게 번지는 홍조, 주근깨가 홍조 위로 더 도드라짐, 입술을 살짝 오므린 부끄러운 표정. 조명: 부드러운 핑크-라벤더 톤 조명.',
            'sea_serious': '미소가 완전히 사라진 진지한 표정, 미간을 살짝 찡그리며 의심스럽게 캐묻는 눈빛, 눈이 날카롭게 변하고 눈꼬리가 살짝 올라감, 입술을 일자로 굳게 다문 모습. 조명: 중립적이고 평탄한 조명.',
            'sea_sad': '미소가 사라지고 입꼬리가 자연스럽게 내려간 우울한 표정, 눈썹이 슬프게 중앙으로 모이며 올라감, 눈이 아래를 향하며 별 하이라이트가 흐릿하게 줄어듦, 혈색이 빠지고 코끝이 살짝 빨개짐. 조명: 약간 채도가 낮은 부드러운 조명.',
            'sea_cry': '눈에서 큰 물방울 같은 눈물이 양 볼을 타고 줄줄 흘러내림, 속눈썹이 젖어 뭉침, 피부가 울음으로 얼룩덜룩 빨개짐, 입을 벌리고 울부짖는 모습, 양손으로 얼굴을 가리려다 만 자세. 조명: 부드럽게 확산된 백색 조명.',
            'sea_hurt': '눈에 눈물이 고여 수면 위 빛처럼 흔들림, 아랫입술을 세게 깨물며 울음을 참는 모습, 배신당한 듯 상처받은 눈빛, 코끝이 빨개짐. 조명: 차가운 청색-회색 톤 조명 채도 낮음.',
            'sea_angry': '양볼을 부풀린 복어 같은 화난 표정, 깊이 찡그린 미간, 눈이 부릅뜨며 눈꼬리가 올라감, 양볼이 분노로 상기됨, 코믹하지만 진심으로 속상한 느낌. 조명: 따뜻한 조명.',
            'sea_yandere': '오른쪽 리본이 풀려 반쯤 내려옴, 비대칭 동공 한쪽이 핀홀처럼 수축 한쪽은 확대, 피부톤이 불건강한 창백 비정상적인 핑크 홍조, 귀까지 찢어질 듯 넓은 미소 이빨이 전부 보임, 고개를 왼쪽으로 25도 부자연스럽게 기울임, 교복에 미세한 붉은 얼룩, 오른손을 등 뒤에 숨기고 왼손은 정면을 향해 뻗는 자세. 조명: 핑크와 핏빛 빨강이 교차하는 조명.',
            'sea_dark': '얼굴 오른쪽 절반이 완전한 어둠에 잠김, 보이는 왼쪽 눈은 하이라이트가 완전히 사라진 공허한 눈동자, 피부톤이 불건강하게 창백, 미소가 완전히 사라진 무표정 힘이 풀린 입술, 양팔이 힘없이 내려간 의욕 상실 자세. 조명: 어두운 남색-검정 조명 극도로 낮은 채도.',
        }
    },
    'riin': {
        'ref': 'riin_normal.png',
        'base_desc': '짧은 다크 퍼플 단발, 앰버 눈, 하프림 안경, 왼쪽 눈 아래 점, 검은 터틀넥 위에 흰 가운, 검은 슬랙스, 은색 목걸이, 클립보드, 20대 후반 보건교사',
        'expressions': {
            'riin_smile': '친절하고 안심시키는 미소, 입꼬리가 양쪽으로 고르게 올라감 치아가 살짝 보임, 앰버 눈이 부드럽게 휘며 눈꼬리가 내려감, 피부에 자연스러운 혈색, 다가가기 쉬운 따뜻한 표정이지만 눈 속에 미세한 관찰의 시선. 조명: 따뜻한 자연광 조명.',
            'riin_gentle': '만족스럽고 우아한 미소, 고개를 살짝 옆으로 기울이며 눈을 반쯤 감은 고양이 같은 만족감, 비밀을 알고 있는 듯한 여유로운 표정. 조명: 부드러운 따뜻한 조명.',
            'riin_seductive': '반쯤 감은 앰버 눈 속눈썹이 그림자를 드리움 유혹적인 눈빛, 앞머리가 한쪽 눈을 살짝 가림, 입술에 미세한 광택, 오른손 검지를 입술에 살짝 대고 있는 쉿 제스처, 의미심장한 비대칭 미소, 가운이 한쪽 어깨에서 살짝 벗겨짐. 조명: 따뜻한 앰버-골드 톤.',
            'riin_close': '극단적 클로즈업 구도 얼굴이 화면의 80% 차지, 앰버 눈이 크게 보이는 클로즈업, 피부 결이 보일 듯한 가까운 거리, 한쪽 눈썹을 미세하게 올린 관찰하고 분석하는 표정, 위에서 내려다보는 듯한 앵글. 조명: 중립적 조명.',
            'riin_pleased': '흡족하고 우아한 미소, 앰버 눈이 반달 모양으로 부드럽게 휘며 만족한 고양이의 눈, 양볼에 자연스러운 혈색, 눈을 반쯤 감은 채 고개를 살짝 기울이며 만족하는 표정, 오른손은 턱 아래에 살짝 갖다 댐. 조명: 따뜻한 앰버 톤.',
            'riin_cold': '완전히 무감정한 임상적 시선 실험 대상을 관찰하는 과학자의 눈, 앰버 눈에서 온기가 완전히 사라지고 유리 같은 무기질적 광택만 남음, 피부톤이 창백하고 차가움, 가운 단추가 끝까지 잠기고 자세가 경직됨, 일체의 감정이 지워진 냉담한 표정. 조명: 위에서 내리쬐는 차가운 흰색 형광등 조명.',
            'riin_dark': '짧은 다크 퍼플 단발이 그림자에 거의 검게 보임, 앰버 눈이 어둠 속에서 노란 빛으로 형광처럼 빛남 동공이 세로로 좁아진 느낌, 창백한 피부에 눈 아래 깊은 그림자, 오른손에 의료용 주사기 들고 있음 보라색 액체, 얼굴 윗부분이 깊은 그림자에 덮임, 음흉하고 위협적인 미소 치아가 드러남. 조명: 아래에서 올라오는 병적인 초록-보라빛 호러 언더라이팅.',
            'riin_neutral': '중립적이고 무표정에 가까운 담담한 얼굴, 차분하고 분석적인 눈빛 약간 눈을 가늘게 뜸, 담담하고 침착한 표정 입술은 자연스러운 닫힘. 조명: 깔끔한 흰색 조명.',
        }
    },
    'yuna': {
        'ref': 'yuna_normal.png',
        'base_desc': '어깨 길이 웨이브 갈색 머리 오른쪽 땋은머리, 다크 브라운 눈, 창백한 피부, 크림색 오버사이즈 가디건, 교복, 빈티지 필름 카메라, 내성적인 여고생',
        'expressions': {
            # yuna_smile already exists - skip
            'yuna_shy': '눈이 아래를 향해 시선 회피 속눈썹이 길게 내려뜨려짐, 양 볼과 귀끝까지 빨갛게 물든 뚜렷한 홍조, 창백한 피부에 대비되는 선명한 붉은 볼, 부끄러워서 눈을 못 마주치는 표정 입술은 소매 뒤에 숨겨진 채 살짝 벌어짐. 조명: 부드러운 따뜻한 확산 조명 핑크빛 반사.',
            'yuna_scared': '눈이 비정상적으로 크게 뜨임 동공이 수축되고 흰자가 많이 보임, 눈 아래에 공포의 그림자, 피부가 훨씬 더 창백해짐 입술에 혈색이 사라짐, 머리카락이 공포로 미세하게 곤두섬 땋은머리가 풀려감, 눈에 띄게 떨리는 어깨. 조명: 위에서 내리누르는 차갑고 강한 백색 조명.',
            'yuna_determined': '눈에 이전에 없던 강한 빛 하이라이트가 크고 선명, 피부톤에 혈색이 돌아옴, 자세가 곧게 펴짐, 머리카락이 바람에 살짝 날림, 굳게 다문 입술 턱에 힘이 들어감, 두려움을 이겨낸 단단하고 맹렬한 결의의 눈빛. 조명: 뒤에서 비치는 영웅적인 역광 금빛 조명.',
            'yuna_desperate': '눈에 눈물이 맺혀 반짝이며 간절함이 가득, 창백한 피부에 눈가와 코끝이 울음으로 빨개짐, 머리카락이 흐트러져 얼굴에 걸림, 앞으로 뻗은 양손 가디건 소매에서 손가락이 간신히 나온 모습, 입을 벌려 뭔가를 애원하듯 외치는 표정, 눈썹이 중앙으로 몰린 절박한 눈빛. 조명: 극적인 측면 조명 한쪽 얼굴만 밝음.',
            'yuna_cry': '눈에서 소리 없이 흘러내리는 큰 눈물방울 속눈썹이 젖어 뭉침, 피부에 눈가 코 볼이 얼룩덜룩 빨개짐, 머리카락이 얼굴 앞으로 떨어짐, 고개를 숙이고 소리 없이 흐느끼는 모습, 가디건 소매로 눈물을 닦으려는 듯 오른손을 얼굴 가까이 가져간 자세. 조명: 부드럽게 확산된 조명 채도 낮음.',
            'yuna_weak': '극도로 마르고 가냘픈 체형 쇄골이 도드라짐, 머리카락이 기름지고 엉키고 흐트러짐 땋은머리 장식 풀림, 눈 초점이 안 맞고 풀려서 반쯤 감긴 상태 눈 아래 진한 다크서클, 병적으로 창백한 피부 입술이 갈라지고 건조함, 찢어지고 더러워진 블레이저 교복 가디건 없음, 오른팔 안쪽에 반창고와 주사 바늘 자국, 힘없이 한쪽으로 기울어져 축 처진 자세. 조명: 어둡고 병적인 녹색-흰색 형광등 조명.',
        }
    },
    'seolhwa': {
        'ref': 'seolhwa_normal.png',
        'base_desc': '극도로 긴 은백색 생머리, 창백한 아이스 블루 눈, 도자기 같은 피부, 바랜 구식 네이비 세일러복, 롱 플리츠 스커트, 신비로운 분위기의 소녀',
        'expressions': {
            'seolhwa_smile': '작고 온화하고 평온한 안도의 미소 입꼬리가 아주 살짝만 올라감, 아이스 블루 눈에 처음으로 작은 따뜻한 하이라이트가 생김, 양볼에 매우 옅은 핑크빛, 깊은 감사와 해방이 담긴 눈빛 눈가에 미세한 눈물 한 방울, 은백색 머리카락이 은은하게 빛남. 조명: 따뜻한 금빛과 차가운 청백색이 섞인 신비로운 조명.',
            'seolhwa_sad': '깊은 우수와 슬픔이 가득한 표정 수백 년의 고독을 담은 눈, 은백색 머리카락이 얼굴 오른쪽을 커튼처럼 덮어 오른쪽 눈을 가림, 보이는 왼쪽 눈에 투명한 눈물이 고여 렌즈 같은 효과, 피부가 더욱 창백해지고 입술에 색이 없음, 몸 윤곽이 평소보다 더 흐릿하게 번짐. 조명: 채도가 극도로 낮은 청회색-모노톤 조명.',
            'seolhwa_fade': '은백색 머리카락이 빛나는 입자로 분해되어 흩어짐 끝부터 사라져감, 아이스 블루 눈이 빛을 잃어가며 투명해짐, 피부가 반투명하게 변하며 뒤가 비침, 옷의 윤곽선이 흐릿해지고 색이 빠짐, 몸 전체가 반투명 유령 같은 상태 팔다리 끝부터 빛나는 입자로 녹아 흩어짐, 오른손을 앞으로 뻗으며 무언가를 잡으려는 자세. 조명: 온몸을 감싸는 하얀 은은한 빛.',
            'seolhwa_ghost': '은백색 머리카락이 중력을 거스르듯 위와 옆으로 떠오름 물속에 있는 것처럼, 아이스 블루 눈이 형광처럼 밝게 빛나며 동공이 사라짐, 피부가 완전히 투명해져 뒤가 비침, 옷이 유령처럼 펄럭임, 몸 주위의 빛나는 청백색 윤곽선 네온 같은 빛 라인, 바닥에서 10cm 떠 있는 자세, 완전한 유령의 초자연적 모습. 조명: 인물 자체에서 발산하는 청백색 빛.',
        }
    },
}

def generate_expression(char_name, ref_path, base_desc, expr_name, expr_desc):
    """Generate one expression image using Gemini 3.1 Flash with reference."""
    out_path = os.path.join(BASE_DIR, f'{expr_name}.png')
    if os.path.exists(out_path):
        print(f'  SKIP (exists): {expr_name}.png')
        return True

    with open(ref_path, 'rb') as f:
        ref_img = base64.b64encode(f.read()).decode()

    prompt = f"""이 캐릭터의 표정만 변경한 이미지를 생성해줘. 캐릭터의 기본 외형({base_desc})은 정확히 동일하게 유지하고, 표정과 조명만 다음과 같이 변경:

{expr_desc}

배경: 단색 밝은 초록색 크로마키 배경 유지.
스타일: 비주얼 노벨 캐릭터 스프라이트, DDLC 스타일, 깔끔한 선화, 선명한 디지털 셀 채색.
절대 금지: 텍스트, 숫자, 워터마크, 로고, 서명."""

    payload = json.dumps({
        'contents': [{'parts': [
            {'inlineData': {'mimeType': 'image/png', 'data': ref_img}},
            {'text': prompt}
        ]}],
        'generationConfig': {'responseModalities': ['IMAGE', 'TEXT']}
    }).encode()

    req = urllib.request.Request(URL, data=payload, headers={'Content-Type': 'application/json'}, method='POST')

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                result = json.load(resp)
            for candidate in result.get('candidates', []):
                for part in candidate.get('content', {}).get('parts', []):
                    if 'inlineData' in part:
                        img_data = base64.b64decode(part['inlineData']['data'])
                        with open(out_path, 'wb') as f:
                            f.write(img_data)
                        print(f'  OK: {expr_name}.png ({len(img_data)} bytes)')
                        return True
            print(f'  WARN: No image in response for {expr_name}')
            return False
        except Exception as e:
            print(f'  RETRY {attempt+1}/3: {expr_name} - {e}')
            time.sleep(5)

    print(f'  FAIL: {expr_name}')
    return False

def main():
    total = sum(len(c['expressions']) for c in CHARACTERS.values())
    done = 0
    failed = []

    for char_name, char_data in CHARACTERS.items():
        ref_path = os.path.join(BASE_DIR, char_data['ref'])
        if not os.path.exists(ref_path):
            print(f'ERROR: Reference not found: {ref_path}')
            continue

        print(f'\n=== {char_name} ({len(char_data["expressions"])} expressions) ===')
        for expr_name, expr_desc in char_data['expressions'].items():
            done += 1
            print(f'[{done}/{total}] {expr_name}...')
            if not generate_expression(char_name, ref_path, char_data['base_desc'], expr_name, expr_desc):
                failed.append(expr_name)
            time.sleep(2)  # rate limit buffer

    print(f'\n=== DONE: {done - len(failed)}/{total} success, {len(failed)} failed ===')
    if failed:
        print(f'Failed: {", ".join(failed)}')

if __name__ == '__main__':
    main()
