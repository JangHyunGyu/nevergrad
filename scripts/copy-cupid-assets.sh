#!/bin/bash
# cupid -> nevergrad 임시 에셋 복사 스크립트
# 프로덕션 전에 오리지널 에셋으로 교체할 것

SRC="c:/workspace/cupid/assets"
DST="c:/workspace/nevergrad/assets"

mkdir -p "$DST/images/background"
mkdir -p "$DST/images/characters"
mkdir -p "$DST/audio/bgm"
mkdir -p "$DST/audio/sfx"

echo "=== Backgrounds ==="
# 교실/학교
cp "$SRC/images/background/school.png"          "$DST/images/background/classroom.png"
cp "$SRC/images/background/room_school.png"      "$DST/images/background/classroom_empty.png"
cp "$SRC/images/background/room_school.png"      "$DST/images/background/classroom_evening.png"
cp "$SRC/images/background/school_hallway.png"   "$DST/images/background/hallway.png"
cp "$SRC/images/background/school_hallway.png"   "$DST/images/background/corridor.png"
cp "$SRC/images/background/school_hallway.png"   "$DST/images/background/corridor_dark.png"
cp "$SRC/images/background/top_school.png"       "$DST/images/background/rooftop.png"
cp "$SRC/images/background/top_school.png"       "$DST/images/background/stairway.png"
cp "$SRC/images/background/nurse_room.jpg"       "$DST/images/background/nurse_office.png"
cp "$SRC/images/background/teacher_office.png"   "$DST/images/background/teacher_office.png"
cp "$SRC/images/background/teacher_office.png"   "$DST/images/background/faculty_office.png"
cp "$SRC/images/background/gym.png"              "$DST/images/background/gym.png"
cp "$SRC/images/background/library_old.png"      "$DST/images/background/library.png"
cp "$SRC/images/background/school_back.png"      "$DST/images/background/school_gate.png"
cp "$SRC/images/background/school_back.png"      "$DST/images/background/school_gate_evening.png"
cp "$SRC/images/background/school_back.png"      "$DST/images/background/outside_school.png"
cp "$SRC/images/background/school_basement.png"  "$DST/images/background/old_building.png"
# 학교 외부
cp "$SRC/images/background/street.png"           "$DST/images/background/street.png"
cp "$SRC/images/background/school_back.png"      "$DST/images/background/exit_door.png"
cp "$SRC/images/background/park.png"             "$DST/images/background/cherry_blossom.png"
# 자취방
cp "$SRC/images/background/student_room.png"     "$DST/images/background/home.png"
cp "$SRC/images/background/student_room.png"     "$DST/images/background/room_morning.png"
cp "$SRC/images/background/student_room.png"     "$DST/images/background/room_night.png"
# 스릴러 (어두운 학교 = 학교 이미지 재활용, CSS 오버레이로 구분)
cp "$SRC/images/background/school_basement.png"  "$DST/images/background/school_night.png"
cp "$SRC/images/background/school_basement.png"  "$DST/images/background/school_dark.png"
cp "$SRC/images/background/school.png"           "$DST/images/background/school_dawn.png"
cp "$SRC/images/background/school_basement.png"  "$DST/images/background/basement.png"
# 엔딩
cp "$SRC/images/background/park.png"             "$DST/images/background/sunset_outside.png"
cp "$SRC/images/background/street.png"           "$DST/images/background/night_rain.png"
echo "  backgrounds done (28 files)"

echo "=== Characters ==="
# 은수 (eunsu) ← teacher
cp "$SRC/images/characters/teacher_normal.png"   "$DST/images/characters/eunsu_normal.png"
cp "$SRC/images/characters/teacher_smile.png"    "$DST/images/characters/eunsu_smile.png"
cp "$SRC/images/characters/teacher_smile.png"    "$DST/images/characters/eunsu_gentle.png"
cp "$SRC/images/characters/teacher_shy.png"      "$DST/images/characters/eunsu_shy.png"
cp "$SRC/images/characters/teacher_angry.png"    "$DST/images/characters/eunsu_angry.png"
cp "$SRC/images/characters/teacher_sad.png"      "$DST/images/characters/eunsu_close.png"
cp "$SRC/images/characters/teacher_angry.png"    "$DST/images/characters/eunsu_cold.png"
cp "$SRC/images/characters/teacher_angry.png"    "$DST/images/characters/eunsu_dark.png"
cp "$SRC/images/characters/teacher_sad.png"      "$DST/images/characters/eunsu_obsessed.png"

