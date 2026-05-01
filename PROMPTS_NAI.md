# Nevergrad - NovelAI V4.5 전용 프롬프트

> NovelAI Diffusion V4.5 (anime) 전용. 영어 Danbooru 태그 + 쉼표 구분.
> 해상도 / 시드 / 샘플러는 NovelAI UI에서 직접 설정 (이 파일에는 미포함).
>
> **권장 세팅**
> - Sampler: **Euler** (또는 Euler Ancestral)
> - Steps: **28**
> - Prompt Guidance (CFG): **5**
> - Resolution: NovelAI Portrait 기본값 또는 원하는 비율
>
> **배경색**: 모든 캐릭터 스프라이트는 **단색 순수 마젠타 #FF00FF** 크로마키 배경.
> 녹색은 머리/피부 엣지에 spill이 남으므로 사용 금지 (CLAUDE.md 규칙).
>
> **DDLC 태그 금지**: NovelAI는 "DDLC" 태그를 인식하면 워터마크를 생성함.
> "anime visual novel sprite, cel shading"로 대체할 것.
>
> **공통 퀄리티 태그 (모든 프롬프트 맨 앞)**
> ```
> masterpiece, best quality, very aesthetic, absurdres, newest,
> ```
>
> **공통 네거티브 (모든 프롬프트에 포함)**
> ```
> lowres, worst quality, low quality, bad anatomy, bad hands, bad fingers,
> extra fingers, fused fingers, missing fingers, deformed hands,
> blurry, jpeg artifacts, sketch, monochrome,
> multiple views, multiple girls, 2girls, 3girls, crowd,
> watermark, signature, text, logo, cropped, out of frame,
> 3d, realistic, photo,
> film grain, film strip, white border, white margin,
> full body, knees, feet, lower body
> ```

---

## 1. 캐릭터 — 박은수 (Eunsu) — 담임교사

> **기본 외형 태그 (모든 표정 공통)**
> `1girl, solo, korean, mature female, teacher, beautiful, mid-twenties,
> long black hair, straight hair, hair past waist, hair tips slightly curled,
> brown eyes, warm brown eyes, large almond eyes, golden highlights in eyes,
> ivory skin, light skin,
> thin silver-framed glasses, round rectangular glasses, semi-rimless,
> 7 head body, hourglass figure, large breasts, very narrow waist, wide hips,
> cream silk blouse, navy v-neck cardigan, knit cardigan,
> navy high-waisted pencil skirt, knee-length skirt, tight skirt,
> sheer pantyhose, skin-tone stockings, pearl stud earrings`

### eunsu_normal.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher, beautiful, mid-twenties,
long straight black hair, hair past waist, hair tips slightly curled,
brown eyes, warm eyes, large almond eyes, golden highlights,
ivory skin, thin silver-framed glasses, semi-rimless,
hourglass figure, large breasts, very narrow waist, wide hips, voluptuous,
cream silk blouse, navy v-neck knit cardigan,
navy high-waisted pencil skirt, sheer pantyhose, pearl stud earrings,
neutral expression, calm, slight smile, closed mouth, looking at viewer,
hands clasped in front, slight body turn, head tilt,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:**
```
lowres, worst quality, low quality, bad anatomy, bad hands, bad fingers,
extra fingers, fused fingers, missing fingers, deformed hands,
blurry, jpeg artifacts, sketch, monochrome,
multiple views, multiple girls, 2girls, 3girls, crowd,
watermark, signature, text, logo, cropped, out of frame,
3d, realistic, photo,
film grain, film strip, white border, white margin,
full body, knees, feet, lower body,
school uniform, blazer, tattoo, twin tails, short hair
```

### eunsu_smile.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher, beautiful, mid-twenties,
long straight black hair, hair past waist,
brown eyes, crescent eyes, smile lines, golden highlights,
ivory skin, blush stickers, pink cheeks,
thin silver-framed glasses,
hourglass figure, large breasts, narrow waist, wide hips,
cream silk blouse, navy v-neck cardigan, navy pencil skirt, pantyhose, pearl earrings,
warm motherly smile, soft smile, closed mouth smile, gentle expression, looking at viewer,
hands clasped in front, slight body turn,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo`)

### eunsu_gentle.png / eunsu_warm.png (둘은 거의 동일)
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher, beautiful, mid-twenties,
long straight black hair, hair past waist, hair flowing over shoulder,
brown eyes, soft eyes, watery eyes, dilated pupils, moist eyes, affectionate gaze,
ivory skin, thin silver-framed glasses,
hourglass figure, large breasts, narrow waist, wide hips,
cream silk blouse, navy v-neck cardigan, navy pencil skirt, pantyhose, pearl earrings,
soft tender smile, slightly parted lips, loving expression, intimate gaze, looking at viewer,
hands clasped in front,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo`)

