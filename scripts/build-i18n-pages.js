/**
 * build-i18n-pages.js
 * 언어별 정적 HTML 페이지 생성 — SEO 크롤러가 각 언어 콘텐츠를 인식하도록
 *
 * 사용: node scripts/build-i18n-pages.js
 * 결과: /en/index.html, /ja/index.html, /es/index.html, /fr/index.html, /de/index.html, /pt-BR/index.html
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
        metaDesc: '転校初日、すべてが完璧だった。完璧すぎて、不気味なほどに。',
        keywords: '無料ビジュアルノベル, ブラウザゲーム 無料, ダウンロード不要 ゲーム, 学園ミステリー, 選択肢 ノベルゲーム, マルチエンディング, 桜 学園 ゲーム, アニメ風 インタラクティブ小説, ホラー ビジュアルノベル, 日本語対応 ノベルゲーム, Nevergrad',
        ogTitle: '卒業できない教室 | Nevergrad',
        twitterTitle: 'Nevergrad: 卒業できない教室',
        twitterDesc: 'ダウンロード不要で遊べる無料Webビジュアルノベル。桜の咲く学校で始まる5日間の記録。5人のヒロイン、7つのエンディング、7言語対応。',
        schemaName: '卒業できない教室 - 5日間の記録',
        schemaDesc: 'ダウンロード不要で遊べる無料Webビジュアルノベル。桜の咲く学校で始まる5日間の記録。5人のヒロイン、7つのエンディング、7言語対応。',
        subtitle: '5日間の記録',
        newGame: 'ニューゲーム', continue: 'つづきから', gallery: 'ギャラリー',
        namePrompt: 'あなたの名前は？', namePlaceholder: '名前を入力してください', start: 'スタート',
        save: 'セーブ', load: 'ロード', settings: '設定', toTitle: 'タイトルへ', resume: '戻る',
        ftPlaceholder: 'メッセージを入力...', ftSend: '送信',
        dayDisplay: '1日目 - 朝',
        galleryTitle: 'エンディングギャラリー', galleryProgress: '達成率', galleryBack: '戻る',
        backlogTitle: '会話ログ',
        slotTitle: 'セーブ',
        loadingText: '読み込み中...',
        rotateText: '端末を横向きにしてください<br>Please rotate your device',
        archerlabLabel: 'ArcherLab ホーム',
        fontHref: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
        fontOverride: ":root{--font-main:'Noto Sans JP','Noto Sans KR',sans-serif;}"
    },
    es: {
        locale: 'es_ES',
        title: 'El Aula Sin Graduación',
        metaTitle: 'Nevergrad - El Aula Sin Graduación',
        metaDesc: 'El primer día de transferencia, todo era perfecto. Demasiado perfecto para ser normal.',
        keywords: 'juego visual novel gratis en navegador, visual novel escolar sin descarga, juego de misterio escolar gratis, historia interactiva con decisiones, juego de finales múltiples, novela interactiva online, juego anime de instituto, visual novel en español, juego narrativo gratis, juego de terror psicológico escolar',
        ogTitle: 'El Aula Sin Graduación | Nevergrad',
        twitterTitle: 'Nevergrad: El Aula Sin Graduación',
        twitterDesc: 'Visual novel web gratis, sin descargas. Una historia de cinco días en una escuela cubierta de cerezos, con cinco heroínas, siete finales y siete idiomas.',
        schemaName: 'El Aula Sin Graduación - Registro de 5 Días',
        schemaDesc: 'Visual novel web gratis, sin descargas. Una historia de cinco días en una escuela cubierta de cerezos, con cinco heroínas, siete finales y siete idiomas.',
        subtitle: 'Registro de 5 Días',
        newGame: 'Nueva Partida', continue: 'Continuar', gallery: 'Galería',
        namePrompt: '¿Cuál es tu nombre?', namePlaceholder: 'Ingresa tu nombre', start: 'Iniciar',
        save: 'Guardar', load: 'Cargar', settings: 'Ajustes', toTitle: 'Título', resume: 'Volver',
        ftPlaceholder: 'Escribe un mensaje...', ftSend: 'Enviar',
        dayDisplay: 'Día 1 - Mañana',
        galleryTitle: 'Galería de finales', galleryProgress: 'Progreso', galleryBack: 'Volver',
        backlogTitle: 'Registro de diálogo',
        slotTitle: 'Guardar',
        loadingText: 'Cargando...',
        rotateText: 'Gira el dispositivo<br>al modo horizontal',
        archerlabLabel: 'Inicio de ArcherLab'
    },
    fr: {
        locale: 'fr_FR',
        title: 'La classe sans diplôme',
        metaTitle: 'Nevergrad - La classe sans diplôme',
        metaDesc: 'Le jour de mon transfert, tout était parfait. Trop parfait pour être normal.',
        keywords: 'visual novel gratuit en ligne, jeu narratif sans téléchargement, visual novel scolaire, mystère au lycée, histoire interactive à choix, jeu à fins multiples, romance scolaire sombre, visual novel en français, jeu web gratuit, thriller psychologique scolaire, Nevergrad',
        ogTitle: 'La classe sans diplôme | Nevergrad',
        twitterTitle: 'Nevergrad : La classe sans diplôme',
        twitterDesc: 'Visual novel web gratuit, sans téléchargement. Cinq jours dans une école en fleurs, cinq héroïnes, sept fins et une histoire où tout semble trop parfait.',
        schemaName: 'La classe sans diplôme - Journal de cinq jours',
        schemaDesc: 'Visual novel web gratuit, sans téléchargement. Cinq jours dans une école en fleurs, cinq héroïnes, sept fins et une histoire où tout semble trop parfait.',
        subtitle: 'Journal de cinq jours',
        newGame: 'Nouvelle partie', continue: 'Continuer', gallery: 'Galerie',
        namePrompt: 'Quel est votre nom ?', namePlaceholder: 'Entrez votre nom', start: 'Commencer',
        save: 'Sauvegarder', load: 'Charger', settings: 'Paramètres', toTitle: 'Écran titre', resume: 'Reprendre',
        ftPlaceholder: 'Écrivez un message...', ftSend: 'Envoyer',
        dayDisplay: 'Jour 1 - matin',
        galleryTitle: 'Galerie des fins', galleryProgress: 'Progression', galleryBack: 'Retour',
        backlogTitle: 'Historique des dialogues',
        slotTitle: 'Sauvegarder',
        loadingText: 'Chargement...',
        rotateText: 'Tournez votre appareil<br>en mode paysage',
        archerlabLabel: 'Accueil ArcherLab',
        fontHref: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap',
        fontOverride: ":root{--font-main:'Noto Sans','Noto Sans KR',sans-serif;}"
    },
    de: {
        locale: 'de_DE',
        title: 'Das Klassenzimmer ohne Abschluss',
        metaTitle: 'Nevergrad - Das Klassenzimmer ohne Abschluss',
        metaDesc: 'Der erste Tag nach dem Schulwechsel, alles war perfekt. Zu perfekt, um normal zu sein.',
        ogTitle: 'Das Klassenzimmer ohne Abschluss | Nevergrad',
        subtitle: 'Fünf-Tage-Protokoll',
        newGame: 'Neues Spiel', continue: 'Fortsetzen', gallery: 'Galerie',
        namePrompt: 'Wie heißt du?', namePlaceholder: 'Namen eingeben', start: 'Start',
        save: 'Speichern', load: 'Laden', settings: 'Einstellungen', toTitle: 'Titelbildschirm', resume: 'Zurück',
        ftPlaceholder: 'Nachricht eingeben...', ftSend: 'Senden',
        dayDisplay: 'Tag 1 - Morgen'
    },
    'pt-BR': {
        locale: 'pt_BR',
        title: 'A Sala de Aula Sem Formatura',
        metaTitle: 'Nevergrad - A Sala de Aula Sem Formatura',
        metaDesc: 'No primeiro dia de transferência, tudo estava perfeito. Perfeito demais para ser normal.',
        ogTitle: 'A Sala de Aula Sem Formatura | Nevergrad',
        subtitle: 'Registro de 5 Dias',
        newGame: 'Novo Jogo', continue: 'Continuar', gallery: 'Galeria',
        namePrompt: 'Qual é o seu nome?', namePlaceholder: 'Digite seu nome', start: 'Começar',
        save: 'Salvar', load: 'Carregar', settings: 'Configurações', toTitle: 'Título', resume: 'Voltar',
        ftPlaceholder: 'Digite uma mensagem...', ftSend: 'Enviar',
        dayDisplay: 'Dia 1 - Manhã'
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
    if (data.keywords) {
        html = html.replace(
            /<meta name="keywords" content="[^"]*">/,
            `<meta name="keywords" content="${data.keywords}">`
        );
    }

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
    if (data.twitterTitle) {
        html = html.replace(
            /<meta name="twitter:title" content="[^"]*">/,
            `<meta name="twitter:title" content="${data.twitterTitle}">`
        );
    }
    if (data.twitterDesc) {
        html = html.replace(
            /<meta name="twitter:description" content="[^"]*">/,
            `<meta name="twitter:description" content="${data.twitterDesc}">`
        );
    }
    if (data.schemaName) {
        html = html.replace(
            /"name": "[^"]*"/,
            `"name": "${data.schemaName}"`
        );
    }
    if (data.schemaDesc) {
        html = html.replace(
            /"description": "[^"]*"/,
            `"description": "${data.schemaDesc}"`
        );
    }
    if (data.fontHref) {
        html = html.replace(
            /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+" rel="stylesheet">/,
            `<link href="${data.fontHref}" rel="stylesheet">`
        );
    }

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
    if (data.galleryTitle) {
        html = html.replace(/(<span class="gallery-title">)[^<]*(<\/span>)/, `$1${data.galleryTitle}$2`);
    }
    if (data.galleryProgress) {
        html = html.replace(/(<span class="gallery-progress-label">)[^<]*(<\/span>)/, `$1${data.galleryProgress}$2`);
    }
    if (data.galleryBack) {
        html = html.replace(/(<button id="gallery-back" class="menu-btn">)[^<]*(<\/button>)/, `$1${data.galleryBack}$2`);
    }
    if (data.backlogTitle) {
        html = html.replace(/(<span class="backlog-title">)[^<]*(<\/span>)/, `$1${data.backlogTitle}$2`);
    }
    if (data.slotTitle) {
        html = html.replace(/(<span id="sl-title" class="sl-title">)[^<]*(<\/span>)/, `$1${data.slotTitle}$2`);
    }
    if (data.loadingText) {
        html = html.replace(/(<div id="loading-text" class="loading-text">)[^<]*(<\/div>)/, `$1${data.loadingText}$2`);
    }
    if (data.rotateText) {
        html = html.replace(/(<div class="rotate-text">)[\s\S]*?(<\/div>)/, `$1${data.rotateText}$2`);
    }
    if (data.archerlabLabel) {
        html = html.replace(/aria-label="ArcherLab [^"]*"/, `aria-label="${data.archerlabLabel}"`);
    }
    if (data.fontOverride) {
        html = html.replace(
            '    <!-- JSON-LD Schema -->',
            `    <style>${data.fontOverride}</style>\n\n    <!-- JSON-LD Schema -->`
        );
    }

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
