/**
 * ============================================================================
 * GlitchSystemAdvanced.js - 확장 글리치 연출 시스템
 * ============================================================================
 *
 * 기본 GlitchSystem.js의 개별 효과들을 조합하여
 * 시나리오 타임라인에 맞춘 점진적 글리치 연출을 제공합니다.
 *
 * [글리치 레벨]
 * NONE (Day 1): 효과 없음 — 완벽한 미연시
 * SUBTLE (Day 2 오후): 미세한 위화감 — 선택지 깜빡임, BGM 미세 변조
 * UNSETTLING (Day 3): 불쾌한 골짜기 — 노이즈, 텍스트 왜곡, 유령 텍스트
 * BREAKING (Day 4): 장르 전환 — 테마 색상 변환, 스탯 폭로, 강한 글리치
 * NIGHTMARE (Day 5): 완전 붕괴 — 화면 깨짐, 레드 비네트, BGM 왜곡
 *
 * [트리거 키]
 * - 'day2_night_stat_flicker': Day 2 밤 스탯 깜빡임
 * - 'day3_lunch_stat_shift': Day 3 점심 스탯 라벨 변환
 * - 'day3_after_riin_flicker': Day 3 리인 후 선택지 깜빡임
 * - 'day3_night_genre_shift': Day 3 밤 장르 전환
 * - 'day5_nightmare_full': Day 5 전면 붕괴
 */

class GlitchSystemAdvanced {
    // =========================================================================
    // Interactive photo deck and investigation scenes
    // =========================================================================

    showPhotoDeck(opts = {}) {
        this.hidePhotoDeck();

        const data = this._getPhotoDeckData(opts.deck || 'yuna_13');
        const photos = data.photos;
        const copy = this._getInteractionCopy(this._getLang());
        let index = 0;
        const viewed = new Set([0]);

        const overlay = document.createElement('div');
        overlay.className = 'photo-deck-overlay';
        overlay.id = 'photo-deck-overlay';

        const shell = document.createElement('div');
        shell.className = 'photo-deck-shell';

        const header = document.createElement('div');
        header.className = 'photo-deck-header';

        const title = document.createElement('div');
        title.className = 'photo-deck-title';
        title.textContent = data.title;

        const counter = document.createElement('div');
        counter.className = 'photo-deck-counter';

        header.appendChild(title);
        header.appendChild(counter);

        const viewport = document.createElement('div');
        viewport.className = 'photo-deck-viewport';

        const card = document.createElement('div');
        card.className = 'photo-deck-card';

        const scanline = document.createElement('div');
        scanline.className = 'photo-deck-scanline';

        const face = document.createElement('div');
        face.className = 'photo-deck-face';
        face.appendChild(document.createElement('span'));
        face.appendChild(document.createElement('span'));
        face.appendChild(document.createElement('span'));

        const meta = document.createElement('div');
        meta.className = 'photo-deck-meta';

        const slot = document.createElement('div');
        slot.className = 'photo-deck-slot';
        const name = document.createElement('div');
        name.className = 'photo-deck-name';
        const tag = document.createElement('div');
        tag.className = 'photo-deck-tag';
        const note = document.createElement('div');
        note.className = 'photo-deck-note';

        meta.appendChild(slot);
        meta.appendChild(name);
        meta.appendChild(tag);
        meta.appendChild(note);
        card.appendChild(scanline);
        card.appendChild(face);
        card.appendChild(meta);

        const prev = document.createElement('button');
        prev.className = 'photo-deck-nav photo-deck-prev';
        prev.type = 'button';
        prev.textContent = '\u2039';
        prev.setAttribute('aria-label', copy.previous);

        const next = document.createElement('button');
        next.className = 'photo-deck-nav photo-deck-next';
        next.type = 'button';
        next.textContent = '\u203a';
        next.setAttribute('aria-label', copy.next);

        viewport.appendChild(prev);
        viewport.appendChild(card);
        viewport.appendChild(next);

        const strip = document.createElement('div');
        strip.className = 'photo-deck-strip';

        const hint = document.createElement('div');
        hint.className = 'photo-deck-hint';
        hint.textContent = copy.photoHint;

        const complete = document.createElement('button');
        complete.className = 'photo-deck-complete hidden';
        complete.type = 'button';
        complete.textContent = copy.photoComplete;

        shell.appendChild(header);
        shell.appendChild(viewport);
        shell.appendChild(strip);
        shell.appendChild(hint);
        shell.appendChild(complete);
        overlay.appendChild(shell);
        document.body.appendChild(overlay);

        const render = (direction = 0) => {
            const photo = photos[index];
            viewed.add(index);

            card.classList.remove('photo-deck-card-in', 'photo-deck-card-prev', 'photo-deck-card-next', 'photo-deck-current');
            void card.offsetWidth;
            card.classList.add('photo-deck-card-in', direction < 0 ? 'photo-deck-card-prev' : 'photo-deck-card-next');
            if (photo.current) card.classList.add('photo-deck-current');

            const playerName = this.engine?.state?.playerName || copy.player;
            slot.textContent = `#${String(photo.slot).padStart(2, '0')}`;
            name.textContent = String(photo.name).replace('{name}', playerName);
            tag.textContent = photo.tag;
            note.textContent = photo.note;
            counter.textContent = `${index + 1} / ${photos.length}`;
            face.classList.toggle('photo-deck-face-image', !!photo.image);
            face.style.backgroundImage = photo.image
                ? `url('${this._assetUrl(photo.image)}')`
                : '';

            strip.innerHTML = '';
            photos.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'photo-deck-dot';
                if (i === index) dot.classList.add('photo-deck-dot-active');
                if (viewed.has(i)) dot.classList.add('photo-deck-dot-seen');
                dot.setAttribute('aria-label', `${copy.photo} ${i + 1}`);
                dot.addEventListener('click', () => {
                    const dir = i > index ? 1 : -1;
                    index = i;
                    render(dir);
                });
                strip.appendChild(dot);
            });

            complete.classList.toggle('hidden', viewed.size < photos.length);
            if (viewed.size >= photos.length) hint.textContent = copy.photoDoneHint;

