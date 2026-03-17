/**
 * 크로마키 배경 제거 스크립트
 * 밝은 초록색 배경 → 투명(알파) 처리
 *
 * 사용법:
 *   node remove-bg.js                      # characters/ 전체
 *   node remove-bg.js --prefix eunsu       # 은수만
 *   node remove-bg.js --file eunsu_normal.png  # 단일 파일
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CHAR_DIR = path.join(__dirname, 'assets/images/characters');

async function removeGreenBg(inputPath) {
    const { data, info } = await sharp(inputPath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const output = Buffer.from(data);

    for (let i = 0; i < width * height; i++) {
        const offset = i * channels;
        const r = output[offset];
        const g = output[offset + 1];
        const b = output[offset + 2];

        // 초록색 크로마키 감지
        // 배경색 샘플: R:150 G:210 B:147 범위
        const gDominance = g - Math.max(r, b);  // G가 얼마나 우세한지
        const isGreen = g > 120 && gDominance > 20;
        const isStrongGreen = g > 150 && gDominance > 40;

        if (isStrongGreen) {
            output[offset + 3] = 0; // 완전 투명
        } else if (isGreen) {
            // 엣지 스무딩: gDominance에 비례하여 투명도
            const alpha = Math.round(Math.max(0, 255 - (gDominance - 20) * 12.75));
            output[offset + 3] = Math.min(output[offset + 3], alpha);
        }
    }

    await sharp(output, { raw: { width, height, channels } })
        .png()
        .toFile(inputPath + '.tmp');

    fs.renameSync(inputPath + '.tmp', inputPath);
}

async function main() {
    const args = process.argv.slice(2);
    const prefix = args.includes('--prefix') ? args[args.indexOf('--prefix') + 1] : null;
    const singleFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

    let files;
    if (singleFile) {
        files = [singleFile];
    } else {
        files = fs.readdirSync(CHAR_DIR).filter(f => f.endsWith('.png'));
        if (prefix) files = files.filter(f => f.startsWith(prefix));
    }

    console.log(`\n🎨 배경 제거: ${files.length}개 파일\n`);

    for (const file of files) {
        const fullPath = path.join(CHAR_DIR, file);
        try {
            const before = fs.statSync(fullPath).size;
            await removeGreenBg(fullPath);
            const after = fs.statSync(fullPath).size;
            console.log(`  ✅ ${file} (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB)`);
        } catch (e) {
            console.log(`  ❌ ${file}: ${e.message}`);
        }
    }

    console.log('\n완료!');
}

main();
