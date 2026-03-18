#!/usr/bin/env python3
"""Regenerate only the 4 failed background images using Imagen 4.0 API."""

import json
import base64
import time
import os
import urllib.request
import urllib.error

def load_env():
    """Load .env file if exists."""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
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
    print("GEMINI_API_KEY not found.")
    exit(1)

API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key={API_KEY}"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "images", "background")

# Only the 4 failed images
FAILED_BACKGROUNDS = [
    {
        "name": "school_night.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, nighttime view looking up at cream ivory 4-story L-shaped main building from schoolyard side, most aluminum frame glass windows dark with light leaking from only one or two 2nd floor windows, dark gray flat roof and green chain-link rooftop fence silhouette, pale moonlight casting shadows on building walls, deep navy blue sky, streetlight next to reddish-brown brick gate creating circular pool of light, ominous and uneasy atmosphere"
    },
    {
        "name": "school_dark.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, pitch-dark cream wall school main building interior corridor same structure as daytime corridor, only light is faint moonlight through aluminum frame glass windows creating three pale rectangles on beige linoleum floor, corridor disappearing into endless darkness with distorted elongated perspective looking abnormally long, sky blue metal shoe lockers and bulletin boards as dark masses in darkness, pure horror atmosphere"
    },
    {
        "name": "school_dawn.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, early dawn cream ivory 4-story L-shaped main building exterior same angle as school_night, first light of soft pink-orange sunrise coloring lower sky while upper sky still deep navy, low dawn mist wrapping around building, reddish-brown brick wall and green chain-link fence silhouettes, cherry blossom trees faint in mist, quiet atmosphere after a storm has passed, pastel pink-lavender-navy gradient"
    },
    {
        "name": "sunset_outside.png",
        "prompt": "Visual novel background illustration, vivid digital cel shading, anime visual novel style,no characters, wide 16:9 composition, 1920x1080 resolution, wide panoramic view from hilltop behind school, cream 4-story L-shaped main building and reddish-brown brick old building visible small below, red urethane track schoolyard and cherry blossom trees, reddish-brown brick wall enclosing school, entire sky filled with breathtaking layered sunset of orange-pink-purple-crimson, golden edges on cumulus cloud borders, trees and utility poles as backlit silhouettes, feeling of liberation and hope"
    },
]

NO_TEXT_SUFFIX = ". STRICTLY NO TEXT of any kind in the image: no letters, words, numbers, labels, signs, exit signs, posters with text, nameplates, logos, watermarks, signatures, or any readable content anywhere in the scene."


def generate_image(prompt, output_path):
    """Call Imagen 4.0 API and save the result."""
    full_prompt = prompt + NO_TEXT_SUFFIX
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

    total = len(FAILED_BACKGROUNDS)
    success_count = 0
    fail_count = 0

    for i, bg in enumerate(FAILED_BACKGROUNDS):
        name = bg["name"]
        output_path = os.path.join(OUTPUT_DIR, name)
        print(f"\n[{i+1}/{total}] Generating {name}...")

        ok, msg = generate_image(bg["prompt"], output_path)
        if ok:
            success_count += 1
            print(f"  SUCCESS: {msg}")
        else:
            fail_count += 1
            print(f"  FAILED: {msg}")

        # 5 second delay between calls to avoid rate limiting
        if i < total - 1:
            print("  Waiting 5 seconds (rate limit)...")
            time.sleep(5)

    print(f"\n{'='*50}")
    print(f"Done! Success: {success_count}, Failed: {fail_count}, Total: {total}")


if __name__ == "__main__":
    main()