### eunsu_shy.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher, mid-twenties,
long straight black hair, hair past waist,
brown eyes, looking down and right, looking away, downcast eyes,
ivory skin, full-face blush, deep blush, blush extending to ears,
thin silver-framed glasses,
hourglass figure, large breasts, narrow waist, wide hips,
cream silk blouse, navy v-neck cardigan, navy pencil skirt, pantyhose, pearl earrings,
biting lip, parted lips, embarrassed but pleased, complex expression,
hands clasped in front, head tilt,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo`)

### eunsu_serious.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher, mid-twenties,
long straight black hair, neat hair, hair past waist,
brown eyes, sharp eyes, narrowed eyes, focused gaze, small focused highlights,
ivory skin, thin silver-framed glasses,
hourglass figure, large breasts, narrow waist, wide hips,
cream silk blouse, navy v-neck cardigan, navy pencil skirt, pantyhose, pearl earrings,
serious expression, no smile, tight lips, professional, authoritative,
hands clasped in front, slight body turn,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo, smile, smirk, blush, ^_^`)

### eunsu_close.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher,
long straight black hair, hair flowing past frame edges,
brown eyes, large eyes, dilated pupils, intense gaze, golden highlights,
ivory skin, thin silver-framed glasses, glasses glare,
extreme close-up, face close-up, intimate gaze, looking at viewer,
slight smirk, knowing smile, asymmetric smile, leaning forward,
cream silk blouse, navy v-neck cardigan visible at edge,
anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo, full body, far shot`)

### eunsu_angry.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher, mid-twenties,
long straight black hair, hair past waist, slight movement,
brown eyes, sharp eyes, glaring, narrowed eyes, raised eye corners, intense glare,
ivory skin, thin silver-framed glasses,
deep furrowed brow, frown, tight closed lips, downturned mouth, fierce expression,
hourglass figure, large breasts, narrow waist, wide hips,
cream silk blouse, navy v-neck cardigan, navy pencil skirt, pantyhose, pearl earrings,
hands clasped in front,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo, smile, smirk`)

### eunsu_cold.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher,
long straight black hair, hair past waist, dull hair, lifeless hair,
brown eyes, cold eyes, dark eyes, small highlights, calculating gaze,
very pale skin, paler than usual, faint dark circles,
thin silver-framed glasses, narrow eyes behind glasses,
hourglass figure, large breasts, narrow waist, wide hips,
cream silk blouse, navy v-neck cardigan, perfectly neat clothing,
navy pencil skirt, pantyhose, pearl earrings,
expressionless, no smile, tight lips, blank face,
hands clasped in front,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, tattoo, smile, smirk, blush, warm expression`)

### eunsu_obsessed.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher,
long messy tangled black hair, disheveled hair, hair sticking out,
brown eyes, wide eyes, pinpoint pupils, tiny constricted pupils, red glint in eyes,
crooked tilted glasses, cracked glass on right lens, broken glasses,
ivory skin, sweat drops, tear tracks,
unhinged smile, manic grin, wide grin, teeth showing, mouth stretched ear to ear,
head tilted unnaturally, head tilted 30 degrees,
disheveled clothing, blouse collar messed up, cardigan slipping off shoulder,
twisted skirt, wrinkled skirt, snagged stockings, stocking runs,
yandere, horror, unhinged, psychological horror,
upper body, anime visual novel sprite, cel shading, clean lineart, dramatic shadows,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:**
```
lowres, worst quality, low quality, bad anatomy, bad hands, bad fingers,
blurry, jpeg artifacts, sketch, monochrome,
multiple girls, 2girls, watermark, signature, text, logo, cropped,
3d, realistic, photo, full body,
school uniform, blazer, tattoo,
bright atmosphere, cute expression, happy mood, cheerful, clean skin, neat hair,
calm expression, normal eyes
```

### eunsu_dark.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, teacher,
long straight black hair, hair covering right eye, hair like a curtain,
brown eyes, one visible left eye, glowing red eye in shadow, constricted pupil,
ivory skin, half face in deep shadow, harsh shadow on right half of face,
thin silver-framed glasses, sinister glasses glare,
sinister smirk, slight unsettling smile, asymmetric smile,
disheveled cardigan, cardigan slipping off one shoulder, twisted skirt,
hourglass figure, large breasts, navy pencil skirt, pantyhose,
horror, sinister, ominous,
upper body, anime visual novel sprite, cel shading, clean lineart, dramatic shadows, chiaroscuro,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (eunsu_obsessed와 동일)

---

## 2. 캐릭터 — 한세아 (Sea) — 반장

> **기본 외형 태그 (모든 표정 공통)**
> `1girl, solo, korean, female student, college age, cute,
> chestnut hair, brown hair, twin tails, twintails, pink ribbon hair tie, pink ribbon, ribbon hair ornament,
> shoulder-length twintails,
> hazel eyes, green eyes, large round eyes, star-shaped pupils, sparkling eyes,
> peach skin, light brown skin, freckles on nose,
> pink star hair clip, hair ornament,
> 6.5 head body, large breasts, narrow waist, wide hips, curvy,
> navy blazer, school uniform, gold emblem badge, fully buttoned blazer,
> white collared shirt, red ribbon tie, neat ribbon,
> navy and red tartan plaid pleated miniskirt, white knee-high socks`

### sea_normal.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, cute,
chestnut hair, twintails, pink ribbon hair ties, shoulder-length twintails,
pink star hair clip,
hazel green eyes, large round eyes, star-shaped pupils, sparkling eyes,
peach skin, freckles on nose,
large breasts, narrow waist, wide hips, curvy,
navy blazer, gold emblem, fully buttoned, white collared shirt, red ribbon tie,
tartan plaid pleated miniskirt, white knee-high socks,
neutral friendly expression, slight smile, closed mouth, looking at viewer,
hand on hip, other arm at side, confident pose, slight body turn,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, long hair, single ponytail`)

