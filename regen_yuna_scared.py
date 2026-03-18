import json, base64, os, urllib.request

with open(".env") as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

# 레퍼런스 이미지 로드
ref_path = "assets/images/characters/yuna_normal.png"
with open(ref_path, "rb") as f:
    ref_b64 = base64.b64encode(f.read()).decode()

prompt = """Using this reference character image, generate the SAME character (same face, same hair, same body, same outfit, same art style, same color palette) but with a scared/anxious expression.

Changes from reference:
- Eyes slightly widened with worry and fear
- Eyebrows raised and furrowed with concern
- Lips slightly parted, trembling
- Hands nervously fidgeting or clutching uniform
- Overall uneasy, anxious body language

Keep EXACTLY the same: face shape, hair color, hair style, eye color, uniform, art style, background (transparent), proportions, lighting.
STRICTLY NO TEXT of any kind in the image."""

payload = {
    "contents": [{
        "parts": [
            {"inlineData": {"mimeType": "image/png", "data": ref_b64}},
            {"text": prompt}
        ]
    }],
    "generationConfig": {
        "responseModalities": ["IMAGE"],
        "imageConfig": {"aspectRatio": "3:4"}
    }
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(API_URL, data=data, headers={"Content-Type": "application/json"}, method="POST")

print("Generating yuna_scared with reference...")
with urllib.request.urlopen(req, timeout=120) as resp:
    result = json.loads(resp.read().decode("utf-8"))

for part in result["candidates"][0]["content"]["parts"]:
    if "inlineData" in part:
        img_bytes = base64.b64decode(part["inlineData"]["data"])
        with open("assets/images/characters/yuna_scared.png", "wb") as f:
            f.write(img_bytes)
        print(f"SUCCESS: {len(img_bytes)} bytes")
        break
