# Nevergrad AI Asset Generation Prompts
> Style: Casual/Anime (DDLC-inspired)
> Tool: Midjourney, Stable Diffusion, NovelAI, etc.

---

## GLOBAL STYLE PREFIX (모든 프롬프트 앞에 붙일 것)

### Characters (Positive)
```
anime visual novel sprite, Korean high school setting, front-facing upper body portrait, soft pastel coloring, clean lineart, simple white background, white outline, 5.5 head proportions, dating sim style, consistent art style
```

### Characters (Negative)
```
(worst quality, low quality:1.4), bad anatomy, bad hands, missing fingers, extra digit, blurry, out of focus, realistic, 3d, photo, multiple views, multiple angles, cropped, watermark, signature
```

### Horror/Dark Expressions (Negative 추가)
```
(cute expression:1.3), bright lighting, cheerful, happy atmosphere
```
> Horror 표정(dark, obsessed, yandere, ghost) 생성 시에는 프롬프트 가중치를 높일 것:
> `(lifeless eyes:1.5)`, `(creepy smile:1.3)`, `(dark dramatic shadows:1.4)`, `(underlighting:1.2)`

### Backgrounds (Positive)
```
anime visual novel background, Korean high school, wide 16:9 aspect ratio, no characters, detailed environment, soft lighting, watercolor-style coloring, dating sim aesthetic
```

### Backgrounds (Negative)
```
(worst quality, low quality:1.4), people, characters, text, watermark, signature, blurry, realistic photo
```

---

## 1. CHARACTER SPRITES

---

### EUNSU (박은수) — 담임교사
> Base: Late 20s woman, long straight black hair in low ponytail, warm brown eyes, white blouse + navy pencil skirt, reading glasses on head, gentle mature aura, Korean female teacher

| File | Expression Prompt |
|------|-------------------|
| `eunsu_normal.png` | neutral calm expression, slight professional smile, hands clasped in front, composed posture |
| `eunsu_smile.png` | warm genuine smile, eyes softened, caring expression, maternal warmth |
| `eunsu_gentle.png` | very soft gentle expression, slightly tilted head, tender gaze, nurturing look |
| `eunsu_shy.png` | light blush on cheeks, averting gaze slightly, bashful smile, hand near chin |
| `eunsu_angry.png` | stern furrowed brows, tight lips, disappointed look, arms crossed, strict teacher expression |
| `eunsu_close.png` | leaning forward slightly, close-up perspective, intense caring gaze, invading personal space |
| `eunsu_cold.png` | emotionless flat expression, cold dead eyes, no smile, clinical detached look, unsettling calm |
| `eunsu_dark.png` | half-shadowed face, one eye glowing, sinister subtle smile, dark aura, possessive gaze |
| `eunsu_obsessed.png` | wide unblinking eyes, intense fixated stare, trembling smile, obsessive love expression, yandere teacher |

---

### RIIN (강리인) — 보건교사
> Base: Mid 20s woman, wavy dark brown hair past shoulders, sharp amber eyes, white nurse coat over fitted black turtleneck, beauty mark under left eye, seductive mature aura, Korean school nurse

| File | Expression Prompt |
|------|-------------------|
| `riin_normal.png` | calm composed expression, slight knowing smile, one hand in coat pocket, confident posture |
| `riin_smile.png` | elegant charming smile, eyes slightly narrowed, alluring expression, sophisticated |
| `riin_seductive.png` | half-lidded eyes, suggestive smirk, chin slightly raised, provocative confident pose, finger on lip |
| `riin_close.png` | extreme close-up perspective, looking down at viewer, hand reaching forward, overwhelming presence |
| `riin_pleased.png` | satisfied closed-eye smile, amused expression, tilted head, cat-like contentment |
| `riin_cold.png` | completely flat expression, clinical detached eyes, no emotion, scientist analyzing a specimen |
| `riin_dark.png` | shadowed face, cold analytical stare, holding syringe, sinister medical professional, predatory calm |