### sea_smile.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, cute, cheerful,
chestnut twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, crescent eyes, sparkles in eyes, multiple star highlights,
peach skin, blush stickers, flushed cheeks, freckles,
^_^, big bright smile, open mouth, teeth, happy, beaming,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip, confident pose,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo`)

### sea_shy.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, cute,
chestnut twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, looking down and left, peeking through eyelashes, looking up,
peach skin, full-face blush, blush extending to ears and neck, freckles visible through blush,
pursed lips, embarrassed, lovestruck,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo`)

### sea_serious.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails, still hair, pink ribbon hair ties, pink star hair clip,
hazel green eyes, sharp eyes, narrowed eyes, slightly raised eye corners, small star highlights,
peach skin, tense facial muscles, freckles,
slight frown, suspicious gaze, tight lips, no smile, scrutinizing,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, smile, ^_^, blush`)

### sea_sad.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails, drooping limp twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, downcast eyes, looking down, dim star highlights, sad shadows under eyes,
peach skin, drained color, slightly red nose, freckles,
sad expression, frown, downturned mouth, eyebrows raised in sadness, melancholy,
quiet sadness in eyes,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, smile`)

### sea_cry.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, big tears flowing, streaming tears, wet eyelashes, distorted highlights,
peach skin, blotchy red face, red nose, red cheeks, crying face, freckles,
open mouth crying, trembling lips, wailing,
hands near face, hands trying to cover face, fingers visible through tears,
emotional breakdown,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie wet from tears, tartan miniskirt,
knee-high socks,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, smile, dry eyes`)

### sea_hurt.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails, drooping twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, tears welling, watery eyes, distorted star highlights, betrayed look,
peach skin, flushed from tears, slightly red nose, freckles,
biting lower lip hard, teeth marks on lip, holding back tears,
hurt expression, betrayed eyes, raised eyebrows in sadness,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, smile`)

### sea_angry.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, cute,
chestnut twintails, slightly raised twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, wide eyes, raised eye corners, glaring,
peach skin, flushed cheeks from anger, freckles,
puffed cheeks, pufferfish expression, deep furrowed brow, comedic anger,
slight tears at corner of eyes, genuinely upset but cute,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, smile, ^_^`)

### sea_yandere.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, yandere,
chestnut twintails, asymmetric twintails, right ribbon untied and falling, pink star hair clip,
hazel green eyes, asymmetric pupils, one pupil dilated other constricted, pinpoint pupils,
unhealthy pale skin, pink unnatural blush, freckles,
unhinged ear-to-ear smile, wide manic grin, all teeth showing,
head tilted unnaturally 25 degrees, tilted to the left,
right hand hidden behind back, left hand reaching toward viewer, come-here gesture,
faint red stains on blazer, navy blazer, gold emblem, white shirt, red ribbon tie,
tartan miniskirt, knee-high socks,
yandere, horror, uncanny valley, dramatic lighting, pink and red tones,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:**
```
lowres, worst quality, low quality, bad anatomy, bad hands, bad fingers,
blurry, jpeg artifacts, sketch, monochrome,
multiple girls, 2girls, watermark, signature, text, logo, cropped,
3d, realistic, photo, full body,
glasses, tattoo,
bright atmosphere, cute expression, happy mood, cheerful, clean skin
```

### sea_dark.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails in shadow, dull pink ribbons, pink star hair clip,
hazel green eyes, empty eyes, hollow eyes, no highlights, dead eyes, lifeless,
right half of face in deep shadow, harsh chiaroscuro,
unhealthy pale skin, freckles,
expressionless, slack lips, no smile, defeated, broken,
large breasts, narrow waist,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
arms hanging limply,
cowboy shot, anime visual novel sprite, cel shading, clean lineart, dramatic shadows,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (sea_yandere와 동일)

### sea_vulnerable.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, cute,
chestnut twintails, drooping twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, wide trembling eyes, wavering pupils, tears welling up reflecting light,
pale skin, drained color, red nose only, freckles,
trembling lips, holding back tears, on the verge of breaking,
arms crossed across body, self-hugging pose, defensive posture, hands gripping own arms,
fragile, small, vulnerable,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, smile, confident pose`)

