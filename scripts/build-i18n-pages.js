/**
 * build-i18n-pages.js
 * 언어별 정적 HTML 페이지 생성 — SEO 크롤러가 각 언어 콘텐츠를 인식하도록
 *
 * 사용: node scripts/build-i18n-pages.js
 * 결과: /en/index.html, /ja/index.html, /es/index.html, /fr/index.html, /de/index.html, /pt/index.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://nevergrad.archerlab.dev';

const LANGS = {
    en: {
        locale: 'en_US',
        title: 'The Classroom That Never Graduates',
        metaTitle: 'Nevergrad - Free Browser Visual Novel, No Download',
        metaDesc: 'Play Nevergrad, a free school mystery visual novel in your browser with no download. Five days of choices, five heroines, seven endings, and multilingual support.',
        ogTitle: 'Nevergrad | Free Browser Visual Novel',
        subtitle: 'Five-Day Record',
        newGame: 'New Game', continue: 'Continue', gallery: 'Gallery',
        namePrompt: 'What is your name?', namePlaceholder: 'Enter your name', start: 'Start',
        save: 'Save', load: 'Load', settings: 'Settings', toTitle: 'Title Screen', resume: 'Resume',
        settingsBgm: 'BGM Volume', settingsSfx: 'SFX Volume', settingsTextSpeed: 'Text Speed',
        settingsFullscreen: 'Fullscreen', settingsReset: 'Reset', settingsOff: 'OFF',
        ftPlaceholder: 'Type a message...', ftSend: 'Send',
        dayDisplay: 'Day 1 - Morning',
        keywords: 'free visual novel, browser visual novel, no download visual novel, free school mystery game, psychological horror visual novel, choice based story game, multiple endings game, online interactive novel, anime school game, Nevergrad',
        twitterTitle: 'Nevergrad: Free Browser Visual Novel',
        twitterDesc: 'Play a free school mystery visual novel in your browser with no download. Five days, five heroines, seven endings.',
        schemaName: 'Nevergrad: The Classroom That Never Graduates',
        schemaDesc: 'Play Nevergrad, a free school mystery visual novel in your browser with no download. Five days of choices, five heroines, seven endings, and multilingual support.',
        galleryTitle: 'Ending Gallery',
        galleryProgress: 'Completion',
        galleryBack: 'Back',
        backlogTitle: 'Dialogue History',
        slotTitle: 'Save',
        loadingText: 'Loading...',
        rotateText: 'Rotate your device<br>to landscape mode',
        archerlabLabel: 'ArcherLab Home',
        koOptionLabel: '한국어'
    },
    ja: {
        locale: 'ja_JP',
        title: '卒業できない教室',
        metaTitle: 'Nevergrad - 無料ブラウザビジュアルノベル',
        metaDesc: 'ダウンロード不要でブラウザからすぐ遊べる無料の学園ミステリー・ビジュアルノベル。5日間の選択、5人のヒロイン、7つのエンディング、7言語に対応。',
        keywords: '無料ビジュアルノベル, ブラウザ ビジュアルノベル, ダウンロード不要 ノベルゲーム, 学園ミステリー ゲーム, ホラー ビジュアルノベル 無料, 選択肢 ノベルゲーム, マルチエンディング, Nevergrad',
        ogTitle: 'Nevergrad | 無料ブラウザビジュアルノベル',
        twitterTitle: 'Nevergrad: 無料ブラウザビジュアルノベル',
        twitterDesc: 'ダウンロード不要で遊べる無料の学園ミステリー・ビジュアルノベル。5日間、5人のヒロイン、7つのエンディング。7言語対応。',
        schemaName: 'Nevergrad: 卒業できない教室',
        schemaDesc: 'ダウンロード不要でブラウザからすぐ遊べる無料の学園ミステリー・ビジュアルノベル。5日間の選択、5人のヒロイン、7つのエンディング、7言語に対応。',
        subtitle: '5日間の記録',
        newGame: 'ニューゲーム', continue: 'つづきから', gallery: 'ギャラリー',
        namePrompt: 'あなたの名前は？', namePlaceholder: '名前を入力してください', start: 'スタート',
        save: 'セーブ', load: 'ロード', settings: '設定', toTitle: 'タイトルへ', resume: '戻る',
        settingsBgm: 'BGM 音量', settingsSfx: '効果音 音量', settingsTextSpeed: 'テキスト速度',
        settingsFullscreen: 'フルスクリーン', settingsReset: 'リセット', settingsOff: 'OFF',
        ftPlaceholder: 'メッセージを入力...', ftSend: '送信',
        dayDisplay: '1日目 - 朝',
        galleryTitle: 'エンディングギャラリー', galleryProgress: '達成率', galleryBack: '戻る',
        backlogTitle: '会話ログ',
        slotTitle: 'セーブ',
        loadingText: '読み込み中...',
        rotateText: '端末を横向きにしてください',
        archerlabLabel: 'ArcherLab ホーム',
        koOptionLabel: '韓国語',
        fontHref: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
        fontOverride: ":root{--font-main:'Noto Sans JP','Noto Sans KR',sans-serif;}"
    },
    es: {
        locale: 'es_ES',
        title: 'El Aula Sin Graduación',
        metaTitle: 'Nevergrad - Visual Novel Gratis en Navegador',
        metaDesc: 'Juega Nevergrad, una visual novel escolar de misterio gratis y sin descarga. Cinco días de decisiones, cinco heroínas, siete finales y soporte multilingüe.',
        keywords: 'visual novel gratis, visual novel en navegador, visual novel sin descarga, juego de misterio escolar gratis, novela visual de terror psicológico, juego narrativo con decisiones, juego con múltiples finales, Nevergrad',
        ogTitle: 'Nevergrad | Visual Novel Gratis en Navegador',
        twitterTitle: 'Nevergrad: Visual Novel Gratis en Navegador',
        twitterDesc: 'Una visual novel escolar de misterio gratis, sin descarga. Cinco días, cinco heroínas y siete finales.',
        schemaName: 'Nevergrad: El Aula Sin Graduación',
        schemaDesc: 'Juega Nevergrad, una visual novel escolar de misterio gratis y sin descarga. Cinco días de decisiones, cinco heroínas, siete finales y soporte multilingüe.',
        subtitle: 'Registro de 5 Días',
        newGame: 'Nueva Partida', continue: 'Continuar', gallery: 'Galería',
        namePrompt: '¿Cuál es tu nombre?', namePlaceholder: 'Ingresa tu nombre', start: 'Iniciar',
        save: 'Guardar', load: 'Cargar', settings: 'Ajustes', toTitle: 'Título', resume: 'Volver',
        settingsBgm: 'Volumen BGM', settingsSfx: 'Volumen efectos', settingsTextSpeed: 'Velocidad de texto',
        settingsFullscreen: 'Pantalla completa', settingsReset: 'Restablecer', settingsOff: 'OFF',
        ftPlaceholder: 'Escribe un mensaje...', ftSend: 'Enviar',
        dayDisplay: 'Día 1 - Mañana',
        galleryTitle: 'Galería de finales', galleryProgress: 'Progreso', galleryBack: 'Volver',
        backlogTitle: 'Registro de diálogo',
        slotTitle: 'Guardar',
        loadingText: 'Cargando...',
        rotateText: 'Gira el dispositivo<br>al modo horizontal',
        archerlabLabel: 'Inicio de ArcherLab',
        koOptionLabel: 'Coreano'
    },
    fr: {
        locale: 'fr_FR',
        title: 'La classe sans diplôme',
        metaTitle: 'Nevergrad - Visual Novel Gratuit en Navigateur',
        metaDesc: 'Jouez à Nevergrad, un visual novel scolaire mystère gratuit sans téléchargement. Cinq jours de choix, cinq héroïnes, sept fins et prise en charge multilingue.',
        keywords: 'visual novel gratuit, visual novel navigateur, visual novel sans téléchargement, jeu mystère scolaire gratuit, visual novel horreur psychologique, histoire interactive à choix, jeu à fins multiples, Nevergrad',
        ogTitle: 'Nevergrad | Visual Novel Gratuit en Navigateur',
        twitterTitle: 'Nevergrad : Visual Novel Gratuit en Navigateur',
        twitterDesc: 'Un visual novel scolaire mystère gratuit, sans téléchargement. Cinq jours, cinq héroïnes et sept fins.',
        schemaName: 'Nevergrad: La classe sans diplôme',
        schemaDesc: 'Jouez à Nevergrad, un visual novel scolaire mystère gratuit sans téléchargement. Cinq jours de choix, cinq héroïnes, sept fins et prise en charge multilingue.',
        subtitle: 'Journal de cinq jours',
        newGame: 'Nouvelle partie', continue: 'Continuer', gallery: 'Galerie',
        namePrompt: 'Quel est votre nom ?', namePlaceholder: 'Entrez votre nom', start: 'Commencer',
        save: 'Sauvegarder', load: 'Charger', settings: 'Paramètres', toTitle: 'Écran titre', resume: 'Reprendre',
        settingsBgm: 'Volume BGM', settingsSfx: 'Volume effets', settingsTextSpeed: 'Vitesse du texte',
        settingsFullscreen: 'Plein écran', settingsReset: 'Réinitialiser', settingsOff: 'OFF',
        ftPlaceholder: 'Écrivez un message...', ftSend: 'Envoyer',
        dayDisplay: 'Jour 1 - matin',
        galleryTitle: 'Galerie des fins', galleryProgress: 'Progression', galleryBack: 'Retour',
        backlogTitle: 'Historique des dialogues',
        slotTitle: 'Sauvegarder',
        loadingText: 'Chargement...',
        rotateText: 'Tournez votre appareil<br>en mode paysage',
        archerlabLabel: 'Accueil ArcherLab',
        koOptionLabel: 'Coréen',
        fontHref: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap',
        fontOverride: ":root{--font-main:'Noto Sans','Noto Sans KR',sans-serif;}"
    },
    de: {
        locale: 'de_DE',
        title: 'Das Klassenzimmer ohne Abschluss',
        metaTitle: 'Nevergrad - Kostenlose Visual Novel im Browser',
        metaDesc: 'Spiele Nevergrad, eine kostenlose Schulmystery-Visual-Novel ohne Download. Fünf Tage voller Entscheidungen, fünf Heldinnen, sieben Enden und Mehrsprachigkeit.',
        ogTitle: 'Nevergrad | Kostenlose Visual Novel im Browser',
        subtitle: 'Fünf-Tage-Protokoll',
        newGame: 'Neues Spiel', continue: 'Fortsetzen', gallery: 'Galerie',
        namePrompt: 'Wie heißt du?', namePlaceholder: 'Namen eingeben', start: 'Start',
        save: 'Speichern', load: 'Laden', settings: 'Einstellungen', toTitle: 'Titelbildschirm', resume: 'Zurück',
        settingsBgm: 'BGM-Lautstärke', settingsSfx: 'Soundeffekte', settingsTextSpeed: 'Textgeschwindigkeit',
        settingsFullscreen: 'Vollbild', settingsReset: 'Zurücksetzen', settingsOff: 'AUS',
        ftPlaceholder: 'Nachricht eingeben...', ftSend: 'Senden',
        dayDisplay: 'Tag 1 - Morgen',
        keywords: 'kostenlose Visual Novel, Visual Novel im Browser, Visual Novel ohne Download, kostenloses Schulmystery-Spiel, psychologische Horror-Visual-Novel, Entscheidungsgeschichte online, Spiel mit mehreren Enden, Nevergrad',
        twitterTitle: 'Nevergrad: Kostenlose Visual Novel im Browser',
        twitterDesc: 'Eine kostenlose Schulmystery-Visual-Novel ohne Download. Fünf Tage, fünf Heldinnen und sieben Enden.',
        schemaName: 'Nevergrad: Das Klassenzimmer ohne Abschluss',
        schemaDesc: 'Spiele Nevergrad, eine kostenlose Schulmystery-Visual-Novel ohne Download. Fünf Tage voller Entscheidungen, fünf Heldinnen, sieben Enden und Mehrsprachigkeit.',
        galleryTitle: 'Galerie der Enden',
        galleryProgress: 'Fortschritt',
        galleryBack: 'Zurück',
        backlogTitle: 'Dialogverlauf',
        slotTitle: 'Speichern',
        loadingText: 'Lädt...',
        rotateText: 'Drehe dein Gerät<br>ins Querformat',
        archerlabLabel: 'ArcherLab-Startseite',
        koOptionLabel: 'Koreanisch'
    },
    pt: {
        locale: 'pt',
        title: 'A Sala de Aula Sem Formatura',
        metaTitle: 'Nevergrad - Visual Novel Grátis no Navegador',
        metaDesc: 'Jogue Nevergrad, uma visual novel escolar de mistério grátis e sem download. Cinco dias de escolhas, cinco heroínas, sete finais e suporte multilíngue.',
        ogTitle: 'Nevergrad | Visual Novel Grátis no Navegador',
        subtitle: 'Registro de 5 Dias',
        newGame: 'Novo Jogo', continue: 'Continuar', gallery: 'Galeria',
        namePrompt: 'Qual é o seu nome?', namePlaceholder: 'Digite seu nome', start: 'Começar',
        save: 'Salvar', load: 'Carregar', settings: 'Configurações', toTitle: 'Título', resume: 'Voltar',
        settingsBgm: 'Volume BGM', settingsSfx: 'Volume efeitos', settingsTextSpeed: 'Velocidade do texto',
        settingsFullscreen: 'Tela cheia', settingsReset: 'Redefinir', settingsOff: 'OFF',
        ftPlaceholder: 'Digite uma mensagem...', ftSend: 'Enviar',
        dayDisplay: 'Dia 1 - Manhã',
        keywords: 'visual novel grátis, visual novel no navegador, visual novel sem download, jogo de mistério escolar grátis, visual novel de terror psicológico, jogo narrativo com escolhas, jogo com múltiplos finais, Nevergrad',
        twitterTitle: 'Nevergrad: Visual Novel Grátis no Navegador',
        twitterDesc: 'Uma visual novel escolar de mistério grátis, sem download. Cinco dias, cinco heroínas e sete finais.',
        schemaName: 'Nevergrad: A Sala de Aula Sem Formatura',
        schemaDesc: 'Jogue Nevergrad, uma visual novel escolar de mistério grátis e sem download. Cinco dias de escolhas, cinco heroínas, sete finais e suporte multilíngue.',
        galleryTitle: 'Galeria de Finais',
        galleryProgress: 'Progresso',
        galleryBack: 'Voltar',
        backlogTitle: 'Histórico de Diálogos',
        slotTitle: 'Salvar',
        loadingText: 'Carregando...',
        rotateText: 'Gire a tela para o modo paisagem<br>Please rotate your device',
        archerlabLabel: 'Página inicial da ArcherLab',
        koOptionLabel: 'Coreano',
        fontHref: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap',
        fontOverride: ":root{--font-main:'Noto Sans','Noto Sans KR',sans-serif;}"
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

function readSeoSitemapFragment() {
    const fragmentPath = path.join(ROOT, 'seo', '_sitemap_fragment.xml');
    if (!fs.existsSync(fragmentPath)) return '';
    return fs.readFileSync(fragmentPath, 'utf-8').replace(/\s+$/g, '');
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
    // ===== Settings Overlay =====
    if (data.settings) {
        html = html.replace(
            /(<span id="settings-title" class="settings-title">)[^<]*(<\/span>)/,
            `$1${data.settings}$2`
        );
    }
    if (data.settingsBgm) {
        html = html.replace(
            /(<label id="settings-bgm-label" class="settings-label" for="settings-bgm">)[^<]*(<\/label>)/,
            `$1${data.settingsBgm}$2`
        );
    }
    if (data.settingsSfx) {
        html = html.replace(
            /(<label id="settings-sfx-label" class="settings-label" for="settings-sfx">)[^<]*(<\/label>)/,
            `$1${data.settingsSfx}$2`
        );
    }
    if (data.settingsTextSpeed) {
        html = html.replace(
            /(<label id="settings-text-speed-label" class="settings-label" for="settings-text-speed">)[^<]*(<\/label>)/,
            `$1${data.settingsTextSpeed}$2`
        );
    }
    if (data.settingsFullscreen) {
        html = html.replace(
            /(<span id="settings-fullscreen-label" class="settings-label">)[^<]*(<\/span>)/,
            `$1${data.settingsFullscreen}$2`
        );
    }
    if (data.settingsOff) {
        html = html.replace(
            /(<button id="settings-fullscreen-toggle" class="settings-toggle">)[^<]*(<\/button>)/,
            `$1${data.settingsOff}$2`
        );
    }
    if (data.settingsReset) {
        html = html.replace(
            /(<button id="settings-reset" class="menu-btn settings-reset-btn">)[^<]*(<\/button>)/,
            `$1${data.settingsReset}$2`
        );
    }
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
    if (data.koOptionLabel) {
        html = html.replace(/(<option value="\/">)[^<]*(<\/option>)/, `$1${data.koOptionLabel}$2`);
    }
    if (data.fontOverride) {
        html = html.replace(
            '    <!-- JSON-LD Schema -->',
            `    <style>${data.fontOverride}</style>\n\n    <!-- JSON-LD Schema -->`
        );
    }

    html = html.replace(
        /        <!-- SCENARIO\.md 5454:[\s\S]*?미생성 에셋 에러 방지\) -->/,
        '        <!-- Title background and character sprite layers. Optional assets are resolved at runtime. -->'
    );
    html = html.replace(
        /        <!-- Quick Menu — MENU 하나만\. 저장\/불러오기는 MENU → pause-menu 안에서 접근 \(중복 제거\) -->/,
        '        <!-- Quick menu entry point. Save and load are opened through the pause menu. -->'
    );
    html = html.replace(
        /    <!-- ===== Save Slot Glitch UI \(Day 4 세이브파일 강제 오픈\) ===== -->/,
        '    <!-- ===== Save Slot Glitch UI (Day 4 forced save-file open) ===== -->'
    );
    html = html.replace(
        /                <!-- JS로 13개 슬롯 동적 생성 -->/,
        '                <!-- 13 slots are generated dynamically in JS. -->'
    );
    html = html.replace(
        /                <!-- JS로 자동\(0\) \+ 수동\(1~9\) 슬롯 동적 생성 -->/,
        '                <!-- Auto slot (0) and manual slots (1-9) are generated dynamically in JS. -->'
    );
    html = html.replace(
        /    <!-- ===== Rotate Prompt \(모바일\/태블릿 세로모드 안내\) ===== -->/,
        '    <!-- ===== Rotate Prompt (mobile and tablet portrait guidance) ===== -->'
    );

    // 상대 경로를 한 단계 위로 (언어별 페이지는 /en/ 같은 하위 경로에 생성됨)
    html = html.replace(/\b(href|src|data-src|data-default|data-ngp)="assets\//g, '$1="../assets/');
    html = html.replace(/\bhref="(?:\.\/)?favicon\.svg"/g, 'href="../favicon.svg"');

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

const seoSitemapFragment = readSeoSitemapFragment();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join('\n')}${seoSitemapFragment ? `\n${seoSitemapFragment}` : ''}
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
