// Nevergrad SEO landing page generator.
// Run from the project root with: node seo/_generate.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const SITE = 'https://nevergrad.archerlab.dev';
const LASTMOD = '2026-04-29';

const HOME = {
  ko: '/',
  en: '/en/',
  ja: '/ja/',
  es: '/es/',
  fr: '/fr/',
  de: '/de/',
  pt: '/pt/'
};

const LANG = {
  ko: {
    htmlLang: 'ko',
    cta: '지금 무료로 플레이',
    whyTitle: '왜 Nevergrad인가',
    why: [
      '설치, 다운로드, 회원가입 없이 브라우저에서 바로 시작합니다.',
      '5일의 선택이 5명의 히로인과 7개의 엔딩으로 갈라집니다.',
      '초반의 로맨스 분위기가 학원 미스터리와 심리 스릴러로 전환됩니다.',
      'PC와 모바일 브라우저에서 같은 웹 게임으로 플레이할 수 있습니다.'
    ],
    featureTitle: '검색 의도에 맞는 핵심',
    features: [
      ['무료 플레이', '결제나 구독 없이 본편을 브라우저에서 바로 시작합니다.'],
      ['다운로드 없음', '앱 설치 대신 URL만 열면 세이브까지 브라우저에 저장됩니다.'],
      ['멀티 엔딩', '선택과 관계 변화에 따라 서로 다른 결말을 볼 수 있습니다.']
    ],
    howTitle: '30초 안에 시작하는 방법',
    how: ['아래 플레이 버튼을 누릅니다.', '이름을 입력하고 새 게임을 시작합니다.', '5일 동안 선택지를 고르며 엔딩을 확인합니다.'],
    faqTitle: '자주 묻는 질문',
    faqs: [
      ['정말 무료인가요?', '네. Nevergrad는 결제, 구독, 회원가입 없이 브라우저에서 플레이할 수 있습니다.'],
      ['모바일에서도 되나요?', '네. 최신 Chrome, Safari, Edge 등 모바일 브라우저에서 플레이할 수 있습니다.'],
      ['어떤 장르인가요?', '로맨스 비주얼 노벨로 시작해 학원 미스터리와 심리 스릴러로 확장되는 선택지 스토리 게임입니다.'],
      ['진행 상황은 저장되나요?', '같은 브라우저에서는 localStorage 기반으로 진행 상황과 세이브를 유지합니다.']
    ],
    otherLangs: '다른 언어',
    footer: 'Nevergrad - 무료 브라우저 비주얼 노벨'
  },
  en: {
    htmlLang: 'en',
    cta: 'Play Free Now',
    whyTitle: 'Why Nevergrad',
    why: [
      'Start instantly in the browser with no install, no download, and no signup.',
      'Five days of choices branch into five heroines and seven endings.',
      'A gentle school romance gradually turns into mystery and psychological thriller.',
      'Playable on desktop and mobile browsers as the same web game.'
    ],
    featureTitle: 'What matches this search',
    features: [
      ['Free to play', 'Open the game and start the full story without payment or subscription.'],
      ['No download', 'Use the URL instead of an app install, with saves stored in your browser.'],
      ['Multiple endings', 'Your choices and relationships lead to different outcomes.']
    ],
    howTitle: 'Start in 30 seconds',
    how: ['Click the play button below.', 'Enter a name and begin a new game.', 'Make choices over five days and reach an ending.'],
    faqTitle: 'Frequently asked questions',
    faqs: [
      ['Is it really free?', 'Yes. Nevergrad is playable in the browser without payment, subscription, or signup.'],
      ['Does it work on mobile?', 'Yes. It runs in modern mobile browsers including Chrome, Safari, and Edge.'],
      ['What genre is it?', 'It starts as a romance visual novel and opens into a school mystery psychological thriller.'],
      ['Is progress saved?', 'On the same browser, progress and save slots are kept with localStorage.']
    ],
    otherLangs: 'Other languages',
    footer: 'Nevergrad - free browser visual novel'
  },
  ja: {
    htmlLang: 'ja',
    cta: '無料でプレイ',
    whyTitle: 'Nevergradを選ぶ理由',
    why: [
      'インストール、ダウンロード、登録なしでブラウザからすぐに開始できます。',
      '5日間の選択が5人のヒロインと7つのエンディングへ分岐します。',
      '序盤の学園ロマンスがミステリーと心理スリラーへ変化します。',
      'PCでもスマホでも同じWebゲームとして遊べます。'
    ],
    featureTitle: '検索意図に合うポイント',
    features: [
      ['無料プレイ', '支払いなしで本編をブラウザから開始できます。'],
      ['ダウンロード不要', 'アプリではなくURLを開くだけで、セーブもブラウザに保存されます。'],
      ['マルチエンディング', '選択と関係性によって異なる結末に進みます。']
    ],
    howTitle: '30秒で始める方法',
    how: ['下のプレイボタンを押します。', '名前を入力してニューゲームを開始します。', '5日間の選択を進めてエンディングを見ます。'],
    faqTitle: 'よくある質問',
    faqs: [
      ['本当に無料ですか？', 'はい。Nevergradは支払い、登録、サブスクなしでブラウザから遊べます。'],
      ['スマホでも遊べますか？', 'はい。Chrome、Safari、Edgeなどの最新モバイルブラウザに対応しています。'],
      ['どんなジャンルですか？', 'ロマンスビジュアルノベルから始まり、学園ミステリーと心理スリラーへ展開します。'],
      ['進行状況は保存されますか？', '同じブラウザではlocalStorageで進行状況とセーブが保持されます。']
    ],
    otherLangs: '他の言語',
    footer: 'Nevergrad - 無料ブラウザビジュアルノベル'
  },
  es: {
    htmlLang: 'es',
    cta: 'Jugar Gratis Ahora',
    whyTitle: 'Por qué Nevergrad',
    why: [
      'Empieza al instante en el navegador, sin instalación, descarga ni registro.',
      'Cinco días de decisiones se ramifican en cinco heroínas y siete finales.',
      'Un romance escolar suave se transforma en misterio y thriller psicológico.',
      'Se juega en navegadores de escritorio y móvil como el mismo juego web.'
    ],
    featureTitle: 'Qué encaja con esta búsqueda',
    features: [
      ['Gratis', 'Abre el juego y empieza la historia sin pago ni suscripción.'],
      ['Sin descarga', 'Usa la URL en lugar de instalar una app, con guardado en el navegador.'],
      ['Múltiples finales', 'Tus elecciones y relaciones llevan a desenlaces distintos.']
    ],
    howTitle: 'Empieza en 30 segundos',
    how: ['Pulsa el botón de jugar abajo.', 'Escribe un nombre y comienza una nueva partida.', 'Toma decisiones durante cinco días y alcanza un final.'],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      ['¿Es realmente gratis?', 'Sí. Nevergrad se puede jugar en el navegador sin pago, suscripción ni registro.'],
      ['¿Funciona en móvil?', 'Sí. Funciona en navegadores móviles modernos como Chrome, Safari y Edge.'],
      ['¿Qué género es?', 'Empieza como visual novel romántica y se abre a misterio escolar y thriller psicológico.'],
      ['¿Se guarda el progreso?', 'En el mismo navegador, el progreso y las ranuras de guardado se conservan con localStorage.']
    ],
    otherLangs: 'Otros idiomas',
    footer: 'Nevergrad - visual novel gratis en navegador'
  },
  fr: {
    htmlLang: 'fr',
    cta: 'Jouer Gratuitement',
    whyTitle: 'Pourquoi Nevergrad',
    why: [
      'Commencez directement dans le navigateur, sans installation, téléchargement ni inscription.',
      'Cinq jours de choix mènent à cinq héroïnes et sept fins.',
      'Une romance scolaire douce bascule vers le mystère et le thriller psychologique.',
      'Le même jeu web fonctionne sur navigateur mobile et ordinateur.'
    ],
    featureTitle: 'Ce qui correspond à cette recherche',
    features: [
      ['Gratuit', 'Ouvrez le jeu et lancez l’histoire sans paiement ni abonnement.'],
      ['Sans téléchargement', 'Utilisez simplement l’URL, avec sauvegarde dans le navigateur.'],
      ['Fins multiples', 'Vos choix et relations conduisent à des issues différentes.']
    ],
    howTitle: 'Commencer en 30 secondes',
    how: ['Cliquez sur le bouton de jeu ci-dessous.', 'Entrez un nom et lancez une nouvelle partie.', 'Faites vos choix pendant cinq jours et atteignez une fin.'],
    faqTitle: 'Questions fréquentes',
    faqs: [
      ['Est-ce vraiment gratuit ?', 'Oui. Nevergrad se joue dans le navigateur sans paiement, abonnement ni inscription.'],
      ['Est-ce compatible mobile ?', 'Oui. Le jeu fonctionne dans les navigateurs mobiles récents comme Chrome, Safari et Edge.'],
      ['Quel est le genre ?', 'Le jeu commence comme un visual novel romantique, puis devient un mystère scolaire et thriller psychologique.'],
      ['La progression est-elle sauvegardée ?', 'Dans le même navigateur, la progression et les sauvegardes sont conservées avec localStorage.']
    ],
    otherLangs: 'Autres langues',
    footer: 'Nevergrad - visual novel gratuit en navigateur'
  },
  de: {
    htmlLang: 'de',
    cta: 'Jetzt Kostenlos Spielen',
    whyTitle: 'Warum Nevergrad',
    why: [
      'Starte direkt im Browser, ohne Installation, Download oder Registrierung.',
      'Fünf Tage voller Entscheidungen führen zu fünf Heldinnen und sieben Enden.',
      'Eine ruhige Schulromanze wird zu Mystery und psychologischem Thriller.',
      'Das gleiche Webspiel läuft auf Desktop- und Mobilbrowsern.'
    ],
    featureTitle: 'Was zu dieser Suche passt',
    features: [
      ['Kostenlos', 'Öffne das Spiel und starte die Story ohne Zahlung oder Abo.'],
      ['Ohne Download', 'Nutze die URL statt einer App-Installation, mit Spielständen im Browser.'],
      ['Mehrere Enden', 'Deine Entscheidungen und Beziehungen führen zu unterschiedlichen Ausgängen.']
    ],
    howTitle: 'In 30 Sekunden starten',
    how: ['Klicke unten auf den Spielen-Button.', 'Gib einen Namen ein und starte ein neues Spiel.', 'Triff fünf Tage lang Entscheidungen und erreiche ein Ende.'],
    faqTitle: 'Häufige Fragen',
    faqs: [
      ['Ist es wirklich kostenlos?', 'Ja. Nevergrad ist im Browser ohne Zahlung, Abo oder Registrierung spielbar.'],
      ['Läuft es mobil?', 'Ja. Es läuft in modernen mobilen Browsern wie Chrome, Safari und Edge.'],
      ['Welches Genre ist es?', 'Es beginnt als Romance Visual Novel und entwickelt sich zu Schulmystery und psychologischem Thriller.'],
      ['Wird der Fortschritt gespeichert?', 'Im selben Browser werden Fortschritt und Spielstände mit localStorage erhalten.']
    ],
    otherLangs: 'Andere Sprachen',
    footer: 'Nevergrad - kostenlose Browser Visual Novel'
  },
  pt: {
    htmlLang: 'pt',
    cta: 'Jogar Grátis Agora',
    whyTitle: 'Por que Nevergrad',
    why: [
      'Comece direto no navegador, sem instalação, download ou cadastro.',
      'Cinco dias de escolhas se ramificam em cinco heroínas e sete finais.',
      'Um romance escolar tranquilo vira mistério e thriller psicológico.',
      'O mesmo jogo web funciona em navegador de desktop e celular.'
    ],
    featureTitle: 'O que combina com esta busca',
    features: [
      ['Grátis', 'Abra o jogo e comece a história sem pagamento ou assinatura.'],
      ['Sem download', 'Use a URL em vez de instalar um app, com save no navegador.'],
      ['Múltiplos finais', 'Suas escolhas e relações levam a finais diferentes.']
    ],
    howTitle: 'Comece em 30 segundos',
    how: ['Clique no botão de jogar abaixo.', 'Digite um nome e inicie um novo jogo.', 'Faça escolhas por cinco dias e chegue a um final.'],
    faqTitle: 'Perguntas frequentes',
    faqs: [
      ['É grátis mesmo?', 'Sim. Nevergrad roda no navegador sem pagamento, assinatura ou cadastro.'],
      ['Funciona no celular?', 'Sim. Funciona em navegadores móveis modernos como Chrome, Safari e Edge.'],
      ['Qual é o gênero?', 'Começa como visual novel romântica e se abre para mistério escolar e thriller psicológico.'],
      ['O progresso é salvo?', 'No mesmo navegador, progresso e saves ficam preservados com localStorage.']
    ],
    otherLangs: 'Outros idiomas',
    footer: 'Nevergrad - visual novel grátis no navegador'
  }
};