### sea_broken_smile.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, eyes filled with tears not falling, distorted star highlights,
peach skin, red nose, tear stains on cheeks, freckles,
forced smile, broken smile, smiling with crying eyes, raised mouth corners but sad eyes,
tragic expression, eyes and mouth showing opposite emotions,
large breasts, narrow waist, wide hips,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
hand on hip,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo`)

### sea_stare.png — 2회차 NG+ 정면 응시
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
chestnut twintails, pink ribbon hair ties, pink star hair clip,
hazel green eyes, perfectly direct stare, unblinking, pupils locked on viewer,
no highlights in eyes, dead serious gaze,
peach skin, freckles,
emotionless, expressionless, slight unsettling smile, mouth corners barely raised,
breaking the fourth wall, looking directly at viewer, eye contact,
navy blazer, gold emblem, white shirt, red ribbon tie, tartan miniskirt, knee-high socks,
arms at sides, perfectly still pose,
front view, cowboy shot, anime visual novel sprite, cel shading, clean lineart,
uncanny valley, slight dread,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (공통 + `glasses, tattoo, looking away, side glance, big smile, ^_^, closed eyes`)

---

## 3. 캐릭터 — 강리인 (Riin) — 보건교사

> **기본 외형 태그 (모든 표정 공통)**
> `1girl, solo, korean, mature female, school nurse, doctor, late twenties, elegant,
> short dark purple hair, dark purple bob cut, blunt bob, jaw-length bob, side-swept bangs,
> amber eyes, narrow eyes, slanted eyes, cat eyes, fox eyes,
> light skin, mole under left eye, beauty mark, tear mole,
> thin silver half-rim glasses, half-rimless glasses,
> 7 head body, slender body, model figure, medium breasts, narrow waist, wide hips,
> black turtleneck, fitted turtleneck,
> open white doctor coat, white lab coat, pen in pocket,
> black high-waisted slacks, straight-fit pants,
> black pointed-toe ankle boots, silver chain necklace,
> aluminum clipboard in left hand`

### riin_normal.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse, late twenties, elegant,
short dark purple hair, blunt bob, jaw-length, side-swept bangs covering forehead partially,
amber eyes, narrow cat eyes, slanted eyes, cool gaze,
light skin, mole under left eye, beauty mark,
thin silver half-rimless glasses,
slender model figure, medium breasts, narrow waist, wide hips,
black fitted turtleneck, open white doctor coat, pen in pocket,
black high-waisted slacks, ankle boots, silver chain necklace,
holding aluminum clipboard in left hand,
calm analytical expression, slightly narrowed eyes, closed lips, looking at viewer,
slight body turn, head tilted slightly down,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, twin tails, long hair past shoulders, smile`)

### riin_smile.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse, elegant,
short dark purple bob, side-swept bangs,
amber eyes, soft curving eyes, drooping eye corners,
light skin, slight blush, mole under left eye,
thin silver half-rimless glasses,
slender, medium breasts, narrow waist, wide hips,
black turtleneck, open white doctor coat, pen in pocket,
black slacks, ankle boots, silver chain necklace,
holding aluminum clipboard,
kind smile, reassuring smile, even mouth corners raised, slight teeth showing,
warm but observant gaze, subtle scrutiny in eyes,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, twin tails`)

### riin_gentle.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse, elegant,
short dark purple bob, side-swept bangs,
amber eyes, half-closed eyes, drooping corners, satisfied cat-like expression,
light skin, mole under left eye,
thin silver half-rimless glasses,
slender, medium breasts, narrow waist, wide hips,
black turtleneck, open white doctor coat, black slacks, ankle boots, silver chain,
satisfied elegant smile, even smile, head tilted to side, eyes half closed,
hidden amusement, knowing expression,
holding aluminum clipboard,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, twin tails`)

