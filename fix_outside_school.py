import json, base64, os, urllib.request

# Load .env
env_path = os.path.join(os.path.dirname(__file__) or ".", ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

img_path = "assets/images/background/outside_school.png"
with open(img_path, "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

payload = {
    "contents": [{
        "parts": [
            {"inlineData": {"mimeType": "image/png", "data": img_b64}},
            {"text": "Remove the person/character from this image completely. Fill the area where the person was with the background (brick wall, fence, grass, and building behind). Keep everything else exactly the same. STRICTLY NO TEXT of any kind in the output image."}
        ]
    }],
    "generationConfig": {
        "responseModalities": ["IMAGE"],
        "imageConfig": {"aspectRatio": "16:9"}
    }
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(API_URL, data=data, headers={"Content-Type": "application/json"}, method="POST")

print("Sending to Gemini 3.1 Flash...")
with urllib.request.urlopen(req, timeout=120) as resp:
    result = json.loads(resp.read().decode("utf-8"))

for part in result["candidates"][0]["content"]["parts"]:
    if "inlineData" in part:
        img_bytes = base64.b64decode(part["inlineData"]["data"])
        with open(img_path, "wb") as f:
            f.write(img_bytes)
        print(f"SUCCESS: Saved ({len(img_bytes)} bytes)")
        break
