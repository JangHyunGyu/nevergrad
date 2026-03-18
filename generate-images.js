/**
 * Nevergrad 이미지 일괄 생성 스크립트
 * Gemini 3.1 Flash Image Preview (Nano Banana 2) 사용
 *
 * 사용법:
 *   export GEMINI_API_KEY=your_key_here
 *   node generate-images.js              # 전체 생성
 *   node generate-images.js --skip 5     # 처음 5개 건너뛰고 시작
 *   node generate-images.js --only bg    # 배경만 생성
 *   node generate-images.js --only char  # 캐릭터만 생성
 *   node generate-images.js --dry-run    # 실제 API 호출 없이 목록만 확인
 */
const fs = require('fs');
const path = require('path');

// .env 로드 (프로젝트 루트 → 워크스페이스 루트 순서)
function loadEnv() {
    const candidates = [
        path.join(__dirname, '.env'),
        path.resolve(__dirname, '..', '.env')
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) {
            for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                    const [k, ...v] = trimmed.split('=');
                    if (!process.env[k.trim()]) process.env[k.trim()] = v.join('=').trim();
                }
            }
        }
    }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('❌ GEMINI_API_KEY 환경변수를 설정해주세요.');
    console.error('   ../. env 또는 .env에 GEMINI_API_KEY=your_key 추가');
    process.exit(1);
}

// 모델: _normal/배경 → Imagen 4, 표정 변형 → Gemini 3.1 Flash
const FLASH_MODEL = 'gemini-3.1-flash-image-preview';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';
const FLASH_URL = `https://generativelanguage.googleapis.com/v1beta/models/${FLASH_MODEL}:generateContent?key=${API_KEY}`;
const IMAGEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${API_KEY}`;
const DELAY_MS = 5000; // API 호출 간 딜레이 (rate limit 대비)
const MAX_RETRIES = 3;

const CHAR_DIR = path.join(__dirname, 'assets/images/characters');
const BG_DIR = path.join(__dirname, 'assets/images/background');

// ═══════════════════════════════════════════
// PROMPTS_READY.md 파싱
// ═══════════════════════════════════════════
function parsePrompts() {
    const md = fs.readFileSync(path.join(__dirname, 'PROMPTS_READY.md'), 'utf8');
    const lines = md.split('\n');

    const images = [];
    let currentFile = null;
    let currentType = null; // 'char' | 'bg'
    let inPrompt = false;
    let inNegative = false;
    let promptLines = [];
    let negativeLines = [];
    let codeBlockCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 섹션 감지: 캐릭터 vs 배경 vs BGM(무시)
        if (/^## \d+\. /.test(line) && !/^## \d+\. BGM/.test(line) && !/^## \d+\. SFX/.test(line)) {
            // 섹션 전환 전에 이전 파일 저장
            if (currentFile && promptLines.length > 0) {
                images.push({
                    file: currentFile,
                    type: currentType,
                    prompt: promptLines.join(' ').trim(),
                    negative: negativeLines.join(' ').trim()
                });
                currentFile = null;
                promptLines = [];
                negativeLines = [];
            }
            if (/배경/.test(line)) {
                currentType = 'bg';
            } else {
                currentType = 'char';
            }
            continue;
        }
        // BGM/SFX 섹션부터는 이미지 아님 → 중단
        if (/^## \d+\. BGM/.test(line) || /^## \d+\. SFX/.test(line) ||
            /^## BGM/.test(line) || /^## SFX/.test(line) ||
            /^### .*\.mp3/.test(line)) {
            if (currentFile && promptLines.length > 0) {
                images.push({
                    file: currentFile,
                    type: currentType,
                    prompt: promptLines.join(' ').trim(),
                    negative: negativeLines.join(' ').trim()
                });
            }
            break;
        }

        // ### filename.png
        if (/^### .+\.png/.test(line)) {
            // 이전 항목 저장
            if (currentFile && promptLines.length > 0) {
                images.push({
                    file: currentFile,
                    type: currentType,
                    prompt: promptLines.join(' ').trim(),
                    negative: negativeLines.join(' ').trim()
                });
            }
            currentFile = line.replace(/^### /, '').replace(/\s*\(.*\)/, '').trim();
            // classmate.png은 캐릭터
            if (currentFile === 'classmate.png') currentType = 'char';
            promptLines = [];
            negativeLines = [];
            codeBlockCount = 0;
            inPrompt = false;
            inNegative = false;
            continue;
        }

        // 코드 블럭 감지
        if (line.trim() === '```') {
            codeBlockCount++;
            if (codeBlockCount === 1) { inPrompt = true; continue; }
            if (codeBlockCount === 2) { inPrompt = false; continue; }
            if (codeBlockCount === 3) { inNegative = true; continue; }
            if (codeBlockCount === 4) { inNegative = false; continue; }
            continue;
        }

        if (inPrompt) promptLines.push(line);
        if (inNegative) negativeLines.push(line);
    }

    // 마지막 항목 (BGM break로 안 잡힌 경우만)
    if (currentFile && promptLines.length > 0) {
        const alreadyAdded = images.some(img => img.file === currentFile);
        if (!alreadyAdded) {
            images.push({
                file: currentFile,
                type: currentType,
                prompt: promptLines.join(' ').trim(),
                negative: negativeLines.join(' ').trim()
            });
        }
    }

    return images;
}

