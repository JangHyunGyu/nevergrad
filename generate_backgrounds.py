#!/usr/bin/env python3
"""Generate all background images using Imagen 4.0 API."""

import json
import base64
import time
import os
import urllib.request
import urllib.error

def load_env():
    """Load .env file if exists."""
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip())

load_env()
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("❌ GEMINI_API_KEY가 없습니다.")
    print("   .env 파일에 GEMINI_API_KEY=your_key 형태로 추가해주세요.")
    exit(1)
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key={API_KEY}"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets/images/background")

# All backgrounds with English translations of the Korean prompts
BACKGROUNDS = [
    {
        "name": "room_morning.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, old villa 2nd floor small studio apartment morning version, single bed with rumpled blue blanket and head impression on pillow, study desk across with alarm clock and smartphone, small wooden bookshelf with manga and textbooks, bright warm morning sunlight streaming through thin white curtains flooding the room with golden light, dust particles floating in light beams, cup ramen on small refrigerator, slippers and bag on floor, fresh atmosphere of a new day beginning",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "home.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, old villa 2nd floor small studio apartment evening time, single bed with blue blanket against left wall, study desk with metal stand lamp and a few books across, small wooden bookshelf with manga and textbooks, thin white curtains draped over window, slippers and bag on floor, cup ramen on small refrigerator, cozy but lonely feeling of living alone, mixed neutral lighting of warm circular stand lamp light and evening window light",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "room_night.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, same villa studio apartment night version, only metal stand lamp illuminating study desk with rest in darkness, smartphone screen glowing faint blue-white on single bed with blue blanket, small wooden bookshelf and refrigerator as silhouettes in shadow, thin white curtains over pitch-black window outside, atmosphere of isolation and loneliness at night, dark navy-black colors with only warm circular stand lamp light as contrast",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "school_gate.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, Korean high school front gate entrance frontal view, two 180cm tall reddish-brown brick pillars with spherical stone lantern ornaments on top and black wrought iron gate between them with arched top vertical bars half open, reddish-brown brick wall extending on both sides with dark green chain-link fence on top, inside the gate an asphalt path lined with 30+ year old full-bloom cherry blossom trees forming a tunnel, cream ivory concrete 4-story main building visible far at end of path, pink petals scattered on ground, bright vivid April spring morning, golden natural light",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "cherry_blossom.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, 150m straight asphalt path leading to school front gate, 30+ year old full-bloom cherry blossom trees on both sides with branches forming an arch tunnel overhead, countless pink petals slowly drifting in the wind, ground covered like a pink carpet of petals, reddish-brown brick pillar school gate visible small in the distance at end of path, bright warm spring sunlight creating light beams through branches, dreamy and romantic soft focus atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "hallway.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream ivory concrete school main building 1st floor entrance hall frontal view, aluminum frame glass automatic doors at front with cherry blossom path light shining through, sky blue metal shoe lockers lining both walls up to ceiling, two wooden benches for shoe changing on floor, beige polished linoleum floor reflecting entrance door light in long streaks, square fluorescent lights on ceiling, cream painted walls, bright and lively morning attendance atmosphere, warm natural light",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "corridor.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream painted wall school main building corridor with perspective depth, left side has beige plywood sliding classroom doors in a row with bulletin boards and fire extinguishers between doors, right side has aluminum frame large glass windows in a row with bright spring sunlight coming in and cherry blossom branches visible outside, beige polished linoleum floor reflecting window light, square fluorescent lights in a row on ceiling turned on, olive-colored metal railing stairwell entrance slightly visible at corridor end, bright and clean daytime ordinary school feeling",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "classroom.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building classroom interior viewed from back toward front, 4 columns 6 rows of light birch-colored plywood desks and matching chairs neatly arranged in rows, dark green chalkboard at front with chalk marks, round clock and speaker above chalkboard, three aluminum frame glass windows on left wall with thin white lace curtains slightly billowing in spring breeze, grid pattern of window light on light birch plywood floor, full-bloom cherry blossom branches and blue sky visible outside windows, two rows of square fluorescent ceiling lights, warm and lively daytime atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "teacher_office.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building 2nd floor private teacher's office next to faculty room, wooden desk with stacks of papers and red pen steaming coffee cup small potted plant, wooden bookshelf behind with textbooks and files, metal stand lamp creating warm circular light, photo frame with blurry family photo, aluminum frame glass window with afternoon natural light coming in and schoolyard with reddish-brown brick wall visible outside, cozy but formal atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "library.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building 3rd floor library interior viewed from between aisles, floor-to-ceiling dark brown wooden bookshelves packed with books on both sides, reading table and desk lamp at end of aisle, arched aluminum frame large window with afternoon sunlight streaming in at an angle with dust particles visible in light beams, beige polished linoleum floor, square fluorescent ceiling lights, quiet and still atmosphere as if time has stopped",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "nurse_office.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building 1st floor east end nurse's office interior, two beds partitioned by white curtains with clean white sheets, glass door stainless steel medicine cabinet with medicine bottles and bandages, wooden desk with computer monitor thermometer blood pressure meter, aluminum frame glass window with lace curtains letting in bright light, beige polished linoleum floor, square fluorescent ceiling lights, clean and sterile but somehow unsettling clinical atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "rooftop.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, high-altitude rooftop of 4-story school building looking outward, camera at 4th floor height with expansive sky taking up upper half of frame, green chain-link safety fence 180cm tall along edges, looking DOWN over fence at cherry blossom treetops and tiny schoolyard far below with red urethane track, miniature reddish-brown brick wall and small village houses spread out in distance below eye level, strong sense of height and vertigo, old wooden bench in left corner, concrete floor with rain stains and drain, gray metal fire door for rooftop access behind, towel fluttering on fence in wind, vast open sky with cumulus clouds, peaceful afternoon sunshine and feeling of liberation from above",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "stairway.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream painted wall school main building stairwell interior looking up from below, concrete stairs with olive-colored painted metal railing, yellow anti-slip tape on stair edges, small aluminum frame window at mid-landing with spring sunlight streaming in at an angle creating light beams on stairs, slightly cramped and narrow but reassuring because of the light, neutral daytime lighting",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "garden.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, small courtyard garden between cream main building and reddish-brown brick old building, low reddish-brown brick flower beds with red-yellow-purple seasonal flowers in full bloom, narrow cement walking path between flower beds, tall ginkgo tree in center with old wooden bench beneath it, right side shows cream main building 1st floor wall with aluminum frame windows with potted plants on windowsill, reddish-brown brick 2-story old building visible far on left, soft warm spring afternoon natural light, peaceful and cozy secret garden space",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "classroom_empty.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building classroom but eerily empty, light birch-colored plywood desks pushed messily to one side with some chairs toppled over, one lone desk remaining in center of room with a single closed notebook on it, dark green chalkboard with only erased marks remaining, three aluminum frame glass windows with late afternoon sunset light streaming in at an angle casting long shadows on plywood floor, floating dust particles, unnaturally silent atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "corridor_dark.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, nighttime cream wall school main building corridor same structure as daytime corridor, all square fluorescent lights off with only dim greenish emergency lights on ceiling flickering intermittently, moonlight through aluminum frame glass windows creating pale rectangular patterns on beige linoleum floor, olive-colored stairway railing at corridor end disappearing into pitch darkness, sky blue metal shoe locker shadows stretching across floor like monster silhouettes, red fire extinguisher on wall standing out in darkness, horror thriller atmosphere of tension",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "old_building.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, reddish-brown brick exterior 2-story old building interior corridor with perspective depth, cream paint peeling and cracked walls revealing reddish-brown brick underneath, rusted aluminum frame windows with dusty broken glass letting in hazy light, beige linoleum floor with fallen leaves and dust debris, some ceiling tiles missing exposing pipes, cobwebs and abandoned chair in corner, stark contrast to clean main building making it feel dark and creepy even in daytime",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "exit_door.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, dark school main building 1st floor corridor end with cream walls and beige linoleum floor, heavy gray metal fire door slightly ajar same material as rooftop access door, blinding natural light pouring through door gap spreading in wedge shape on floor, this side corridor in deep darkness with sky blue metal shoe locker shadows, outside shows dazzling cherry blossom path light, green emergency light above door, dramatic light-dark contrast of hope and escape",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "faculty_office.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building 2nd floor faculty office interior, wooden teacher desks arranged in 4 rows with stacks of papers on each desk, gray steel filing cabinets along walls, copy machine in corner, aluminum frame glass windows with bright light, beige polished linoleum floor, square fluorescent ceiling lights casting shadowless bright light, whiteboard, impersonal bureaucratic and rigid atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "gym.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, school gymnasium interior center view in separate building behind main building, polished wooden floor with court lines reflecting light, basketball hoops and nets at both ends, folding stage and stacked pipe chairs against back wall, high arched ceiling with circular lights, aluminum frame windows high on side walls letting in light with cream main building visible outside, empty space where footsteps would echo with hollow feeling",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "basement.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, secret laboratory in basement of reddish-brown brick old building, single flickering square fluorescent light on ceiling buzzing and flashing, stainless steel medical bed with leather restraint straps in center, IV stand and medical monitor beside it, glass door stainless steel chemical cabinet on wall same model as nurse office but with different contents including reagent bottles, white tile floor with drain and stains, reddish-brown brick wall exposed in places, sterile institutional horror atmosphere, cold overhead lighting",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles, bright atmosphere, clean environment"
    },
    {
        "name": "outside_school.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, view from outside reddish-brown brick wall with dark green chain-link fence on top looking at cream ivory 4-story main building beyond, standing outside wall looking at school, grass and weeds below wall, dark clouds hanging low in sky with rain starting to fall in overcast sky, raindrops hanging on green chain-link fence, contrast between free open space outside fence and enclosed school inside, desaturated dull gray-blue tones",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "street.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, quiet residential neighborhood alley on gentle uphill slope used as school commute path, small 2-story houses with walls and gates on both sides, overhead power lines crossing with sparrows on utility pole, manhole cover on asphalt road, vending machine in corner, full-bloom cherry blossom trees and reddish-brown brick gate pillars slightly visible far at end of road, warm afternoon light casting shadows on walls, ordinary and peaceful suburban neighborhood",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "night_rain.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, rainy night on residential neighborhood alley near school same street as daytime version first-person walking perspective, wet glistening asphalt road with streetlight reflections stretching long, heavy rain falling, puddles on ground reflecting streetlight, dark 2-story house silhouettes and utility poles on both sides, single streetlight glow in school direction in distance, deeply melancholic and lonely noir atmosphere, cold navy blue tones",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "school_night.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, nighttime view looking up at cream ivory 4-story L-shaped main building from schoolyard side, most aluminum frame glass windows dark with light leaking from only one or two 2nd floor windows, dark gray flat roof and green chain-link rooftop fence silhouette, pale moonlight casting shadows on building walls, deep navy blue sky, streetlight next to reddish-brown brick gate creating circular pool of light, ominous and uneasy atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "school_dark.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, pitch-dark cream wall school main building interior corridor same structure as daytime corridor, only light is faint moonlight through aluminum frame glass windows creating three pale rectangles on beige linoleum floor, corridor disappearing into endless darkness with distorted elongated perspective looking abnormally long, sky blue metal shoe lockers and bulletin boards as dark masses in darkness, pure horror atmosphere",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles, bright atmosphere"
    },
    {
        "name": "school_dawn.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, early dawn cream ivory 4-story L-shaped main building exterior same angle as school_night, first light of soft pink-orange sunrise coloring lower sky while upper sky still deep navy, low dawn mist wrapping around building, reddish-brown brick wall and green chain-link fence silhouettes, cherry blossom trees faint in mist, quiet atmosphere after a storm has passed, pastel pink-lavender-navy gradient",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
    {
        "name": "sunset_outside.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, wide panoramic view from hilltop behind school, cream 4-story L-shaped main building and reddish-brown brick old building visible small below, red urethane track schoolyard and cherry blossom trees, reddish-brown brick wall enclosing school, entire sky filled with breathtaking layered sunset of orange-pink-purple-crimson, golden edges on cumulus cloud borders, trees and utility poles as backlit silhouettes, feeling of liberation and hope",
        "negative": "low quality, blurry, 3D rendering, photorealistic photo, watermark, signature, text, letters, characters, numbers, logo, sign, nameplate, people, person, character, multiple angles"
    },
]


def generate_image(prompt, negative_prompt, output_path):
    """Call Imagen 4.0 API and save the result."""
    # Imagen 4.0 no longer supports negativePrompt parameter
    # Incorporate key negative constraints into the prompt itself
    full_prompt = prompt + ". STRICTLY NO TEXT of any kind in the image: no letters, words, numbers, labels, signs, exit signs, posters with text, nameplates, logos, watermarks, signatures, or any readable content anywhere in the scene."
    payload = {
        "instances": [
            {"prompt": full_prompt}
        ],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "16:9",
            "personGeneration": "allow_all"
        }
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))

        if "predictions" in result and len(result["predictions"]) > 0:
            img_b64 = result["predictions"][0]["bytesBase64Encoded"]
            img_bytes = base64.b64decode(img_b64)
            with open(output_path, "wb") as f:
                f.write(img_bytes)
            return True, f"Saved ({len(img_bytes)} bytes)"
        else:
            return False, f"No predictions in response: {json.dumps(result)[:300]}"
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return False, f"HTTP {e.code}: {body[:300]}"
    except Exception as e:
        return False, f"Error: {str(e)}"


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = len(BACKGROUNDS)
    success_count = 0
    fail_count = 0

    for i, bg in enumerate(BACKGROUNDS):
        name = bg["name"]
        output_path = os.path.join(OUTPUT_DIR, name)
        print(f"\n[{i+1}/{total}] Generating {name}...")

        ok, msg = generate_image(bg["prompt"], bg["negative"], output_path)
        if ok:
            success_count += 1
            print(f"  SUCCESS: {msg}")
        else:
            fail_count += 1
            print(f"  FAILED: {msg}")

        # Pause between calls (skip after last)
        if i < total - 1:
            print("  Waiting 2 seconds...")
            time.sleep(2)

    print(f"\n{'='*50}")
    print(f"Done! Success: {success_count}, Failed: {fail_count}, Total: {total}")


if __name__ == "__main__":
    main()