# 리인 (riin) ← nurse
cp "$SRC/images/characters/nurse_normal.png"     "$DST/images/characters/riin_normal.png"
cp "$SRC/images/characters/nurse_normal.png"     "$DST/images/characters/riin_smile.png"
cp "$SRC/images/characters/nurse_shy.png"        "$DST/images/characters/riin_seductive.png"
cp "$SRC/images/characters/nurse_shy.png"        "$DST/images/characters/riin_close.png"
cp "$SRC/images/characters/nurse_normal.png"     "$DST/images/characters/riin_pleased.png"
cp "$SRC/images/characters/nurse_angry.png"      "$DST/images/characters/riin_cold.png"
cp "$SRC/images/characters/nurse_angry.png"      "$DST/images/characters/riin_dark.png"

# 세아 (sea) ← seyoun
cp "$SRC/images/characters/seyoun_normal.png"    "$DST/images/characters/sea_normal.png"
cp "$SRC/images/characters/seyoun_laugh.png"     "$DST/images/characters/sea_smile.png"
cp "$SRC/images/characters/seyoun_shy.png"       "$DST/images/characters/sea_shy.png"
cp "$SRC/images/characters/seyoun_worried.png"   "$DST/images/characters/sea_serious.png"
cp "$SRC/images/characters/seyoun_angry.png"     "$DST/images/characters/sea_angry.png"
cp "$SRC/images/characters/seyoun_sad.png"       "$DST/images/characters/sea_hurt.png"
cp "$SRC/images/characters/seyoun_angry.png"     "$DST/images/characters/sea_dark.png"
cp "$SRC/images/characters/seyoun_cry.png"       "$DST/images/characters/sea_cry.png"
cp "$SRC/images/characters/seyoun_angry.png"     "$DST/images/characters/sea_yandere.png"
cp "$SRC/images/characters/seyoun_sad.png"       "$DST/images/characters/sea_sad.png"

# 유나 (yuna) ← yuna
cp "$SRC/images/characters/yuna_normal.png"      "$DST/images/characters/yuna_normal.png"
cp "$SRC/images/characters/yuna_smile.png"       "$DST/images/characters/yuna_smile.png"
cp "$SRC/images/characters/yuna_shy.png"         "$DST/images/characters/yuna_scared.png"
cp "$SRC/images/characters/yuna_sad.png"         "$DST/images/characters/yuna_desperate.png"
cp "$SRC/images/characters/yuna_sad.png"         "$DST/images/characters/yuna_cry.png"
cp "$SRC/images/characters/yuna_bored.png"       "$DST/images/characters/yuna_weak.png"
cp "$SRC/images/characters/yuna_angry.png"       "$DST/images/characters/yuna_determined.png"

# 설화 (seolhwa) ← dain
cp "$SRC/images/characters/dain_normal.png"      "$DST/images/characters/seolhwa_normal.png"
cp "$SRC/images/characters/dain_laugh.png"       "$DST/images/characters/seolhwa_smile.png"
cp "$SRC/images/characters/dain_sad.png"         "$DST/images/characters/seolhwa_sad.png"
cp "$SRC/images/characters/dain_sad.png"         "$DST/images/characters/seolhwa_fade.png"
cp "$SRC/images/characters/dain_active.png"      "$DST/images/characters/seolhwa_ghost.png"
echo "  characters done (38 files)"