const CLUSTERS = [
  {
    id: 'free-browser-visual-novel',
    pages: {
      ko: {
        slug: 'muryo-visual-novel-browser',
        h1: '무료 비주얼 노벨 브라우저 게임 - Nevergrad',
        title: '무료 비주얼 노벨 브라우저 게임 | Nevergrad',
        meta: '무료 비주얼 노벨을 브라우저에서 바로 플레이하세요. Nevergrad는 다운로드 없이 즐기는 학원 미스터리 선택지 게임입니다.',
        intro: '무료 비주얼 노벨을 찾는다면 설치 파일보다 바로 열리는 웹 게임이 빠릅니다. Nevergrad는 브라우저에서 시작해 5일의 선택과 7개 엔딩을 플레이하는 학원 미스터리 비주얼 노벨입니다.',
        angleTitle: '무료 브라우저 VN으로 잡은 이유',
        angle: ['결제 장벽 없이 첫 장면부터 플레이할 수 있습니다.', '비주얼 노벨, 학원물, 미스터리, 선택지 게임 검색 의도를 함께 충족합니다.', '모바일에서도 링크만 열면 같은 게임을 시작할 수 있습니다.']
      },
      en: {
        slug: 'free-browser-visual-novel',
        h1: 'Free Browser Visual Novel - Play Nevergrad Online',
        title: 'Free Browser Visual Novel | Play Nevergrad Online',
        meta: 'Play a free browser visual novel online. Nevergrad is a school mystery choice game with no download, five heroines, and seven endings.',
        intro: 'If you are looking for a free browser visual novel, the best path is a game that starts from a link. Nevergrad runs in the browser and turns five days of choices into a school mystery with seven endings.',
        angleTitle: 'Why this fits the keyword',
        angle: ['No payment wall before the story starts.', 'It matches visual novel, school story, mystery, and choice-game intent.', 'Desktop and mobile players can start from the same URL.']
      },
      ja: {
        slug: 'browser-visual-novel-muryo',
        h1: '無料ブラウザビジュアルノベル - Nevergrad',
        title: '無料ブラウザビジュアルノベル | Nevergrad',
        meta: '無料のブラウザビジュアルノベルを今すぐプレイ。Nevergradはダウンロード不要の学園ミステリー選択肢ゲームです。',
        intro: '無料のビジュアルノベルを探しているなら、インストール不要で開けるWebゲームが最短です。Nevergradはブラウザで始まり、5日間の選択と7つのエンディングへ進む学園ミステリーです。',
        angleTitle: '無料ブラウザVNとしての強み',
        angle: ['支払いなしで最初のシーンから遊べます。', 'ビジュアルノベル、学園、ミステリー、選択肢ゲームの検索意図に合います。', 'スマホでも同じURLから開始できます。']
      },
      es: {
        slug: 'visual-novel-gratis-navegador',
        h1: 'Visual Novel Gratis en Navegador - Nevergrad',
        title: 'Visual Novel Gratis en Navegador | Nevergrad',
        meta: 'Juega una visual novel gratis en navegador. Nevergrad es un misterio escolar con decisiones, sin descarga, cinco heroínas y siete finales.',
        intro: 'Si buscas una visual novel gratis en navegador, lo ideal es empezar desde un enlace. Nevergrad corre en el navegador y convierte cinco días de decisiones en un misterio escolar con siete finales.',
        angleTitle: 'Por qué encaja con la búsqueda',
        angle: ['No hay pago antes de empezar la historia.', 'Cubre intención de visual novel, historia escolar, misterio y decisiones.', 'Se puede iniciar desde la misma URL en PC o móvil.']
      },
      fr: {
        slug: 'visual-novel-gratuit-navigateur',
        h1: 'Visual Novel Gratuit en Navigateur - Nevergrad',
        title: 'Visual Novel Gratuit en Navigateur | Nevergrad',
        meta: 'Jouez à un visual novel gratuit en navigateur. Nevergrad est un mystère scolaire à choix, sans téléchargement, avec cinq héroïnes et sept fins.',
        intro: 'Pour trouver un visual novel gratuit en navigateur, le plus simple est un jeu qui démarre depuis un lien. Nevergrad se joue dans le navigateur et transforme cinq jours de choix en mystère scolaire à sept fins.',
        angleTitle: 'Pourquoi ce mot-clé fonctionne',
        angle: ['Aucun paiement avant le début de l’histoire.', 'Le jeu répond aux recherches visual novel, école, mystère et choix.', 'La même URL fonctionne sur ordinateur et mobile.']
      },
      de: {
        slug: 'kostenlose-browser-visual-novel',
        h1: 'Kostenlose Browser Visual Novel - Nevergrad',
        title: 'Kostenlose Browser Visual Novel | Nevergrad',
        meta: 'Spiele eine kostenlose Browser Visual Novel. Nevergrad ist ein Schulmystery mit Entscheidungen, ohne Download, fünf Heldinnen und sieben Enden.',
        intro: 'Wer eine kostenlose Browser Visual Novel sucht, will schnell aus einem Link starten. Nevergrad läuft im Browser und macht aus fünf Tagen voller Entscheidungen ein Schulmystery mit sieben Enden.',
        angleTitle: 'Warum dieses Keyword passt',
        angle: ['Keine Zahlung vor dem Story-Start.', 'Es trifft Suchintentionen rund um Visual Novel, Schule, Mystery und Entscheidungen.', 'Desktop und Mobilgeräte starten über dieselbe URL.']
      },
      pt: {
        slug: 'visual-novel-gratis-navegador-pt',
        h1: 'Visual Novel Grátis no Navegador - Nevergrad',
        title: 'Visual Novel Grátis no Navegador | Nevergrad',
        meta: 'Jogue uma visual novel grátis no navegador. Nevergrad é um mistério escolar com escolhas, sem download, cinco heroínas e sete finais.',
        intro: 'Se você procura uma visual novel grátis no navegador, o melhor é começar por um link. Nevergrad roda no navegador e transforma cinco dias de escolhas em um mistério escolar com sete finais.',
        angleTitle: 'Por que combina com a busca',
        angle: ['Não há pagamento antes do começo da história.', 'Atende buscas por visual novel, escola, mistério e jogo de escolhas.', 'A mesma URL funciona no computador e no celular.']
      }
    }
  },
  {
    id: 'no-download-visual-novel',
    pages: {
      ko: {
        slug: 'download-eopsi-visual-novel',
        h1: '다운로드 없이 비주얼 노벨 플레이 - Nevergrad',
        title: '다운로드 없이 비주얼 노벨 플레이 | Nevergrad',
        meta: '다운로드 없이 플레이하는 무료 웹 비주얼 노벨. Nevergrad는 설치 없는 브라우저 기반 학원 미스터리 게임입니다.',
        intro: '다운로드 없이 비주얼 노벨을 플레이하려면 실행 파일이나 앱스토어가 필요 없어야 합니다. Nevergrad는 링크를 열고 바로 시작하는 무료 웹 비주얼 노벨입니다.',
        angleTitle: '무설치 검색에 맞춘 포인트',
        angle: ['앱 설치 없이 최신 브라우저에서 플레이합니다.', '세이브와 진행 상황은 같은 브라우저에 저장됩니다.', '짧은 체험판이 아니라 5일 구조와 엔딩 분기를 제공합니다.']
      },
      en: {
        slug: 'visual-novel-no-download',
        h1: 'Visual Novel With No Download - Play Nevergrad',
        title: 'Visual Novel No Download | Play Nevergrad Free',
        meta: 'Play a visual novel with no download. Nevergrad is a free browser-based school mystery game with choices and multiple endings.',
        intro: 'A no-download visual novel should not require an installer, app store, or account before the story begins. Nevergrad starts from a browser link and keeps the experience lightweight.',
        angleTitle: 'Why it fits no-download intent',
        angle: ['No app install or desktop client is required.', 'Progress is stored on the same browser.', 'It offers a complete five-day structure with branching endings.']
      },
      ja: {
        slug: 'download-nashi-visual-novel',
        h1: 'ダウンロード不要のビジュアルノベル - Nevergrad',
        title: 'ダウンロード不要 ビジュアルノベル | Nevergrad',
        meta: 'ダウンロード不要で遊べる無料Webビジュアルノベル。Nevergradはブラウザで進む学園ミステリー選択肢ゲームです。',
        intro: 'ダウンロード不要のビジュアルノベルなら、インストーラーやアプリストアを通さずに物語を始められるべきです。Nevergradはブラウザのリンクからすぐに開始できます。',
        angleTitle: '無インストール検索に合う理由',
        angle: ['アプリを入れずに最新ブラウザで遊べます。', '同じブラウザに進行状況が保存されます。', '短い体験版ではなく、5日構成と分岐エンディングがあります。']
      },
      es: {
        slug: 'visual-novel-sin-descarga',
        h1: 'Visual Novel Sin Descarga - Juega Nevergrad',
        title: 'Visual Novel Sin Descarga | Nevergrad Gratis',
        meta: 'Juega una visual novel sin descarga. Nevergrad es un misterio escolar gratis en navegador, con decisiones y múltiples finales.',
        intro: 'Una visual novel sin descarga no debería pedir instalador, tienda de apps ni cuenta antes de empezar. Nevergrad se abre desde un enlace del navegador y mantiene la experiencia ligera.',
        angleTitle: 'Por qué encaja con sin descarga',
        angle: ['No requiere app ni cliente de escritorio.', 'El progreso se guarda en el mismo navegador.', 'Tiene estructura completa de cinco días y finales ramificados.']
      },
      fr: {
        slug: 'visual-novel-sans-telechargement',
        h1: 'Visual Novel Sans Téléchargement - Nevergrad',
        title: 'Visual Novel Sans Téléchargement | Nevergrad',
        meta: 'Jouez à un visual novel sans téléchargement. Nevergrad est un mystère scolaire gratuit en navigateur, avec choix et fins multiples.',
        intro: 'Un visual novel sans téléchargement ne doit pas imposer d’installateur, de boutique d’apps ou de compte avant le début. Nevergrad se lance depuis un simple lien de navigateur.',
        angleTitle: 'Pourquoi cela répond à la recherche',
        angle: ['Aucune application ou client de bureau nécessaire.', 'La progression reste dans le même navigateur.', 'Le jeu propose cinq jours complets et des fins ramifiées.']
      },
      de: {
        slug: 'visual-novel-ohne-download',
        h1: 'Visual Novel Ohne Download - Nevergrad Spielen',
        title: 'Visual Novel Ohne Download | Nevergrad Kostenlos',
        meta: 'Spiele eine Visual Novel ohne Download. Nevergrad ist ein kostenloses Browser-Schulmystery mit Entscheidungen und mehreren Enden.',
        intro: 'Eine Visual Novel ohne Download sollte keine Installation, keinen App Store und kein Konto vor dem Start verlangen. Nevergrad beginnt direkt über einen Browser-Link.',
        angleTitle: 'Warum es zu ohne Download passt',
        angle: ['Keine App und kein Desktop-Client nötig.', 'Der Fortschritt bleibt im selben Browser gespeichert.', 'Die Story bietet fünf Tage und verzweigte Enden.']
      },
      pt: {
        slug: 'visual-novel-sem-download',
        h1: 'Visual Novel Sem Download - Jogue Nevergrad',
        title: 'Visual Novel Sem Download | Nevergrad Grátis',
        meta: 'Jogue uma visual novel sem download. Nevergrad é um mistério escolar grátis no navegador, com escolhas e múltiplos finais.',
        intro: 'Uma visual novel sem download não deve exigir instalador, loja de apps ou conta antes da história. Nevergrad começa por um link do navegador e mantém tudo leve.',
        angleTitle: 'Por que atende a busca sem download',
        angle: ['Não precisa de app ou cliente de desktop.', 'O progresso fica salvo no mesmo navegador.', 'Oferece estrutura completa de cinco dias e finais ramificados.']
      }
    }
  },
  {
    id: 'school-mystery-visual-novel',
    pages: {
      ko: {
        slug: 'hakgyo-mystery-game-muryo',
        h1: '학교 미스터리 게임 무료 플레이 - Nevergrad',
        title: '학교 미스터리 게임 무료 | Nevergrad 비주얼 노벨',
        meta: '무료 학교 미스터리 게임을 브라우저에서 플레이하세요. Nevergrad는 선택과 엔딩 분기가 있는 학원 스릴러 비주얼 노벨입니다.',
        intro: '학교 미스터리 게임은 익숙한 교실과 이상한 규칙이 만나는 순간 강해집니다. Nevergrad는 평범한 전학 첫날에서 시작해 5일 동안 학교의 비밀을 따라가는 무료 비주얼 노벨입니다.',
        angleTitle: '학원 미스터리 검색에 맞는 이유',
        angle: ['교실, 복도, 옥상, 기록실 같은 학원 공간이 핵심 무대입니다.', '선택에 따라 히로인 관계와 진실 접근 방식이 달라집니다.', '로맨스에서 미스터리로 장르가 전환되는 구조입니다.']
      },
      en: {
        slug: 'school-mystery-visual-novel',
        h1: 'School Mystery Visual Novel - Nevergrad',
        title: 'School Mystery Visual Novel | Play Nevergrad Free',
        meta: 'Play a free school mystery visual novel in your browser. Nevergrad blends choices, heroines, hidden records, and seven endings.',
        intro: 'A school mystery works when familiar classrooms start feeling controlled by hidden rules. Nevergrad begins with a transfer day and follows five days of choices toward the secret beneath the school.',
        angleTitle: 'Why it matches school mystery intent',
        angle: ['Classrooms, hallways, rooftops, and records rooms carry the story.', 'Choices change relationships and how close you get to the truth.', 'The route shifts from romance into mystery as the week unfolds.']
      },
      ja: {
        slug: 'gakuen-mystery-game-muryo',
        h1: '無料の学園ミステリーゲーム - Nevergrad',
        title: '学園ミステリーゲーム 無料 | Nevergrad',
        meta: '無料の学園ミステリーゲームをブラウザでプレイ。Nevergradは選択肢と分岐エンディングを備えたビジュアルノベルです。',
        intro: '学園ミステリーは、見慣れた教室に不自然なルールが混ざった瞬間に強くなります。Nevergradは転校初日から始まり、5日間の選択で学校の秘密へ近づきます。',
        angleTitle: '学園ミステリー検索に合う理由',
        angle: ['教室、廊下、屋上、記録室が物語の中心です。', '選択によって関係性と真実への近づき方が変わります。', 'ロマンスからミステリーへ移行する構成です。']
      },
      es: {
        slug: 'juego-misterio-escolar-gratis',
        h1: 'Juego de Misterio Escolar Gratis - Nevergrad',
        title: 'Juego de Misterio Escolar Gratis | Nevergrad',
        meta: 'Juega un misterio escolar gratis en navegador. Nevergrad combina visual novel, decisiones, registros ocultos y siete finales.',
        intro: 'Un misterio escolar funciona cuando aulas familiares empiezan a obedecer reglas ocultas. Nevergrad empieza con un día de transferencia y sigue cinco días de elecciones hacia el secreto de la escuela.',
        angleTitle: 'Por qué encaja con misterio escolar',
        angle: ['Aulas, pasillos, azoteas y salas de registros sostienen la historia.', 'Las decisiones cambian relaciones y acceso a la verdad.', 'La ruta pasa de romance a misterio durante la semana.']
      },
      fr: {
        slug: 'jeu-mystere-scolaire-gratuit',
        h1: 'Jeu de Mystère Scolaire Gratuit - Nevergrad',
        title: 'Jeu de Mystère Scolaire Gratuit | Nevergrad',
        meta: 'Jouez à un mystère scolaire gratuit en navigateur. Nevergrad mélange visual novel, choix, dossiers cachés et sept fins.',
        intro: 'Un mystère scolaire devient fort quand des salles familières semblent suivre des règles cachées. Nevergrad commence par un transfert et suit cinq jours de choix vers le secret de l’école.',
        angleTitle: 'Pourquoi cela correspond au mystère scolaire',
        angle: ['Salles de classe, couloirs, toit et archives portent l’histoire.', 'Les choix changent les relations et l’accès à la vérité.', 'Le récit passe de la romance au mystère au fil de la semaine.']
      },
      de: {
        slug: 'schulmystery-spiel-kostenlos',
        h1: 'Kostenloses Schulmystery-Spiel - Nevergrad',
        title: 'Schulmystery-Spiel Kostenlos | Nevergrad',
        meta: 'Spiele ein kostenloses Schulmystery im Browser. Nevergrad verbindet Visual Novel, Entscheidungen, versteckte Akten und sieben Enden.',
        intro: 'Ein Schulmystery funktioniert, wenn vertraute Klassenzimmer plötzlich geheimen Regeln folgen. Nevergrad beginnt mit einem Schulwechsel und führt fünf Tage lang durch Entscheidungen zum Geheimnis der Schule.',
        angleTitle: 'Warum es zu Schulmystery passt',
        angle: ['Klassenzimmer, Flure, Dach und Archivräume tragen die Handlung.', 'Entscheidungen verändern Beziehungen und den Weg zur Wahrheit.', 'Die Route wechselt im Verlauf der Woche von Romance zu Mystery.']
      },
      pt: {
        slug: 'jogo-misterio-escolar-gratis',
        h1: 'Jogo de Mistério Escolar Grátis - Nevergrad',
        title: 'Jogo de Mistério Escolar Grátis | Nevergrad',
        meta: 'Jogue um mistério escolar grátis no navegador. Nevergrad mistura visual novel, escolhas, registros ocultos e sete finais.',
        intro: 'Um mistério escolar ganha força quando salas familiares parecem seguir regras escondidas. Nevergrad começa em um dia de transferência e segue cinco dias de escolhas até o segredo da escola.',
        angleTitle: 'Por que combina com mistério escolar',
        angle: ['Salas, corredores, terraço e arquivos sustentam a história.', 'As escolhas mudam relações e o acesso à verdade.', 'A rota passa de romance para mistério ao longo da semana.']
      }
    }
  },
  {
    id: 'psychological-horror-visual-novel',
    pages: {
      ko: {
        slug: 'horror-visual-novel-muryo',
        h1: '호러 비주얼 노벨 무료 플레이 - Nevergrad',
        title: '호러 비주얼 노벨 무료 | Nevergrad 심리 스릴러',
        meta: '무료 호러 비주얼 노벨을 브라우저에서 플레이하세요. Nevergrad는 로맨스에서 심리 스릴러로 변하는 학원 미스터리 게임입니다.',
        intro: '호러 비주얼 노벨의 힘은 큰 점프스케어보다 익숙한 장면이 조금씩 틀어지는 데 있습니다. Nevergrad는 평온한 학교 로맨스에서 시작해 심리 스릴러로 변하는 무료 웹 게임입니다.',
        angleTitle: '심리 호러 키워드에 맞는 이유',
        angle: ['초반은 안전한 학원 로맨스로 보이지만 점차 위화감이 커집니다.', '기억, 반복, 관찰이라는 주제로 공포를 구성합니다.', '호러가 갑자기 튀어나오기보다 선택과 기록을 통해 누적됩니다.']
      },
      en: {
        slug: 'psychological-horror-visual-novel',
        h1: 'Psychological Horror Visual Novel - Nevergrad',
        title: 'Psychological Horror Visual Novel | Play Nevergrad',
        meta: 'Play a free psychological horror visual novel in your browser. Nevergrad begins as school romance and turns into a mystery thriller.',
        intro: 'The best psychological horror visual novels do not rely only on sudden scares. Nevergrad starts with a gentle school romance, then lets repetition, memory, and observation make the world feel wrong.',
        angleTitle: 'Why it fits psychological horror',
        angle: ['The early story feels safe before unease slowly grows.', 'Memory, repetition, and observation carry the horror premise.', 'The fear accumulates through choices, records, and school routines.']
      },
      ja: {
        slug: 'horror-visual-novel-muryo-ja',
        h1: '無料ホラービジュアルノベル - Nevergrad',
        title: 'ホラービジュアルノベル 無料 | Nevergrad',
        meta: '無料のホラービジュアルノベルをブラウザでプレイ。Nevergradは学園ロマンスから心理スリラーへ変化するミステリーゲームです。',
        intro: 'ホラービジュアルノベルの強さは、突然の驚きだけではありません。Nevergradは穏やかな学園ロマンスから始まり、記憶、反復、観察によって世界が歪んでいきます。',
        angleTitle: '心理ホラー検索に合う理由',
        angle: ['序盤は安全な学園ロマンスに見え、少しずつ違和感が増します。', '記憶、反復、観察が恐怖の軸になります。', '選択、記録、学校の日常を通じて恐怖が蓄積します。']
      },
      es: {
        slug: 'visual-novel-terror-psicologico',
        h1: 'Visual Novel de Terror Psicológico - Nevergrad',
        title: 'Visual Novel Terror Psicológico | Nevergrad',
        meta: 'Juega una visual novel de terror psicológico gratis en navegador. Nevergrad empieza como romance escolar y cambia a thriller de misterio.',
        intro: 'Las mejores visual novels de terror psicológico no dependen solo de sustos. Nevergrad empieza como romance escolar tranquilo y deja que memoria, repetición y observación vuelvan extraño el mundo.',
        angleTitle: 'Por qué encaja con terror psicológico',
        angle: ['La historia inicial parece segura antes de que crezca la incomodidad.', 'Memoria, repetición y observación sostienen la premisa de horror.', 'El miedo se acumula por decisiones, registros y rutinas escolares.']
      },
      fr: {
        slug: 'visual-novel-horreur-psychologique',
        h1: 'Visual Novel Horreur Psychologique - Nevergrad',
        title: 'Visual Novel Horreur Psychologique | Nevergrad',
        meta: 'Jouez à un visual novel d’horreur psychologique gratuit en navigateur. Nevergrad commence comme romance scolaire et devient thriller mystère.',
        intro: 'Les meilleurs visual novels d’horreur psychologique ne reposent pas seulement sur les sursauts. Nevergrad commence comme une romance scolaire douce, puis mémoire, répétition et observation rendent le monde étrange.',
        angleTitle: 'Pourquoi cela correspond à l’horreur psychologique',
        angle: ['Le début paraît sûr avant que le malaise grandisse.', 'Mémoire, répétition et observation portent la prémisse horrifique.', 'La peur s’accumule par les choix, les dossiers et les routines scolaires.']
      },
      de: {
        slug: 'psychologische-horror-visual-novel',
        h1: 'Psychologische Horror Visual Novel - Nevergrad',
        title: 'Psychologische Horror Visual Novel | Nevergrad',
        meta: 'Spiele eine kostenlose psychologische Horror Visual Novel im Browser. Nevergrad beginnt als Schulromanze und wird zum Mystery-Thriller.',
        intro: 'Starke psychologische Horror Visual Novels leben nicht nur von Schreckmomenten. Nevergrad beginnt als ruhige Schulromanze und lässt Erinnerung, Wiederholung und Beobachtung die Welt falsch wirken.',
        angleTitle: 'Warum es zu psychologischem Horror passt',
        angle: ['Der Anfang wirkt sicher, bevor das Unbehagen wächst.', 'Erinnerung, Wiederholung und Beobachtung tragen die Horroridee.', 'Die Angst entsteht durch Entscheidungen, Akten und Schulroutinen.']
      },
      pt: {
        slug: 'visual-novel-terror-psicologico-pt',
        h1: 'Visual Novel de Terror Psicológico - Nevergrad',
        title: 'Visual Novel Terror Psicológico | Nevergrad',
        meta: 'Jogue uma visual novel de terror psicológico grátis no navegador. Nevergrad começa como romance escolar e vira thriller de mistério.',
        intro: 'As melhores visual novels de terror psicológico não dependem só de sustos. Nevergrad começa como romance escolar tranquilo e deixa memória, repetição e observação tornarem o mundo estranho.',
        angleTitle: 'Por que combina com terror psicológico',
        angle: ['A história inicial parece segura antes do desconforto crescer.', 'Memória, repetição e observação sustentam a premissa de horror.', 'O medo acumula por escolhas, registros e rotinas escolares.']
      }
    }
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function urlFor(page) {
  return `${SITE}/seo/${page.slug}.html`;
}

function buildAlternates(cluster, currentLang) {
  const links = Object.entries(cluster.pages)
    .map(([lang, page]) => `  <link rel="alternate" hreflang="${lang}" href="${urlFor(page)}">`);
  links.push(`  <link rel="alternate" hreflang="x-default" href="${urlFor(cluster.pages.en || cluster.pages[currentLang])}">`);
  return links.join('\n');
}

function listItems(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function featureCards(features) {
  return features
    .map(([title, text]) => `<div class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`)
    .join('');
}

function faqDetails(faqs) {
  return faqs
    .map(([q, a]) => `<details class="faq"><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`)
    .join('');
}

function languageLinks(cluster, currentLang, label) {
  const links = Object.entries(cluster.pages)
    .filter(([lang]) => lang !== currentLang)
    .map(([lang, page]) => `<a href="/seo/${page.slug}.html" hreflang="${lang}">${lang.toUpperCase()}</a>`);
  return `<span>${escapeHtml(label)}:</span> ${links.join(' · ')}`;
}

function structuredData(langData, page) {
  const faq = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoGame',
        name: 'Nevergrad',
        alternateName: ['The Classroom of No Graduation', '졸업하지 못한 교실', '네버그라드'],
        description: page.meta,
        genre: ['Visual Novel', 'School Mystery', 'Psychological Thriller', 'Interactive Fiction'],
        gamePlatform: 'Web Browser',
        applicationCategory: 'Game',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: SITE,
        image: `${SITE}/nevergrad_link.png`,
        author: { '@type': 'Organization', name: 'Archerlab' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: langData.faqs.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      }
    ]
  };
  return JSON.stringify(faq);
}

function renderPage(cluster, lang, page) {
  const langData = LANG[lang];
  const canonical = urlFor(page);
  const home = HOME[lang] || '/';

  return `<!DOCTYPE html>
<html lang="${langData.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.meta)}">
  <link rel="canonical" href="${canonical}">
${buildAlternates(cluster, lang)}
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.meta)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${SITE}/nevergrad_link.png">
  <meta property="og:site_name" content="Nevergrad">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.meta)}">
  <meta name="twitter:image" content="${SITE}/nevergrad_link.png">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,"Noto Sans KR","Noto Sans JP","Noto Sans",sans-serif;line-height:1.65;color:#201e2b;background:#fff7fa;min-height:100vh}
.wrap{max-width:800px;margin:0 auto;padding:34px 20px 84px}
header{padding:26px 0 12px;text-align:center}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:0;text-transform:uppercase;color:#8d1b43;margin-bottom:10px}
h1{font-size:34px;line-height:1.2;color:#251829;margin-bottom:16px}
h2{font-size:21px;margin:38px 0 13px;color:#4b1730;border-bottom:2px solid #f2cad8;padding-bottom:7px}
h3{font-size:17px;margin-bottom:6px;color:#6b1740}
p{margin-bottom:14px}
.intro{font-size:17px;background:#fff;border:1px solid #f1d4df;border-left:5px solid #b9235c;border-radius:8px;padding:16px 18px;color:#3e3540}
.cta-box{text-align:center;margin:34px 0;padding:26px 18px;background:#5d1236;border-radius:10px;box-shadow:0 10px 24px rgba(93,18,54,.18)}
.cta{display:inline-block;background:#fff;color:#5d1236;text-decoration:none;font-weight:800;font-size:18px;padding:13px 30px;border-radius:999px}
.cta:hover{transform:translateY(-1px)}
ul{margin:12px 0 20px 22px}
li{margin-bottom:8px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:14px 0 20px}
.card{background:#fff;border:1px solid #f1d4df;border-radius:8px;padding:16px}
.card p{font-size:14px;color:#5a505b;margin:0}
.faq{background:#fff;border:1px solid #f1d4df;border-radius:8px;margin-bottom:10px;padding:0 14px}
.faq summary{cursor:pointer;font-weight:700;padding:12px 0;color:#332535}
.faq p{padding:0 0 12px;color:#5a505b}
footer{margin-top:48px;padding-top:20px;border-top:1px solid #f1d4df;text-align:center;font-size:13px;color:#766b73}
.langs{margin-top:12px}
.langs a{color:#8d1b43;text-decoration:none;margin:0 4px;font-weight:700}
@media(max-width:680px){h1{font-size:27px}.grid{grid-template-columns:1fr}.wrap{padding-left:18px;padding-right:18px}.cta{font-size:16px;padding:12px 24px}}
  </style>
  <script type="application/ld+json">${structuredData(langData, page)}</script>
</head>
<body>
  <main class="wrap">
    <header>
      <div class="eyebrow">Nevergrad</div>
      <h1>${escapeHtml(page.h1)}</h1>
    </header>

    <p class="intro">${escapeHtml(page.intro)}</p>

    <div class="cta-box"><a class="cta" href="${home}">${escapeHtml(langData.cta)}</a></div>

    <h2>${escapeHtml(page.angleTitle)}</h2>
    <ul>${listItems(page.angle)}</ul>

    <h2>${escapeHtml(langData.whyTitle)}</h2>
    <ul>${listItems(langData.why)}</ul>

    <h2>${escapeHtml(langData.featureTitle)}</h2>
    <div class="grid">${featureCards(langData.features)}</div>

    <h2>${escapeHtml(langData.howTitle)}</h2>
    <ul>${listItems(langData.how)}</ul>

    <div class="cta-box"><a class="cta" href="${home}">${escapeHtml(langData.cta)}</a></div>

    <h2>${escapeHtml(langData.faqTitle)}</h2>
    ${faqDetails(langData.faqs)}

    <footer>
      <div>${escapeHtml(langData.footer)}</div>
      <div class="langs">${languageLinks(cluster, lang, langData.otherLangs)}</div>
    </footer>
  </main>
</body>
</html>
`;
}

function sitemapUrl(page) {
  return `    <url>
        <loc>${urlFor(page)}</loc>
        <lastmod>${LASTMOD}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.65</priority>
    </url>`;
}

function updateRootSitemap(fragment) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;

  let sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/nevergrad\.archerlab\.dev\/seo\/[\s\S]*?<\/url>/g, '');
  sitemap = sitemap.replace(/\s*<\/urlset>\s*$/m, `\n${fragment}\n</urlset>\n`);
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
}

const sitemapEntries = [];

for (const cluster of CLUSTERS) {
  for (const [lang, page] of Object.entries(cluster.pages)) {
    const html = renderPage(cluster, lang, page);
    const outPath = path.join(OUT, `${page.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf-8');
    sitemapEntries.push(sitemapUrl(page));
    console.log(`  created seo/${page.slug}.html`);
  }
}

const fragment = sitemapEntries.join('\n');
fs.writeFileSync(path.join(OUT, '_sitemap_fragment.xml'), fragment, 'utf-8');
updateRootSitemap(fragment);

console.log(`Done. Generated ${sitemapEntries.length} SEO pages.`);