### riin_seductive.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse, elegant, seductive,
short dark purple bob, side-swept bangs covering one eye,
amber eyes, half-closed eyes, lidded eyes, sultry gaze, eyelash shadows,
light skin, glossy lips, mole under left eye, beauty mark emphasized,
slender, voluptuous, large breasts, narrow waist,
black turtleneck, white doctor coat slipping off left shoulder, off-shoulder coat,
black slacks, ankle boots, silver chain necklace,
finger to lips, shushing gesture, index finger on lips,
asymmetric smirk, suggestive smile, one corner raised,
upper body, anime visual novel sprite, cel shading, clean lineart, dramatic lighting,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (공통 + `school uniform, blazer, twin tails, nsfw, lewd`)

### riin_close.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse,
short dark purple bob,
amber eyes, large eyes in close-up, viewer reflected in eyes,
light skin, fine skin texture, mole under left eye,
thin silver half-rimless glasses,
black turtleneck, white doctor coat collar at frame edge,
extreme close-up, looming over viewer, leaning forward, top-down angle,
slightly raised single eyebrow, observing analyzing expression,
intimate but overwhelming closeness,
anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (공통 + `school uniform, blazer, twin tails, far shot, full body`)

### riin_pleased.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse, elegant,
short dark purple bob, side-swept bangs,
amber eyes, crescent eyes, satisfied cat eyes, half-closed eyes,
light skin, slight blush, mole under left eye,
thin silver half-rimless glasses,
slender, medium breasts, narrow waist, wide hips,
black turtleneck, open white doctor coat, black slacks, ankle boots, silver chain,
elegant satisfied smile, mouth corners up gently, head tilted, hand under chin,
holding aluminum clipboard in left hand, right hand near chin,
pleased, things going as planned expression,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, twin tails`)

### riin_cold.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse,
short dark purple bob, perfectly neat hair, not a strand out of place,
amber eyes, glassy eyes, no warmth, inorganic shine, clinical gaze,
very pale skin, colder skin tone, mole under left eye,
thin silver half-rimless glasses,
fully buttoned white coat, stiff posture,
slender, medium breasts, narrow waist,
black turtleneck, black slacks, ankle boots, silver chain,
holding aluminum clipboard,
completely emotionless, scientist observing specimen, deadpan,
no smile, blank expression,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, twin tails, smile, smirk, blush, warm expression`)

### riin_dark.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse,
short dark purple bob, hair in shadow, almost black hair,
amber eyes, glowing yellow eyes, slit pupils, fluorescent eye glow in shadow,
pale skin, deep eye shadow, mole under left eye,
holding medical syringe, syringe with purple liquid, right hand holding syringe,
flowing white lab coat, billowing coat,
black slacks, ankle boots, deep shadows on upper face from forehead to nose,
sinister threatening grin, teeth showing, ominous smile,
horror, sinister, threatening,
upper body, anime visual novel sprite, cel shading, clean lineart, dramatic shadows,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (공통 + `school uniform, blazer, twin tails, bright atmosphere, cute, happy, clean skin`)

### riin_neutral.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, mature female, school nurse, late twenties, elegant,
short dark purple bob, side-swept bangs,
amber eyes, narrow cat eyes,
light skin, mole under left eye,
thin silver half-rimless glasses,
slender, medium breasts, narrow waist, wide hips,
black turtleneck, open white doctor coat, black slacks, ankle boots, silver chain,
holding aluminum clipboard,
neutral expressionless face, deadpan, expressionless, calm,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `school uniform, blazer, twin tails, smile, smirk, blush`)

---

## 4. 캐릭터 — 최유나 (Yuna) — 사진부

> **기본 외형 태그 (모든 표정 공통)**
> `1girl, solo, korean, female student, college age, shy, introverted,
> shoulder-length brown hair, wavy hair, side braid on right, small braid hair ornament,
> dark brown eyes, large eyes, drooping eye corners, deer-like eyes, long eyelashes,
> pale skin,
> oversized cream knit cardigan, sleeves covering hands, sweater paws,
> white collared shirt under cardigan, loose red ribbon tie,
> navy red tartan plaid pleated miniskirt,
> vintage film camera, black leather camera strap, camera around neck,
> 6.5 head body, hidden curves, gentle figure`

### yuna_normal.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, shy, introverted,
shoulder-length wavy brown hair, side braid on right side, small braid,
dark brown eyes, large drooping eyes, deer-like eyes, long eyelashes,
pale skin, neutral calm expression, closed mouth,
oversized cream knit cardigan, sweater paws, sleeves covering hands,
white collared shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck, black leather strap,
both hands holding camera in front of chest, gentle grip,
shoulders pulled inward, introverted posture, looking down and to the left,
not making eye contact,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, confident pose, school blazer`)

### yuna_smile.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, shy,
shoulder-length wavy brown hair, side braid on right,
dark brown eyes, slightly bigger highlights than usual, gentle sparkle,
pale skin, faint pink blush, hint of color in cheeks,
oversized cream knit cardigan, sweater paws,
white shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck, black leather strap,
both hands holding camera in front of chest,
small genuine smile, mouth corners carefully raised, awkward smile, rare happiness,
first time opening up expression,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, big smile, ^_^, open mouth`)