// ═══════════════════════════════════════════
// Gemini API 호출
// ═══════════════════════════════════════════
async function generateImage(prompt, negative, aspectRatio, imageSize, refImagePath) {
    let fullPrompt = negative
        ? `${prompt}\n\nAvoid the following: ${negative}`
        : prompt;

    const parts = [];

    // 참조 이미지가 있으면 첨부 + 프롬프트 수정
    if (refImagePath && fs.existsSync(refImagePath)) {
        const refData = fs.readFileSync(refImagePath).toString('base64');
        parts.push({
            inlineData: {
                mimeType: 'image/png',
                data: refData
            }
        });
        fullPrompt = `Using this reference character image, generate the same character (same face, same hair, same body, same outfit) but with a different expression and mood as described below. Keep the character's identity perfectly consistent.\n\n${fullPrompt}`;
    }

    parts.push({ text: fullPrompt });

    const body = {
        contents: [{ parts: parts }],
        generationConfig: {
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspectRatio,
                imageSize: imageSize
            }
        }
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API ${res.status}: ${errText}`);
    }

    const data = await res.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('No candidates in response: ' + JSON.stringify(data).slice(0, 500));
    }

    for (const part of data.candidates[0].content.parts) {
        if (part.inlineData) {
            return Buffer.from(part.inlineData.data, 'base64');
        }
    }

    throw new Error('No image in response: ' + JSON.stringify(data).slice(0, 500));
}

// ═══════════════════════════════════════════
// 메인
// ═══════════════════════════════════════════
async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const onlyType = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
    const prefix = args.includes('--prefix') ? args[args.indexOf('--prefix') + 1] : null;
    const skipCount = args.includes('--skip') ? parseInt(args[args.indexOf('--skip') + 1]) : 0;

    // 디렉토리 생성
    if (!fs.existsSync(CHAR_DIR)) fs.mkdirSync(CHAR_DIR, { recursive: true });
    if (!fs.existsSync(BG_DIR)) fs.mkdirSync(BG_DIR, { recursive: true });

    const allImages = parsePrompts();

    // 필터
    let images = allImages;
    if (onlyType) {
        images = images.filter(img => img.type === onlyType);
    }
    if (prefix) {
        images = images.filter(img => img.file.startsWith(prefix));
    }

    // black.png, title_bg.png 제외 (이미 존재)
    images = images.filter(img => !['black.png', 'title_bg.png'].includes(img.file));

    // 이미 존재하는 파일 건너뛰기
    images = images.filter(img => {
        const dir = img.type === 'char' ? CHAR_DIR : BG_DIR;
        const exists = fs.existsSync(path.join(dir, img.file));
        if (exists) console.log(`⏭ ${img.file} — 이미 존재, 건너뜀`);
        return !exists;
    });

    if (skipCount > 0) {
        console.log(`⏭ 처음 ${skipCount}개 건너뜀\n`);
        images = images.slice(skipCount);
    }

    console.log(`\n══════════ NEVERGRAD IMAGE GENERATOR ══════════`);
    console.log(`모델: ${MODEL}`);
    console.log(`대상: ${images.length}개 이미지 (캐릭터: ${images.filter(i => i.type === 'char').length}, 배경: ${images.filter(i => i.type === 'bg').length})`);
    console.log(`딜레이: ${DELAY_MS}ms`);
    console.log(`예상 시간: ~${Math.ceil(images.length * (DELAY_MS + 3000) / 60000)}분\n`);

    if (dryRun) {
        console.log('📋 [DRY RUN] 생성 대상 목록:\n');
        images.forEach((img, i) => {
            const dir = img.type === 'char' ? 'characters/' : 'background/';
            console.log(`  ${i + 1}. ${dir}${img.file}`);
        });
        console.log(`\n총 ${images.length}개`);
        return;
    }

    let success = 0;
    let fail = 0;

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const dir = img.type === 'char' ? CHAR_DIR : BG_DIR;
        const outPath = path.join(dir, img.file);
        const aspectRatio = img.type === 'char' ? '3:4' : '16:9';
        const imageSize = '1K';

        // 캐릭터 참조 이미지: 같은 캐릭터의 _normal.png가 있으면 참조
        let refImagePath = null;
        if (img.type === 'char' && !img.file.endsWith('_normal.png')) {
            const charId = img.file.split('_')[0];
            const normalPath = path.join(CHAR_DIR, charId + '_normal.png');
            if (fs.existsSync(normalPath)) {
                refImagePath = normalPath;
            }
        }

        const refTag = refImagePath ? ' [ref: ' + path.basename(refImagePath) + ']' : '';
        console.log(`[${i + 1}/${images.length}] ${img.type === 'char' ? '👤' : '🏞'} ${img.file} (${aspectRatio}, ${imageSize})${refTag}`);

        let lastError = null;
        for (let retry = 0; retry < MAX_RETRIES; retry++) {
            try {
                const buffer = await generateImage(img.prompt, img.negative, aspectRatio, imageSize, refImagePath);
                fs.writeFileSync(outPath, buffer);
                console.log(`  ✅ 저장 완료 (${(buffer.length / 1024).toFixed(0)}KB)`);
                success++;
                lastError = null;
                break;
            } catch (e) {
                lastError = e;
                console.log(`  ⚠ 시도 ${retry + 1}/${MAX_RETRIES} 실패: ${e.message.slice(0, 200)}`);
                if (retry < MAX_RETRIES - 1) {
                    const waitMs = DELAY_MS * (retry + 2);
                    console.log(`  ⏳ ${waitMs / 1000}초 후 재시도...`);
                    await sleep(waitMs);
                }
            }
        }

        if (lastError) {
            console.log(`  ❌ 최종 실패: ${img.file}`);
            fail++;
        }

        // 다음 요청 전 딜레이
        if (i < images.length - 1) {
            await sleep(DELAY_MS);
        }
    }

    console.log(`\n══════════ 완료 ══════════`);
    console.log(`✅ 성공: ${success}개`);
    if (fail > 0) console.log(`❌ 실패: ${fail}개`);
    console.log(`\n다음 단계: node validate.js 실행하여 누락 파일 확인`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(e => {
    console.error('Fatal:', e);
    process.exit(1);
});
