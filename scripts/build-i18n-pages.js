/**
 * build-i18n-pages.js
 * 언어별 정적 HTML 페이지 생성 — SEO 크롤러가 각 언어 콘텐츠를 인식하도록
 *
 * 사용: node scripts/build-i18n-pages.js
 * 결과: /en/index.html, /ja/index.html, /es/index.html, /fr/index.html, /de/index.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://nevergrad.archerlab.dev';

const LANGS = {
    en: {
        locale: 'en_US',
        title: 'The Classroom of No Graduation',
        metaTitle: 'Nevergrad - The Classroom of No Graduation',
        metaDesc: 'The first day of transfer, everything was perfect. Too perfect to be normal.',
        ogTitle: 'The Classroom of No Graduation | Nevergrad',
        subtitle: '5 Days Record',
        newGame: 'New Game', continue: 'Continue', gallery: 'Gallery',
        namePrompt: 'What is your name?', namePlaceholder: 'Enter your name', start: 'Start',
        save: 'Save', load: 'Load', settings: 'Settings', toTitle: 'Title', resume: 'Resume',
        ftPlaceholder: 'Type a message...', ftSend: 'Send',
        dayDisplay: 'Day 1 - Morning'
    },
    ja: {
        locale: 'ja_JP',
        title: '卒業できない教室',
        metaTitle: 'Nevergrad - 卒業できない教室',
        metaDesc: '転校初日、すべてが完璧だった。完璧すぎて不思議なほどに。',
        ogTitle: '卒業できない教室 | Nevergrad',
        subtitle: '5日間の記録',
        newGame: 'ニューゲーム', continue: 'つづきから', gallery: 'ギャラリー',
        namePrompt: 'あなたの名前は？', namePlaceholder: '名前を入力してください', start: 'スタート',
        save: 'セーブ', load: 'ロード', settings: '設定', toTitle: 'タイトルへ', resume: '戻る',
        ftPlaceholder: 'メッセージを入力...', ftSend: '送信',
        dayDisplay: '1日目 - 朝'
    },
    es: {
        locale: 'es_ES',
        title: 'El Aula Sin Graduación',
        metaTitle: 'Nevergrad - El Aula Sin Graduación',
        metaDesc: 'El primer día de transferencia, todo era perfecto. Demasiado perfecto para ser normal.',
        ogTitle: 'El Aula Sin Graduación | Nevergrad',
        subtitle: 'Registro de 5 Días',
        newGame: 'Nueva Partida', continue: 'Continuar', gallery: 'Galería',
        namePrompt: '¿Cuál es tu nombre?', namePlaceholder: 'Ingresa tu nombre', start: 'Iniciar',
        save: 'Guardar', load: 'Cargar', settings: 'Ajustes', toTitle: 'Título', resume: 'Volver',
        ftPlaceholder: 'Escribe un mensaje...', ftSend: 'Enviar',
        dayDisplay: 'Día 1 - Mañana'
    },
    fr: {
        locale: 'fr_FR',
        title: 'La Classe Sans Diplôme',
        metaTitle: 'Nevergrad - La Classe Sans Diplôme',
        metaDesc: 'Le premier jour de transfert, tout était parfait. Trop parfait pour être normal.',
        ogTitle: 'La Classe Sans Diplôme | Nevergrad',
        subtitle: 'Chronique de 5 Jours',
        newGame: 'Nouvelle Partie', continue: 'Continuer', gallery: 'Galerie',
        namePrompt: 'Quel est votre nom ?', namePlaceholder: 'Entrez votre nom', start: 'Commencer',
        save: 'Sauvegarder', load: 'Charger', settings: 'Paramètres', toTitle: 'Titre', resume: 'Retour',
        ftPlaceholder: 'Écrivez un message...', ftSend: 'Envoyer',
        dayDisplay: 'Jour 1 - Matin'
    },
    de: {
        locale: 'de_DE',
        title: 'Das Klassenzimmer ohne Abschluss',
        metaTitle: 'Nevergrad - Das Klassenzimmer ohne Abschluss',
        metaDesc: 'Der erste Tag nach dem Schulwechsel, alles war perfekt. Zu perfekt, um normal zu sein.',
        ogTitle: 'Das Klassenzimmer ohne Abschluss | Nevergrad',
        subtitle: 'Aufzeichnung von 5 Tagen',
        newGame: 'Neues Spiel', continue: 'Fortsetzen', gallery: 'Galerie',
        namePrompt: 'Wie heißt du?', namePlaceholder: 'Namen eingeben', start: 'Start',
        save: 'Speichern', load: 'Laden', settings: 'Einstellungen', toTitle: 'Titelbildschirm', resume: 'Zurück',
        ftPlaceholder: 'Nachricht eingeben...', ftSend: 'Senden',
        dayDisplay: 'Tag 1 - Morgen'
    }
};

// hreflang 블록 생성 (경로 기반)
function buildHreflangBlock() {
    const lines = [];
    lines.push(`    <link rel="alternate" hreflang="ko" href="${BASE_URL}/">`);
    for (const lang of Object.keys(LANGS)) {
        lines.push(`    <link rel="alternate" hreflang="${lang}" href="${BASE_URL}/${lang}/">`);
    }
    lines.push(`    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`);
    return lines.join('\n');
}

function buildPage(lang, data) {
    const template = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
    const hreflangBlock = buildHreflangBlock();

    let html = template;

    // <html lang>
    html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);

    // <title>
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${data.metaTitle}</title>`);

    // <meta name="description">
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${data.metaDesc}">`
    );

    // canonical
    html = html.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${BASE_URL}/${lang}/">`
    );

    // hreflang 블록 교체
    html = html.replace(
        /    <link rel="alternate" hreflang="ko"[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*>/,
        hreflangBlock
    );

    // OG tags
    html = html.replace(
        /<meta property="og:title" content="[^"]*">/,
        `<meta property="og:title" content="${data.ogTitle}">`
    );
    html = html.replace(
        /<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${data.metaDesc}">`
    );
    html = html.replace(
        /<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${BASE_URL}/${lang}/">`
    );
    html = html.replace(
        /<meta property="og:locale" content="[^"]*">/,
        `<meta property="og:locale" content="${data.locale}">`
    );

    // 정적 HTML 텍스트를 해당 언어로 교체
    html = html.replace(
        /<h1 class="title-text">[^<]*<\/h1>/,
        `<h1 class="title-text">${data.title}</h1>`
    );
    html = html.replace(
        /<p class="title-subtitle">[^<]*<\/p>/,
        `<p class="title-subtitle">${data.subtitle}</p>`
    );
    html = html.replace(
        /(<button id="btn-new-game" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.newGame}$2`
    );
    html = html.replace(
        /(<button id="btn-continue" class="menu-btn"[^>]*>)[^<]*(<\/button>)/,
        `$1${data.continue}$2`
    );
    html = html.replace(
        /(<button id="btn-gallery" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.gallery}$2`
    );
    html = html.replace(
        /(<p class="name-prompt">)[^<]*(<\/p>)/,
        `$1${data.namePrompt}$2`
    );
    html = html.replace(
        /(<input type="text" id="player-name-input"[^>]*) placeholder="[^"]*"/,
        `$1 placeholder="${data.namePlaceholder}"`
    );
    html = html.replace(
        /(<button id="btn-start" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.start}$2`
    );
    html = html.replace(
        /(<button id="btn-save" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.save}$2`
    );
    html = html.replace(
        /(<button id="btn-load" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.load}$2`
    );
    html = html.replace(
        /(<button id="btn-settings" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.settings}$2`
    );
    html = html.replace(
        /(<button id="btn-title" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.toTitle}$2`
    );
    html = html.replace(
        /(<button id="btn-resume" class="menu-btn">)[^<]*(<\/button>)/,
        `$1${data.resume}$2`
    );
    html = html.replace(
        /(<input type="text" id="ft-input") placeholder="[^"]*"/,
        `$1 placeholder="${data.ftPlaceholder}"`
    );
    html = html.replace(
        /(<button id="ft-send" class="ft-send-btn">)[^<]*(<\/button>)/,
        `$1${data.ftSend}$2`
    );
    html = html.replace(
        /(<div id="day-display" class="day-display">)[^<]*(<\/div>)/,
        `$1${data.dayDisplay}$2`
    );

    // 상대 경로를 한 단계 위로 (assets/ → ../assets/)
    html = html.replace(/href="assets\//g, 'href="../assets/');
    html = html.replace(/src="assets\//g, 'src="../assets/');

    // 언어 강제 지정 스크립트 삽입 (첫 번째 <script> 앞에)
    html = html.replace(
        '    <!-- Config & Data -->',
        `    <!-- Language override -->\n    <script>window.__NEVERGRAD_LANG__='${lang}';</script>\n\n    <!-- Config & Data -->`
    );

    return html;
}

// 실행
console.log('Building i18n pages...');

for (const [lang, data] of Object.entries(LANGS)) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const html = buildPage(lang, data);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    console.log(`  ✓ /${lang}/index.html`);
}

// sitemap.xml 업데이트
const sitemapLangs = ['ko', ...Object.keys(LANGS)];
const sitemapLinks = sitemapLangs.map(l => {
    const href = l === 'ko' ? `${BASE_URL}/` : `${BASE_URL}/${l}/`;
    return `        <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`;
}).join('\n');
const sitemapXdefault = `        <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>`;

const sitemapUrls = [];
// 기본(ko) URL
sitemapUrls.push(`    <url>
        <loc>${BASE_URL}/</loc>
${sitemapLinks}
${sitemapXdefault}
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>`);

// 각 언어 URL
for (const lang of Object.keys(LANGS)) {
    sitemapUrls.push(`    <url>
        <loc>${BASE_URL}/${lang}/</loc>
${sitemapLinks}
${sitemapXdefault}
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf-8');
console.log('  ✓ sitemap.xml updated');

// 메인 index.html의 hreflang도 경로 기반으로 업데이트
let mainHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const mainHreflang = buildHreflangBlock();
mainHtml = mainHtml.replace(
    /    <link rel="alternate" hreflang="ko"[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*>/,
    mainHreflang
);
fs.writeFileSync(path.join(ROOT, 'index.html'), mainHtml, 'utf-8');
console.log('  ✓ index.html hreflang updated');

console.log('\nDone! All language pages generated.');
