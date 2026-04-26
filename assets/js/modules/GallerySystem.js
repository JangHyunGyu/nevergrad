/**
 * ============================================================================
 * GallerySystem.js - 엔딩 갤러리 시스템
 * ============================================================================
 *
 * localStorage에 달성한 엔딩을 기록하고, 갤러리 화면에서 표시합니다.
 * - 키: nevergrad_endings (JSON 배열)
 * - 7개 엔딩: TRUE END, RESIST END, FORGET END, CAGE END, GHOST END, ESCAPE END, COMPLICIT END
 */

class GallerySystem {
    static STORAGE_KEY = 'nevergrad_endings';

    static ENDINGS = [
        'TRUE END',
        'RESIST END',
        'FORGET END',
        'CAGE END',
        'GHOST END',
        'ESCAPE END',
        'COMPLICIT END'
    ];

    /**
     * 엔딩 설명 (다국어) — 달성 후 표시
     */
    static ENDING_DESCRIPTIONS = {
        'TRUE END': {
            ko: '진실을 마주하고, 졸업을 선택했다.',
            en: 'Faced the truth, and chose to graduate.',
            ja: '真実に向き合い、卒業を選んだ。',
            es: 'Enfrentaste la verdad y elegiste graduarte.',
            fr: 'Tu as fait face à la vérité et choisi de partir.',
            de: 'Du hast die Wahrheit erkannt und den Abschluss gewählt.',
            'pt-BR': 'Você encarou a verdade e escolheu se formar.'
        },
        'RESIST END': {
            ko: '끝까지 저항했지만, 교실은 당신을 놓아주지 않았다.',
            en: 'You resisted to the end, but the classroom never let go.',
            ja: '最後まで抵抗したが、教室はあなたを離さなかった。',
            es: 'Resististe hasta el final, pero el aula nunca te soltó.',
            fr: 'Tu as résisté jusqu\'au bout, mais la classe ne t\'a pas libéré.',
            de: 'Du hast bis zum Ende Widerstand geleistet, aber das Klassenzimmer ließ nicht los.',
            'pt-BR': 'Você resistiu até o fim, mas a sala nunca soltou você.'
        },
        'FORGET END': {
            ko: '모든 것을 잊고, 평범한 일상으로 돌아갔다.',
            en: 'You forgot everything and returned to ordinary days.',
            ja: 'すべてを忘れて、普通の日常に戻った。',
            es: 'Lo olvidaste todo y volviste a la rutina.',
            fr: 'Tu as tout oublié et tu es retourné à ta vie ordinaire.',
            de: 'Du hast alles vergessen und bist in den Alltag zurückgekehrt.',
            'pt-BR': 'Você esqueceu tudo e voltou aos dias comuns.'
        },
        'CAGE END': {
            ko: '행복한 교실. 영원히.',
            en: 'A happy classroom. Forever.',
            ja: '幸せな教室。永遠に。',
            es: 'Un aula feliz. Para siempre.',
            fr: 'Une classe heureuse. Pour toujours.',
            de: 'Ein glückliches Klassenzimmer. Für immer.',
            'pt-BR': 'Uma sala de aula feliz. Para sempre.'
        },
        'GHOST END': {
            ko: '당신은 떠났지만, 무언가가 교실에 남았다.',
            en: 'You left, but something stayed behind in the classroom.',
            ja: 'あなたは去ったが、何かが教室に残った。',
            es: 'Te fuiste, pero algo se quedó en el aula.',
            fr: 'Tu es parti, mais quelque chose est resté dans la classe.',
            de: 'Du bist gegangen, aber etwas blieb im Klassenzimmer zurück.',
            'pt-BR': 'Você foi embora, mas algo ficou na sala de aula.'
        },
        'ESCAPE END': {
            ko: '탈출에 성공했다. 하지만 대가가 있었다.',
            en: 'You escaped. But there was a price.',
            ja: '脱出に成功した。しかし代償があった。',
            es: 'Escapaste. Pero hubo un precio.',
            fr: 'Tu t\'es échappé. Mais il y a eu un prix.',
            de: 'Du bist entkommen. Aber es hatte seinen Preis.',
            'pt-BR': 'Você escapou. Mas houve um preço.'
        },
        'COMPLICIT END': {
            ko: '당신은 공범이 되었다.',
            en: 'You became an accomplice.',
            ja: 'あなたは共犯者になった。',
            es: 'Te convertiste en cómplice.',
            fr: 'Tu es devenu complice.',
            de: 'Du wurdest zum Komplizen.',
            'pt-BR': 'Você se tornou cúmplice.'
        }
    };

