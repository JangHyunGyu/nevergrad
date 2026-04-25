/**
 * 크로마키 배경 제거 스크립트
 * 녹색 또는 마젠타 배경 → 투명(알파) 처리
 *
 * 사용법:
 *   node remove-bg.js                                  # characters/ 전체 (자동 감지)
 *   node remove-bg.js --prefix sea                     # 세아만
 *   node remove-bg.js --file sea_angry.png             # 단일 파일
 *   node remove-bg.js --color magenta --prefix sea     # 마젠타 강제
 *   node remove-bg.js --color green --prefix eunsu     # 그린 강제
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CHAR_DIR = path.join(__dirname, 'assets/images/characters');

function detectColor(data, width, height, channels) {
    // 코너 4점 평균으로 배경색 추정
    const samples = [
        0,
        (width - 1) * channels,
        (height - 1) * width * channels,
        ((height - 1) * width + (width - 1)) * channels,
    ];
    let r = 0, g = 0, b = 0;
    for (const o of samples) {
        r += data[o];
        g += data[o + 1];
        b += data[o + 2];
    }
    r /= samples.length;
    g /= samples.length;
    b /= samples.length;
    if (g > 100 && g > r * 1.3 && g > b * 1.3) return 'green';
    if (r > 150 && b > 150 && Math.min(r, b) - g > 60) return 'magenta';
    return null;
}

async function removeChromaBg(inputPath, forceColor = null) {
    const { data, info } = await sharp(inputPath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const output = Buffer.from(data);
    const color = forceColor || detectColor(data, width, height, channels);
    if (!color) return { skipped: true };

    for (let i = 0; i < width * height; i++) {
        const offset = i * channels;
        const r = output[offset];
        const g = output[offset + 1];
        const b = output[offset + 2];

        if (color === 'green') {
            // green chromakey + spill 제거 (3단계)
            if (g > 100 && g > r * 1.4 && g > b * 1.4) {
                output[offset + 3] = 0;
            } else if (g > 80 && g > r * 1.2 && g > b * 1.2) {
                output[offset + 3] = Math.min(output[offset + 3], 80);
                output[offset + 1] = Math.round(g * 0.7 + r * 0.3);
            } else if (g > 60 && g > r * 1.05 && g > b * 1.05) {
                const ratio = (g - Math.max(r, b)) / g;
                output[offset + 3] = Math.min(output[offset + 3], Math.round(255 * (1 - ratio * 2)));
                output[offset + 1] = Math.round(g * 0.85 + ((r + b) / 2) * 0.15);
            }
        } else {
            // magenta chromakey + spill 제거 (3단계)
            const mDom = Math.min(r, b) - g;
            if (g < 60 && mDom > 100) {
                output[offset + 3] = 0;
            } else if (g < 110 && mDom > 60) {
                output[offset + 3] = Math.min(output[offset + 3], 80);
                // magenta spill: r/b 채널을 g 쪽으로 끌어내림
                output[offset] = Math.round(r * 0.7 + g * 0.3);
                output[offset + 2] = Math.round(b * 0.7 + g * 0.3);
            } else if (mDom > 30) {
                const ratio = mDom / Math.min(r, b);
                output[offset + 3] = Math.min(output[offset + 3], Math.round(255 * (1 - ratio * 2)));
                output[offset] = Math.round(r * 0.85 + g * 0.15);
                output[offset + 2] = Math.round(b * 0.85 + g * 0.15);
            }
        }
    }

    await sharp(output, { raw: { width, height, channels } })
        .png()
        .toFile(inputPath + '.tmp');

    fs.renameSync(inputPath + '.tmp', inputPath);
    return { color };
}

async function main() {
    const args = process.argv.slice(2);
    const prefix = args.includes('--prefix') ? args[args.indexOf('--prefix') + 1] : null;
    const singleFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;
    const forceColor = args.includes('--color') ? args[args.indexOf('--color') + 1] : null;

    let files;
    if (singleFile) {
        files = [singleFile];
    } else {
        files = fs.readdirSync(CHAR_DIR).filter(f => f.endsWith('.png'));
        if (prefix) files = files.filter(f => f.startsWith(prefix));
    }

    console.log(`\n배경 제거: ${files.length}개 파일${forceColor ? ` (강제: ${forceColor})` : ' (자동 감지)'}\n`);

    for (const file of files) {
        const fullPath = path.join(CHAR_DIR, file);
        try {
            const before = fs.statSync(fullPath).size;
            const result = await removeChromaBg(fullPath, forceColor);
            if (result.skipped) {
                console.log(`  SKIP ${file} (배경색 미감지)`);
                continue;
            }
            const after = fs.statSync(fullPath).size;
            console.log(`  OK ${file} [${result.color}] (${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB)`);
        } catch (e) {
            console.log(`  FAIL ${file}: ${e.message}`);
        }
    }

    console.log('\n완료');
}

main();