---

### SEA (한세아) — 반장
> Base: 18 year old girl, shoulder-length chestnut brown hair with pink hairpin, bright hazel eyes, school uniform (navy blazer + plaid skirt), class president armband, energetic cheerful aura, Korean high school girl

| File | Expression Prompt |
|------|-------------------|
| `sea_normal.png` | friendly neutral expression, slight smile, good posture, approachable class president |
| `sea_smile.png` | bright beaming smile, sparkling eyes, radiating happiness, energetic and cute |
| `sea_shy.png` | deep blush, looking down, fidgeting with hair, embarrassed cute expression |
| `sea_serious.png` | focused determined look, slight frown, responsible class president mode |
| `sea_angry.png` | pouting, puffed cheeks, furrowed brows, frustrated but still cute anger |
| `sea_hurt.png` | pained expression, teary eyes, biting lip, holding back emotions, wounded look |
| `sea_dark.png` | shadowed eyes, hollow smile, lifeless stare, broken cheerfulness, unsettling contrast |
| `sea_cry.png` | tears streaming down face, red puffy eyes, trembling lips, openly sobbing |
| `sea_yandere.png` | wide manic eyes, twisted sweet smile, head tilted unnaturally, possessive obsessive gaze, pink and red color contrast |

---

### YUNA (최유나) — 사진부
> Base: 17 year old girl, short bob-cut black hair with side bangs, large round dark eyes, school uniform (slightly oversized cardigan over uniform), vintage camera around neck, timid quiet aura, Korean high school girl

| File | Expression Prompt |
|------|-------------------|
| `yuna_normal.png` | quiet reserved expression, slightly nervous, hands holding camera strap, introverted posture |
| `yuna_smile.png` | small genuine smile, slightly relieved expression, shy happiness, soft warm look |
| `yuna_scared.png` | wide frightened eyes, trembling, hands clutched to chest, looking over shoulder, terrified |
| `yuna_desperate.png` | panicked urgent expression, teary eyes, reaching out hand, pleading look, frantic |
| `yuna_cry.png` | crying silently, tears rolling down, trying to stay quiet, suppressed sobbing |
| `yuna_weak.png` | exhausted pale face, dark circles under eyes, barely standing, drained of energy |
| `yuna_determined.png` | steeled resolved expression, gripping camera tightly, fierce eyes despite fear, brave determination |

---

### SEOLHWA (이설화) — 수수께끼의 소녀
> Base: 17 year old girl, very long straight silver-white hair, pale ice-blue eyes, school uniform but slightly faded/translucent, extremely pale porcelain skin, ethereal ghostly aura, Korean ghost girl

| File | Expression Prompt |
|------|-------------------|
| `seolhwa_normal.png` | distant vacant expression, looking slightly past viewer, otherworldly calm, faint presence |
| `seolhwa_smile.png` | small melancholic smile, bittersweet expression, nostalgic sadness in eyes, gentle ghost |
| `seolhwa_sad.png` | deeply sorrowful eyes, looking down, translucent tears, heavy grief, lonely expression |
| `seolhwa_fade.png` | body becoming transparent, edges dissolving into particles, fading from existence, reaching out |
| `seolhwa_ghost.png` | fully ghostly appearance, glowing pale blue outline, hollow dark eyes, hair floating unnaturally, horror apparition |

---

## 2. BACKGROUNDS (16:9, 1920x1080)

---

