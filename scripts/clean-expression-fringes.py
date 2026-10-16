"""Neutralize verified chroma spill without cropping or changing sprite alpha.

Requires Pillow, NumPy and SciPy. Write candidates to a separate directory:
  python scripts/clean-expression-fringes.py --output-dir tmp/fringe-candidates

The approved generated eunsu_obsessed master is maintained separately.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
TARGETS = {
    'eunsu': ['angry', 'close', 'cold', 'dark', 'gentle', 'normal', 'serious', 'shy', 'smile', 'warm'],
    'sea': ['angry', 'broken_smile', 'cry', 'dark', 'hurt', 'sad', 'serious', 'shy', 'smile', 'stare', 'vulnerable', 'yandere'],
}


def clean(source, character):
    original = np.asarray(source.convert('RGBA')).copy()
    result = original.copy()
    rgb = original[:, :, :3].astype(np.float64)
    alpha = original[:, :, 3]
    height, width = alpha.shape
    radius = max(5, round(6 * height / 1448))
    visible = alpha > 0
    depth = ndimage.distance_transform_edt(visible)
    chroma = np.minimum(rgb[:, :, 0], rgb[:, :, 2]) - rgb[:, :, 1]
    selection = visible & (depth <= radius) & (chroma > 4)
    protected = np.zeros_like(visible)

    if character == 'sea':
        # Pink ribbons and the star pin are intentional, including thin strands.
        protected[:round(height * 0.40), :] = True
        red_fabric = (rgb[:, :, 0] > rgb[:, :, 2] * 1.4) & (rgb[:, :, 0] > rgb[:, :, 1] * 1.8) & (rgb[:, :, 1] < 90)
        protected |= red_fabric
        selection &= ~protected

    # Remove the excess magenta while retaining each fringe pixel's luminance.
    correction = chroma
    adjusted = rgb.copy()
    adjusted[:, :, 0] -= 0.7152 * correction
    adjusted[:, :, 1] += 0.2848 * correction
    adjusted[:, :, 2] -= 0.7152 * correction
    adjusted = np.clip(np.rint(adjusted), 0, 255).astype(np.uint8)
    result[:, :, :3][selection] = adjusted[selection]

    removed = np.zeros_like(visible)
    if width == 1536 and height == 2752:
        # Verified disconnected magenta at the bottom-right canvas boundary.
        if source.filename.endswith('sea_smile.png'):
            removed[-1, -1] = True
        elif source.filename.endswith('sea_stare.png'):
            removed[-1, -13:] = True
        removed &= alpha > 0
        assert np.all(alpha[removed] == 80)
        assert np.all(chroma[removed] > 30)
        result[removed] = 0

    changed = np.any(original != result, axis=2)
    assert np.array_equal(original[~(selection | removed)], result[~(selection | removed)])
    assert np.array_equal(original[:, :, 3][~removed], result[:, :, 3][~removed])
    assert np.array_equal(original[protected], result[protected])
    output_chroma = np.minimum(result[:, :, 0].astype(int), result[:, :, 2].astype(int)) - result[:, :, 1].astype(int)
    assert not np.any(output_chroma[selection & ~removed] > 4)

    return Image.fromarray(result), {
        'size': [width, height],
        'edgeRadius': radius,
        'changedPixels': int(changed.sum()),
        'changedPercent': round(float(changed.mean() * 100), 4),
        'removedPixels': int(removed.sum()),
        'alphaPreservedOutsideVerifiedSpecks': True,
        'outsideMaskUnchanged': True,
        'protectedMaterialUnchanged': True,
        'remainingChromaInTreatedPixels': int((output_chroma[selection & ~removed] > 4).sum()),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', required=True, type=Path)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    records = []
    for character, expressions in TARGETS.items():
        for expression in expressions:
            name = f'{character}_{expression}.png'
            source_path = ROOT / 'assets/images/characters' / name
            output_path = args.output_dir / name
            if source_path.resolve() == output_path.resolve():
                raise ValueError('Use a separate candidate directory to preserve the master')
            with Image.open(source_path) as source:
                image, record = clean(source, character)
            image.save(output_path, compress_level=9)
            records.append({'file': name, **record})
            print(name, record['changedPixels'], 'changed;', record['removedPixels'], 'removed')
    (args.output_dir / 'pixel-validation.json').write_text(json.dumps(records, indent=2), encoding='utf-8')


if __name__ == '__main__':
    main()