            this.engine?.audio?.playUIClick?.();
            if (photo.current) {
                this.engine?.glitch?.screenNoise?.(260);
                this.engine?.deviceGimmick?.vibrate?.('stat_crack');
            }
        };

        const advance = (delta) => {
            const nextIndex = Math.max(0, Math.min(photos.length - 1, index + delta));
            if (nextIndex === index) return;
            index = nextIndex;
            render(delta);
        };

        prev.addEventListener('click', () => advance(-1));
        next.addEventListener('click', () => advance(1));
        card.addEventListener('click', () => advance(1));

        let dragStartX = null;
        const startDrag = (x) => { dragStartX = x; };
        const endDrag = (x) => {
            if (dragStartX == null) return;
            const diff = x - dragStartX;
            dragStartX = null;
            if (Math.abs(diff) < 36) return;
            advance(diff < 0 ? 1 : -1);
        };

        viewport.addEventListener('mousedown', (e) => startDrag(e.clientX));
        viewport.addEventListener('mouseup', (e) => endDrag(e.clientX));
        viewport.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        viewport.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            if (touch) endDrag(touch.clientX);
        }, { passive: true });

        complete.addEventListener('click', () => {
            this.hidePhotoDeck();
            opts.onComplete?.();
        });

        requestAnimationFrame(() => overlay.classList.add('visible'));
        render(1);
    }

    hidePhotoDeck() {
        document.querySelector('#photo-deck-overlay')?.remove();
    }

    showLockerSearch(opts = {}) {
        this.hideLockerSearch();

        const copy = this._getInteractionCopy(this._getLang());
        let panelOpened = false;
        let cameraFound = false;

        const overlay = document.createElement('div');
        overlay.className = 'locker-search-overlay';
        overlay.id = 'locker-search-overlay';

        const shell = document.createElement('div');
        shell.className = 'locker-search-shell';

        const title = document.createElement('div');
        title.className = 'locker-search-title';
        title.textContent = copy.lockerTitle;

        const stage = document.createElement('div');
        stage.className = 'locker-search-stage';

        const lockers = [];
        for (let i = 0; i < 3; i++) {
            const locker = document.createElement('div');
            locker.className = 'locker-search-locker';
            if (i === 1) locker.classList.add('locker-search-target');
            lockers.push(locker);
            stage.appendChild(locker);
        }

        const proof = document.createElement('div');
        proof.className = 'locker-search-proof';
        proof.style.backgroundImage = `url('${this._assetUrl(CONFIG.EVIDENCE_IMAGES?.locker_camera || 'assets/images/evidence/locker_hidden_camera.png')}')`;
        stage.appendChild(proof);

        const status = document.createElement('div');
        status.className = 'locker-search-status';
        status.textContent = copy.lockerHint;

        const complete = document.createElement('button');
        complete.className = 'locker-search-complete hidden';
        complete.type = 'button';
        complete.textContent = copy.lockerComplete;

        const makeHotspot = (cls, label, text) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `locker-hotspot ${cls}`;
            btn.setAttribute('aria-label', label);
            btn.addEventListener('click', () => {
                status.textContent = text;
                btn.classList.add('locker-hotspot-found');
                this.engine?.audio?.playUIClick?.();
                this.engine?.deviceGimmick?.vibrate?.('timer_tick');
            });
            return btn;
        };

        lockers[0].appendChild(makeHotspot('locker-hotspot-dust', copy.dust, copy.dustFound));
        lockers[1].appendChild(makeHotspot('locker-hotspot-clean', copy.clean, copy.cleanFound));

        const seam = makeHotspot('locker-hotspot-seam', copy.seam, copy.seamFound);
        lockers[1].appendChild(seam);

        const camera = makeHotspot('locker-hotspot-camera hidden', copy.camera, copy.cameraFound);
        lockers[1].appendChild(camera);

        seam.addEventListener('click', () => {
            if (panelOpened) return;
            panelOpened = true;
            stage.classList.add('locker-panel-open');
            camera.classList.remove('hidden');
        });

        camera.addEventListener('click', () => {
            if (cameraFound) return;
            cameraFound = true;
            stage.classList.add('locker-camera-found');
            proof.classList.add('visible');
            complete.classList.remove('hidden');
            this.engine?.glitch?.screenNoise?.(180);
        });

        complete.addEventListener('click', () => {
            this.hideLockerSearch();
            opts.onComplete?.();
        });

        shell.appendChild(title);
        shell.appendChild(stage);
        shell.appendChild(status);
        shell.appendChild(complete);
        overlay.appendChild(shell);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('visible'));
    }

    hideLockerSearch() {
        document.querySelector('#locker-search-overlay')?.remove();
    }

    _getLang() {
        return this._lang();
    }

    _assetPath(src) {
        if (!src) return '';
        const normalized = String(src).replace(/^\.\//, '');
        if (/^(?:https?:|data:|blob:|\/)/.test(normalized) || normalized.startsWith('../')) {
            return normalized;
        }
        return (window.__NEVERGRAD_LANG__ ? '../' : '') + normalized;
    }

    _assetUrl(src) {
        return new URL(this._assetPath(src), document.baseURI).href;
    }

    _getInteractionCopy(lang) {
        const map = {
            ko: {
                player: '나',
                previous: '이전 사진',
                next: '다음 사진',
                photo: '사진',
                photoHint: '사진을 클릭하거나 좌우로 넘기세요. 마지막까지 확인해야 내려놓을 수 있습니다.',
                photoDoneHint: '모든 사진을 확인했습니다.',
                photoComplete: '카메라를 내려놓는다',
                lockerTitle: '유나의 사물함',
                lockerHint: '이상한 지점을 눌러 조사하세요.',
                dust: '먼지가 쌓인 사물함',
                clean: '닦인 사물함',
                seam: '들뜬 바닥판',
                camera: '숨겨진 카메라',
                dustFound: '옆 사물함에는 먼지가 그대로 남아 있다.',
                cleanFound: '유나의 사물함만 최근에 닦은 흔적이 있다.',
                seamFound: '바닥 합판이 손톱 하나만큼 떠 있다.',
                cameraFound: '이중 바닥 안쪽에서 카메라를 꺼냈다.',
                lockerComplete: '카메라를 켠다'
            },
            en: {
                player: 'Me',
                previous: 'Previous photo',
                next: 'Next photo',
                photo: 'Photo',
                photoHint: 'Click or swipe through the photos. You cannot put the camera down yet.',
                photoDoneHint: 'Every photo has been checked.',
                photoComplete: 'Put the camera down',
                lockerTitle: "Yuna's locker",
                lockerHint: 'Tap the suspicious spots to inspect them.',
                dust: 'Dusty locker',
                clean: 'Wiped locker',
                seam: 'Raised floor panel',
                camera: 'Hidden camera',
                dustFound: 'The neighboring locker still has dust on it.',
                cleanFound: "Only Yuna's locker was wiped recently.",
                seamFound: 'The plywood floor is raised by a fingernail.',
                cameraFound: 'A camera is hidden under the false bottom.',
                lockerComplete: 'Turn the camera on'
            },
            ja: {
                player: '僕',
                previous: '前の写真',
                next: '次の写真',
                photo: '写真',
                photoHint: '写真をクリックまたはスワイプしてください。最後まで確認するまでカメラを置けません。',
                photoDoneHint: 'すべての写真を確認しました。',
                photoComplete: 'カメラを置く',
                lockerTitle: 'ユナのロッカー',
                lockerHint: '不自然な場所をタップして調べてください。',
                dust: 'ほこりをかぶったロッカー',
                clean: '拭かれたロッカー',
                seam: '浮いた床板',
                camera: '隠しカメラ',
                dustFound: '隣のロッカーにはまだほこりが残っている。',
                cleanFound: 'ユナのロッカーだけ最近拭かれた跡がある。',
                seamFound: '合板の床が爪一枚分ほど浮いている。',
                cameraFound: '二重底の内側からカメラを取り出した。',
                lockerComplete: 'カメラを起動する'
            },
            es: {
                player: 'Yo',
                previous: 'Foto anterior',
                next: 'Foto siguiente',
                photo: 'Foto',
                photoHint: 'Haz clic o desliza las fotos. No puedes bajar la cámara todavía.',
                photoDoneHint: 'Todas las fotos fueron revisadas.',
                photoComplete: 'Bajar la cámara',
                lockerTitle: 'Taquilla de Yuna',
                lockerHint: 'Toca los puntos sospechosos para investigarlos.',
                dust: 'Taquilla con polvo',
                clean: 'Taquilla limpiada',
                seam: 'Panel del suelo levantado',
                camera: 'Cámara oculta',
                dustFound: 'La taquilla de al lado aún tiene polvo.',
                cleanFound: 'Solo la taquilla de Yuna fue limpiada hace poco.',
                seamFound: 'El contrachapado del suelo está levantado por el grosor de una uña.',
                cameraFound: 'Sacaste una cámara del falso fondo.',
                lockerComplete: 'Encender la cámara'
            },
            fr: {
                player: 'Moi',
                previous: 'Photo précédente',
                next: 'Photo suivante',
                photo: 'Photo',
                photoHint: 'Cliquez ou faites défiler les photos. Impossible de poser l’appareil avant la fin.',
                photoDoneHint: 'Toutes les photos ont été vérifiées.',
                photoComplete: 'Poser l’appareil',
                lockerTitle: 'Casier de Yuna',
                lockerHint: 'Touchez les zones suspectes pour les examiner.',
                dust: 'Casier poussiéreux',
                clean: 'Casier essuyé',
                seam: 'Panneau de sol soulevé',
                camera: 'Caméra cachée',
                dustFound: 'Le casier voisin est encore couvert de poussière.',
                cleanFound: 'Seul le casier de Yuna a été essuyé récemment.',
                seamFound: 'Le contreplaqué du sol est soulevé de l’épaisseur d’un ongle.',
                cameraFound: 'Une caméra était cachée sous le double fond.',
                lockerComplete: 'Allumer la caméra'
            },
            de: {
                player: 'Ich',
                previous: 'Vorheriges Foto',
                next: 'Nächstes Foto',
                photo: 'Foto',
                photoHint: 'Klicke oder wische durch die Fotos. Du kannst die Kamera noch nicht weglegen.',
                photoDoneHint: 'Alle Fotos wurden überprüft.',
                photoComplete: 'Kamera weglegen',
                lockerTitle: 'Yunas Spind',
                lockerHint: 'Tippe auf verdächtige Stellen, um sie zu untersuchen.',
                dust: 'Verstaubter Spind',
                clean: 'Abgewischter Spind',
                seam: 'Angehobene Bodenplatte',
                camera: 'Versteckte Kamera',
                dustFound: 'Auf dem Nachbarspind liegt noch Staub.',
                cleanFound: 'Nur Yunas Spind wurde kürzlich abgewischt.',
                seamFound: 'Die Sperrholzplatte ist um eine Fingernagelbreite angehoben.',
                cameraFound: 'Unter dem falschen Boden war eine Kamera versteckt.',
                lockerComplete: 'Kamera einschalten'
            },
            pt: {
                player: 'Eu',
                previous: 'Foto anterior',
                next: 'Próxima foto',
                photo: 'Foto',
                photoHint: 'Clique ou deslize pelas fotos. Você ainda não pode abaixar a câmera.',
                photoDoneHint: 'Todas as fotos foram verificadas.',
                photoComplete: 'Abaixar a câmera',
                lockerTitle: 'Armário da Yuna',
                lockerHint: 'Toque nos pontos suspeitos para investigar.',
                dust: 'Armário empoeirado',
                clean: 'Armário limpo',
                seam: 'Painel do piso levantado',
                camera: 'Câmera escondida',
                dustFound: 'O armário ao lado ainda está coberto de poeira.',
                cleanFound: 'Só o armário da Yuna foi limpo recentemente.',
                seamFound: 'O compensado do piso está levantado por uma unha.',
                cameraFound: 'Há uma câmera escondida sob o fundo falso.',
                lockerComplete: 'Ligar a câmera'
            }
        };
        return map[lang] || map.en;
    }

    _getPhotoDeckData(deck) {
        const lang = this._getLang();
        const romanizedNames = {
            1: 'Kim Dojin',
            2: 'Lee Junseo',
            3: 'Park Seojin',
            4: 'Jung Hayul',
            5: 'Kang Minhyuk',
            6: 'Yoon Jaewon',
            7: 'Kim Taeho',
            8: 'Choi Siwoo',
            9: 'Han Jiho',
            10: 'Song Yejun',
            11: 'Oh Taehyun',
            12: 'Lim Seoyul'
        };
        const namesByLang = {
            ko: {
                1: '김도진',
                2: '이준서',
                3: '박서진',
                4: '정하율',
                5: '강민혁',
                6: '윤재원',
                7: '김태호',
                8: '최시우',
                9: '한지호',
                10: '송예준',
                11: '오태현',
                12: '임서율'
            },
            en: romanizedNames,
            ja: {
                1: 'キム・ドジン',
                2: 'イ・ジュンソ',
                3: 'パク・ソジン',
                4: 'チョン・ハユル',
                5: 'カン・ミンヒョク',
                6: 'ユン・ジェウォン',
                7: 'キム・テホ',
                8: 'チェ・シウ',
                9: 'ハン・ジホ',
                10: 'ソン・イェジュン',
                11: 'オ・テヒョン',
                12: 'イム・ソユル'
            },
            es: romanizedNames,
            fr: romanizedNames,
            de: romanizedNames,
            pt: romanizedNames
        };
        const copyByLang = {
            ko: {
                titleYuna: 'YUNA_CAM / 전학생',
                titleDefault: '카메라 롤',
                gate: '교문',
                currentTag: '어제 아침 / 교문',
                currentNote: '현재 관찰 중.',
                notes: [
                    '짧은 검은 머리. 새 교복.',
                    '안경. 같은 자세.',
                    '갈색 머리. 같은 눈.',
                    '머리색만 다르다.',
                    '입꼬리의 흉터 위치가 같다.',
                    '이름표만 바뀌었다.',
                    '피곤한 얼굴. 눈 밑이 꺼져 있다.',
                    '뒷주머니에 접힌 메모.',
                    '카메라를 알아본 표정.',
                    '시선이 CCTV로 향해 있다.',
                    '웃고 있지만 손은 굳어 있다.',
                    '교복 깃의 접힌 자국까지 같다.'
                ]
            },
            en: {
                titleYuna: 'YUNA_CAM / TRANSFER_STUDENTS',
                titleDefault: 'CAMERA_ROLL',
                gate: 'School gate',
                currentTag: 'Yesterday morning / School gate',
                currentNote: 'Currently under observation.',
                notes: [
                    'Short black hair. New uniform.',
                    'Glasses. Same posture.',
                    'Brown hair. Same eyes.',
                    'Only the hair color is different.',
                    'The scar at the mouth corner is in the same place.',
                    'Only the name tag changed.',
                    'Tired face. Hollow shadows under the eyes.',
                    'Folded note in the back pocket.',
                    'Expression suggests he noticed the camera.',
                    'His gaze is turned toward the CCTV.',
                    'Smiling, but the hands are rigid.',
                    'Even the fold in the uniform collar matches.'
                ]
            },
            ja: {
                titleYuna: 'YUNA_CAM / 転入生',
                titleDefault: 'カメラロール',
                gate: '校門',
                currentTag: '昨日の朝 / 校門',
                currentNote: '現在観察中。',
                notes: [
                    '短い黒髪。新しい制服。',
                    '眼鏡。同じ姿勢。',
                    '茶色の髪。同じ目。',
                    '髪色だけが違う。',
                    '口元の傷跡の位置が同じ。',
                    '名札だけが変わっている。',
                    '疲れた顔。目の下が落ちくぼんでいる。',
                    '後ろポケットに折りたたまれたメモ。',
                    'カメラに気づいた表情。',
                    '視線がCCTVへ向いている。',
                    '笑っているが手は固まっている。',
                    '制服の襟の折り目まで同じ。'
                ]
            },
            es: {
                titleYuna: 'YUNA_CAM / ESTUDIANTES_TRASLADADOS',
                titleDefault: 'Carrete de cámara',
                gate: 'Puerta escolar',
                currentTag: 'Ayer por la mañana / Puerta escolar',
                currentNote: 'Actualmente bajo observación.',
                notes: [
                    'Pelo negro corto. Uniforme nuevo.',
                    'Gafas. Misma postura.',
                    'Pelo castaño. Mismos ojos.',
                    'Solo cambia el color del pelo.',
                    'La cicatriz en la comisura está en el mismo lugar.',
                    'Solo cambió la etiqueta del nombre.',
                    'Rostro cansado. Ojeras hundidas.',
                    'Nota doblada en el bolsillo trasero.',
                    'Parece haber notado la cámara.',
                    'La mirada apunta al CCTV.',
                    'Sonríe, pero las manos están rígidas.',
                    'Incluso el pliegue del cuello del uniforme coincide.'
                ]
            },
            fr: {
                titleYuna: 'YUNA_CAM / ELEVES_TRANSFERES',
                titleDefault: 'Pellicule',
                gate: "Portail de l'ecole",
                currentTag: "Hier matin / Portail de l'ecole",
                currentNote: 'Actuellement sous observation.',
                notes: [
                    'Cheveux noirs courts. Nouvel uniforme.',
                    'Lunettes. Même posture.',
                    'Cheveux bruns. Même regard.',
                    'Seule la couleur des cheveux change.',
                    'La cicatrice au coin de la bouche est au même endroit.',
                    "Seule l'etiquette du nom a change.",
                    'Visage fatigué. Cernes creusés.',
                    'Note pliée dans la poche arrière.',
                    'Il semble avoir remarqué la caméra.',
                    'Son regard se tourne vers la CCTV.',
                    'Il sourit, mais ses mains sont rigides.',
                    "Même le pli du col de l'uniforme correspond."
                ]
            },
            de: {
                titleYuna: 'YUNA_CAM / TRANSFERSCHUELER',
                titleDefault: 'Kamerarolle',
                gate: 'Schultor',
                currentTag: 'Gestern Morgen / Schultor',
                currentNote: 'Derzeit unter Beobachtung.',
                notes: [
                    'Kurzes schwarzes Haar. Neue Uniform.',
                    'Brille. Gleiche Haltung.',
                    'Braunes Haar. Gleiche Augen.',
                    'Nur die Haarfarbe ist anders.',
                    'Die Narbe am Mundwinkel sitzt an derselben Stelle.',
                    'Nur das Namensschild wurde geändert.',
                    'Müdes Gesicht. Eingefallene Schatten unter den Augen.',
                    'Gefaltete Notiz in der Gesäßtasche.',
                    'Der Ausdruck deutet an, dass er die Kamera bemerkt hat.',
                    'Sein Blick ist auf die CCTV gerichtet.',
                    'Er lächelt, aber die Hände sind starr.',
                    'Sogar die Falte am Uniformkragen stimmt überein.'
                ]
            },
            pt: {
                titleYuna: 'YUNA_CAM / ALUNOS_TRANSFERIDOS',
                titleDefault: 'Rolo da câmera',
                gate: 'Portão da escola',
                currentTag: 'Ontem de manhã / Portão da escola',
                currentNote: 'Atualmente em observação.',
                notes: [
                    'Cabelo preto curto. Uniforme novo.',
                    'Óculos. Mesma postura.',
                    'Cabelo castanho. Mesmos olhos.',
                    'Só a cor do cabelo é diferente.',
                    'A cicatriz no canto da boca está no mesmo lugar.',
                    'Só a etiqueta de nome mudou.',
                    'Rosto cansado. Sombras fundas sob os olhos.',
                    'Bilhete dobrado no bolso de trás.',
                    'Expressão de quem percebeu a câmera.',
                    'O olhar está voltado para a CCTV.',
                    'Sorrindo, mas com as mãos rígidas.',
                    'Até a dobra da gola do uniforme coincide.'
                ]
            }
        };
        const names = namesByLang[lang] || namesByLang.en;
        const copy = copyByLang[lang] || copyByLang.en;
        const dates = ['04.03', '04.08', '04.13', '04.18', '04.23', '04.28', '05.03', '05.08', '05.13', '05.18', '05.23', '05.28'];
        const photos = dates.map((date, index) => ({
            slot: index + 1,
            name: names[index + 1],
            tag: `${date} / ${copy.gate}`,
            note: copy.notes[index],
            image: CONFIG.SUBJECT_FACE_IMAGES?.[index + 1] || null
        }));
        photos.push({
            slot: 13,
            name: '{name}',
            tag: copy.currentTag,
            note: copy.currentNote,
            current: true,
            image: CONFIG.EVIDENCE_IMAGES?.player_photo || CONFIG.SUBJECT_FACE_IMAGES?.[13] || CONFIG.EVIDENCE_IMAGES?.yuna_photo || 'assets/images/evidence/yuna_photo_evidence.png'
        });
        return {
            title: deck === 'yuna_13' ? copy.titleYuna : copy.titleDefault,
            photos
        };
    }

    /**
     * @param {GameEngine} engine - 메인 게임 엔진 참조
     */
    constructor(engine) {
        /** @type {GameEngine} */
        this.engine = engine;

        /** @type {string} 현재 글리치 레벨 */
        this.level = 'NONE';

        /** @type {HTMLElement|null} 글리치 오버레이 요소 */
        this.overlay = document.getElementById('glitch-overlay');

        /** @type {Array<{text: string, el: HTMLElement}>} 유령 텍스트 대기열 */
        this.ghostTextQueue = [];

        /** @type {number[]} 활성 타이머 ID 목록 (정리용) */
        this._activeTimers = [];

        /** @type {HTMLElement|null} 레드 비네트 요소 */
        this._redVignette = null;

        /** @type {boolean} 위험도 스탯 공개 여부 */
        this._dangerStatsRevealed = false;
    }

    showMirrorPlayerReveal(stage = 0) {
        const gameScreen = document.getElementById('game-screen') || document.body;
        let mirror = document.getElementById('mirror-player-reflection');
        if (!mirror) {
            mirror = document.createElement('div');
            mirror.id = 'mirror-player-reflection';
            mirror.className = 'mirror-player-reflection mirror-player-stage-0';
            mirror.innerHTML = `
                <div class="mirror-player-glass"></div>
                <div class="mirror-player-face">
                    <span class="mirror-player-hair"></span>
                    <span class="mirror-player-eye mirror-player-eye-left"></span>
                    <span class="mirror-player-eye mirror-player-eye-right"></span>
                    <span class="mirror-player-nose"></span>
                    <span class="mirror-player-mouth"></span>
                </div>
            `;
            gameScreen.appendChild(mirror);
        }

        const face = mirror.querySelector('.mirror-player-face');
        const playerMirror = CONFIG.EVIDENCE_IMAGES?.player_mirror;
        if (face && playerMirror) {
            face.classList.add('mirror-player-face-image');
            face.style.backgroundImage = `url('${this._assetUrl(playerMirror)}')`;
        }

        mirror.classList.remove(
            'mirror-player-stage-0',
            'mirror-player-stage-1',
            'mirror-player-stage-2',
            'mirror-player-stage-3'
        );
        mirror.classList.add(`mirror-player-stage-${Math.max(0, Math.min(3, Number(stage) || 0))}`);
        requestAnimationFrame(() => mirror.classList.add('visible'));
        return mirror;
    }

    // =========================================================================
    // 글리치 레벨 관리
    // =========================================================================

    /**
     * 글리치 강도 레벨 설정
     * 레벨에 따라 허용되는 효과 범위가 달라짐
     *
     * @param {'NONE'|'SUBTLE'|'UNSETTLING'|'BREAKING'|'NIGHTMARE'} level
     */
    setLevel(level) {
        const validLevels = ['NONE', 'SUBTLE', 'UNSETTLING', 'BREAKING', 'NIGHTMARE'];
        if (!validLevels.includes(level)) return;

        this.level = level;

        // 엔진 상태와 동기화
        if (this.engine?.state) {
            const levelMap = {
                NONE: 0, SUBTLE: 1, UNSETTLING: 2, BREAKING: 3, NIGHTMARE: 4
            };
            this.engine.state.setGlitchLevel(levelMap[level] ?? 0);
        }
    }

    /**
     * 현재 레벨의 수치 값 반환
     * @returns {number} 0~4
     * @private
     */
    _getLevelValue() {
        const map = { NONE: 0, SUBTLE: 1, UNSETTLING: 2, BREAKING: 3, NIGHTMARE: 4 };
        return map[this.level] ?? 0;
    }

    // =========================================================================
    // 오버레이 효과
    // =========================================================================

    /**
     * 노이즈 오버레이 표시
     *
     * @param {number} [duration=300] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showNoise(duration = 300) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('noise');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('noise');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 강한 글리치 오버레이 (스캔라인 + 색수차)
     *
     * @param {number} [duration=1000] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showHeavyGlitch(duration = 1000) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('heavy-glitch');

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.add('screen-shake');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('heavy-glitch');
                if (gameScreen) gameScreen.classList.remove('screen-shake');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 화면 흔들림 효과
     *
     * @param {number} [duration=500] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showScreenShake(duration = 500) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return Promise.resolve();

        gameScreen.classList.add('screen-shake');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                gameScreen.classList.remove('screen-shake');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 전체 화면 블랙아웃 (암전)
     *
     * @param {number} [duration=1000] - 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showBlackout(duration = 1000) {
        const blackout = document.createElement('div');
        blackout.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000;
            z-index: 60;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        document.body.appendChild(blackout);

        // 페이드 인
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                blackout.style.opacity = '1';
            });
        });

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                // 페이드 아웃
                blackout.style.opacity = '0';
                setTimeout(() => {
                    blackout.remove();
                    resolve();
                }, 200);
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    // =========================================================================
    // 텍스트 효과
    // =========================================================================

    /**
     * 유령 텍스트 — 대화창 밖에서 떠오르는 반투명 텍스트
     *
     * @param {string} text - 표시할 텍스트
     * @param {number} [x=50] - X 위치 (%, 화면 기준)
     * @param {number} [y=30] - Y 위치 (%, 화면 기준)
     * @param {number} [duration=2000] - 표시 시간 (ms)
     */
    showGhostText(text, x = 50, y = 30, duration = 2000) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-text';
        ghost.textContent = text;
        ghost.style.left = `${x}%`;
        ghost.style.top = `${y}%`;

        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.appendChild(ghost);
        } else {
            document.body.appendChild(ghost);
        }

        this.ghostTextQueue.push({ text, el: ghost });

        const timer = setTimeout(() => {
            ghost.remove();
            this.ghostTextQueue = this.ghostTextQueue.filter(g => g.el !== ghost);
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 텍스트 요소에 글리치 플래시 적용
     *
     * @param {HTMLElement} element - 대상 요소
     * @param {number} [duration=200] - 효과 지속 시간 (ms)
     */
    showGlitchText(element, duration = 200) {
        if (!element) return;

        element.classList.add('glitch-text');

        const timer = setTimeout(() => {
            element.classList.remove('glitch-text');
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 텍스트에 Zalgo(결합 문자) 삽입하여 깨진 텍스트 생성
     *
     * @param {string} text - 원본 텍스트
     * @param {number} [intensity=0.1] - 오염 강도 (0~1)
     * @returns {string} Zalgo 처리된 텍스트
     */
    corruptText(text, intensity = 0.1) {
        /** @type {string[]} 결합 발음 구별 기호 (위) */
        const zalgoUp = [
            '\u0300', '\u0301', '\u0302', '\u0303', '\u0304',
            '\u0305', '\u0306', '\u0307', '\u0308', '\u030A',
            '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'
        ];
        /** @type {string[]} 결합 발음 구별 기호 (아래) */
        const zalgoDown = [
            '\u0316', '\u0317', '\u0318', '\u0319', '\u031A',
            '\u031B', '\u031C', '\u031D', '\u031E', '\u031F'
        ];
        /** @type {string[]} 대체 기호 */
        const glitchChars = ['#', '$', '@', '?', '!', '&', '%', '̷', '̸', '̶'];

        const chars = [...text];

        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < intensity && chars[i] !== ' ') {
                // Zalgo 추가 또는 문자 대체
                if (Math.random() < 0.5) {
                    // Zalgo 결합 문자 추가
                    const numZalgo = Math.floor(Math.random() * 3) + 1;
                    for (let j = 0; j < numZalgo; j++) {
                        const pool = Math.random() < 0.5 ? zalgoUp : zalgoDown;
                        chars[i] += pool[Math.floor(Math.random() * pool.length)];
                    }
                } else {
                    // 문자 대체
                    chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
            }
        }

        return chars.join('');
    }

    // =========================================================================
    // 스탯 효과
    // =========================================================================

    /**
     * 스탯 라벨 깜빡임 — "호감도"가 순간적으로 "위험도"로 보이는 연출
     *
     * @param {HTMLElement} statEl - 스탯 라벨 요소
     * @param {string} revealText - 깜빡일 때 표시할 텍스트 (예: "위험도")
     * @param {number} [duration=150] - 깜빡임 지속 시간 (ms)
     */
    flickerStat(statEl, revealText, duration = 150) {
        if (!statEl) return;

        const original = statEl.textContent;

        statEl.textContent = revealText;
        statEl.classList.add('glitch-text');

        const timer = setTimeout(() => {
            statEl.textContent = original;
            statEl.classList.remove('glitch-text');
        }, duration);
        this._activeTimers.push(timer);
    }

    /**
     * 위험도 스탯 영구 공개 — 호감도 UI를 신뢰도/위험도로 전환
     * Day 3 밤 장르 전환 시 사용
     */
    async revealDangerStats() {
        if (this._dangerStatsRevealed) return;
        this._dangerStatsRevealed = true;

        // 모든 스탯 라벨 요소 찾기
        const statLabels = document.querySelectorAll('.stat-label, [data-stat-label]');

        for (const label of statLabels) {
            const thrillLabel = label.dataset.thrillerlabel;
            if (!thrillLabel) continue;

            // 글리치 텍스트 애니메이션으로 전환
            const original = label.textContent;

            // 단계 1: 텍스트 깨짐 (3회)
            for (let i = 0; i < 3; i++) {
                label.textContent = this.corruptText(original, 0.3 + i * 0.15);
                label.classList.add('glitch-text');
                await this._sleep(100);
            }

            // 단계 2: 노이즈 플래시
            await this.showNoise(150);

            // 단계 3: 새 라벨로 교체
            label.textContent = thrillLabel;
            label.classList.remove('glitch-text');
            label.classList.add('stat-revealed');

            await this._sleep(300);
        }

        // 스탯 값도 업데이트 (danger 수치 표시)
        const statValues = document.querySelectorAll('[data-stat-danger]');
        statValues.forEach(el => {
            const charId = el.dataset.charId;
            if (charId && this.engine?.state) {
                const stats = this.engine.state.getRealStats(charId);
                el.textContent = stats.danger;
                el.classList.add('stat-revealed');
            }
        });
    }

    // =========================================================================
    // 화면 효과
    // =========================================================================

    /**
     * 레드 비네트 오버레이 추가 (Day 4+)
     * 화면 가장자리에 붉은 비네트 효과
     */
    showRedVignette() {
        if (this._redVignette) return;

        const bgOverlay = document.getElementById('bg-overlay');
        if (bgOverlay) {
            bgOverlay.classList.add('vignette-red');
            this._redVignette = bgOverlay;
        }
    }

    /**
     * 레드 비네트 제거
     */
    hideRedVignette() {
        if (this._redVignette) {
            this._redVignette.classList.remove('vignette-red');
            this._redVignette = null;
        }
    }

    /**
     * 약물 블러 블랙아웃 효과
     * 리인 음료 마신 후 발생하는 시야 흐림
     *
     * @param {number} [duration=500] - 효과 지속 시간 (ms)
     * @returns {Promise<void>}
     */
    showDrugBlur(duration = 500) {
        if (!this.overlay) return Promise.resolve();

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('drug-blur');

        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.overlay.classList.add('hidden');
                this.overlay.classList.remove('drug-blur');
                resolve();
            }, duration);
            this._activeTimers.push(timer);
        });
    }

    // =========================================================================
    // BGM 조작
    // =========================================================================

    /**
     * BGM 재생 속도를 점진적으로 감속
     *
     * @param {HTMLAudioElement} audioEl - 오디오 요소
     * @param {number} [factor=0.7] - 최종 속도 비율 (1.0 = 정상)
     * @param {number} [duration=3000] - 감속에 걸리는 시간 (ms)
     */
    slowdownBGM(audioEl, factor = 0.7, duration = 3000) {
        if (!audioEl) return;

        const startRate = audioEl.playbackRate;
        const delta = startRate - factor;
        const startTime = Date.now();

        const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);

            // easeOutQuad로 자연스러운 감속
            const eased = 1 - (1 - progress) * (1 - progress);
            audioEl.playbackRate = startRate - (delta * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    /**
     * BGM 즉시 정지 — 갑작스러운 정적 연출
     *
     * @param {HTMLAudioElement} audioEl - 오디오 요소
     */
    stopBGM(audioEl) {
        if (!audioEl) return;

        // 볼륨을 급격히 낮춘 뒤 정지
        const originalVol = audioEl.volume;
        audioEl.volume = 0;

        setTimeout(() => {
            audioEl.pause();
            audioEl.volume = originalVol;
        }, 50);
    }

    // =========================================================================
    // 시나리오 타임라인 트리거
    // =========================================================================

    /**
     * 키 이름으로 사전 정의된 글리치 시퀀스 실행
     *
     * @param {string} key - 트리거 키
     * @returns {Promise<void>}
     *
     * @example
     * glitchAdv.triggerGlitch('day2_night_stat_flicker');
     * glitchAdv.triggerGlitch('day3_night_genre_shift');
     */
    async triggerGlitch(key) {
        switch (key) {

            // ===== Day 2 밤: 스탯 미세 깜빡임 =====
            // "호감도" 라벨이 0.15초간 "위험도"로 깜빡임
            case 'day2_night_stat_flicker': {
                this.setLevel('SUBTLE');

                const statLabels = document.querySelectorAll('.stat-label, [data-stat-label]');
                const randomLabel = statLabels[Math.floor(Math.random() * statLabels.length)];
                if (randomLabel) {
                    this.flickerStat(randomLabel, this._localizedDangerLabel(), 150);
                }

                // BGM 미세 변조
                const bgm = this.engine?.renderer?.bgmAudio;
                if (bgm) {
                    const origRate = bgm.playbackRate;
                    bgm.playbackRate = 0.97;
                    await this._sleep(2000);
                    bgm.playbackRate = origRate;
                }
                break;
            }

            // ===== Day 3 점심: 스탯 라벨 잠깐 이동 =====
            // "호감도" → 글리치 → "???" → 복구
            case 'day3_lunch_stat_shift': {
                this.setLevel('UNSETTLING');

                const labels = document.querySelectorAll('.stat-label, [data-stat-label]');
                for (const label of labels) {
                    const orig = label.textContent;
                    label.textContent = this.corruptText(orig, 0.4);
                    label.classList.add('glitch-text');
                    await this._sleep(200);
                    label.textContent = '???';
                    await this._sleep(300);
                    label.textContent = orig;
                    label.classList.remove('glitch-text');
                }

                await this.showNoise(200);
                break;
            }

            // ===== Day 3 리인 후: 선택지 잔상 깜빡임 =====
            // 게임 화면 모서리에 유령 텍스트 표시
            case 'day3_after_riin_flicker': {
                this.setLevel('UNSETTLING');

                // 유령 텍스트 연속 표시
                this.showGhostText(this._pickLocalized({
                    ko: '...도망쳐',
                    en: '...Run',
                    ja: '...逃げて',
                    es: '...Corre',
                    fr: '...Fuis',
                    de: '...Lauf',
                    pt: '...Corra'
                }), 20, 15, 2500);
                await this._sleep(800);
                this.showGhostText(this._pickLocalized({
                    ko: '여기서 나가',
                    en: 'Get out of here',
                    ja: 'ここから出て',
                    es: 'Sal de aquí',
                    fr: "Sors d'ici",
                    de: 'Raus hier',
                    pt: 'Saia daqui'
                }), 75, 25, 2000);
                await this._sleep(1200);
                this.showGhostText(this._pickLocalized({
                    ko: '마시지 마',
                    en: "Don't drink it",
                    ja: '飲まないで',
                    es: 'No lo bebas',
                    fr: 'Ne bois pas',
                    de: 'Trink es nicht',
                    pt: 'Não beba'
                }), 30, 70, 1800);

                // 노이즈 플래시
                await this._sleep(500);
                await this.showNoise(150);
                break;
            }

            // ===== Day 3 밤: 장르 전환 =====
            // 핵심 연출 — 로맨스 → 스릴러 전면 전환
            case 'day3_night_genre_shift': {
                this.setLevel('BREAKING');

                // 1) BGM 감속
                const bgmEl = this.engine?.renderer?.bgmAudio;
                if (bgmEl) {
                    this.slowdownBGM(bgmEl, 0.5, 2000);
                }

                // 2) 화면 흔들림
                await this.showScreenShake(800);

                // 3) 강한 노이즈
                await this.showHeavyGlitch(1500);

                // 4) 블랙아웃
                await this.showBlackout(1000);

                // 5) BGM 완전 정지
                if (bgmEl) {
                    this.stopBGM(bgmEl);
                }

                // 6) 스탯 폭로
                await this.revealDangerStats();

                // 7) 테마 색상 전환
                if (this.engine?.glitch) {
                    this.engine.glitch.shiftTheme('thriller');
                }

                // 8) 레드 비네트
                this.showRedVignette();

                // 9) 상태 매니저 동기화
                if (this.engine?.state) {
                    this.engine.state.triggerGenreShift();
                }

                // 10) 콘솔 메시지 업데이트
                if (this.engine?.metaHorror) {
                    this.engine.metaHorror.printConsoleMessage(3);
                    this.engine.metaHorror.activate(3);
                }
                break;
            }

            // ===== Day 5: 전면 붕괴 =====
            // 모든 효과 동시 발동
            case 'day5_nightmare_full': {
                this.setLevel('NIGHTMARE');

                // 진동 (모바일)
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.vibrate('paralysis');
                }

                // 동시 다발 효과
                this.showRedVignette();
                this.showGhostText(this._pickLocalized({
                    ko: '졸업하지 못한 교실',
                    en: 'The Classroom of No Graduation',
                    ja: '卒業できなかった教室',
                    es: 'El aula sin graduación',
                    fr: 'La classe sans diplôme',
                    de: 'Das Klassenzimmer ohne Abschluss',
                    pt: 'A sala sem formatura'
                }), 50, 20, 4000);
                this.showGhostText(this._pickLocalized({
                    ko: '도망칠 수 없어',
                    en: "You can't run",
                    ja: '逃げられない',
                    es: 'No puedes huir',
                    fr: 'Tu ne peux pas fuir',
                    de: 'Du kannst nicht weglaufen',
                    pt: 'Você não pode fugir'
                }), 30, 50, 3000);
                this.showGhostText(this._pickLocalized({
                    ko: '{name}, 돌아와',
                    en: '{name}, come back',
                    ja: '{name}、戻って',
                    es: '{name}, vuelve',
                    fr: '{name}, reviens',
                    de: '{name}, komm zurück',
                    pt: '{name}, volte'
                }), 70, 40, 3500);

                await this.showHeavyGlitch(2000);

                // 화면 연속 글리치
                for (let i = 0; i < 3; i++) {
                    await this.showNoise(200);
                    await this._sleep(300);
                    await this.showScreenShake(400);
                    await this._sleep(200);
                }

                // BGM 왜곡
                const audio = this.engine?.renderer?.bgmAudio;
                if (audio) {
                    this.slowdownBGM(audio, 0.3, 4000);
                }

                // 블랙아웃 피날레
                await this._sleep(1000);
                await this.showBlackout(2000);

                // 커서 감속 (PC)
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.enableCursorSlowdown();
                }

                // 콘솔 메시지
                if (this.engine?.metaHorror) {
                    this.engine.metaHorror.printConsoleMessage(5);
                }
                break;
            }

            // ===== Day 4 밤: 세이브 파일 강제 오픈 =====
            // 핸드폰 화면이 혼자 켜지며 12개의 이전 주기 폭로
            case 'day4_night_save_slot': {
                this.setLevel('BREAKING');

                // 화면 흔들림 + 노이즈로 시작
                await this.showScreenShake(500);
                await this.showNoise(300);

                // 세이브 슬롯 UI 표시
                const playerName = this.engine?.state?.playerName || '{name}';
                if (this.engine?.save) {
                    await this.showSaveSlotGlitch(this.engine.save, playerName);
                }

                // 닫힌 후 글리치 여운
                await this.showHeavyGlitch(800);
                break;
            }

            default:
                console.warn(`[GlitchSystemAdvanced] 알 수 없는 트리거 키: ${key}`);
                break;
        }
    }

    // =========================================================================
    // 세이브 슬롯 글리치 UI (Day 4 밤 연출)
    // =========================================================================

    _lang() {
        const lang = this.engine?.i18n?.currentLang || document.documentElement.lang || 'ko';
        const normalized = String(lang).toLowerCase();
        return normalized.startsWith('pt') ? 'pt' : normalized.slice(0, 2);
    }

    _pickLocalized(map) {
        if (!map || typeof map !== 'object' || Array.isArray(map)) return map;
        const lang = this._lang();
        return map[lang] || map.en || map.ko || '';
    }

    _localizedRomanceLabel() {
        return this.engine?.i18n?.getStatLabel?.(CONFIG.STAT_MODES.ROMANCE, 'sea')?.primary
            || this._pickLocalized({
                ko: '호감도',
                en: 'Affinity',
                ja: '好感度',
                es: 'Afinidad',
                fr: 'Affinité',
                de: 'Zuneigung',
                pt: 'Afinidade'
            });
    }

    _localizedDangerLabel() {
        return this.engine?.i18n?.getStatLabel?.(CONFIG.STAT_MODES.THRILLER, 'eunsu')?.label
            || this._pickLocalized({
                ko: '위험도',
                en: 'Danger',
                ja: '危険度',
                es: 'Peligro',
                fr: 'Danger',
                de: 'Gefahr',
                pt: 'Perigo'
            });
    }

    _localizedSubjectName(slotId, fallback) {
        if (fallback === '{name}') return fallback;
        const koreanNames = {
            1: '김도진',
            2: '이준서',
            3: '박서진',
            4: '정하율',
            5: '강민혁',
            6: '윤재원',
            7: '김태호',
            8: '최시우',
            9: '한지호',
            10: '송예준',
            11: '오태현',
            12: '임서율'
        };
        const romanizedNames = {
            1: 'Kim Dojin',
            2: 'Lee Junseo',
            3: 'Park Seojin',
            4: 'Jung Hayul',
            5: 'Kang Minhyuk',
            6: 'Yoon Jaewon',
            7: 'Kim Taeho',
            8: 'Choi Siwoo',
            9: 'Han Jiho',
            10: 'Song Yejun',
            11: 'Oh Taehyun',
            12: 'Lim Seoyul'
        };
        const namesByLang = {
            ko: koreanNames,
            en: romanizedNames,
            ja: {
                1: 'キム・ドジン',
                2: 'イ・ジュンソ',
                3: 'パク・ソジン',
                4: 'チョン・ハユル',
                5: 'カン・ミンヒョク',
                6: 'ユン・ジェウォン',
                7: 'キム・テホ',
                8: 'チェ・シウ',
                9: 'ハン・ジホ',
                10: 'ソン・イェジュン',
                11: 'オ・テヒョン',
                12: 'イム・ソユル'
            },
            es: romanizedNames,
            fr: romanizedNames,
            de: romanizedNames,
            pt: romanizedNames
        };
        const names = namesByLang[this._lang()] || namesByLang.en;
        return names[slotId] || fallback;
    }

    _localizedSubjectStatus(slot) {
        if (this._lang() === 'ko') return slot.status;
        const rawStatus = String(slot.status || '');
        const statusClass = slot.statusClass
            || (rawStatus.includes('진행') ? 'active'
                : rawStatus.includes('이상') ? 'corrupted'
                    : rawStatus.includes('종료') || rawStatus.includes('처리') ? 'completed'
                        : '');
        const status = {
            graduated: {
                en: 'Graduated',
                ja: '卒業',
                es: 'Graduado',
                fr: 'Diplômé',
                de: 'Abgeschlossen',
                pt: 'Formado'
            },
            active: {
                en: 'Active',
                ja: '進行中',
                es: 'En curso',
                fr: 'En cours',
                de: 'Aktiv',
                pt: 'Em andamento'
            },
            corrupted: {
                en: '██ADVERSE██ external contact, escape attempt',
                ja: '██異常██ 外部接触、脱出試行',
                es: '██ADVERSO██ contacto externo, intento de fuga',
                fr: '██ANOMALIE██ contact externe, tentative de fuite',
                de: '██ABWEICHUNG██ externer Kontakt, Fluchtversuch',
                pt: '██ADVERSO██ contato externo, tentativa de fuga'
            },
            failed9: {
                en: 'Early detection, forced processing',
                ja: '早期発覚、強制処理',
                es: 'Detección temprana, procesamiento forzado',
                fr: 'Détection précoce, traitement forcé',
                de: 'Frühe Entdeckung, Zwangsverarbeitung',
                pt: 'Detecção precoce, processamento forçado'
            },
            failed: {
                en: 'Escape attempt, failed',
                ja: '脱出試行、失敗',
                es: 'Intento de fuga, fallido',
                fr: 'Tentative de fuite, échec',
                de: 'Fluchtversuch, gescheitert',
                pt: 'Tentativa de fuga, falhou'
            },
            processed: {
                en: 'Processed',
                ja: '処理完了',
                es: 'Procesado',
                fr: 'Traité',
                de: 'Verarbeitet',
                pt: 'Processado'
            }
        };
        if (statusClass === 'graduated') return this._pickLocalized(status.graduated);
        if (statusClass === 'active') return this._pickLocalized(status.active);
        if (statusClass === 'corrupted') return this._pickLocalized(status.corrupted);
        if (statusClass === 'failed') {
            return Number(slot.number || slot.id) === 9
                ? this._pickLocalized(status.failed9)
                : this._pickLocalized(status.failed);
        }
        return this._pickLocalized(status.processed);
    }

    _localizedSubjectNote(subject) {
        if (this._lang() === 'ko' || !subject.note) return subject.note || '';
        const note = String(subject.note);
        if (note.includes('Day 4')) {
            return this._pickLocalized({
                en: 'Day 4 deviation attempt',
                ja: 'Day 4 逸脱試行',
                es: 'Intento de desviación del Día 4',
                fr: 'Tentative de déviation du jour 4',
                de: 'Abweichungsversuch an Tag 4',
                pt: 'Tentativa de desvio no Dia 4'
            });
        }
        if (note.includes('이설화')) {
            return this._pickLocalized({
                en: 'External contact: Lee Seolhwa',
                ja: '外部接触: イ・ソルファ',
                es: 'Contacto externo: Lee Seolhwa',
                fr: 'Contact externe : Lee Seolhwa',
                de: 'Externer Kontakt: Lee Seolhwa',
                pt: 'Contato externo: Lee Seolhwa'
            });
        }
        if (note.includes('Day 3')) {
            return this._pickLocalized({
                en: 'Day 3 early detection',
                ja: 'Day 3 早期発覚',
                es: 'Detección temprana del Día 3',
                fr: 'Détection précoce du jour 3',
                de: 'Frühe Entdeckung an Tag 3',
                pt: 'Detecção precoce no Dia 3'
            });
        }
        return note;
    }

    _localizedSubjectRow(subject) {
        const slotId = subject.number ?? subject.id ?? subject.slot;
        return {
            ...subject,
            name: this._localizedSubjectName(slotId, subject.name),
            status: this._localizedSubjectStatus(subject),
            note: this._localizedSubjectNote(subject)
        };
    }

    _localizedEndingCreditStatus(ending, fallbackSlot) {
        const map = {
            TRUE: { ko: '졸업 ✓', en: 'Graduated ✓', ja: '卒業 ✓', es: 'Graduado ✓', fr: 'Diplômé ✓', de: 'Abgeschlossen ✓', pt: 'Formado ✓', c: 'graduated' },
            ESCAPE: { ko: '실종', en: 'Missing', ja: '失踪', es: 'Desaparecido', fr: 'Disparu', de: 'Vermisst', pt: 'Desaparecido', c: 'missing' },
            RESIST: { ko: '동행', en: 'Escaped together', ja: '同行', es: 'Escape conjunto', fr: 'Évadés ensemble', de: 'Gemeinsam entkommen', pt: 'Fuga conjunta', c: 'escaped' },
            CAGE: { ko: '잔류', en: 'Contained', ja: '残留', es: 'Contenido', fr: 'Confiné', de: 'Eingeschlossen', pt: 'Contido', c: 'contained' },
            FORGET: { ko: '처리 완료', en: 'Processed', ja: '処理完了', es: 'Procesado', fr: 'Traité', de: 'Verarbeitet', pt: 'Processado', c: 'terminated' },
            GHOST: { ko: '소실', en: 'Lost', ja: '消失', es: 'Perdido', fr: 'Perdu', de: 'Verloren', pt: 'Perdido', c: 'missing' },
            COMPLICIT: { ko: '전환 - 담당자', en: 'Converted - handler', ja: '転換 - 担当者', es: 'Convertido - responsable', fr: 'Converti - responsable', de: 'Umgewandelt - Betreuer', pt: 'Convertido - responsável', c: 'converted' }
        };
        const entry = map[ending];
        if (!entry) return { s: fallbackSlot.status, c: fallbackSlot.statusClass };
        return { s: this._pickLocalized(entry), c: entry.c };
    }

    _localizedSlotDeniedMessage(slot) {
        if (slot.number === 7) {
            return this._pickLocalized({
                ko: '해당 데이터는 손상되었습니다.',
                en: 'This data is corrupted.',
                ja: 'このデータは破損しています。',
                es: 'Estos datos están dañados.',
                fr: 'Ces données sont corrompues.',
                de: 'Diese Daten sind beschädigt.',
                pt: 'Estes dados estão corrompidos.'
            });
        }
        if (slot.statusClass === 'active') {
            return this._pickLocalized({
                ko: '진행 중...',
                en: 'In progress...',
                ja: '進行中...',
                es: 'En curso...',
                fr: 'En cours...',
                de: 'In Bearbeitung...',
                pt: 'Em andamento...'
            });
        }
        return this._pickLocalized({
            ko: '권한이 없습니다.',
            en: 'Permission denied.',
            ja: '権限がありません。',
            es: 'Permiso denegado.',
            fr: 'Autorisation refusée.',
            de: 'Zugriff verweigert.',
            pt: 'Permissão negada.'
        });
    }

    _defaultSubjectFaceNames(playerName) {
        return Array.from({ length: 12 }, (_, index) => {
            const slotId = index + 1;
            return `#${slotId} ${this._localizedSubjectName(slotId, '')}`;
        }).concat(`#13 ${playerName}`);
    }

    /**
     * Day 4 밤: 세이브 파일 강제 오픈 연출
     * 핸드폰 화면이 갑자기 켜지며 13개 슬롯이 드러남
     *
     * @param {SaveManager} saveManager - 세이브 매니저 인스턴스
     * @param {string} playerName - 현재 플레이어 이름
     * @returns {Promise<void>} 유저가 닫을 때까지 대기
     */
    async showSaveSlotGlitch(saveManager, playerName) {
        const overlay = document.getElementById('save-slot-overlay');
        const list = document.getElementById('save-slot-list');
        if (!overlay || !list) return;

        // 슬롯 데이터 생성
        const slots = saveManager.getSubjectSlots(playerName).map(slot => this._localizedSubjectRow(slot));
        if (slots[12]?.ngPlusFlash && this._lang() !== 'ko') {
            slots[12].ngPlusFlash = {
                ...slots[12].ngPlusFlash,
                status: this._localizedSubjectStatus(slots[12].ngPlusFlash)
            };
        }

        // 기존 내용 클리어
        list.innerHTML = '';

        // 화면 진동 (모바일)
        if (this.engine?.deviceGimmick) {
            this.engine.deviceGimmick.vibrate('pulse');
        }

        // 오버레이 표시
        overlay.classList.remove('hidden');

        // 글리치 사운드 (있으면)
        await this.showNoise(200);

        // 슬롯 하나씩 순차 표시 (타자기 효과)
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const item = document.createElement('div');
            item.className = `save-slot-item ${slot.statusClass}`;
            item.style.animationDelay = `${i * 0.08}s`;
            item.style.position = 'relative';

            item.innerHTML = `
                <span class="slot-number">[${String(slot.number).padStart(2, '0')}]</span>
                <div class="slot-info">
                    <span class="slot-name">${slot.name}</span>
                    <span class="slot-day">${slot.day} ${slot.time}</span>
                </div>
                <span class="slot-status">${slot.status}</span>
            `;

            // 클릭 시 "로드 거절" 연출
            item.addEventListener('click', () => {
                this._handleSlotClick(item, slot);
            });

            list.appendChild(item);

            // 7번 슬롯(corrupted)에서 잠깐 멈춤 + 노이즈
            if (slot.number === 7) {
                await this._sleep(300);
                await this.showNoise(150);
            }
        }

        // NG+ 모드: 슬롯 13이 잠깐 1회차 결과를 보여줌
        if (slots[12].ngPlusFlash) {
            await this._sleep(800);
            const slot13 = list.children[12];
            if (slot13) {
                const statusEl = slot13.querySelector('.slot-status');
                const origStatus = statusEl.textContent;
                const origClass = slot13.className;

                // 0.5초간 1회차 결과 플래시
                statusEl.textContent = slots[12].ngPlusFlash.status;
                slot13.className = `save-slot-item ${slots[12].ngPlusFlash.statusClass} ng-flash`;

                await this._sleep(500);

                // 원래대로 복구
                statusEl.textContent = origStatus;
                slot13.className = origClass;
            }
        }

        // 유저가 닫을 때까지 대기 (ESC 또는 클릭으로 닫기)
        return new Promise((resolve) => {
            const closeHandler = (e) => {
                // 슬롯 아이템 클릭은 무시 (로드 거절 연출이 처리)
                if (e.target.closest('.save-slot-item')) return;

                // ESC 키 또는 배경 클릭으로 닫기
                if (e.type === 'keydown' && e.key !== 'Escape') return;

                overlay.classList.add('hidden');
                document.removeEventListener('keydown', closeHandler);
                overlay.removeEventListener('click', closeHandler);
                resolve();
            };

            // 3초 후에 닫기 활성화 (바로 닫히는 것 방지)
            const timer = setTimeout(() => {
                document.addEventListener('keydown', closeHandler);
                overlay.addEventListener('click', closeHandler);
            }, 3000);
            this._activeTimers.push(timer);
        });
    }

    /**
     * 엔딩 크레딧용 세이브 파일 UI (SCENARIO.md 5436)
     * 메타 내러티브 마무리 — 13개 슬롯이 엔딩에 따라 다른 상태로 표시
     *
     * TRUE END: 전체 슬롯 '졸업 ✓' (13번째가 12번의 자신도 함께 졸업시킴)
     * 기타 END: 슬롯 13만 해당 엔딩 결과
     *
     * @param {SaveManager} saveManager
     * @param {string} playerName
     * @param {string} ending - 'TRUE' | 'ESCAPE' | 'RESIST' | 'CAGE' | 'FORGET' | 'GHOST' | 'COMPLICIT'
     */
    async showEndingCreditSaveUI(saveManager, playerName, ending) {
        const overlay = document.getElementById('save-slot-overlay');
        const list = document.getElementById('save-slot-list');
        if (!overlay || !list) return;

        const slots = saveManager.getSubjectSlots(playerName).map(slot => this._localizedSubjectRow(slot));

        list.innerHTML = '';
        overlay.classList.remove('hidden');
        overlay.classList.add('ending-credit-mode');

        await this.showNoise(300);

        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const item = document.createElement('div');

            let status, statusClass;
            if (ending === 'TRUE') {
                const m = this._localizedEndingCreditStatus('TRUE', slot);
                status = m.s;
                statusClass = m.c;
            } else if (i === 12) {
                const m = this._localizedEndingCreditStatus(ending, slot);
                status = m.s;
                statusClass = m.c;
            } else {
                status = slot.status;
                statusClass = slot.statusClass;
            }

            item.className = `save-slot-item ${statusClass} credit-slot`;
            item.style.animationDelay = `${i * 0.1}s`;
            item.innerHTML = `
                <span class="slot-number">[${String(slot.number).padStart(2, '0')}]</span>
                <div class="slot-info">
                    <span class="slot-name">${slot.name}</span>
                    <span class="slot-day">${slot.day} ${slot.time}</span>
                </div>
                <span class="slot-status">${status}</span>
            `;
            list.appendChild(item);

            await this._sleep(100);
        }

        return new Promise((resolve) => {
            const close = () => {
                overlay.classList.add('hidden');
                overlay.classList.remove('ending-credit-mode');
                document.removeEventListener('keydown', close);
                overlay.removeEventListener('click', close);
                resolve();
            };
            const t = setTimeout(() => {
                document.addEventListener('keydown', close);
                overlay.addEventListener('click', close);
            }, 2500);
            this._activeTimers.push(t);
        });
    }

    /**
     * 슬롯 클릭 시 "로드 불가" 연출
     * @private
     */
    _handleSlotClick(item, slot) {
        // 이미 거절 메시지가 있으면 무시
        if (item.querySelector('.slot-denied-msg')) return;

        // 흔들림 애니메이션
        item.classList.add('load-denied');
        setTimeout(() => item.classList.remove('load-denied'), 400);

        // 거절 메시지
        const msg = this._localizedSlotDeniedMessage(slot);

        const msgEl = document.createElement('span');
        msgEl.className = 'slot-denied-msg';
        msgEl.textContent = msg;
        item.appendChild(msgEl);

        setTimeout(() => msgEl.remove(), 1500);
    }

    // =========================================================================
    // NG+ 타이틀 화면 변조 (SCENARIO.md 5002-5012)
    // =========================================================================

    /**
     * 2회차 타이틀 화면 변조 적용
     * - 로고 균열 텍스처
     * - [이어하기] 버튼 아래 서브텍스트
     * - [새 게임] 버튼 엔딩별 깜빡임
     *
     * @param {SaveManager} saveManager
     */
    applyNGPlusTitleCorruption(saveManager) {
        if (!saveManager.isNewGamePlus()) return;

        const meta = saveManager.getMeta();

        // 1. 로고 균열 텍스처
        const titleText = document.querySelector('.title-text');
        if (titleText) {
            titleText.classList.add('ng-plus-cracked');
        }

        // 1-2. 캐릭터 일러스트 시선 변경 (SCENARIO.md 5454)
        // 타이틀 스테이지 전반 채도 하락 + 세아(왼쪽)만 정면 응시 스프라이트로 교체
        const stage = document.getElementById('title-stage');
        if (stage) stage.classList.add('ng-plus-mode');
        const seaChar = document.getElementById('title-char-sea');
        if (seaChar) {
            seaChar.classList.add('ng-plus-stare');
            const ngpSrc = seaChar.dataset.ngp;
            if (ngpSrc) {
                // NG+ 전용 응시 스프라이트가 로드되면 교체, 실패 시 기본 + 필터만 유지
                const probe = new Image();
                probe.onload = () => { seaChar.src = ngpSrc; };
                probe.src = ngpSrc;
            }
        }

        // 2. [이어하기] 버튼 아래 서브텍스트
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn && !continueBtn.querySelector('.ng-plus-load-subtext')) {
            const sub = document.createElement('span');
            sub.className = 'ng-plus-load-subtext';
            // i18n은 한국어 기본, 다국어 HTML에서는 해당 언어 적용
            sub.textContent = '\u200B'; // zero-width space placeholder
            continueBtn.style.position = 'relative';
            continueBtn.appendChild(sub);

            // 매우 작은 글씨로 읽히지 않을 정도로
            const lang = document.documentElement.lang || 'ko';
            const loadSubTexts = {
                ko: '(죽은 자는 덮어쓸 수 없습니다)',
                en: '(the dead cannot be overwritten)',
                ja: '(死者は上書きできません)',
                es: '(los muertos no pueden sobrescribirse)',
                fr: '(les morts ne peuvent pas \u00eatre \u00e9cras\u00e9s)',
                de: '(die Toten k\u00f6nnen nicht \u00fcberschrieben werden)',
                pt: '(os mortos não podem ser sobrescritos)'
            };
            sub.textContent = loadSubTexts[lang] || loadSubTexts.en;
        }

        // 3. [새 게임] 버튼 엔딩별 깜빡임
        const newGameBtn = document.getElementById('btn-new-game');
        if (newGameBtn && meta.lastEnding) {
            this._setupNewGameFlicker(newGameBtn, meta.lastEnding);
        }
    }

    /**
     * [새 게임] 버튼에 엔딩별 깜빡임 적용
     * @param {HTMLElement} btn
     * @param {string} lastEnding
     * @private
     */
    _setupNewGameFlicker(btn, lastEnding) {
        const playerName = this.engine?.state?.playerName || '{name}';

        const flickerTexts = {
            FORGET: this._pickLocalized({
                ko: '#14 \uD22C\uC785 (Load Subject #14)',
                en: '#14 Intake (Load Subject #14)',
                ja: '#14 投入 (Load Subject #14)',
                es: '#14 Ingreso (Load Subject #14)',
                fr: '#14 Admission (Load Subject #14)',
                de: '#14 Aufnahme (Load Subject #14)',
                pt: '#14 Inserção (Load Subject #14)'
            }),
            ESCAPE: this._pickLocalized({
                ko: '...\uC544\uBB34\uAC83\uB3C4 \uBC14\uB00C\uC9C0 \uC54A\uC558\uB2E4.',
                en: '...Nothing has changed.',
                ja: '...何も変わっていない。',
                es: '...Nada ha cambiado.',
                fr: "...Rien n'a changé.",
                de: '...Nichts hat sich geändert.',
                pt: '...Nada mudou.'
            }),
            GHOST: this._pickLocalized({
                ko: '...\uC544\uBB34\uAC83\uB3C4 \uBC14\uB00C\uC9C0 \uC54A\uC558\uB2E4.',
                en: '...Nothing has changed.',
                ja: '...何も変わっていない。',
                es: '...Nada ha cambiado.',
                fr: "...Rien n'a changé.",
                de: '...Nichts hat sich geändert.',
                pt: '...Nada mudou.'
            }),
            RESIST: this._pickLocalized({
                ko: '\uC740\uC218\uB294 \uB5A0\uB0AC\uB2E4. \uC774\uC0AC\uD68C\uB294 \uB0A8\uC558\uB2E4.',
                en: 'Eunsu left. The board remains.',
                ja: 'ウンスは去った。理事会は残った。',
                es: 'Eunsu se fue. La junta permanece.',
                fr: 'Eunsu est partie. Le conseil reste.',
                de: 'Eunsu ist gegangen. Der Vorstand bleibt.',
                pt: 'Eunsu foi embora. O conselho permanece.'
            }),
            TRUE: this._pickLocalized({
                ko: '...\uB2E4 \uB05D\uB0AC\uB294\uB370.',
                en: '...But it was over.',
                ja: '...でも、終わったはずなのに。',
                es: '...Pero ya había terminado.',
                fr: "...Mais c'était terminé.",
                de: '...Aber es war vorbei.',
                pt: '...Mas já tinha acabado.'
            }),
            COMPLICIT: this._pickLocalized({
                ko: `#14 \uD22C\uC785 \uC2B9\uC778 \u2014 \uB2F4\uB2F9: ${playerName}`,
                en: `#14 Intake approved - handler: ${playerName}`,
                ja: `#14 投入承認 - 担当: ${playerName}`,
                es: `#14 Ingreso aprobado - responsable: ${playerName}`,
                fr: `#14 Admission approuvée - responsable : ${playerName}`,
                de: `#14 Aufnahme genehmigt - Betreuer: ${playerName}`,
                pt: `#14 Inserção aprovada - responsável: ${playerName}`
            })
        };

        // TRUE END 추가 깜빡임 — 본편 감정선 이후의 아주 짧은 잔상
        const trueEndSecondFlicker = this._pickLocalized({
            ko: '\uAE30\uB85D\uC774 \uC544\uC9C1 \uB2EB\uD788\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.',
            en: 'The record has not closed yet.',
            ja: '記録はまだ閉じていません。',
            es: 'El registro aún no se ha cerrado.',
            fr: "Le dossier n'est pas encore clos.",
            de: 'Der Eintrag ist noch nicht geschlossen.',
            pt: 'O registro ainda não foi encerrado.'
        });

        const flickerText = flickerTexts[lastEnding];
        if (!flickerText) return; // CAGE: no flicker

        const originalText = btn.textContent;
        const flickerDuration = (lastEnding === 'TRUE' || lastEnding === 'COMPLICIT') ? 500 : 300;

        // 5초마다 반복 깜빡임 (타이틀 화면에 있는 동안)
        const doFlicker = () => {
            if (!btn.isConnected) return; // DOM에서 제거되면 중단
            btn.textContent = flickerText;
            btn.classList.add('glitch-text');

            if (lastEnding === 'TRUE') {
                // TRUE END: 0.5초 "...다 끝났는데." 후 0.3초 기록 잔상
                setTimeout(() => {
                    if (!btn.isConnected) return;
                    btn.textContent = trueEndSecondFlicker;
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('glitch-text');
                    }, 300);
                }, flickerDuration);
            } else {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('glitch-text');
                }, flickerDuration);
            }
        };

        // 첫 깜빡임은 2초 후
        const t1 = setTimeout(doFlicker, 2000);
        this._activeTimers.push(t1);

        // 이후 8초마다 반복
        const interval = setInterval(() => {
            if (!btn.isConnected) { clearInterval(interval); return; }
            doFlicker();
        }, 8000);
        this._ngPlusTitleInterval = interval;
    }

    /**
     * NG+ 타이틀 BGM 변조 — 피치 다운 + 0.75배속
     * @param {AudioManager} audio
     */
    applyNGPlusTitleBGM(audio) {
        if (!audio?.ctx) return;

        // BGM 피치 다운은 playbackRate로 구현
        // AudioManager의 BGM이 시작된 후 호출해야 함
        const applyPitchDown = () => {
            const activeGain = audio._activeSlotA ? audio.bgmGainA : audio.bgmGainB;
            const activeSource = audio._activeSlotA ? audio.bgmSourceA : audio.bgmSourceB;
            if (activeSource) {
                // 반음 다운 = 2^(-1/12) ≈ 0.9439, * 0.75 배속 = ~0.708
                activeSource.playbackRate.value = 0.75 * Math.pow(2, -1/12);
            }
        };

        // 약간 지연 (BGM 로드 후)
        const t = setTimeout(applyPitchDown, 500);
        this._activeTimers.push(t);

        // SCENARIO.md 5450: 15초마다 불협화음 건반 1타 삽입
        this._startNGPlusDissonantChord(audio);
    }

    /**
     * NG+ 타이틀 — 15초마다 불협화음 1타 (SCENARIO.md 5450)
     * @param {AudioManager} audio
     * @private
     */
    _startNGPlusDissonantChord(audio) {
        if (!audio?.ctx) return;
        if (this._ngPlusDissonanceInterval) return;

        const playChord = () => {
            if (!audio.ctx || audio.ctx.state !== 'running') return;
            try {
                const ctx = audio.ctx;
                const now = ctx.currentCurrentTime !== undefined ? ctx.currentTime : ctx.currentTime;
                // 트라이톤 + 반음 긁기 = 강한 불협화음 (F#4 + G4 + C5)
                const frequencies = [369.99, 392.00, 523.25];
                const master = ctx.createGain();
                master.gain.setValueAtTime(0, now);
                master.gain.linearRampToValueAtTime(0.08, now + 0.02);
                master.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
                master.connect(audio.sfxGain || audio.masterGain || ctx.destination);

                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    osc.type = i === 0 ? 'triangle' : 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    const g = ctx.createGain();
                    g.gain.value = i === 2 ? 0.35 : 0.55;
                    osc.connect(g);
                    g.connect(master);
                    osc.start(now);
                    osc.stop(now + 2.5);
                });
            } catch (e) {
                // 무시 — 실패해도 경고 없이 다음 주기로
            }
        };

        // 15초마다 (SCENARIO.md 명시)
        this._ngPlusDissonanceInterval = setInterval(playChord, 15000);
    }

    // =========================================================================
    // NG+ 선택지 스테이닝 (SCENARIO.md 5036-5047)
    // =========================================================================

    /**
     * 선택지 버튼에 1회차 선택 흔적 표시
     * - 이전 회차에서 선택한 선택지에 붉은 체크마크
     * - 특정 씬에서 고스트 텍스트 표시
     *
     * @param {HTMLElement[]} buttons - 선택지 버튼 배열
     * @param {string} sceneId - 현재 씬 ID
     * @param {SaveManager} saveManager
     */
    applyChoiceStaining(buttons, sceneId, saveManager) {
        if (!saveManager.isNewGamePlus()) return;

        const prevChoice = saveManager.getPreviousChoice(sceneId);
        if (!prevChoice) return;

        const prevIndex = prevChoice.index;
        if (prevIndex < 0 || prevIndex >= buttons.length) return;

        const targetBtn = buttons[prevIndex];
        if (!targetBtn) return;

        // 붉은 체크마크 0.3초간 깜빡임
        targetBtn.style.position = 'relative';
        const check = document.createElement('span');
        check.className = 'ng-plus-check';
        check.textContent = '\u2713';
        targetBtn.appendChild(check);

        const t = setTimeout(() => check.remove(), 300);
        this._activeTimers.push(t);

        // 특정 씬에서 고스트 텍스트 (SCENARIO.md 5485-5488, 전체 게임 3~5회 제한)
        // 실제 시나리오 씬 ID로 매핑
        const ghostTexts = {
            'day1_choco_choice': this._pickLocalized({
                ko: '...물어봤자 같은 대답이야.',
                en: '...You already know the answer.',
                ja: '...答えはもう知っている。',
                es: '...Ya sabes la respuesta.',
                fr: '...Tu connais déjà la réponse.',
                de: '...Du kennst die Antwort schon.',
                pt: '...Você já sabe a resposta.'
            }),
            'day3_after_riin_choice': this._pickLocalized({
                ko: '너 이거 맛 알잖아.',
                en: 'You know what this tastes like.',
                ja: 'この味、知ってるでしょ。',
                es: 'Sabes a qué sabe esto.',
                fr: 'Tu sais quel goût ça a.',
                de: 'Du kennst diesen Geschmack.',
                pt: 'Você sabe que gosto isso tem.'
            }),
            'day5_morning_proposal_timer': this._pickLocalized({
                ko: '또?',
                en: 'Again?',
                ja: 'また?',
                es: '¿Otra vez?',
                fr: 'Encore ?',
                de: 'Schon wieder?',
                pt: 'De novo?'
            })
        };

        const ghostText = ghostTexts[sceneId];
        if (ghostText) {
            const ghost = document.createElement('span');
            ghost.className = 'choice-ghost-text';
            ghost.textContent = ghostText;
            targetBtn.appendChild(ghost);

            const duration = sceneId === 'day5_morning_proposal_timer' ? 300 : 500;
            const t2 = setTimeout(() => ghost.remove(), duration);
            this._activeTimers.push(t2);
        }
    }

    // =========================================================================
    // NG+ 대사 미세 왜곡 (SCENARIO.md 5049-5062)
    // =========================================================================

    /**
     * 대사 표시 전 깜빡임 단어 삽입
     * 특정 씬에서 대사 앞에 "또" 등의 단어가 0.3초 깜빡임
     *
     * @param {string} sceneId - 현재 씬 ID
     * @param {HTMLElement} textEl - 대사 텍스트 요소
     * @param {SaveManager} saveManager
     * @returns {number} 추가 딜레이 ms (깜빡임이 있으면 300, 없으면 0)
     */
    applyDialogueDistortion(sceneId, textEl, saveManager) {
        if (!saveManager.isNewGamePlus()) return 0;
        if (!textEl) return 0;

        // 씬별 깜빡임 단어 매핑 (SCENARIO.md 5497-5500, 실제 씬 ID)
        const flashWords = {
            'day1_eunsu_1': this._pickLocalized({
                ko: '또',
                en: 'Again',
                ja: 'また',
                es: 'Otra vez',
                fr: 'Encore',
                de: 'Wieder',
                pt: 'De novo'
            }),
            'day1_eunsu_2': this._pickLocalized({
                ko: '또',
                en: 'Again',
                ja: 'また',
                es: 'Otra vez',
                fr: 'Encore',
                de: 'Wieder',
                pt: 'De novo'
            }),
            'day1_choco_1': this._pickLocalized({
                ko: '이번에도',
                en: 'This time too',
                ja: '今回も',
                es: 'Esta vez también',
                fr: 'Cette fois aussi',
                de: 'Auch diesmal',
                pt: 'Desta vez também'
            })
        };

        const word = flashWords[sceneId];
        if (!word) return 0;

        // 텍스트 요소 위에 깜빡임 단어 오버레이
        textEl.style.position = 'relative';
        const flash = document.createElement('span');
        flash.className = 'ng-plus-flash-word';
        flash.textContent = word;
        textEl.appendChild(flash);

        const t = setTimeout(() => flash.remove(), 300);
        this._activeTimers.push(t);

        return 300;
    }

    // =========================================================================
    // NG+ Day 1 조기 탈출 (SCENARIO.md 5064-5096)
    // =========================================================================

    /**
     * Day 1 교문에서 뒤로 가기 시도 감지 및 히든 이벤트
     * 3회 이상 시도 시 발동
     *
     * @param {Function} onTrigger - 히든 이벤트 발동 시 콜백 (씬 전환)
     * @param {SaveManager} saveManager
     * @returns {{ increment: Function, getCount: Function }}
     */
    setupEarlyEscape(saveManager) {
        if (!saveManager.isNewGamePlus()) return null;

        let escapeAttempts = 0;

        return {
            increment: () => ++escapeAttempts,
            getCount: () => escapeAttempts,
            shouldTrigger: () => escapeAttempts >= 3
        };
    }

    /**
     * 조기 탈출 히든 이벤트 연출 — 화면 하얘짐 + 교실 복귀
     * @returns {Promise<void>}
     */
    async playEarlyEscapeSequence() {
        // 1. 화면 서서히 하얘짐
        const white = document.createElement('div');
        white.className = 'early-escape-white';
        document.body.appendChild(white);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                white.classList.add('active');
            });
        });

        // BGM 페이드아웃
        const audio = this.engine?.audio;
        if (audio?.ctx) {
            audio.fadeOutAll(2000);
        }

        await this._sleep(2500);

        // 2. 완전 화이트아웃 후 제거
        await this._sleep(500);
        white.remove();

        // 3. 블랙아웃으로 전환
        await this.showBlackout(1500);
    }

    // =========================================================================
    // Day 5 노이즈 필터 (SCENARIO.md 3408)
    // =========================================================================

    /**
     * Day 5 모든 대화창에 노이즈 필터 CSS 적용
     */
    enableDay5NoiseFilter() {
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.classList.add('day5-noise');
        }
    }

    /**
     * Day 5 노이즈 필터 제거
     */
    disableDay5NoiseFilter() {
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.classList.remove('day5-noise');
        }
    }

    // =========================================================================
    // 인터랙티브 거울 스와이프 (SCENARIO.md 3253)
    // =========================================================================

    /**
     * 거울 안개 닦기 인터랙션
     * canvas 마스크로 구현: 위에서 아래로 스와이프하면 안개가 걷힘
     *
     * @param {string} mirrorBgUrl - 거울 아래 배경(반사) 이미지 URL
     * @param {Function} onComplete - 안개 70% 이상 제거 시 콜백
     * @returns {Promise<void>}
     */
    async showMirrorSwipe(mirrorBgUrl, onComplete, options = {}) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.className = 'mirror-swipe-container';

            const canvas = document.createElement('canvas');
            canvas.className = 'mirror-swipe-canvas';
            container.appendChild(canvas);

            // 힌트 텍스트
            const hint = document.createElement('div');
            hint.className = 'mirror-swipe-hint';
            const lang = document.documentElement.lang || 'ko';
            const hintTexts = {
                ko: '\u2191 \uC704\uC5D0\uC11C \uC544\uB798\uB85C \uB2E6\uC73C\uC138\uC694',
                en: '\u2191 Swipe down to wipe',
                ja: '\u2191 \u4E0A\u304B\u3089\u4E0B\u3078\u62ED\u3044\u3066\u304F\u3060\u3055\u3044',
                es: '\u2191 Desliza hacia abajo',
                fr: '\u2191 Glissez vers le bas',
                de: '\u2191 Nach unten wischen',
                pt: '\u2191 Deslize para baixo'
            };
            hint.textContent = hintTexts[lang] || hintTexts.en;
            container.appendChild(hint);

            document.body.appendChild(container);

            // Canvas 설정
            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                drawFog();
            };

            const ctx = canvas.getContext('2d');
            let completed = false;
            let targetRect = null;
            let cellSize = 18;
            let targetCols = 1;
            let targetRows = 1;
            let clearedCells = new Set();
            let minClearedY = Infinity;
            let maxClearedY = -Infinity;
            const completeThreshold = Math.max(0.2, Math.min(0.6, Number(options.threshold) || 0.32));
            const requiredVerticalSpan = Math.max(0.45, Math.min(0.75, Number(options.verticalSpan) || 0.58));

            const getTargetRect = () => {
                const width = Math.min(canvas.width * 0.56, 560);
                const height = Math.min(canvas.height * 0.76, 760);
                return {
                    left: (canvas.width - width) / 2,
                    top: (canvas.height - height) / 2,
                    width,
                    height
                };
            };

            const resetProgress = () => {
                targetRect = getTargetRect();
                cellSize = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.024));
                targetCols = Math.max(1, Math.ceil(targetRect.width / cellSize));
                targetRows = Math.max(1, Math.ceil(targetRect.height / cellSize));
                clearedCells = new Set();
                minClearedY = Infinity;
                maxClearedY = -Infinity;
            };

            const drawFog = () => {
                ctx.fillStyle = 'rgba(200, 210, 220, 0.95)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                resetProgress();
            };

            resize();
            window.addEventListener('resize', resize);

            // 스와이프로 안개 제거
            let isDrawing = false;
            const stopDrawing = () => { isDrawing = false; };
            const brushSize = Math.max(40, Math.min(canvas.width, canvas.height) * 0.08);

            const markCleared = (x, y) => {
                if (!targetRect) return { clearRatio: 0, verticalRatio: 0 };

                const radiusSq = brushSize * brushSize;
                const colStart = Math.max(0, Math.floor((x - brushSize - targetRect.left) / cellSize));
                const colEnd = Math.min(targetCols - 1, Math.floor((x + brushSize - targetRect.left) / cellSize));
                const rowStart = Math.max(0, Math.floor((y - brushSize - targetRect.top) / cellSize));
                const rowEnd = Math.min(targetRows - 1, Math.floor((y + brushSize - targetRect.top) / cellSize));

                for (let row = rowStart; row <= rowEnd; row++) {
                    const cellY = targetRect.top + row * cellSize + cellSize / 2;
                    for (let col = colStart; col <= colEnd; col++) {
                        const cellX = targetRect.left + col * cellSize + cellSize / 2;
                        const dx = cellX - x;
                        const dy = cellY - y;
                        if ((dx * dx + dy * dy) > radiusSq) continue;
                        clearedCells.add(`${col}:${row}`);
                        minClearedY = Math.min(minClearedY, cellY);
                        maxClearedY = Math.max(maxClearedY, cellY);
                    }
                }

                const clearRatio = clearedCells.size / Math.max(1, targetCols * targetRows);
                const verticalRatio = Number.isFinite(minClearedY)
                    ? Math.max(0, maxClearedY - minClearedY) / targetRect.height
                    : 0;
                return { clearRatio, verticalRatio };
            };

            const clearFog = (x, y) => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, brushSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';

                const { clearRatio, verticalRatio } = markCleared(x, y);

                if (clearRatio >= completeThreshold && verticalRatio >= requiredVerticalSpan && !completed) {
                    completed = true;
                    hint.remove();

                    // 안개 완전 제거 애니메이션
                    const fadeOut = () => {
                        canvas.style.transition = 'opacity 0.5s ease';
                        canvas.style.opacity = '0';
                        setTimeout(() => {
                            window.removeEventListener('resize', resize);
                            window.removeEventListener('mouseup', stopDrawing);
                            container.remove();
                            if (onComplete) onComplete();
                            resolve();
                        }, 500);
                    };

                    setTimeout(fadeOut, 300);
                }
            };

            // 마우스 이벤트
            canvas.addEventListener('mousedown', (e) => { isDrawing = true; clearFog(e.clientX, e.clientY); });
            canvas.addEventListener('mousemove', (e) => { if (isDrawing) clearFog(e.clientX, e.clientY); });
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing);
            window.addEventListener('mouseup', stopDrawing);

            // 터치 이벤트
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDrawing = true;
                const t = e.touches[0];
                clearFog(t.clientX, t.clientY);
            }, { passive: false });
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isDrawing) return;
                const t = e.touches[0];
                clearFog(t.clientX, t.clientY);
            }, { passive: false });
            canvas.addEventListener('touchend', stopDrawing);
        });
    }

    // =========================================================================
    // 거울 13명 얼굴 오버레이 (SCENARIO.md 3337)
    // =========================================================================

    /**
     * 거울 2타: 13장의 증명사진을 빠르게 오버레이
     * @param {Array<string|{label: string, image?: string}>} faceNames - 13명의 이름/이미지 배열
     * @param {string} playerName - 현재 플레이어 이름 (13번째)
     * @param {string} finalText - 최종 표시 텍스트
     * @returns {Promise<void>}
     */
    async showMirror13Faces(faceNames, playerName, finalText, options = {}) {
        const photoInterval = Math.max(60, Number(options.photoInterval) || 400);
        const finalHold = Math.max(0, Number(options.overlayFadeDuration) || 3000);
        const exitFade = Math.max(0, Number(options.overlayExitFadeDuration) || 1000);
        const overlay = document.createElement('div');
        overlay.className = 'mirror-face-overlay';
        document.body.appendChild(overlay);

        // 기본 이름 목록 (이미지가 없으면 텍스트로 대체)
        const entries = (faceNames || this._defaultSubjectFaceNames(playerName)).map(entry => {
            if (entry && typeof entry === 'object') return entry;
            return { label: entry };
        });

        // 진동 동기화 (모바일)
        const deviceGimmick = this.engine?.deviceGimmick;

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const frame = document.createElement('div');
            frame.className = 'mirror-face-card';

            if (entry.image) {
                const img = document.createElement('img');
                img.className = 'mirror-face-img';
                img.alt = '';
                img.src = this._assetUrl(entry.image);
                frame.appendChild(img);
            }

            const nameEl = document.createElement('div');
            nameEl.className = 'mirror-face-name';
            nameEl.textContent = entry.label || '';
            frame.appendChild(nameEl);
            overlay.appendChild(frame);

            // 진동 (0.4초 간격)
            if (deviceGimmick) {
                deviceGimmick.vibrate([100]);
            }

            await this._sleep(photoInterval);
            frame.remove();
        }

        // 최종 텍스트
        const finalEl = document.createElement('div');
        finalEl.className = 'mirror-final-text';
        finalEl.textContent = finalText || this._pickLocalized({
            ko: '\uB098\uB294 13\uBC88\uC9F8 \uAECD\uB370\uAE30\uB2E4.',
            en: 'I am the 13th shell.',
            ja: '私は13番目の殻だ。',
            es: 'Soy la decimotercera cáscara.',
            fr: 'Je suis la treizième coquille.',
            de: 'Ich bin die dreizehnte Hülle.',
            pt: 'Eu sou a décima terceira casca.'
        });
        overlay.appendChild(finalEl);

        await this._sleep(finalHold);

        // 페이드아웃
        overlay.style.transition = `opacity ${exitFade}ms ease`;
        overlay.style.opacity = '0';
        await this._sleep(exitFade);
        overlay.remove();
    }

    // =========================================================================
    // NG+ 스킵 시스템 삽입 (SCENARIO.md 5025-5034)
    // =========================================================================

    /**
     * 스킵 중 기시감 텍스트 삽입
     * 2회차 스킵 시 특정 씬에서 0.5초 더 긴 표시 + 기시감 텍스트
     *
     * @param {string} sceneId - 현재 씬 ID
     * @param {SaveManager} saveManager
     * @returns {boolean} true면 스킵 딜레이 적용
     */
    _getDejaVuTexts() {
        // SCENARIO.md 5473-5477 (B. 스킵 시스템 변조)
        // 씬 ID는 실제 시나리오에 존재해야 매칭됨
        return {
            'day1_gate_1': this._pickLocalized({
                ko: '...이 길을 아는 것 같다. 왜지? 처음 오는 학교인데. ......피곤해서 그런 거겠지.',
                en: '...I feel like I know this path. Why? It is my first time at this school. ...I must be tired.',
                ja: '...この道を知っている気がする。なぜ? 初めて来る学校なのに。...疲れているだけだろう。',
                es: '...Siento que conozco este camino. ¿Por qué? Es mi primera vez en esta escuela. ...Debo estar cansado.',
                fr: "...J'ai l'impression de connaître ce chemin. Pourquoi ? C'est ma première fois dans cette école. ...Je dois être fatigué.",
                de: '...Ich habe das Gefühl, diesen Weg zu kennen. Warum? Ich bin zum ersten Mal an dieser Schule. ...Ich muss müde sein.',
                pt: '...Sinto que conheço este caminho. Por quê? É minha primeira vez nesta escola. ...Devo estar cansado.'
            }),
            'day1_hallway_1': this._pickLocalized({
                ko: '...이 웃음. 어딘가에서 봤다. ...아닌가.',
                en: '...That smile. I have seen it somewhere. ...Or maybe not.',
                ja: '...あの笑顔。どこかで見たことがある。...違うかもしれない。',
                es: '...Esa sonrisa. La he visto en algún lugar. ...O tal vez no.',
                fr: "...Ce sourire. Je l'ai déjà vu quelque part. ...Ou peut-être pas.",
                de: '...Dieses Lächeln. Ich habe es irgendwo schon gesehen. ...Oder vielleicht nicht.',
                pt: '...Aquele sorriso. Já vi em algum lugar. ...Ou talvez não.'
            }),
            'day2_morning_gate_1': this._pickLocalized({
                ko: '...세아의 동작이 어쩐지 익숙하다. 기분 탓이겠지.',
                en: "...Sea's movement feels strangely familiar. It must be my imagination.",
                ja: '...セアの動きが妙に見覚えある。気のせいだろう。',
                es: '...El movimiento de Sea se siente extrañamente familiar. Debe ser mi imaginación.',
                fr: "...Le geste de Sea me semble étrangement familier. C'est sûrement mon imagination.",
                de: '...Seas Bewegung kommt mir seltsam vertraut vor. Das bilde ich mir sicher nur ein.',
                pt: '...O movimento da Sea parece estranhamente familiar. Deve ser coisa da minha cabeça.'
            }),
            'day3_after_riin_drink': this._pickLocalized({
                ko: '...이 맛. 낯설지 않다. 마셔본 적도 없는데.',
                en: '...This taste is not unfamiliar, even though I have never drunk it before.',
                ja: '...この味。知らない味じゃない。飲んだこともないのに。',
                es: '...Este sabor no me resulta desconocido, aunque nunca lo había bebido.',
                fr: "...Ce goût ne m'est pas inconnu, même si je ne l'ai jamais bu.",
                de: '...Dieser Geschmack ist mir nicht fremd, obwohl ich es noch nie getrunken habe.',
                pt: '...Este gosto não é estranho, mesmo eu nunca tendo bebido isto antes.'
            })
        };
    }

    checkSkipDejaVu(sceneId, saveManager) {
        if (!saveManager.isNewGamePlus()) return false;

        const dejaVuTexts = this._getDejaVuTexts();

        const text = dejaVuTexts[sceneId];
        if (!text) return false;

        // 기시감 텍스트 표시
        const el = document.createElement('div');
        el.className = 'skip-dejavu-text';
        el.textContent = text;
        document.body.appendChild(el);

        const t = setTimeout(() => el.remove(), 2000);
        this._activeTimers.push(t);

        return true;
    }

    // =========================================================================
    // COMPLICIT 2회차 서명 인터랙션 (SCENARIO.md 5107-5120)
    // =========================================================================

    /**
     * COMPLICIT END 2회차: 서명란 터치 인터랙션
     * 자동 진행이 아닌 플레이어가 직접 서명란을 클릭해야 진행
     *
     * @param {string} playerName - 서명할 이름
     * @param {SaveManager} saveManager
     * @returns {Promise<void>} 서명 완료 시 resolve
     */
    async showComplicitSignature(playerName, saveManager) {
        if (!saveManager.hasSeenEnding('COMPLICIT')) {
            return; // 1회차에는 자동 진행
        }

        const choicePanel = document.getElementById('choice-panel');
        if (!choicePanel) return;

        return new Promise((resolve) => {
            choicePanel.innerHTML = '';
            choicePanel.classList.remove('hidden');

            const signArea = document.createElement('div');
            signArea.className = 'complicit-sign-area';
            signArea.textContent = playerName;

            choicePanel.appendChild(signArea);

            // 서명 직전 0.5초간 멈춤 + 유령 텍스트
            const ghost = document.createElement('span');
            ghost.className = 'sign-ghost';
            ghost.textContent = this._pickLocalized({
                ko: '\uB450 \uBC88\uC9F8\uC57C.',
                en: 'It is the second time.',
                ja: '二度目だ。',
                es: 'Es la segunda vez.',
                fr: "C'est la deuxième fois.",
                de: 'Es ist das zweite Mal.',
                pt: 'É a segunda vez.'
            });
            signArea.appendChild(ghost);

            const t = setTimeout(() => ghost.remove(), 500);
            this._activeTimers.push(t);

            // 진동 (서명 순간)
            signArea.addEventListener('click', () => {
                if (this.engine?.deviceGimmick) {
                    this.engine.deviceGimmick.vibrate([100]);
                }
                choicePanel.classList.add('hidden');
                choicePanel.innerHTML = '';
                resolve();
            }, { once: true });
        });
    }

    // =========================================================================
    // ★ 인터랙티브 거울 스와이프 래퍼 (Day 4 밤)
    // 기존 showMirrorSwipe()를 scene.glitch.mirrorWipe 키로 호출한다.
    // requireSwipe=true면 스와이프 완료 전까지 대화 진행을 차단한다.
    // =========================================================================

    startMirrorWipe(opts = {}) {
        // 이미 실행 중이면 무시 (swipe_2~5의 silence만 있는 후속 씬)
        if (document.querySelector('.mirror-swipe-container')) return;

        const engine = this.engine;
        if (opts.requireSwipe && engine) {
            // _loadScene이 걸어둔 300ms 자동 해제 타이머를 무효화 — 스와이프 완료까지 유지
            if (engine._clickLockTimer) {
                clearTimeout(engine._clickLockTimer);
                engine._clickLockTimer = null;
            }
            engine._clickLocked = true;
        }

        this.showMirrorPlayerReveal(0);
        this.showMirrorSwipe(null, () => {
            this.showMirrorPlayerReveal(1);
            if (engine) engine._clickLocked = false;
        }, {
            threshold: opts.threshold,
            verticalSpan: opts.verticalSpan
        });
    }

    // =========================================================================
    // ★ COMPLICIT 서명 패드 (SCENARIO.md 5608)
    // 유저가 직접 드래그/터치로 "서명"해야 진행된다 — 돌이킬 수 없음의 촉감.
    // 완료 시 짧고 날카로운 진동 0.1초 + 스크린샷 컨텍스트 활성화(반응 없음).
    // =========================================================================

    startSignaturePad(opts = {}) {
        if (document.querySelector('.signature-pad-container')) return;
        const engine = this.engine;
        if (opts.requireSignature && engine) {
            if (engine._clickLockTimer) {
                clearTimeout(engine._clickLockTimer);
                engine._clickLockTimer = null;
            }
            engine._clickLocked = true;
        }
        // 스크린샷 감지: '반응 없음'이지만 컨텍스트는 활성화 (SCENARIO.md 5640 — 기록 허용)
        engine?.metaHorror?.setScreenshotContext?.('complicit_sign');
        this._showSignaturePad(() => {
            if (engine) engine._clickLocked = false;
            // 짧고 날카로운 단일 진동 0.1초 (돌이킬 수 없음의 촉감)
            engine?.deviceGimmick?.vibrate?.('complicit_sign');
            engine?._vibrateVisual?.('complicit_sign');
        });
    }

    _showSignaturePad(onComplete) {
        const container = document.createElement('div');
        container.className = 'signature-pad-container';

        const paper = document.createElement('div');
        paper.className = 'signature-pad-paper';

        const label = document.createElement('div');
        label.className = 'signature-pad-label';
        const lang = document.documentElement.lang || 'ko';
        const labels = {
            ko: '서명',
            en: 'Signature',
            ja: '署名',
            es: 'Firma',
            fr: 'Signature',
            de: 'Unterschrift',
            pt: 'Assinatura'
        };
        label.textContent = labels[lang] || labels.en;

        const line = document.createElement('div');
        line.className = 'signature-pad-line';

        const canvas = document.createElement('canvas');
        canvas.className = 'signature-pad-canvas';

        paper.appendChild(label);
        paper.appendChild(canvas);
        paper.appendChild(line);
        container.appendChild(paper);
        document.body.appendChild(container);

        // 캔버스 사이즈 (paper 기준)
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let drawing = false;
        let last = null;
        let drawnPixels = 0;
        let completed = false;
        // 서명 "유효" 기준 — 총 이동 거리 > threshold
        const threshold = Math.max(180, canvas.width * 0.35);

        const toLocal = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const beginStroke = (x, y) => {
            drawing = true;
            last = { x, y };
            ctx.beginPath();
            ctx.moveTo(x, y);
        };
        const extendStroke = (x, y) => {
            if (!drawing) return;
            ctx.lineTo(x, y);
            ctx.stroke();
            const dx = x - last.x, dy = y - last.y;
            drawnPixels += Math.sqrt(dx * dx + dy * dy);
            last = { x, y };
            if (drawnPixels > threshold && !completed) {
                completed = true;
                setTimeout(() => {
                    container.classList.add('signature-pad-done');
                    setTimeout(() => {
                        window.removeEventListener('resize', resize);
                        container.remove();
                        if (onComplete) onComplete();
                    }, 400);
                }, 200);
            }
        };
        const endStroke = () => { drawing = false; };

        canvas.addEventListener('mousedown', (e) => {
            const p = toLocal(e.clientX, e.clientY);
            beginStroke(p.x, p.y);
        });
        canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            const p = toLocal(e.clientX, e.clientY);
            extendStroke(p.x, p.y);
        });
        canvas.addEventListener('mouseup', endStroke);
        canvas.addEventListener('mouseleave', endStroke);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            const p = toLocal(t.clientX, t.clientY);
            beginStroke(p.x, p.y);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!drawing) return;
            const t = e.touches[0];
            const p = toLocal(t.clientX, t.clientY);
            extendStroke(p.x, p.y);
        }, { passive: false });
        canvas.addEventListener('touchend', endStroke);
    }

    hideSignaturePad() {
        document.querySelector('.signature-pad-container')?.remove();
    }

    /**
     * Day 3 유나 13장 사진 — NG+ 시 14번째 빈 프레임 0.8초 (SCENARIO.md 5503)
     */
    show14thEmptyFrame(duration = 800) {
        const frame = document.createElement('div');
        frame.id = 'ng-plus-empty-frame';
        frame.style.cssText = `
            position: fixed;
            bottom: 18%;
            right: 14%;
            width: 90px;
            height: 120px;
            border: 2px dashed rgba(220, 220, 230, 0.8);
            background: rgba(15, 15, 20, 0.3);
            z-index: 180;
            pointer-events: none;
            opacity: 0;
            transition: opacity 180ms ease-in;
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(220, 220, 230, 0.6);
            font-family: monospace;
            font-size: 0.72rem;
            letter-spacing: 1px;
        `;
        frame.textContent = '#14';
        document.body.appendChild(frame);

        requestAnimationFrame(() => { frame.style.opacity = '1'; });
        const t1 = setTimeout(() => { frame.style.opacity = '0'; }, duration - 180);
        const t2 = setTimeout(() => frame.remove(), duration);
        this._activeTimers.push(t1, t2);
    }

    /** scenario의 photoOverlay 키를 기존 showMirror13Faces로 연결 */
    async showPhotoOverlay(opts = {}) {
        const sequence = opts.photoSequence || [];
        const playerName = this.engine?.state?.playerName || '';
        const entries = sequence.map(p => {
            const display = (p.name === '{name}')
                ? playerName
                : this._localizedSubjectName(p.slot, p.name);
            return {
                label: `#${String(p.slot).padStart(2, '0')}  ${display}`,
                image: CONFIG.SUBJECT_FACE_IMAGES?.[p.slot] || null
            };
        });
        const overlayTextRaw = this._pickLocalized(
            (opts.overlayText && typeof opts.overlayText === 'object')
                ? opts.overlayText
                : {
                    ko: opts.overlayText || '',
                    en: 'Current name: {name}',
                    ja: '\u4eca\u56de\u306e\u540d\u524d: {name}',
                    es: 'Nombre actual: {name}',
                    fr: 'Nom actuel : {name}',
                    de: 'Aktueller Name: {name}',
                    pt: 'Nome atual: {name}'
                }
        );
        const overlayText = overlayTextRaw.replace('{name}', playerName);
        await this.showMirror13Faces(entries, playerName, overlayText, {
            photoInterval: opts.photoInterval,
            overlayFadeDuration: opts.overlayFadeDuration,
            overlayExitFadeDuration: opts.overlayExitFadeDuration
        });
    }

    hidePhotoOverlay() {
        document.querySelector('.mirror-face-overlay')?.remove();
    }

    _teardownMirrorWipe() {
        document.querySelector('.mirror-swipe-container')?.remove();
        document.getElementById('mirror-player-reflection')?.remove();
    }

    // =========================================================================
    // ★ 거울 속 반사 (characterAbsentInMirror)
    // 화면 위쪽에 거울 프레임을 띄우고, 캐릭터 레이어의 특정 캐릭터를
    // 반사상에서 제외해 '설화는 거울에 비치지 않는다' 연출
    // =========================================================================

    showMirrorReflection(absentCharId) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        this.hideMirrorReflection();

        const mirror = document.createElement('div');
        mirror.className = 'mirror-reflection';
        mirror.id = 'mirror-reflection';

        const inner = document.createElement('div');
        inner.className = 'mirror-reflection-inner';

        const self = document.createElement('div');
        self.className = 'mirror-reflection-self';
        self.innerHTML = `
            <span class="mirror-reflection-self-hair"></span>
            <span class="mirror-reflection-self-eye mirror-reflection-self-eye-left"></span>
            <span class="mirror-reflection-self-eye mirror-reflection-self-eye-right"></span>
            <span class="mirror-reflection-self-nose"></span>
            <span class="mirror-reflection-self-mouth"></span>
        `;
        const playerMirror = CONFIG.EVIDENCE_IMAGES?.player_mirror;
        if (playerMirror) {
            self.classList.add('mirror-reflection-self-image');
            self.style.backgroundImage = `url('${this._assetUrl(playerMirror)}')`;
        }
        inner.appendChild(self);

        // 현재 캐릭터 레이어 복제 (transform scaleX(-1)로 거울상)
        ['char-left', 'char-center', 'char-right'].forEach(id => {
            const src = document.getElementById(id);
            if (!src?.src || src.src.endsWith('/') || src.style.display === 'none') return;
            if (src.classList.contains('char-fade-out')) return;
            // 스프라이트 URL에서 charId 추출: 파일명 첫 언더스코어 앞 토큰
            // 예) assets/images/characters/seolhwa_sad.png → 'seolhwa'
            const filename = src.src.split(/[?#]/)[0].split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
            const charId = filename.split('_')[0];
            if (absentCharId && charId === absentCharId) return;

            const clone = document.createElement('img');
            clone.src = src.src;
            clone.className = `mirror-reflection-sprite mirror-pos-${id.replace('char-', '')}`;
            inner.appendChild(clone);
        });

        mirror.appendChild(inner);
        gameScreen.appendChild(mirror);

        // 페이드 인
        requestAnimationFrame(() => mirror.classList.add('visible'));
    }

    hideMirrorReflection() {
        document.getElementById('mirror-reflection')?.remove();
    }


    // =========================================================================
    // ★ 피험자 관리 시스템 어드민 패널 (Day 4 밤)
    // 안전앱이 뒤집혀 13명의 피험자 목록이 노출된다
    // save_glitch_7에서 생성, mirror 씬 진입 시 자동 정리
    // =========================================================================

    showAdminPanel(subjects = []) {
        this.hideAdminPanel();

        const panel = document.createElement('div');
        panel.className = 'admin-panel-overlay';
        panel.id = 'admin-panel-overlay';

        const playerName = this.engine?.state?.playerName || '';
        const copy = this._pickLocalized({
            ko: {
                title: "NEVERGRAD - \ud53c\ud5d8\uc790 \uad00\ub9ac \uc2dc\uc2a4\ud15c",
                id: "ID",
                name: "\uc774\ub984",
                status: "\uc0c1\ud0dc",
                note: "\ube44\uace0",
                tracking: "\uc704\uce58 \ucd94\uc801 \uae30\ub85d",
                monitoring: "\uc2e4\uc2dc\uac04 \ubaa8\ub2c8\ud130\ub9c1",
                live: "LIVE"
            },
            en: {
                title: "NEVERGRAD - Subject Management System",
                id: "ID",
                name: "Name",
                status: "Status",
                note: "Notes",
                tracking: "Location tracking log",
                monitoring: "Real-time monitoring",
                live: "LIVE"
            },
            ja: {
                title: "NEVERGRAD - 被験者管理システム",
                id: "ID",
                name: "名前",
                status: "状態",
                note: "備考",
                tracking: "位置追跡ログ",
                monitoring: "リアルタイム監視",
                live: "LIVE"
            },
            es: {
                title: "NEVERGRAD - Sistema de gestión de sujetos",
                id: "ID",
                name: "Nombre",
                status: "Estado",
                note: "Notas",
                tracking: "Registro de seguimiento de ubicación",
                monitoring: "Monitoreo en tiempo real",
                live: "EN VIVO"
            },
            fr: {
                title: "NEVERGRAD - Système de gestion des sujets",
                id: "ID",
                name: "Nom",
                status: "Statut",
                note: "Notes",
                tracking: "Journal de suivi de position",
                monitoring: "Surveillance en temps réel",
                live: "DIRECT"
            },
            de: {
                title: "NEVERGRAD - Subjektverwaltungssystem",
                id: "ID",
                name: "Name",
                status: "Status",
                note: "Notizen",
                tracking: "Standortverfolgungsprotokoll",
                monitoring: "Echtzeitüberwachung",
                live: "LIVE"
            },
            pt: {
                title: "NEVERGRAD - Sistema de gerenciamento de sujeitos",
                id: "ID",
                name: "Nome",
                status: "Status",
                note: "Notas",
                tracking: "Registro de rastreamento de localização",
                monitoring: "Monitoramento em tempo real",
                live: "AO VIVO"
            }
        });
        panel.innerHTML = `
            <div class="admin-panel-header">
                <span class="admin-panel-title">${copy.title}</span>
                <span class="admin-panel-version">v4.7</span>
            </div>
            <div class="admin-panel-columns">
                <span>${copy.id}</span>
                <span>${copy.name}</span>
                <span>${copy.status}</span>
                <span>${copy.note}</span>
            </div>
            <div class="admin-panel-rows" id="admin-panel-rows"></div>
            <div class="admin-panel-footer">
                <span class="admin-panel-tab">▸ ${copy.tracking}</span>
                <span class="admin-panel-tab">▸ ${copy.monitoring}</span>
                <span class="admin-panel-live">● ${copy.live}</span>
            </div>
        `;

        const rows = panel.querySelector('#admin-panel-rows');
        subjects.forEach(sub => {
            const localized = this._localizedSubjectRow(sub);
            const row = document.createElement('div');
            row.className = 'admin-panel-row';
            const rawStatus = String(sub.status || '');
            const isWarning = sub.statusClass === 'corrupted'
                || rawStatus.includes('이상')
                || ['ADVERSE', 'ADVERSO', 'ANOMALIE', 'ABWEICHUNG', '異常'].some(token => localized.status.includes(token));
            const isActive = sub.statusClass === 'active'
                || rawStatus.includes('진행')
                || localized.status === this._pickLocalized({ en: 'Active', ja: '進行中', es: 'En curso', fr: 'En cours', de: 'Aktiv', pt: 'Em andamento' })
                || isWarning;
            if (isActive) row.classList.add('admin-row-active');
            if (isWarning) row.classList.add('admin-row-warning');

            const name = (localized.name === '{name}')
                ? playerName
                : localized.name;

            row.innerHTML = `
                <span class="admin-cell-id">#${String(localized.id).padStart(2, '0')}</span>
                <span class="admin-cell-name">${this._escape(name)}</span>
                <span class="admin-cell-status">${this._escape(localized.status)}</span>
                <span class="admin-cell-note">${this._escape(localized.note || '')}</span>
            `;
            rows.appendChild(row);
        });

        (document.getElementById('game-screen') || document.body).appendChild(panel);
        requestAnimationFrame(() => panel.classList.add('visible'));
    }

    hideAdminPanel() {
        document.getElementById('admin-panel-overlay')?.remove();
    }

    _escape(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // =========================================================================
    // ★ 스탯 라벨 벗겨내기 (peelStatLabel, Day 3 밤)
    // '호감도' 라벨이 얇은 막처럼 벗겨지며 '위험도'가 드러난다
    // =========================================================================

    async peelStatLabel(revealDuration = 300) {
        const statEl = document.getElementById('stat-display');
        if (!statEl) return;

        // 나레이션 씬이라 숨겨진 상태면 강제 노출 (장르 전환 연출의 핵심)
        statEl.classList.remove('hidden', 'stat-hidden');
        if (!statEl.textContent.trim()) {
            // 호감도 UI가 아직 한 번도 표시된 적 없으면 기본값으로 표시
            const last = this.engine?.state?._lastCharLabel;
            const aff = this.engine?.state ? this.engine.state.getDisplayAffinity?.('sea') : 0;
            statEl.textContent = last?.text || `♡ ${this._localizedRomanceLabel()} ${aff ?? ''}`.trim();
        }

        const original = statEl.textContent;
        // 뒤에 있을 '진짜' 라벨 — 위험도 계열
        const revealed = statEl.dataset.thrillerlabel || `⚠ ${this._localizedDangerLabel()} ${original.match(/\d+/)?.[0] || ''}`.trim();

        // 벗겨지는 라벨을 감싸기
        statEl.classList.add('stat-peeling');
        const peelLayer = document.createElement('span');
        peelLayer.className = 'stat-peel-layer';
        peelLayer.textContent = original;

        // 원래 텍스트는 revealed로 미리 교체
        statEl.textContent = '';
        const base = document.createElement('span');
        base.className = 'stat-peel-base';
        base.textContent = revealed;
        statEl.appendChild(base);
        statEl.appendChild(peelLayer);

        // 벗겨짐 애니메이션
        await this._sleep(50);
        peelLayer.classList.add('peeling');
        await this._sleep(revealDuration);
        peelLayer.remove();

        await this._sleep(400);
        statEl.textContent = revealed;
        statEl.classList.remove('stat-peeling');
        statEl.classList.add('stat-revealed');
    }

    // =========================================================================
    // ★ 온도 하강 (temperatureDrop, Day 3 밤)
    // 화면 전체가 차갑게 식는 연출 — 푸른 색조 + 미세한 서리 오버레이
    // =========================================================================

    temperatureDrop(duration = 2000) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;

        gameScreen.classList.add('temperature-drop');

        const timer = setTimeout(() => {
            gameScreen.classList.remove('temperature-drop');
        }, duration);
        this._activeTimers.push(timer);
    }

    // =========================================================================
    // 정리
    // =========================================================================

    /**
     * 모든 활성 효과 제거 및 초기 상태로 복구
     */
    clearAll() {
        // 모든 타이머 정리
        this._activeTimers.forEach(id => clearTimeout(id));
        this._activeTimers = [];

        // 오버레이 정리
        if (this.overlay) {
            this.overlay.className = 'glitch-overlay hidden';
        }

        // 화면 흔들림 제거
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('screen-shake');
        }

        // 유령 텍스트 정리
        this.ghostTextQueue.forEach(g => {
            if (g.el && g.el.parentNode) {
                g.el.remove();
            }
        });
        this.ghostTextQueue = [];

        // 레드 비네트 제거
        this.hideRedVignette();

        // Day 5 노이즈 필터 제거
        this.disableDay5NoiseFilter();

        // NG+ 타이틀 인터벌 정리
        if (this._ngPlusTitleInterval) {
            clearInterval(this._ngPlusTitleInterval);
            this._ngPlusTitleInterval = null;
        }
        if (this._ngPlusDissonanceInterval) {
            clearInterval(this._ngPlusDissonanceInterval);
            this._ngPlusDissonanceInterval = null;
        }

        // 글리치 텍스트 클래스 정리
        document.querySelectorAll('.glitch-text').forEach(el => {
            el.classList.remove('glitch-text');
        });

        // 인터랙티브 연출 정리
        this._teardownMirrorWipe();
        this.hideMirrorReflection();
        this.hidePhotoOverlay();
        this.hidePhotoDeck();
        this.hideLockerSearch();
        this.hideAdminPanel();
        document.getElementById('game-screen')?.classList.remove('temperature-drop');

        // stat-revealed 클래스는 제거하지 않음 (영구 전환)

        // 레벨 리셋하지 않음 (호출자가 명시적으로 설정)
    }

    // =========================================================================
    // 유틸리티
    // =========================================================================

    /**
     * 지정 시간만큼 대기
     * @param {number} ms - 대기 시간 (ms)
     * @returns {Promise<void>}
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => {
            const timer = setTimeout(resolve, ms);
            this._activeTimers.push(timer);
        });
    }
}

window.GlitchSystemAdvanced = GlitchSystemAdvanced;