### School - Daytime
| File | Prompt |
|------|--------|
| `classroom.png` | bright sunlit classroom, rows of desks, cherry blossom trees visible through windows, warm spring atmosphere, chalkboard, clean and welcoming |
| `classroom_empty.png` | empty classroom after school, golden afternoon light, long shadows, desks neatly arranged, slightly melancholic atmosphere |
| `classroom_evening.png` | classroom at sunset, orange-red light flooding through windows, dramatic long shadows, warm but lonely feeling |
| `hallway.png` | bright school hallway, lockers along walls, sunlight from windows, clean tile floor, notice board, daytime atmosphere |
| `corridor.png` | long school corridor perspective, windows on one side, cherry blossoms visible outside, peaceful daytime |
| `corridor_dark.png` | same corridor at night, emergency lights only, deep shadows, moonlight through windows, eerie atmosphere |
| `stairway.png` | school stairwell, concrete stairs, metal railing, window at landing, natural lighting |
| `rooftop.png` | school rooftop, chain-link fence, blue sky with clouds, cherry blossom petals floating, panoramic city view below |
| `nurse_office.png` | school infirmary, white curtain partitions, medical bed, medicine cabinet, clean clinical atmosphere, warm lighting |
| `teacher_office.png` | teacher's staff room, multiple desks with papers, bookshelves, warm professional atmosphere |
| `faculty_office.png` | principal's office or faculty meeting room, formal furniture, certificates on wall, authoritative atmosphere |
| `gym.png` | school gymnasium interior, wooden floor, basketball hoops, high ceiling with lights, empty and echoey |
| `library.png` | school library, tall bookshelves, reading tables, warm lamp lighting, quiet studious atmosphere |
| `school_gate.png` | school front gate, cherry blossom trees lining path, students in distance, bright morning, welcoming |
| `school_gate_evening.png` | same school gate at sunset, orange sky, long shadows, cherry petals falling, nostalgic |
| `old_building.png` | abandoned old school building, broken windows, overgrown ivy, dusty interior visible, ominous |

### School - Exterior
| File | Prompt |
|------|--------|
| `street.png` | residential street near school, houses and shops, utility poles, afternoon light, quiet neighborhood |
| `outside_school.png` | school exterior viewed from outside fence, multi-story building, sports field visible, daytime |
| `exit_door.png` | school emergency exit door, metal push-bar door, red EXIT sign, hallway perspective, slightly ominous |
| `cherry_blossom.png` | park path under cherry blossom tunnel, petals carpeting ground, dreamy pink atmosphere, romantic |

### Home
| File | Prompt |
|------|--------|
| `home.png` | small studio apartment, simple furniture, bed and desk, personal belongings, lived-in cozy feel |
| `room_morning.png` | same apartment, morning sunlight through curtains, warm golden glow, alarm clock on desk |
| `room_night.png` | same apartment at night, desk lamp only light source, dark outside window, late-night studying atmosphere |

### Thriller/Horror
| File | Prompt |
|------|--------|
| `school_night.png` | school building at night, no lights on, moonlight casting shadows, empty dark windows, unsettling |
| `school_dark.png` | school interior pitch dark, only flashlight beam visible, deep shadows everywhere, horror atmosphere |
| `school_dawn.png` | school at pre-dawn, dark blue sky, faint light on horizon, fog around building, liminal |
| `basement.png` | school basement storage room, concrete walls, exposed pipes, single flickering fluorescent light, dusty boxes, claustrophobic |

### Ending
| File | Prompt |
|------|--------|
| `sunset_outside.png` | open field outside school district, vast orange sunset sky, freedom feeling, road leading away, hopeful |
| `night_rain.png` | rainy night street, wet reflections on pavement, streetlights creating halos, melancholic heavy rain |
| `black.png` | (solid black, no generation needed) |

---

## 3. BGM GUIDE (Suno / Udio)

---

### Bright/Daily
| File | Prompt/Description |
|------|-------------------|
| `spring_bright.mp3` | cheerful anime opening, acoustic guitar + piano, cherry blossom feeling, bright hopeful, 120bpm, instrumental |
| `morning_bright.mp3` | upbeat morning routine, light piano + bells, fresh start energy, kawaii slice-of-life, instrumental |
| `morning_peaceful.mp3` | calm gentle morning, soft piano solo, peaceful awakening, warm sunrise feeling, instrumental |
| `daily_bright.mp3` | everyday school life, light pop instrumental, xylophone + acoustic guitar, fun casual, 115bpm |
| `sunset_warm.mp3` | warm afternoon sunset, nostalgic acoustic guitar, bittersweet gentle melody, golden hour feeling |
| `night_calm.mp3` | quiet nighttime, soft piano + music box, stargazing atmosphere, peaceful reflective, slow tempo |