### yuna_shy.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student, shy,
shoulder-length wavy brown hair, side braid on right,
dark brown eyes, looking down, downcast eyes, eyelashes lowered,
pale skin, vivid blush, full-face blush, blush extending to ears,
strong red contrast against pale skin,
oversized cream knit cardigan, sweater paws covering hands,
white shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck,
both hands holding camera, hiding mouth behind sleeve, mouth visible only barely,
shoulders pulled inward, can't make eye contact, embarrassed,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails`)

### yuna_scared.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
shoulder-length wavy brown hair, hair slightly raised in fear, side braid loosening,
dark brown eyes, abnormally wide eyes, pinpoint pupils, sclera visible,
shadow of fear under eyes,
extremely pale skin, drained color, white lips,
oversized cream knit cardigan, sweater paws,
white shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck,
both hands holding camera tightly, visibly trembling shoulders, terrified posture,
horror, fear, shock,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, smile, calm`)

### yuna_determined.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
shoulder-length wavy brown hair, hair slightly windblown, side braid on right,
dark brown eyes, strong bright highlights, large clear highlights, fierce resolve,
pale skin, color back in face,
oversized cream knit cardigan, but standing straight revealing figure,
medium breasts, narrow waist, wide hips,
white shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck,
both hands holding camera firmly, straightened posture,
firmly closed lips, jaw clenched, fierce determined eyes, overcoming fear,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, scared, shy, smile`)

### yuna_desperate.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
shoulder-length wavy brown hair, disheveled hair across face, side braid on right,
dark brown eyes, tearful eyes, glistening with tears, pleading eyes, desperate,
pale skin, red around eyes and nose from crying,
oversized cream knit cardigan, sweater paws but fingers showing,
white shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck,
both hands reaching forward, grab me gesture, fingers barely visible from sleeves,
open mouth pleading, crying out, eyebrows pulled together, desperate expression,
believe me look,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, smile`)

### yuna_cry.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
shoulder-length wavy brown hair, hair falling forward, hair covering face partially,
dark brown eyes, silent tears flowing, large teardrops, wet eyelashes,
pale skin, blotchy red around eyes nose cheeks,
oversized cream knit cardigan, sweater paws,
white shirt, loose red ribbon tie, tartan miniskirt,
vintage film camera around neck,
head down, silent sobbing, shoulders subtly trembling,
right hand near face wiping eyes with sleeve, hand covered by sweater,
emotional release moment,
cowboy shot, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, smile, dry eyes`)