echo "=== Audio BGM ==="
# 밝은/일상
cp "$SRC/audio/bgm/morning.mp3"     "$DST/audio/bgm/spring_bright.mp3"
cp "$SRC/audio/bgm/morning.mp3"     "$DST/audio/bgm/morning_bright.mp3"
cp "$SRC/audio/bgm/morning.mp3"     "$DST/audio/bgm/morning_peaceful.mp3"
cp "$SRC/audio/bgm/daily.mp3"       "$DST/audio/bgm/daily_bright.mp3"
cp "$SRC/audio/bgm/sunset1.mp3"     "$DST/audio/bgm/sunset_warm.mp3"
cp "$SRC/audio/bgm/night1.mp3"      "$DST/audio/bgm/night_calm.mp3"
# 불안/전환
cp "$SRC/audio/bgm/daily2.mp3"      "$DST/audio/bgm/daily_tense.mp3"
cp "$SRC/audio/bgm/morning.mp3"     "$DST/audio/bgm/morning_uneasy.mp3"
cp "$SRC/audio/bgm/night1.mp3"      "$DST/audio/bgm/night_ambient.mp3"
cp "$SRC/audio/bgm/night2.mp3"      "$DST/audio/bgm/night_tension.mp3"
# 스릴러/호러
cp "$SRC/audio/bgm/mystery.mp3"     "$DST/audio/bgm/tension.mp3"
cp "$SRC/audio/bgm/mystery.mp3"     "$DST/audio/bgm/thriller_ambient.mp3"
cp "$SRC/audio/bgm/mystery.mp3"     "$DST/audio/bgm/nightmare.mp3"
cp "$SRC/audio/bgm/mystery.mp3"     "$DST/audio/bgm/horror_ambient.mp3"
cp "$SRC/audio/bgm/night2.mp3"      "$DST/audio/bgm/chase.mp3"
cp "$SRC/audio/bgm/night2.mp3"      "$DST/audio/bgm/chase_intense.mp3"
cp "$SRC/audio/bgm/mystery.mp3"     "$DST/audio/bgm/climax.mp3"
# 캐릭터 테마 (임시로 동일 BGM)
cp "$SRC/audio/bgm/confession.mp3"  "$DST/audio/bgm/riin_theme.mp3"
cp "$SRC/audio/bgm/confession.mp3"  "$DST/audio/bgm/sea_theme.mp3"
cp "$SRC/audio/bgm/confession.mp3"  "$DST/audio/bgm/eunsu_theme.mp3"
cp "$SRC/audio/bgm/date.mp3"        "$DST/audio/bgm/eunsu_dark_theme.mp3"
# 엔딩
cp "$SRC/audio/bgm/ending.mp3"      "$DST/audio/bgm/ending_hope.mp3"
cp "$SRC/audio/bgm/sunset2.mp3"     "$DST/audio/bgm/ending_melancholy.mp3"
cp "$SRC/audio/bgm/sunset2.mp3"     "$DST/audio/bgm/ending_bittersweet.mp3"
cp "$SRC/audio/bgm/night2.mp3"      "$DST/audio/bgm/ending_dark.mp3"
cp "$SRC/audio/bgm/mystery.mp3"     "$DST/audio/bgm/ending_ghost.mp3"
echo "  bgm done (26 files)"

echo "=== Audio SFX ==="
cp "$SRC/audio/sfx/affinity_up.mp3"   "$DST/audio/sfx/affinity_up.mp3"
cp "$SRC/audio/sfx/affinity_down.mp3" "$DST/audio/sfx/affinity_down.mp3"
echo "  sfx done (2 files)"

# 검정 배경은 직접 생성 (1x1 black pixel)
if ! [ -f "$DST/images/background/black.png" ]; then
    printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\x60\x60\x60\x00\x00\x00\x04\x00\x01\xe4\x00\x18\xd8\x00\x00\x00\x00IEND\xaeB\x60\x82' > "$DST/images/background/black.png"
    echo "  created black.png"
fi

echo ""
echo "=== Complete ==="
echo "Total: 28 backgrounds + 38 characters + 26 BGM + 2 SFX = 94 placeholder files"
echo "NOTE: These are temporary placeholders from cupid. Replace with original art before release."