### Uneasy/Transition
| File | Prompt/Description |
|------|-------------------|
| `daily_tense.mp3` | school life but something is off, same melody as daily_bright but in minor key, subtle dissonance, underlying tension |
| `morning_uneasy.mp3` | morning routine but anxious, piano with occasional wrong notes, building unease, 100bpm |
| `night_ambient.mp3` | nighttime ambient, low drone + distant wind, crickets, subtle unsettling undertone, dark ambient |
| `night_tension.mp3` | tense night scene, low strings tremolo, heartbeat-like bass pulse, suspenseful, building dread |

### Thriller/Horror
| File | Prompt/Description |
|------|-------------------|
| `tension.mp3` | psychological tension, dissonant strings + low brass, slow build, thriller atmosphere, 80bpm |
| `thriller_ambient.mp3` | dark ambient background, industrial sounds, distant metallic echoes, oppressive atmosphere, minimal |
| `nightmare.mp3` | nightmare sequence, distorted music box melody, reversed audio elements, surreal horror, glitchy |
| `horror_ambient.mp3` | pure horror ambience, deep rumbling bass, sudden silence gaps, whisper-like textures, dread |
| `chase.mp3` | escape chase scene, fast aggressive drums, urgent strings, 160bpm, adrenaline rush, running |
| `chase_intense.mp3` | intense final chase, all instruments, orchestral action, desperate tempo 180bpm, climax |
| `climax.mp3` | final confrontation, epic dark orchestral, choir, building to peak, dramatic reveal moment |

### Character Themes
| File | Prompt/Description |
|------|-------------------|
| `riin_theme.mp3` | elegant mysterious woman, jazz piano + saxophone, seductive smooth, slightly dangerous undertone |
| `sea_theme.mp3` | bright energetic girl, cute pop melody, cheerful but with hidden melancholic undertone in bridge |
| `eunsu_theme.mp3` | warm caring teacher, gentle classical piano, maternal feeling, but minor key variation lurking |
| `eunsu_dark_theme.mp3` | corrupted teacher theme, same melody as eunsu_theme but distorted, music box + static, obsessive loop |

### Endings
| File | Prompt/Description |
|------|-------------------|
| `ending_hope.mp3` | hopeful ending, bright orchestral swell, sunrise feeling, emotional piano + strings, triumphant |
| `ending_melancholy.mp3` | bittersweet ending, solo piano, rain sound effects, beautiful but sad, acceptance |
| `ending_bittersweet.mp3` | mixed emotions ending, acoustic guitar + soft vocals (humming), sunset nostalgia, not fully happy |
| `ending_dark.mp3` | bad ending, single low piano note repeating, silence between notes, despair, emptiness |
| `ending_ghost.mp3` | ghost ending, ethereal choir + music box, floating feeling, between worlds, peaceful but eerie |

---

## 4. SFX

| File | Description |
|------|-------------|
| `affinity_up.mp3` | short positive chime, sparkle sound, heart notification, 0.5s |
| `affinity_down.mp3` | low negative tone, subtle crack sound, disappointment, 0.5s |

---

## NOTES

- Character sprites: PNG, transparent background, ~800x1200px
- Backgrounds: PNG/JPG, 1920x1080 (16:9)
- BGM: MP3, loop-friendly (seamless start/end), 1-3 min
- SFX: MP3, under 1 second
- All character sprites must use the same base reference image for consistency
- For expression variants, use img2img or --cref with the normal pose as reference
- Horror variants (dark, obsessed, yandere, ghost) can break consistency slightly for unsettling effect