    constructor(game) {
        this.game = game;
    }

    /**
     * 달성 엔딩 목록 불러오기
     */
    getUnlockedEndings() {
        try {
            const data = localStorage.getItem(GallerySystem.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * 엔딩 달성 기록
     */
    unlockEnding(endingTitle) {
        if (!GallerySystem.ENDINGS.includes(endingTitle)) return;
        const unlocked = this.getUnlockedEndings();
        if (unlocked.includes(endingTitle)) return;
        unlocked.push(endingTitle);
        try {
            localStorage.setItem(GallerySystem.STORAGE_KEY, JSON.stringify(unlocked));
        } catch (e) {
            console.warn('[Gallery] Failed to save ending:', e);
        }
    }

    /**
     * 갤러리 화면 열기
     */
    open() {
        const screen = document.getElementById('gallery-screen');
        if (!screen) return;

        this._render();

        // 화면 전환
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }

    /**
     * 갤러리 닫기 (타이틀로)
     */
    close() {
        const screen = document.getElementById('gallery-screen');
        if (screen) {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        }
        const title = document.getElementById('title-screen');
        if (title) {
            title.classList.remove('hidden');
            title.classList.add('active');
        }
    }

    /**
     * 갤러리 화면 렌더링
     */
    _render() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        const unlocked = this.getUnlockedEndings();
        const lang = this.game.i18n?.currentLang || 'ko';

        grid.innerHTML = '';

        GallerySystem.ENDINGS.forEach(ending => {
            const isUnlocked = unlocked.includes(ending);
            const card = document.createElement('div');
            card.className = `gallery-card ${isUnlocked ? 'gallery-unlocked' : 'gallery-locked'}`;

            const icon = document.createElement('div');
            icon.className = 'gallery-card-icon';
            icon.textContent = isUnlocked ? this._getEndingIcon(ending) : '';

            const title = document.createElement('div');
            title.className = 'gallery-card-title';
            title.textContent = isUnlocked ? ending : '???';

            const desc = document.createElement('div');
            desc.className = 'gallery-card-desc';
            if (isUnlocked) {
                const descriptions = GallerySystem.ENDING_DESCRIPTIONS[ending];
                desc.textContent = descriptions?.[lang] || descriptions?.ko || '';
            } else {
                desc.textContent = this._getLockedText(lang);
            }

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(desc);
            grid.appendChild(card);
        });

        // 달성률 업데이트
        const progress = document.getElementById('gallery-progress');
        if (progress) {
            progress.textContent = `${unlocked.length} / ${GallerySystem.ENDINGS.length}`;
        }
    }

    /**
     * 엔딩별 아이콘 문자
     */
    _getEndingIcon(ending) {
        const icons = {
            'TRUE END': '\u2605',       // star
            'RESIST END': '\u2694',     // crossed swords
            'FORGET END': '\u29BE',     // circled white bullet
            'CAGE END': '\u2603',       // snowman (cage/trapped)
            'GHOST END': '\u2620',      // skull
            'ESCAPE END': '\u2708',     // airplane (escape)
            'COMPLICIT END': '\u2622'   // radioactive (danger)
        };
        return icons[ending] || '\u2726';
    }

    /**
     * 잠금 텍스트
     */
    _getLockedText(lang) {
        const map = {
            ko: '아직 도달하지 못한 결말',
            en: 'An ending yet to be reached',
            ja: 'まだ到達していない結末',
            es: 'Un final aún por descubrir',
            fr: 'Une fin encore à découvrir',
            de: 'Ein Ende, das noch entdeckt werden muss',
            'pt-BR': 'Um final ainda não alcançado'
        };
        return map[lang] || map.ko;
    }

    /**
     * 이벤트 바인딩
     */
    bind() {
        document.getElementById('btn-gallery')?.addEventListener('click', () => {
            this.game.audio?.playUIClick();
            this.open();
        });
        document.getElementById('gallery-back')?.addEventListener('click', () => {
            this.game.audio?.playUIClick();
            this.close();
        });
    }
}
