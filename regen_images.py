import json, base64, time, os, urllib.request

with open(".env") as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

NO_TEXT = " STRICTLY NO TEXT of any kind in the image: no letters, words, numbers, labels, signs, exit signs, posters with text, nameplates, logos, watermarks, signatures, or any readable content anywhere in the scene."

IMAGES = [
    {
        "name": "assets/images/background/student_council.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building student council room interior, smaller than regular classroom, long wooden meeting table with 6 chairs around it, whiteboard on front wall with markers, wooden shelf with organized binders and documents, school flag in corner, aluminum frame glass window with afternoon sunlight, beige polished linoleum floor, square fluorescent ceiling lights, organized and formal atmosphere but slightly cozy." + NO_TEXT
    },
    {
        "name": "assets/images/background/teacher_office.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style, no characters, wide 16:9 composition, 1920x1080 resolution, cream wall school main building 2nd floor private teacher's office next to faculty room, wooden desk with stacks of papers and red pen steaming coffee cup small potted plant, wooden bookshelf behind with textbooks and files, metal stand lamp creating warm circular light, photo frame with blurry family photo, aluminum frame glass window with afternoon natural light coming in and schoolyard with reddish-brown brick wall visible outside, cozy but formal atmosphere." + NO_TEXT
    },
    {
        "name": "assets/images/characters/yuna_scared.png",
        "prompt": "Visual novel character illustration, anime style, single female character portrait on transparent background, 3:4 aspect ratio, a Korean high school girl with short wavy auburn hair and soft reddish-brown eyes, wearing standard school uniform (white shirt, dark blazer), showing a naturally anxious and uneasy expression, eyes slightly widened with worry, lips slightly parted, eyebrows furrowed with concern, subtle trembling, NOT horror NOT black and white, natural skin color, soft warm lighting, gentle worried expression not exaggerated." + NO_TEXT
    }
]

for i, img in enumerate(IMAGES):
    out_path = img["name"]
    print(f"\n[{i+1}/3] Generating {out_path}...")

    payload = {
        "contents": [{"parts": [{"text": img["prompt"]}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "16:9" if "background" in out_path else "3:4"}
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

    if i < 2:
        print("  Waiting 10 seconds...")
        time.sleep(10)

print("\nDone!")