### yuna_weak.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female student,
extremely thin and frail body, skinny, prominent collarbone,
shoulder-length wavy brown hair, oily messy hair, tangled hair, braid undone,
dark brown eyes, unfocused eyes, half-closed eyes, deep dark circles, hollow eyes,
sickly pale skin, cracked dry lips,
torn dirty blazer school uniform, ripped tartan skirt, no cardigan,
multiple needle marks on inner right arm, bandaids, injection scars,
weakly leaning to one side, slumped posture, drained,
cowboy shot, anime visual novel sprite, cel shading, clean lineart, dim lighting,
solid magenta background, pure magenta background, chromakey background, simple background
```
**네거티브:** (공통 + `glasses, tattoo, twin tails, bright atmosphere, cute, happy, clean skin, healthy`)

---

## 5. 캐릭터 — 이설화 (Seolhwa) — 수수께끼의 여성

> **중요**: 설화는 은백발/형광눈이 아닌 **자연스러운 흑갈색 머리에 살아있는 인간으로 보이는** 여성.
> 유령 모드(ghost/fade)에서만 약간의 림라이트와 흐림 효과 추가.
>
> **기본 외형 태그 (모든 표정 공통)**
> `1girl, solo, korean, female, college age, quiet, introverted,
> very long hair, dark brown hair, almost black hair, straight hair, hair past waist,
> subtle ash brown highlights at hair tips,
> calm dark grey-brown eyes, dark grey eyes, large quiet eyes,
> slightly pale but living natural skin tone, faint rose lips,
> faded vintage navy sailor uniform, white sailor collar,
> faded navy long pleated skirt, knee-length skirt (NOT miniskirt),
> old-fashioned uniform style, slightly worn fabric,
> 7 head body, slim realistic body, hunched shoulders, introverted posture`

### seolhwa_normal.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female, quiet, introverted,
very long dark brown hair, almost black hair, straight hair past waist,
subtle ash brown highlights at hair tips,
calm dark grey-brown eyes, large quiet eyes,
slightly pale but living natural skin tone,
faint rose lips, slim realistic body,
faded vintage navy sailor uniform, white sailor collar, slightly worn fabric,
faded navy long pleated skirt, knee-length skirt, old-fashioned style,
hunched shoulders, introverted posture,
quiet calm expression, slightly avoiding eye contact, faint anxiety in eyes,
straight on front view, perfect frontal pose,
hair flowing naturally down, sharp silhouette to hair tips, fully opaque body outline,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:**
```
lowres, worst quality, low quality, bad anatomy, bad hands, bad fingers,
blurry, jpeg artifacts, sketch, monochrome,
multiple girls, 2girls, watermark, signature, text, logo, cropped,
3d, realistic, photo, full body,
silver hair, white hair, platinum hair, fluorescent eyes, glowing eyes,
ice blue eyes, transparent skin, translucent body, ghost, halo, fog, particles,
neon outline, levitation, floating,
modern miniskirt, school blazer, tartan plaid, twin tails, glasses
```

### seolhwa_smile.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female, quiet, introverted,
very long dark brown hair, almost black, straight hair past waist, ash brown highlights,
calm dark grey-brown eyes, slightly softer eyes,
slightly pale skin, very faint color in cheeks, faint rose lips,
faded vintage navy sailor uniform, white sailor collar, long pleated skirt,
hunched shoulders,
very small careful smile, mouth corners barely raised, restrained smile,
silently grateful expression,
straight on front view, perfect frontal pose,
hair flowing naturally, sharp silhouette, fully opaque body,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (seolhwa_normal과 동일 + `excessive happy expression, big smile, ^_^`)

### seolhwa_sad.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female, quiet,
very long dark brown hair, hair partially covering one side of face, ash brown highlights,
calm dark grey-brown eyes, drooping eye corners, sad eyes,
slightly pale skin, faint rose lips,
faded vintage navy sailor uniform, white sailor collar, long pleated skirt,
hunched shoulders,
sad expression, eyes slightly downturned, lips lightly closed, on verge of tears but no tears visible,
silent worry and fatigue,
straight on front view,
hair flowing naturally, sharp silhouette, fully opaque body,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (seolhwa_normal과 동일 + `tears falling, crying, big smile`)

### seolhwa_fade.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female,
very long dark brown hair mostly intact, hair tips fading to ash grey, hair edges dispersing into light particles like dust,
calm dark grey-brown eyes losing light, dim eyes,
slightly pale skin slowly losing color, gradient color loss,
faint rose lips,
faded vintage navy sailor uniform, sleeve edges and skirt edges subtly dissolving,
body and face mostly opaque and recognizable as same person,
tragic quietly fading expression, expression of quiet acceptance,
straight on front view,
upper body, anime visual novel sprite, cel shading, clean lineart, subtle particle dispersion,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (공통 + `complete white hair, complete silver hair, ice blue eyes, no pupils, different person face, excessive neon outline, levitation, monstrous expression, modern uniform`)

### seolhwa_ghost.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female, ghost,
very long dark brown hair mostly intact, hair edges cooled to ash grey, ash gradient at edges,
calm grey-brown eyes with faint cold glow but pupils visible,
slightly pale skin with cool blue undertone,
faint pale lips, faded vintage navy sailor uniform, white sailor collar, long pleated skirt,
subtle blue-grey rim light around body, faint ghostly aura,
hair tips and sleeve ends slightly blurred at edges only,
body mostly opaque and recognizable as same character,
quietly sad ghost expression,
straight on front view,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting, atmospheric
```
**네거티브:** (공통 + `bright atmosphere, cute, happy, complete white hair, complete silver hair, ice blue eyes, no pupils, different person face, excessive neon outline, levitation, monstrous expression`)

### seolhwa_quiet.png
**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1girl, solo, korean, female, quiet, introverted,
very long dark brown hair flowing naturally over shoulders and chest, ash brown highlights,
calm dark grey-brown eyes, slightly downcast,
slightly pale skin, faint rose lips,
faded vintage navy sailor uniform, white sailor collar, long pleated skirt,
hunched shoulders,
firmly closed lips, eyes slightly down, silent endurance expression, quiet patience,
hands neatly clasped together, modest pose,
straight on front view, perfect frontal pose,
hair sharp silhouette, fully opaque body,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:** (seolhwa_normal과 동일 + `crying, tears, particles, light rays, levitation`)

---

## 6. 서브 — 평범한 남학생 (classmate.png)

