// 캐릭터 PNG → WebP 일괄 변환 (sharp)
// 사용: node scripts/convert_characters_to_webp.js
// - assets/images/characters/*.png 만 대상 (backup/ 등 하위 폴더 제외)
// - 같은 파일명으로 .webp 생성, 이미 있으면 PNG 가 더 새것일 때만 갱신
// - quality 82 / effort 6 (배경 변환과 같은 톤의 압축률)

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.resolve(__dirname, '..', 'assets', 'images', 'characters');
const QUALITY = 82;
const EFFORT = 6;

async function main() {
    const entries = fs.readdirSync(DIR, { withFileTypes: true });
    const pngs = entries
        .filter(e => e.isFile() && /\.png$/i.test(e.name))
        .map(e => e.name)
        .sort();

    let converted = 0, skipped = 0, totalBefore = 0, totalAfter = 0;

    for (const name of pngs) {
        const pngPath = path.join(DIR, name);
        const webpPath = path.join(DIR, name.replace(/\.png$/i, '.webp'));
        const pngStat = fs.statSync(pngPath);

        if (fs.existsSync(webpPath)) {
            const webpStat = fs.statSync(webpPath);
            if (webpStat.mtimeMs >= pngStat.mtimeMs) {
                skipped++;
                totalBefore += pngStat.size;
                totalAfter += webpStat.size;
                continue;
            }
        }

        await sharp(pngPath)
            .webp({ quality: QUALITY, effort: EFFORT })
            .toFile(webpPath);

        const webpStat = fs.statSync(webpPath);
        const ratio = ((1 - webpStat.size / pngStat.size) * 100).toFixed(1);
        console.log(`  ${name}  ${(pngStat.size / 1024).toFixed(0)}KB → ${(webpStat.size / 1024).toFixed(0)}KB  (-${ratio}%)`);
        converted++;
        totalBefore += pngStat.size;
        totalAfter += webpStat.size;
    }

    console.log('');
    console.log(`변환 완료: ${converted}개 신규, ${skipped}개 스킵 (이미 최신)`);
    console.log(`전체 사이즈: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
}

main().catch(err => {
    console.error('변환 실패:', err);
    process.exit(1);
});
