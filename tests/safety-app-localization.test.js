'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '../assets/js/i18n');

// The protagonist downloads a provisional app on Day 1, registers on Day 2,
// then discovers an unrequested administrator profile on Day 4.
const terms = {
    en: [/provisional install/i, /QR/, /before registering a student ID/i, /Smart Campus module/, /hidden profile/, /left hand/, /never heard it before/i],
    ja: [/仮インストール/, /QR/, /学籍番号を登録する前/, /スマートキャンパス.*モジュール/, /非表示のプロファイル/, /左手/, /初めて聞く/],
    es: [/instalación provisional/, /QR/, /antes de registrar el número de estudiante/, /módulo Smart Campus/, /perfil oculto/, /mano izquierda/, /Nunca la había oído/],
    fr: [/installation provisoire/, /QR/, /avant même l'enregistrement du numéro d'élève/, /module Smart Campus/, /profil masqué/, /main gauche/, /première fois/],
    de: [/vorläufigen Installation/, /QR/, /vor der Registrierung der Schülernummer/, /Smart-Campus-Modul/, /verstecktes Profil/, /linken Hand/, /zum ersten Mal/],
    pt: [/instalação provisória/, /QR/, /antes de cadastrar o número de estudante/, /módulo Smart Campus/, /perfil oculto/, /mão esquerda/, /primeira vez/],
    zh: [/预安装/, /二维码/, /登记学号前/, /智能校园模块/, /隐藏配置文件/, /左手/, /第一次听见/]
};

for (const [lang, markers] of Object.entries(terms)) {
    test(`${lang}: app installation chronology and opening clues survive localization`, () => {
        const read = file => require(path.join(root, lang, `${file}.json`));
        const night = read('day1_night');
        const morning = read('day1_morning');
        const values = [
            night.day1_night_app_1.text,
            night.day1_night_app_1.text,
            night.day1_night_app_2.text,
            read('day2_afterschool').day2_after_eunsu_2.text,
            read('day4_morning').day4_morning_commute_5.text,
            morning.day1_opening_5.text,
            morning.day1_opening_8.text
        ];
        values.forEach((value, i) => assert.match(value, markers[i], `${lang}: clue ${i}`));
    });
}