**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
1boy, solo, korean, college student, ordinary, plain,
short black hair,
black eyes, friendly expression, slight smile,
average skin, average build,
navy blazer, school uniform style, gold emblem, white collared shirt, navy slacks,
casual standing pose, looking at viewer,
upper body, anime visual novel sprite, cel shading, clean lineart,
solid magenta background, pure magenta background, chromakey background, simple background,
soft diffuse lighting
```
**네거티브:**
```
lowres, worst quality, low quality, bad anatomy, bad hands, bad fingers,
blurry, jpeg artifacts, sketch, monochrome,
multiple boys, 2boys, multiple girls, 2girls, crowd,
watermark, signature, text, logo, cropped,
3d, realistic, photo,
1girl, female, handsome, pretty boy, bishounen,
full body, knees, feet,
particles, light particles, lens flare, glowing aura, light rays,
film grain, film strip, white border, white margin
```

---

## 7. 타이틀 배경 (title_cherry_tree.png)

> NovelAI는 캐릭터 없는 풍경 배경에 약함. Imagen 4 Ultra 사용 권장.
> 굳이 NovelAI로 시도할 경우:

**프롬프트:**
```
masterpiece, best quality, very aesthetic, absurdres, newest,
scenery, no humans, landscape, school building exterior,
cherry blossom tree in full bloom, sakura petals falling,
ivory cream concrete school building, four floors, rectangular windows,
spring afternoon, golden hour, warm sunlight, blue sky with clouds,
old fashioned korean school, atmospheric,
anime visual novel background, cel shading, clean lineart,
wide shot, no characters, soft diffuse lighting
```
**네거티브:**
```
lowres, worst quality, low quality, blurry, jpeg artifacts,
1girl, 1boy, person, character, human, people,
watermark, signature, text, logo,
3d, realistic, photo, multiple views,
modern building, glass skyscraper, neon signs,
night, dark, rain, cloudy
```

---

## 8. 배경 — NovelAI 비추천

> **배경은 NovelAI 비추천.** 캐릭터 학습 데이터 위주라 인물 없는 배경 구성이 약합니다.
> [PROMPTS_READY.md](PROMPTS_READY.md)의 배경 프롬프트를 Imagen 4 Ultra로 사용 권장.
>
> 굳이 NovelAI로 배경을 뽑을 경우:
> - 네거티브에 `1girl, 1boy, person, character, human, people` 강하게
> - 프롬프트 시작에 `scenery, no humans, landscape, empty room`
> - "건축 일관성 규칙"의 디테일(크림색 외벽, 적갈색 벽돌, 녹색 펜스 등)은 영문 변환 필요

---

## 9. 이벤트 CG / 다중 인물 — NovelAI 비추천

> **이벤트 CG / 다중 인물 장면은 NovelAI보다 Imagen 4 / Gemini 3.1 Flash Image가 적합.**
> NovelAI는 단일 캐릭터 생성에 강하고 다중 인물·복잡 구도에 약합니다.
> 이벤트 CG는 [PROMPTS_READY.md](PROMPTS_READY.md)의 Imagen/Gemini 프롬프트 사용을 권장합니다.

---

## 사용 팁

### NovelAI 결과가 안 좋을 때 체크리스트
1. **Steps 28** 인지 확인 (1로 시작되어 있는 경우 흔함)
2. **CFG 5** 인지 확인
3. **Sampler를 Euler로** 바꿔보기
4. **퀄리티 태그**가 프롬프트 맨 앞에 있는지 확인
5. **`solo, 1girl`** 누락 체크 (군중 생성의 주범)
6. 손이 망가지면 네거티브에 `bad hands, extra fingers, fused fingers` 강화
7. 비율이 이상하면 `large breasts` → `medium breasts`로 톤다운

### 시드 활용
- 마음에 드는 결과가 나오면 Seed 고정 후 표정/포즈만 바꿔가며 시리즈 생성
- 같은 시드 + 다른 표정 태그 = 같은 캐릭터의 다른 컷

### Vibe Transfer 활용
- 1번 캐릭터(_normal)를 먼저 만족스럽게 뽑기
- 그 결과를 Vibe Transfer로 넣고 같은 화풍으로 다른 표정/캐릭터 생성
- 시리즈 톤 통일에 효과적

### 캐릭터 일관성 (가장 어려운 부분)
- NovelAI는 `same character` 보장이 약함 — 같은 외형 태그를 써도 매번 미세하게 다름
- 캐릭터 일관성이 중요하면: Imagen 4 Ultra로 _normal 1장 → Gemini 3.1 Flash Image로 표정 변형
- NovelAI 단독으로 일관성 강제: Vibe Transfer + Seed 고정 + 동일 프롬프트 + i2i 약하게 적용

### 매젠타 크로마키 후처리
- 마젠타(#FF00FF)는 머리/피부 spill이 녹색보다 적음 (CLAUDE.md 규칙 준수)
- 후처리: `remove.bg`, `BRIA RMBG`, 또는 색상 키 마스킹
- NovelAI는 정확한 #FF00FF를 못 뽑을 수 있으니 후처리에서 색상 범위로 제거
