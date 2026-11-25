/* Cupid / Nevergrad crossing. Keep the two copies identical. */
(function () {
    'use strict';
    const DEPART_KEY = 'archer_crossed_away_v1';
    const DEPART_TTL_MS = 600000;
    const COPY = {
        ko: [
            "교문 앞에서",
            "혀끝에는 아직 단맛이 남아 있다. 분명 보건실에 있었는데 교문 너머에서 등교 종이 울린다.",
            "눈을 뜨면",
            "침대 옆 스탠드 대신 머리 위의 형광등이 켜져 있다. 목소리는 아까 그대로인데 침실이 사라졌다.",
            "첫날부터 시작",
            "이전 기록 이어하기",
            "타이틀로",
            "여기까지 저장하고 다른 이야기로 넘어갑니다.",
            "저장된 진행 기록이 있습니다. 이어서 진행하거나 첫날부터 다시 시작할 수 있습니다.",
            "이야기는 다시 4월, 전학 첫날부터 시작됩니다.",
            "넘어가기",
            "장면으로 돌아가기",
            "화면이 열리지 않으면 다시 눌러 주세요.",
            "기록을 저장하지 못했습니다. 이대로 이동할까요?",
            "저장 없이 이동",
            "잠시 후",
            "검은 알약을 삼키자 목 안이 식는다.",
            "방 안의 햇살이 유리처럼 갈라진다.",
            "형광등 불빛 아래서 눈을 뜬다.",
            "분홍 알약이 혀끝에서 달게 녹는다.",
            "어두운 보건실이 봄빛 속으로 흩어진다.",
            "교문 너머에서 등교 종이 울린다.",
            "시야가 좁아졌습니다. 화면을 가로로 돌려 교실 전체를 확인하세요.",
            "세로로 세워 들면 4월의 교문과 대화를 더 편안하게 볼 수 있어요."
        ],
        en: [
            "At the school gate",
            "The sweetness is still on your tongue. You were in the infirmary. Now the school bell rings beyond the gate.",
            "When you open your eyes",
            "A fluorescent light shines overhead where the bedside lamp used to be. The voice sounds the same, but the bedroom has disappeared.",
            "Start from day one",
            "Continue saved story",
            "Title screen",
            "Save here and cross into the other story.",
            "You have a saved story here. Continue where you left off, or start again from day one.",
            "The story starts again in April, on your first day at the new school.",
            "Cross over",
            "Back to the scene",
            "If the page has not opened, press again.",
            "Your progress could not be saved. Leave anyway?",
            "Leave without saving",
            "A moment later",
            "You swallow the black pill and your throat turns cold.",
            "Sunlight across the room fractures like glass.",
            "You open your eyes beneath a fluorescent glare.",
            "The pink pill melts sweet on your tongue.",
            "The dark infirmary dissolves into spring light.",
            "Beyond the school gate, the morning bell rings.",
            "Your view is narrowed. Rotate your screen sideways to see the whole classroom.",
            "Hold your device upright for a clearer view of the April gate and dialogue."
        ],
        ja: [
            "校門の前で",
            "舌にはまだ甘さが残っている。保健室にいたはずなのに、校門の向こうで始業の鐘が鳴る。",
            "目を開けると",
            "ベッド脇のスタンドの代わりに、頭の上で蛍光灯が灯っている。聞こえる声はさっきと同じなのに、寝室は消えている。",
            "初日から始める",
            "前の記録から続ける",
            "タイトルへ",
            "ここまでセーブして、もう一つの物語へ進みます。",
            "セーブデータがあります。続きから遊ぶか、初日からやり直せます。",
            "物語は再び4月、転校初日から始まります。",
            "向こうへ進む",
            "場面に戻る",
            "画面が開かない場合は、もう一度押してください。",
            "進行を保存できませんでした。このまま移動しますか？",
            "保存せずに移動",
            "しばらくして",
            "黒い薬を飲み込むと、喉の奥が冷たくなる。",
            "部屋の日差しがガラスのようにひび割れる。",
            "蛍光灯の光の下で目を覚ます。",
            "ピンクの薬が舌の上で甘く溶ける。",
            "暗い保健室が春の光の中へほどけていく。",
            "校門の向こうで始業の鐘が鳴る。",
            "視界が狭くなっています。画面を横向きにして教室全体を確認してください。",
            "縦向きに持つと、四月の校門と会話をより見やすく楽しめます。"
        ],
        es: [
            "Ante la puerta",
            "Aún queda dulzor en la lengua. Estabas en la enfermería, pero ahora suena el timbre al otro lado de la puerta.",
            "Al abrir los ojos",
            "Un fluorescente brilla sobre tu cabeza en lugar de la lámpara de la mesilla. La voz suena igual, pero el dormitorio ha desaparecido.",
            "Empezar el primer día",
            "Continuar la partida",
            "Pantalla de título",
            "Guarda hasta aquí y pasa a la otra historia.",
            "Tienes una partida guardada. Puedes continuar donde lo dejaste o volver a empezar desde el primer día.",
            "La historia vuelve a empezar en abril, en tu primer día en el nuevo colegio.",
            "Cruzar",
            "Volver a la escena",
            "Si no se abre la página, pulsa de nuevo.",
            "No se pudo guardar el progreso. ¿Salir de todos modos?",
            "Salir sin guardar",
            "Un momento después",
            "Tragas la pastilla negra y el frío te recorre la garganta.",
            "La luz del cuarto se agrieta como un cristal.",
            "Abres los ojos bajo un fluorescente frío.",
            "La pastilla rosa se funde dulce en tu lengua.",
            "La enfermería oscura se disuelve en luz de primavera.",
            "Al otro lado del portón suena el timbre escolar.",
            "Tu campo de visión se estrecha. Gira la pantalla en horizontal para ver toda el aula.",
            "Sostén el dispositivo en vertical para ver mejor la puerta de abril y los diálogos."
        ],
        fr: [
            "Devant le portail",
            "Le goût sucré reste sur ta langue. Tu étais à l’infirmerie. Maintenant, la sonnerie retentit derrière le portail.",
            "En ouvrant les yeux",
            "Un néon brille au-dessus de ta tête à la place de la lampe de chevet. La voix est la même, mais la chambre a disparu.",
            "Repartir du premier jour",
            "Reprendre la sauvegarde",
            "Écran titre",
            "Sauvegarde ici, puis passe à l’autre histoire.",
            "Une partie est sauvegardée. Reprends là où tu en étais ou recommence au premier jour.",
            "L’histoire reprend en avril, le jour de ton arrivée dans cette école.",
            "Traverser",
            "Revenir à la scène",
            "Si la page ne s’ouvre pas, appuie à nouveau.",
            "La progression n’a pas pu être sauvegardée. Partir quand même ?",
            "Partir sans sauvegarder",
            "Un instant plus tard",
            "Tu avales le comprimé noir et ta gorge se glace.",
            "La lumière de la chambre se fissure comme du verre.",
            "Tu ouvres les yeux sous la lueur d’un néon.",
            "Le comprimé rose fond doucement sur ta langue.",
            "L’infirmerie sombre se dissout dans la lumière du printemps.",
            "Derrière le portail, la sonnerie retentit.",
            "Votre champ de vision rétrécit. Tournez l’écran à l’horizontale pour voir toute la classe.",
            "Tiens ton appareil à la verticale pour mieux profiter du portail d’avril et des dialogues."
        ],
        de: [
            "Vor dem Schultor",
            "Der süße Geschmack liegt noch auf deiner Zunge. Du warst im Krankenzimmer. Jetzt läutet hinter dem Tor die Schulglocke.",
            "Wenn du die Augen öffnest",
            "Statt der Nachttischlampe leuchtet über dir eine Leuchtstoffröhre. Die Stimme klingt wie eben, doch das Schlafzimmer ist verschwunden.",
            "Am ersten Tag beginnen",
            "Spielstand fortsetzen",
            "Zum Titel",
            "Hier speichern und in die andere Geschichte wechseln.",
            "Ein Spielstand ist vorhanden. Setze ihn fort oder beginne noch einmal am ersten Tag.",
            "Die Geschichte beginnt erneut im April, an deinem ersten Tag an der neuen Schule.",
            "Hinübergehen",
            "Zurück zur Szene",
            "Falls die Seite nicht geöffnet wurde, drücke erneut.",
            "Der Fortschritt konnte nicht gespeichert werden. Trotzdem wechseln?",
            "Ohne Speichern wechseln",
            "Einen Moment später",
            "Du schluckst die schwarze Tablette und dein Hals wird eiskalt.",
            "Das Sonnenlicht im Zimmer springt wie Glas.",
            "Du öffnest die Augen unter grellem Neonlicht.",
            "Die rosa Tablette schmilzt süß auf deiner Zunge.",
            "Das dunkle Krankenzimmer löst sich im Frühlingslicht auf.",
            "Hinter dem Schultor läutet die Schulglocke.",
            "Dein Sichtfeld ist verengt. Drehe den Bildschirm quer, um das ganze Klassenzimmer zu sehen.",
            "Im Hochformat wirken das Schultor im April und die Dialoge noch angenehmer."
        ],
        pt: [
            "Diante do portão",
            "O doce ainda está na língua. Estavas na enfermaria, mas agora o sinal toca do outro lado do portão.",
            "Ao abrir os olhos",
            "Uma luz fluorescente brilha sobre a tua cabeça no lugar do candeeiro de cabeceira. A voz soa igual, mas o quarto desapareceu.",
            "Começar no primeiro dia",
            "Continuar a partida",
            "Tela inicial",
            "Salva o progresso até aqui e passa para a outra história.",
            "Tens uma partida salva. Podes continuar de onde paraste ou recomeçar no primeiro dia.",
            "A história recomeça em abril, no teu primeiro dia na nova escola.",
            "Atravessar",
            "Voltar à cena",
            "Se a página não abriu, pressiona novamente.",
            "Não foi possível salvar o progresso. Sair mesmo assim?",
            "Sair sem salvar",
            "Um momento depois",
            "Engoles o comprimido preto e a garganta arrefece.",
            "A luz do quarto parte-se como vidro.",
            "Abres os olhos sob uma luz fluorescente fria.",
            "O comprimido rosa derrete doce na tua língua.",
            "A enfermaria escura dissolve-se na luz da primavera.",
            "Do outro lado do portão toca o sinal da escola.",
            "A tua visão está estreita. Gira o ecrã na horizontal para ver toda a sala de aula.",
            "Segura o dispositivo na vertical para ver melhor o portão de abril e os diálogos."
        ],
        zh: [
            "校门前",
            "舌尖上还残留着甜味。明明刚才还在保健室，校门外却响起了上学的铃声。",
            "睁开眼睛",
            "床边的台灯不见了，头顶亮着日光灯。传来的声音和刚才一样，卧室却消失了。",
            "从第一天开始",
            "继续之前的记录",
            "回到标题",
            "保存到这里，然后进入另一个故事。",
            "这里有已保存的进度。可以接着玩，也可以从第一天重新开始。",
            "故事将再次从四月、转学第一天开始。",
            "前往",
            "返回场景",
            "如果页面没有打开，请再点一次。",
            "进度保存失败。要就这样离开吗？",
            "不保存直接离开",
            "片刻之后",
            "吞下黑色药片后，喉咙一阵发凉。",
            "房间里的阳光像玻璃一样裂开。",
            "你在冷白的日光灯下睁开眼睛。",
            "粉色药片在舌尖泛起甜味慢慢融化。",
            "昏暗的保健室在春日阳光中散开。",
            "校门外响起了上学的铃声。",
            "视野变窄了。请将屏幕横过来，看清整间教室。",
            "竖屏握持，能更舒适地欣赏四月的校门与对话。"
        ]
    };
    const STYLE = `
    #cross-world{position:fixed;inset:0;z-index:30000;box-sizing:border-box;color:#eeeae2;background:#080d10;isolation:isolate;overflow:auto;overscroll-behavior:contain;font-family:inherit;--cw-ink:#080d10}
    #cross-world *{box-sizing:border-box}#cross-world.cw-out{pointer-events:none}
    #cross-world:before,#cross-world:after{content:'';position:fixed;left:0;right:0;height:51%;z-index:6;background:#050609;pointer-events:none;transition:transform .65s cubic-bezier(.65,0,.35,1)}
    #cross-world:before{top:0;transform:translateY(-100%);animation:cw-open-top .95s cubic-bezier(.2,.7,.2,1) both}#cross-world:after{bottom:0;transform:translateY(100%);animation:cw-open-bottom .95s cubic-bezier(.2,.7,.2,1) both}
    #cross-world.cw-out:before,#cross-world.cw-out:after{animation:none;transform:translateY(0)}
    @keyframes cw-open-top{from{transform:translateY(0)}to{transform:translateY(-100%)}}@keyframes cw-open-bottom{from{transform:translateY(0)}to{transform:translateY(100%)}}
    #cross-world.cw-spring:before,#cross-world.cw-spring:after{width:51%;height:100%;top:0;bottom:auto}
    #cross-world.cw-spring:before{left:0;right:auto;transform:translateX(-100%);animation-name:cw-open-left}#cross-world.cw-spring:after{right:0;left:auto;transform:translateX(100%);animation-name:cw-open-right}
    #cross-world.cw-spring.cw-out:before,#cross-world.cw-spring.cw-out:after{transform:translateX(0)}
    @keyframes cw-open-left{from{transform:translateX(0)}to{transform:translateX(-100%)}}@keyframes cw-open-right{from{transform:translateX(0)}to{transform:translateX(100%)}}
    #cross-world.cw-spring{background:#201b22;color:#fff4f1;--cw-accent:#f0b9c9;--cw-ink:#201b22}#cross-world.cw-lab{--cw-accent:#a8d6c2}
    #cross-world .cw-haze{position:absolute;inset:0;background:radial-gradient(ellipse at 80% 35%,#a8d6c21a,transparent 65%);pointer-events:none}#cross-world.cw-spring .cw-haze{background:radial-gradient(ellipse at 80% 35%,#f0b9c921,transparent 65%)}
    #cross-world .cw-layout{position:relative;min-height:100%;min-height:100dvh;max-width:1600px;margin:auto;display:grid;grid-template-columns:minmax(0, .85fr) minmax(0, 1.15fr);align-items:center;padding:max(28px,env(safe-area-inset-top)) max(44px,env(safe-area-inset-right)) max(28px,env(safe-area-inset-bottom)) max(44px,env(safe-area-inset-left));gap:3vw}
    #cross-world .cw-art{grid-column:2;grid-row:1;position:relative;align-self:center;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
    #cross-world .cw-art:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,var(--cw-ink),transparent 12%,transparent 90%,var(--cw-ink));box-shadow:inset 0 0 90px 18px #080d1066;pointer-events:none}
    #cross-world .cw-art img{display:block;width:100%;height:auto;max-height:calc(100dvh - 80px);object-fit:contain;object-position:center;opacity:0;filter:brightness(.55);transform:scale(1.06);transition:opacity 1.8s cubic-bezier(.22,.61,.36,1),filter 1.8s ease,transform 3.6s cubic-bezier(.16,1,.3,1)}
    #cross-world.cw-ready .cw-art img{opacity:1;filter:brightness(1);transform:scale(1)}
    #cross-world .cw-copy{grid-column:1;grid-row:1;position:relative;max-width:520px;padding:16px 0;animation:cw-reveal .95s .45s cubic-bezier(.22,.61,.36,1) both}
    #cross-world .cw-route{display:flex;align-items:center;gap:14px;color:var(--cw-accent);font:10px/1.5 ui-monospace,monospace;letter-spacing:.14em;margin-bottom:28px}
    #cross-world .cw-route span{display:flex;flex-direction:column;gap:3px}#cross-world .cw-route b{font-size:24px;font-weight:400;letter-spacing:-.04em}#cross-world .cw-route i{width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--cw-accent));position:relative}#cross-world .cw-route i:after{content:'';position:absolute;right:0;top:-2px;width:5px;height:5px;border-top:1px solid;border-right:1px solid;transform:rotate(45deg)}
    #cross-world .cw-route span:first-child{opacity:.55}
    #cross-world .cw-eyebrow{display:flex;align-items:center;gap:12px;margin:0 0 22px;font:11px/1.5 ui-monospace,monospace;letter-spacing:.19em;color:var(--cw-accent)}
    #cross-world .cw-eyebrow:before{content:'';display:block;width:28px;height:1px;background:currentColor}
    #cross-world h2{font-family:Georgia,'Noto Serif KR',serif;font-size:clamp(28px,3.4vw,54px);font-weight:400;line-height:1.28;letter-spacing:-.04em;margin:0 0 20px;word-break:keep-all;overflow-wrap:anywhere}
    #cross-world .cw-story{font-size:clamp(14px,1.25vw,17px);line-height:1.9;color:#f3eee6;word-break:keep-all;overflow-wrap:anywhere;margin:0 0 24px;max-width:38em}
    #cross-world .cw-rule{width:48px;height:1px;background:var(--cw-accent);opacity:.5;margin:0 0 18px}
    #cross-world .cw-orient-tip{margin:0 0 16px;padding:11px 14px;display:flex;align-items:center;gap:13px;word-break:keep-all;overflow-wrap:anywhere;position:relative}
    #cross-world .cw-orient-tip[hidden]{display:none}
    #cross-world .cw-orient-body{display:flex;flex-direction:column;gap:3px;min-width:0}
    #cross-world .cw-orient-tag{font:9px/1.3 ui-monospace,monospace;letter-spacing:.16em;color:var(--cw-accent);opacity:.9}
    #cross-world .cw-orient-text{font-size:12.5px;line-height:1.55;color:#f6f0ea}
    #cross-world.cw-lab .cw-orient-tip{background:linear-gradient(90deg,#a8d6c218,#0b1317c4 72%);border:1px solid #a8d6c23a;border-left:3px solid #a8d6c2;border-radius:2px;box-shadow:inset 0 0 24px #a8d6c20a}
    #cross-world.cw-lab .cw-orient-icon{flex:0 0 auto;width:15px;height:24px;border:1.5px solid #a8d6c2;border-radius:3px;position:relative;box-shadow:0 0 10px #a8d6c238;animation:cw-tilt-land 2.8s ease-in-out infinite}
    #cross-world.cw-lab .cw-orient-icon:after{content:'';position:absolute;left:50%;bottom:2.5px;width:4px;height:1.5px;transform:translateX(-50%);background:#a8d6c2;border-radius:1px}
    #cross-world.cw-spring .cw-orient-tip{background:linear-gradient(90deg,#f0b9c920,#2e222cc4 76%);border:1px solid #f0b9c947;border-radius:8px;box-shadow:0 4px 18px #0000002e,inset 0 1px 0 #fff2f618}
    #cross-world.cw-spring .cw-orient-icon{flex:0 0 auto;width:22px;height:14px;border:1.5px solid #f0b9c9;border-radius:3px;position:relative;box-shadow:0 0 10px #f0b9c93d;animation:cw-tilt-port 2.8s ease-in-out infinite}
    #cross-world.cw-spring .cw-orient-icon:after{content:'';position:absolute;right:2.5px;top:50%;width:1.5px;height:4px;transform:translateY(-50%);background:#f0b9c9;border-radius:1px}
    @keyframes cw-tilt-land{0%,22%{transform:rotate(0deg)}52%,78%{transform:rotate(-90deg)}100%{transform:rotate(0deg)}}
    @keyframes cw-tilt-port{0%,22%{transform:rotate(0deg)}52%,78%{transform:rotate(90deg)}100%{transform:rotate(0deg)}}
    #cross-world .cw-note{font-size:12px;line-height:1.65;color:#d0c9c5;margin:0 0 16px;overflow-wrap:anywhere}
    #cross-world .cw-actions{display:flex;flex-wrap:wrap;gap:8px 12px;transition:opacity .65s ease,transform .65s ease}
    #cross-world.cw-intro-lock .cw-actions{opacity:0;transform:translateY(8px);pointer-events:none}
    #cross-world button{font:inherit;font-size:13px;line-height:1.4;letter-spacing:0;min-height:46px;max-width:100%;padding:12px 16px;border:1px solid #ffffff40;border-image:none;border-radius:2px;background:#101619d9;color:inherit;cursor:pointer;box-shadow:none;text-shadow:none;white-space:normal;word-break:normal;overflow-wrap:anywhere;touch-action:manipulation;transition:background .2s,border-color .2s}
    #cross-world button.cw-primary{background:var(--cw-accent);border-color:var(--cw-accent);color:#172121}#cross-world button:hover{border-color:var(--cw-accent)}#cross-world button:focus-visible{outline:2px solid #fff;outline-offset:4px}#cross-world button:disabled{opacity:.6;cursor:wait}
    #cross-world button{border-image:none!important}
    #cross-world .cw-foot{margin:18px 0 0;font:10px/1.6 ui-monospace,monospace;letter-spacing:.12em;color:#b7b5b0}
    #cross-world.cw-seq{overflow:hidden;background:#05070a}
    #cross-world.cw-seq:before{animation:none;transform:translateY(-100%)}
    #cross-world.cw-seq:after{animation:none;transform:translateY(100%)}
    #cross-world.cw-seq.cw-spring:before{transform:translateX(-100%)}
    #cross-world.cw-seq.cw-spring:after{transform:translateX(100%)}
    #cross-world.cw-seq.cw-out:before,#cross-world.cw-seq.cw-out:after{transform:translate(0,0)}
    #cross-world .cw-seq-stage{position:relative;width:100%;height:100%;height:100dvh;overflow:hidden}
    #cross-world .cw-seq-layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;z-index:1;transition:opacity 1.2s cubic-bezier(.22,.61,.36,1);pointer-events:none}
    #cross-world .cw-seq-layer.cw-layer-on{opacity:1}
    #cross-world .cw-seq-bg{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;filter:blur(22px) brightness(.44) saturate(1.1);pointer-events:none}
    #cross-world .cw-seq-frame{position:relative;z-index:1;max-width:min(92vw,1220px);max-height:min(70dvh,840px);width:auto;height:auto;object-fit:contain;border-radius:2px;box-shadow:0 24px 80px #000c,0 0 0 1px #ffffff20;filter:brightness(.55);transform:scale(1.06);transition:transform 2.4s cubic-bezier(.16,1,.3,1),filter 1.35s ease}
    #cross-world .cw-seq-layer.cw-layer-on .cw-seq-frame{filter:brightness(1);transform:scale(1)}
    #cross-world .cw-seq-vignette{position:absolute;inset:0;z-index:3;background:radial-gradient(circle at center,transparent 42%,#05070acc 100%);pointer-events:none}
    #cross-world .cw-seq-flash{position:absolute;inset:0;z-index:4;opacity:0;pointer-events:none;background:radial-gradient(circle at center,#fff9f4 0%,var(--cw-accent) 48%,transparent 85%);mix-blend-mode:screen;transition:opacity .45s ease}
    #cross-world.cw-fx-flash .cw-seq-flash{opacity:.48}
    #cross-world.cw-fx-glitch .cw-seq-layer.cw-layer-on .cw-seq-frame{animation:cw-glitch-hit .44s steps(2,end)}
    #cross-world.cw-fx-bloom .cw-seq-layer.cw-layer-on .cw-seq-frame{filter:brightness(1.06) saturate(1.06)}
    #cross-world .cw-seq-caption{position:fixed;left:50%;bottom:max(28px,calc(env(safe-area-inset-bottom) + 20px));transform:translateX(-50%);z-index:5;width:min(640px,calc(100vw - 32px));padding:13px 18px;text-align:center;font-family:Georgia,'Noto Serif KR',serif;font-size:clamp(15px,2.1vw,19px);line-height:1.6;color:#f7f2eb;background:#070a0ed1;border:1px solid #ffffff24;border-bottom-color:var(--cw-accent);word-break:keep-all;overflow-wrap:anywhere;pointer-events:none;opacity:0;transition:opacity .65s ease}
    #cross-world.cw-caption-on .cw-seq-caption{opacity:1}
    #cross-world .cw-seq-progress{position:fixed;left:0;right:0;bottom:0;height:2px;z-index:5;background:#ffffff1a;pointer-events:none}
    #cross-world .cw-seq-progress i{display:block;width:100%;height:100%;background:var(--cw-accent);transform-origin:left center;transform:scaleX(0);transition:transform linear}
    #cross-world .cw-seq-fallback{position:fixed;top:max(16px,env(safe-area-inset-top));right:max(16px,env(safe-area-inset-right));z-index:7;display:flex;align-items:center;gap:10px;background:#0a0e13eb;padding:10px 14px;border:1px solid #ffffff33}
    #cross-world .cw-seq-fallback[hidden]{display:none}
    @keyframes cw-glitch-hit{0%{transform:translate(0,0) scale(1.04);filter:contrast(1.22) hue-rotate(-14deg)}35%{transform:translate(-5px,2px) scale(1.03);filter:contrast(1.32) brightness(1.12)}70%{transform:translate(4px,-2px) scale(1.01)}100%{transform:translate(0,0) scale(1)}}
    @keyframes cw-reveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @media(max-width:1024px) and (orientation:portrait){
        #cross-world .cw-layout{display:flex;flex-direction:column;justify-content:center;gap:0;padding:max(20px,env(safe-area-inset-top)) max(28px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(28px,env(safe-area-inset-left))}
        #cross-world .cw-art{width:100%;height:38dvh;min-height:170px;flex:0 1 auto;align-self:center}
        #cross-world .cw-art img{height:100%;max-height:44dvh;width:100%;object-fit:contain}
        #cross-world .cw-art:after{background:linear-gradient(0deg,var(--cw-ink),transparent 28%,transparent 90%,var(--cw-ink));box-shadow:none}
        #cross-world .cw-copy{width:100%;max-width:620px;padding:20px 0 0}
        #cross-world .cw-eyebrow{margin-bottom:12px}
        #cross-world h2{margin-bottom:12px}
        #cross-world .cw-story{margin-bottom:18px}
        #cross-world .cw-rule{margin-bottom:14px}
    }
    @media(max-width:650px) and (orientation:portrait){
        #cross-world .cw-layout{padding:max(16px,env(safe-area-inset-top)) max(22px,env(safe-area-inset-right)) max(18px,env(safe-area-inset-bottom)) max(22px,env(safe-area-inset-left))}
        #cross-world .cw-art{width:calc(100% + 44px);height:32dvh;min-height:145px;flex-shrink:0}
        #cross-world .cw-art img{height:100%;max-height:42dvh;object-fit:cover;object-position:center 32%}
        #cross-world .cw-copy{padding:16px 0 0}
        #cross-world .cw-route{margin-bottom:14px;gap:12px}
        #cross-world .cw-route span{flex-direction:row;align-items:baseline;gap:7px}
        #cross-world .cw-route b{font-size:18px}
        #cross-world .cw-route i{width:34px}
        #cross-world .cw-eyebrow{display:none}
        #cross-world h2{font-size:28px;margin-bottom:10px}
        #cross-world .cw-story{font-size:14px;line-height:1.75;margin-bottom:14px}
        #cross-world .cw-note{margin-bottom:12px}
        #cross-world .cw-foot{margin-top:12px}
        #cross-world .cw-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
        #cross-world .cw-actions:has(button:nth-child(3)) .cw-primary{grid-column:1/-1}
        #cross-world .cw-actions button{flex:1 1 auto;padding:10px 12px}
    }
    @media(max-width:650px) and (min-height:751px) and (orientation:portrait){#cross-world .cw-art{height:36dvh}}
    @media(max-width:650px) and (min-height:651px) and (max-height:750px) and (orientation:portrait){#cross-world .cw-art{height:27dvh}#cross-world .cw-route{display:none}}
    @media(max-width:650px) and (max-height:650px) and (orientation:portrait){
        #cross-world .cw-layout{padding-top:max(12px,env(safe-area-inset-top));padding-bottom:max(12px,env(safe-area-inset-bottom))}
        #cross-world .cw-art{height:20dvh;min-height:92px}
        #cross-world .cw-art img{max-height:28dvh}
        #cross-world .cw-copy{padding-top:10px}
        #cross-world h2{font-size:25px;margin-bottom:8px}
        #cross-world .cw-story{font-size:13px;line-height:1.65;margin-bottom:8px}
        #cross-world .cw-rule,#cross-world .cw-note{margin-bottom:8px}
        #cross-world .cw-foot{margin-top:8px}
    }
    @media(max-height:540px) and (orientation:landscape){
        #cross-world .cw-layout{padding:max(10px,env(safe-area-inset-top)) max(20px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left));grid-template-columns:1.15fr .85fr;gap:16px}
        #cross-world .cw-copy{padding:0}
        #cross-world .cw-route,#cross-world .cw-rule{display:none}
        #cross-world .cw-eyebrow{margin-bottom:6px;font-size:9px}
        #cross-world h2{font-size:clamp(21px,3vw,26px);margin-bottom:6px}
        #cross-world .cw-story{font-size:12px;line-height:1.55;margin-bottom:8px}
        #cross-world .cw-orient-tip{margin-bottom:9px;padding:7px 11px;gap:10px}
        #cross-world .cw-orient-tag{font-size:8px}
        #cross-world .cw-orient-text{font-size:11px;line-height:1.45}
        #cross-world.cw-spring .cw-orient-icon{width:19px;height:12px}
        #cross-world .cw-note{font-size:11px;line-height:1.45;margin-bottom:8px}
        #cross-world .cw-foot{margin-top:8px;font-size:9px}
        #cross-world .cw-art img{max-height:calc(100dvh - 20px)}
        #cross-world button{font-size:12px;padding:8px 12px;min-height:40px}
        #cross-world .cw-seq-frame{max-height:74dvh}
        #cross-world .cw-seq-caption{bottom:max(14px,env(safe-area-inset-bottom));padding:9px 14px;font-size:14px}
    }
    @media(max-height:650px){#cross-world .cw-route{display:none}}
    #cross-world.cw-image-error .cw-art img{visibility:hidden}#cross-world.cw-image-error .cw-art{background:radial-gradient(ellipse at 50% 30%,#a8d6c222,transparent 70%)}
    @media(prefers-reduced-motion:reduce){#cross-world,#cross-world *,#cross-world:before,#cross-world:after{animation:none!important;transition:none!important}#cross-world .cw-art img,#cross-world .cw-seq-frame{transform:none!important;filter:none!important}}
    `;
    let active = null;
    let backLockBound = false;
    let guardWorld = null;
    const preloaded = new Set();
    const cleanName = value => Array.from(String(value || '').replace(/[<>\x00-\x1f\x7f]/g, '').trim()).slice(0, 24).join('');
    function safeUnlockOrientation() {
        try {
            if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.unlock === 'function') {
                screen.orientation.unlock();
            }
        } catch (_) {}
    }
    function requestLandscape() {
        try {
            if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.lock === 'function') {
                const promise = screen.orientation.lock('landscape');
                if (promise && typeof promise.catch === 'function') promise.catch(() => {});
            }
        } catch (_) {}
    }
    function navigateReplace(url) {
        if (typeof location.replace === 'function') location.replace(url);
        else location.assign(url);
    }
    function readDeparted() {
        try {
            if (typeof sessionStorage === 'undefined' || !sessionStorage) return null;
            const raw = sessionStorage.getItem(DEPART_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || typeof data.url !== 'string' || !Number.isFinite(data.at)) return null;
            const age = Date.now() - data.at;
            if (age < 0 || age >= DEPART_TTL_MS) {
                sessionStorage.removeItem(DEPART_KEY);
                return null;
            }
            return data;
        } catch (_) {
            return null;
        }
    }
    function markDeparted(world, url) {
        try {
            if (typeof sessionStorage !== 'undefined' && sessionStorage && url) {
                sessionStorage.setItem(DEPART_KEY, JSON.stringify({ world, url: String(url), at: Date.now() }));
            }
        } catch (_) {}
    }
    function clearDeparted() {
        try {
            if (typeof sessionStorage !== 'undefined' && sessionStorage) sessionStorage.removeItem(DEPART_KEY);
        } catch (_) {}
    }
    function hasRecentDeparture(world) {
        const entry = readDeparted();
        return Boolean(entry && (!world || entry.world === world));
    }
    function cookieSuffix(age) {
        const host = location.hostname;
        const domain = host === 'archerlab.dev' || host.endsWith('.archerlab.dev') ? '; Domain=.archerlab.dev' : '';
        return `; Path=/; Max-Age=${age}; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
    }
    function remember(target, name) {
        try { document.cookie = `archer_crossing_v1=${encodeURIComponent(JSON.stringify({ target, name: cleanName(name), at: Date.now() }))}${cookieSuffix(600)}`; } catch (_) {}
    }
    function ensureStyle() {
        if (typeof document === 'undefined' || !document.head || document.getElementById('cross-world-style')) return;
        const style = document.createElement('style');
        style.id = 'cross-world-style';
        style.textContent = STYLE;
        document.head.appendChild(style);
    }
    function pushBackGuard(world) {
        if (typeof history !== 'object' || !history || typeof history.pushState !== 'function') return;
        guardWorld = world;
        try {
            const cleanUrl = location.pathname + location.search + location.hash;
            const nextState = history.state && typeof history.state === 'object'
                ? Object.assign({}, history.state, { crossWorldGuard: world })
                : { crossWorldGuard: world };
            history.pushState(nextState, '', cleanUrl);
            if (!backLockBound && typeof window.addEventListener === 'function') {
                backLockBound = true;
                window.addEventListener('popstate', () => {
                    if (!guardWorld) return;
                    try {
                        const curUrl = location.pathname + location.search + location.hash;
                        history.pushState({ crossWorldGuard: guardWorld }, '', curUrl);
                    } catch (_) {}
                });
            }
        } catch (_) {}
    }
    function computeOrientationNotice(world, copy) {
        if (typeof window === 'undefined') return '';
        const w = Number(window.innerWidth) || 0;
        const h = Number(window.innerHeight) || 0;
        if (!w || !h) return '';
        const portrait = h > w;
        const landscape = w > h;
        const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(any-pointer: coarse)').matches;
        if (world === 'nevergrad' && portrait && (coarse || w <= 1024)) {
            return copy[22] || '';
        }
        if (world === 'cupid' && landscape && h <= 540 && (coarse || w <= 1024)) {
            return copy[23] || '';
        }
        return '';
    }
    function takeArrival(world) {
        const url = new URL(location.href);
        const arrival = world === 'cupid' ? url.searchParams.get('gate') === '1' : url.searchParams.get('from') === 'riin';
        if (!arrival) return null;
        clearDeparted();
        if (world === 'cupid') safeUnlockOrientation();
        let name = '';
        try {
            const entry = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith('archer_crossing_v1='));
            const data = entry ? JSON.parse(decodeURIComponent(entry.slice('archer_crossing_v1='.length))) : null;
            if (((data === null || data === void 0 ? void 0 : data.target)) === world && Number.isFinite(data.at) && Date.now() - data.at >= 0 && Date.now() - data.at < 600000) name = cleanName(data.name);
            document.cookie = `archer_crossing_v1=${cookieSuffix(0)}`;
        } catch (_) {}
        url.searchParams.delete(world === 'cupid' ? 'gate' : 'from');
        try { history.replaceState(history.state, '', url.pathname + url.search + url.hash); } catch (_) {}
        pushBackGuard(world);
        return { name };
    }
    function preload(urls) {
        if (typeof Image !== 'function' || !Array.isArray(urls)) return;
        urls.forEach(src => {
            if (!src || preloaded.has(src)) return;
            preloaded.add(src);
            try { const img = new Image(); img.src = src; } catch (_) {}
        });
    }
    async function departSequence(options) {
        const opts = options || {};
        if (active) {
            try { active.close(); } catch (_) {}
        }
        const copy = COPY[opts.lang] || COPY.en;
        const spring = opts.world === 'cupid';
        const frames = Array.isArray(opts.frames) && opts.frames.length
            ? opts.frames
            : [{ image: opts.image, captionIndex: spring ? 21 : 18, fx: spring ? 'bloom' : 'glitch' }];
        try { Promise.resolve(opts.save && opts.save()).catch(() => {}); } catch (_) {}
        remember(opts.world, opts.name);
        markDeparted(opts.world, opts.url);
        safeUnlockOrientation();
        try { opts.onLeave && opts.onLeave(); } catch (error) { console.warn('[CrossWorld] leave hook failed', error); }
        preload(frames.map(f => f && f.image));

        const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (typeof document === 'undefined' || !document.body) {
            try { navigateReplace(opts.url); } catch (_) {}
            return null;
        }
        ensureStyle();
        const root = document.createElement('section');
        root.id = 'cross-world';
        root.className = `cw-seq ${spring ? 'cw-spring' : 'cw-lab'}`;
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', spring ? 'CUPID' : 'NEVERGRAD');
        root.setAttribute('aria-busy', 'true');
        root.innerHTML = '<div class="cw-seq-stage"><div class="cw-seq-layer" data-slot="0"><img class="cw-seq-bg" alt="" aria-hidden="true"><img class="cw-seq-frame" alt=""></div><div class="cw-seq-layer" data-slot="1"><img class="cw-seq-bg" alt="" aria-hidden="true"><img class="cw-seq-frame" alt=""></div><div class="cw-seq-vignette" aria-hidden="true"></div><div class="cw-seq-flash" aria-hidden="true"></div></div><p class="cw-seq-caption" role="status" aria-live="polite"></p><div class="cw-seq-progress" aria-hidden="true"><i></i></div><div class="cw-seq-fallback" hidden><span class="cw-note"></span><button type="button" class="cw-primary"></button></div>';

        const inert = [...document.body.children]
            .filter(el => el instanceof HTMLElement && !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName))
            .map(el => [el, el.inert]);
        inert.forEach(([el]) => { el.inert = true; });
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.body.appendChild(root);

        const layers = [...root.querySelectorAll('.cw-seq-layer')];
        const captionEl = root.querySelector('.cw-seq-caption');
        const progressBar = root.querySelector('.cw-seq-progress i');
        const fallbackBox = root.querySelector('.cw-seq-fallback');
        const fallbackNote = fallbackBox.querySelector('.cw-note');
        const fallbackBtn = fallbackBox.querySelector('button');
        fallbackNote.textContent = copy[12];
        fallbackBtn.textContent = copy[10];
        fallbackBtn.addEventListener('click', () => {
            markDeparted(opts.world, opts.url);
            try { navigateReplace(opts.url); } catch (_) {}
        });

        let cancelled = false;
        let retryTimer = null;
        let slotIndex = 0;
        let hideOldTimer = null;
        const SHIELD_EVENTS = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'keydown', 'keyup', 'wheel'];
        const blockMashInput = event => {
            if (fallbackBox && !fallbackBox.hidden && fallbackBtn && (event.target === fallbackBtn || (fallbackBtn.contains && fallbackBtn.contains(event.target)))) {
                return;
            }
            if (event && event.cancelable) event.preventDefault();
            if (event && typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        };
        if (typeof window.addEventListener === 'function') {
            SHIELD_EVENTS.forEach(evt => window.addEventListener(evt, blockMashInput, true));
        }

        const cleanup = () => {
            cancelled = true;
            clearTimeout(retryTimer);
            clearTimeout(hideOldTimer);
            root.remove();
            inert.forEach(([el, val]) => { el.inert = val; });
            document.body.style.overflow = originalOverflow;
            if (typeof window.removeEventListener === 'function') {
                SHIELD_EVENTS.forEach(evt => window.removeEventListener(evt, blockMashInput, true));
            }
            active = null;
        };
        active = { close: cleanup, element: root };

        const showFrame = (index) => {
            const item = frames[index];
            if (!item) return;
            const caption = item.caption || (Number.isInteger(item.captionIndex) ? copy[item.captionIndex] : '') || '';
            const incoming = layers[slotIndex % layers.length];
            const outgoing = layers[(slotIndex + 1) % layers.length];
            slotIndex += 1;

            root.classList.remove('cw-fx-glitch', 'cw-fx-bloom', 'cw-fx-flash');
            incoming.classList.remove('cw-layer-on');
            if (item.image) {
                incoming.querySelector('.cw-seq-bg').src = item.image;
                incoming.querySelector('.cw-seq-frame').src = item.image;
            }
            if (outgoing) outgoing.style.zIndex = '1';
            incoming.style.zIndex = '2';
            void incoming.offsetWidth;
            incoming.classList.add('cw-layer-on');
            clearTimeout(hideOldTimer);
            if (outgoing && outgoing !== incoming) {
                hideOldTimer = setTimeout(() => {
                    if (!cancelled) outgoing.classList.remove('cw-layer-on');
                }, reduced ? 0 : 1200);
            }
            root.classList.remove('cw-caption-on');
            captionEl.textContent = caption;
            void captionEl.offsetWidth;
            root.classList.add('cw-caption-on');
            if (item.fx) root.classList.add(`cw-fx-${item.fx}`);
            if (index === 1 && !reduced) root.classList.add('cw-fx-flash');
            try { opts.onBeat && opts.onBeat(index, item); } catch (_) {}
        };

        const waitMs = ms => new Promise(resolve => setTimeout(resolve, ms));
        if (reduced) {
            showFrame(frames.length - 1);
            await waitMs(240);
        } else {
            const customBeat = Number(opts.beatMs) > 0 ? Number(opts.beatMs) : 0;
            const durations = Array.isArray(opts.durations) && opts.durations.length === frames.length
                ? opts.durations
                : frames.map((_, idx) => customBeat || (idx === 1 ? 1700 : 1500));
            const totalMs = durations.reduce((acc, v) => acc + v, 0);
            if (progressBar) {
                progressBar.style.transitionDuration = `${totalMs}ms`;
                void progressBar.offsetWidth;
                progressBar.style.transform = 'scaleX(1)';
            }
            for (let i = 0; i < frames.length; i++) {
                if (cancelled) return active;
                showFrame(i);
                await waitMs(durations[i]);
            }
            if (cancelled) return active;
            root.classList.add('cw-out');
            await waitMs(customBeat ? Math.min(customBeat, 480) : 650);
        }
        if (cancelled) return active;
        try {
            navigateReplace(opts.url);
        } catch (_) {
            clearDeparted();
            fallbackBox.hidden = false;
            root.setAttribute('aria-busy', 'false');
            return active;
        }
        retryTimer = setTimeout(() => {
            if (cancelled) return;
            clearDeparted();
            fallbackBox.hidden = false;
            root.classList.remove('cw-out');
            root.setAttribute('aria-busy', 'false');
        }, 3500);
        return active;
    }
    function show(options) { var __oc5;
        if (active) return active;
        const copy = COPY[options.lang] || COPY.en;
        const spring = options.world === 'cupid';
        const previousFocus = document.activeElement;
        const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
        const introLockMs = (options.departure || reduced)
            ? 0
            : (Number.isFinite(options.introLockMs) ? Math.max(0, options.introLockMs) : 2100);
        ensureStyle();
        const root = document.createElement('section');
        root.id = 'cross-world';
        root.className = (spring ? 'cw-spring' : 'cw-lab') + (introLockMs > 0 ? ' cw-intro-lock' : '');
        root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'cw-title'); root.setAttribute('aria-describedby', 'cw-story');
        root.tabIndex = -1;
        root.innerHTML = '<div class="cw-haze" aria-hidden="true"></div><div class="cw-layout"><div class="cw-art" aria-hidden="true"><img alt=""></div><div class="cw-copy"><div class="cw-route" aria-hidden="true"></div><p class="cw-eyebrow"></p><h2 id="cw-title"></h2><p class="cw-story" id="cw-story"></p><div class="cw-rule"></div><div class="cw-orient-tip" role="note" hidden><span class="cw-orient-icon" aria-hidden="true"></span><div class="cw-orient-body"><span class="cw-orient-tag"></span><span class="cw-orient-text"></span></div></div><p class="cw-note" role="status" aria-live="polite"></p><div class="cw-actions"></div><p class="cw-foot"></p></div></div>';
        const worlds = spring ? ['NEVERGRAD', '13', 'CUPID', '01'] : ['CUPID', '01', 'NEVERGRAD', '13'];
        root.querySelector('.cw-route').innerHTML = `<span>${worlds[0]}<b>${worlds[1]}</b></span><i></i><span>${worlds[2]}<b>${worlds[3]}</b></span>`;
        const text = (selector, value) => { root.querySelector(selector).textContent = value; };
        const art = root.querySelector('img');
        art.onload = () => root.classList.add('cw-ready');
        art.onerror = () => root.classList.add('cw-ready', 'cw-image-error');
        art.src = options.image;
        root.style.setProperty('--cw-image', `url("${new URL(options.image, document.baseURI).href}")`);
        text('.cw-eyebrow', spring ? 'CUPID / 01' : 'NEVERGRAD / 13');
        text('h2', copy[spring ? 0 : 2]); text('.cw-story', copy[spring ? 1 : 3]);
        text('.cw-note', options.departure ? copy[7] : copy[options.hasSave ? 8 : 9]);
        text('.cw-foot', options.departure ? `${options.world.toUpperCase()} ↗` : `CUPID × NEVERGRAD · ${copy[15]}`);

        const orientTipEl = root.querySelector('.cw-orient-tip');
        const orientTagEl = orientTipEl ? orientTipEl.querySelector('.cw-orient-tag') : null;
        const orientTextEl = orientTipEl ? orientTipEl.querySelector('.cw-orient-text') : null;
        const syncOrientationTip = () => {
            if (!orientTipEl) return;
            if (options.departure) {
                orientTipEl.hidden = true;
                if (orientTextEl) orientTextEl.textContent = '';
                return;
            }
            const msg = computeOrientationNotice(options.world, copy);
            if (msg) {
                if (orientTagEl) orientTagEl.textContent = options.world === 'nevergrad' ? 'DISPLAY // LANDSCAPE' : 'APRIL VIEW · PORTRAIT';
                if (orientTextEl) orientTextEl.textContent = msg;
                orientTipEl.hidden = false;
            } else {
                if (orientTextEl) orientTextEl.textContent = '';
                orientTipEl.hidden = true;
            }
        };
        syncOrientationTip();

        const inert = [...document.body.children].filter(el => el instanceof HTMLElement && !['SCRIPT','STYLE','LINK'].includes(el.tagName)).map(el => [el, el.inert]);
        inert.forEach(([el]) => { el.inert = true; });
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden'; document.body.appendChild(root);
        let retryTimer = null;
        let unlockTimer = null;
        let introLocked = introLockMs > 0;
        let leaving = false;
        let closed = false;
        let audioStopped = false;
        const cleanup = () => {
            closed = true; clearTimeout(retryTimer); clearTimeout(unlockTimer);
            root.remove(); inert.forEach(([el, value]) => { el.inert = value; }); document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', keys, true); window.removeEventListener('pageshow', restore);
            window.removeEventListener('resize', syncOrientationTip); window.removeEventListener('orientationchange', syncOrientationTip);
            active = null; if (((previousFocus === null || previousFocus === void 0 ? void 0 : previousFocus.isConnected))) previousFocus.focus({ preventScroll: true });
        };
        const close = async action => { var __oc0;
            if (introLocked) return;
            if (!options.departure && options.world === 'nevergrad') requestLandscape();
            if (!options.departure && options.world === 'cupid') safeUnlockOrientation();
            pushBackGuard(options.world);
            cleanup();
            try { await ((action === null || action === void 0 ? void 0 : action())); } catch (error) { console.error('[CrossWorld] entry failed', error); (((__oc0 = options.onTitle) === null || __oc0 === void 0 ? void 0 : __oc0.call(options))); }
        };
        const addButton = (label, action, primary = false) => {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
            if (primary) button.className = 'cw-primary';
            if (introLocked) button.disabled = true;
            button.addEventListener('click', event => { event.stopPropagation(); if (introLocked) return; action(button); });
            root.querySelector('.cw-actions').appendChild(button); return button;
        };
        const setBusy = busy => {
            leaving = busy; root.setAttribute('aria-busy', String(busy));
            root.querySelectorAll('button').forEach(el => { el.disabled = busy || introLocked; });
            if (busy) root.focus({ preventScroll: true });
        };
        const restore = () => { var __oc1, __oc2;
            if (closed) return;
            clearTimeout(retryTimer); root.classList.remove('cw-out'); setBusy(false);
            if (audioStopped) { audioStopped = false; try { Promise.resolve((((__oc1 = options.onReturn) === null || __oc1 === void 0 ? void 0 : __oc1.call(options)))).catch(() => {}); } catch (_) {} }
            if (!introLocked) (((__oc2 = root.querySelector('button')) === null || __oc2 === void 0 ? void 0 : __oc2.focus({ preventScroll: true })));
        };
        const depart = async button => { var __oc3, __oc4;
            if (leaving || introLocked) return;
            setBusy(true);
            if (!button.dataset.unsaved) {
                let saved = false; try { saved = (await (((__oc3 = options.save) === null || __oc3 === void 0 ? void 0 : __oc3.call(options)))) !== false; } catch (_) {}
                if (closed) return;
                if (!saved) { restore(); text('.cw-note', copy[13]); button.textContent = copy[14]; button.dataset.unsaved = '1'; return; }
            }
            remember(options.world, options.name);
            markDeparted(options.world, options.url);
            safeUnlockOrientation();
            try { audioStopped = true; (((__oc4 = options.onLeave) === null || __oc4 === void 0 ? void 0 : __oc4.call(options))); } catch (error) { console.warn('[CrossWorld] audio fade failed', error); }
            root.classList.add('cw-out');
            await new Promise(resolve => setTimeout(resolve, reduced ? 0 : 650));
            if (closed) return;
            try { navigateReplace(options.url); } catch (_) { clearDeparted(); restore(); text('.cw-note', copy[12]); return; }
            retryTimer = setTimeout(() => { clearDeparted(); restore(); text('.cw-note', copy[12]); }, 3500);
        };
        if (options.departure) {
            addButton(copy[10], depart, true); addButton(copy[11], () => close(options.onBack));
        } else {
            if (options.hasSave) addButton(copy[5], () => close(options.onContinue), true);
            addButton(copy[4], () => close(options.onNew), !options.hasSave);
            addButton(copy[6], () => close(options.onTitle));
        }
        const keys = event => {
            if (introLocked) {
                if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') {
                    event.preventDefault();
                }
                event.stopImmediatePropagation();
                return;
            }
            if (event.key === 'Escape' && !leaving) { event.preventDefault(); close(options.departure ? options.onBack : options.onTitle); }
            if (event.key === 'Tab') {
                const buttons = [...root.querySelectorAll('button:not(:disabled)')];
                if (!buttons.length) event.preventDefault();
                const index = buttons.indexOf(document.activeElement);
                if (buttons.length && ((event.shiftKey && index <= 0) || (!event.shiftKey && index === buttons.length - 1))) {
                    event.preventDefault(); buttons[event.shiftKey ? buttons.length - 1 : 0].focus();
                }
            }
            event.stopImmediatePropagation();
        };
        window.addEventListener('keydown', keys, true); window.addEventListener('pageshow', restore);
        window.addEventListener('resize', syncOrientationTip); window.addEventListener('orientationchange', syncOrientationTip);
        active = { close: () => { introLocked = false; return close(); }, element: root };
        if (introLocked) {
            root.focus({ preventScroll: true });
            unlockTimer = setTimeout(() => {
                if (closed) return;
                introLocked = false;
                root.classList.remove('cw-intro-lock');
                if (!leaving) {
                    root.querySelectorAll('button').forEach(el => { el.disabled = false; });
                    const firstBtn = root.querySelector('button');
                    if (firstBtn) firstBtn.focus({ preventScroll: true });
                }
            }, introLockMs);
        } else {
            (((__oc5 = root.querySelector('button')) === null || __oc5 === void 0 ? void 0 : __oc5.focus({ preventScroll: true })));
        }
        return active;
    }
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('pageshow', event => {
            const entry = readDeparted();
            if (!entry) return;
            if ((event && event.persisted) || hasRecentDeparture(entry.world)) {
                try {
                    const target = new URL(entry.url, location.href);
                    if (target.origin !== location.origin || target.pathname !== location.pathname) {
                        navigateReplace(entry.url);
                    }
                } catch (_) {
                    navigateReplace(entry.url);
                }
            }
        });
    }
    window.CrossWorld = { show, departSequence, preload, takeArrival, cleanName, hasRecentDeparture };
})();
