import json, base64, time, os, urllib.request

# Load .env
with open(".env") as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
OUTPUT_DIR = "assets/images/background"

IMAGES = [
    {
        "name": "school_night.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, nighttime view looking up at cream ivory 4-story L-shaped main building from schoolyard side, most aluminum frame glass windows dark with light leaking from only one or two 2nd floor windows, dark gray flat roof and green chain-link rooftop fence silhouette, pale moonlight casting shadows on building walls, deep navy blue sky, streetlight next to reddish-brown brick gate creating circular pool of light, ominous and uneasy atmosphere"
    },
    {
        "name": "school_dark.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, pitch-dark cream wall school main building interior corridor same structure as daytime corridor, only light is faint moonlight through aluminum frame glass windows creating three pale rectangles on beige linoleum floor, corridor disappearing into endless darkness with distorted elongated perspective looking abnormally long, sky blue metal shoe lockers and bulletin boards as dark masses in darkness, pure horror atmosphere"
    },
    {
        "name": "school_dawn.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, early dawn cream ivory 4-story L-shaped main building exterior same angle as school_night, first light of soft pink-orange sunrise coloring lower sky while upper sky still deep navy, low dawn mist wrapping around building, reddish-brown brick wall and green chain-link fence silhouettes, cherry blossom trees faint in mist, quiet atmosphere after a storm has passed, pastel pink-lavender-navy gradient"
    },
    {
        "name": "sunset_outside.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, wide panoramic view from hilltop behind school, cream 4-story L-shaped main building and reddish-brown brick old building visible small below, red urethane track schoolyard and cherry blossom trees, reddish-brown brick wall enclosing school, entire sky filled with breathtaking layered sunset of orange-pink-purple-crimson, golden edges on cumulus cloud borders, trees and utility poles as backlit silhouettes, feeling of liberation and hope"
    }
]

NO_TEXT = ". STRICTLY NO TEXT of any kind in the image: no letters, words, numbers, labels, signs, exit signs, posters with text, nameplates, logos, watermarks, signatures, or any readable content anywhere in the scene."

for i, img in enumerate(IMAGES):
    name = img["name"]
    out_path = os.path.join(OUTPUT_DIR, name)
    print(f"\n[{i+1}/4] Generating {name}...")

    payload = {
        "contents": [{"parts": [{"text": img["prompt"] + NO_TEXT}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "16:9"}
        }
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(API_URL, data=data, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        for part in result["candidates"][0]["content"]["parts"]:
            if "inlineData" in part:
                img_bytes = base64.b64decode(part["inlineData"]["data"])
                with open(out_path, "wb") as f:
                    f.write(img_bytes)
                print(f"  SUCCESS: {len(img_bytes)} bytes")
                break
    except Exception as e:
        print(f"  FAILED: {e}")

    if i < 3:
        print("  Waiting 5 seconds...")
        time.sleep(5)

print("\nDone!")
