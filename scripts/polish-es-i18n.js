#!/usr/bin/env node
/*
 * Polish Spanish i18n strings without changing scenario keys or structure.
 *
 * This pass fixes the most visible machine-translation scars in the ES files:
 * missing accents in common Spanish words, missing opening question/exclamation
 * marks, and a few region/style terms used throughout the visual novel.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ES_DIR = path.join(ROOT, 'assets', 'js', 'i18n', 'es');

const WORD_REPLACEMENTS = [
  ['Ahi', 'Ah\u00ed'], ['ahi', 'ah\u00ed'],
  ['Aqui', 'Aqu\u00ed'], ['aqui', 'aqu\u00ed'],
  ['Alli', 'All\u00ed'], ['alli', 'all\u00ed'],
  ['Ademas', 'Adem\u00e1s'], ['ademas', 'adem\u00e1s'],
  ['Atras', 'Atr\u00e1s'], ['atras', 'atr\u00e1s'],
  ['Detras', 'Detr\u00e1s'], ['detras', 'detr\u00e1s'],
  ['Mas', 'M\u00e1s'], ['mas', 'm\u00e1s'],
  ['Tambien', 'Tambi\u00e9n'], ['tambien', 'tambi\u00e9n'],
  ['Todavia', 'Todav\u00eda'], ['todavia', 'todav\u00eda'],
  ['Despues', 'Despu\u00e9s'], ['despues', 'despu\u00e9s'],
  ['Dia', 'D\u00eda'], ['dia', 'd\u00eda'],
  ['Dias', 'D\u00edas'], ['dias', 'd\u00edas'],
  ['Manana', 'Ma\u00f1ana'], ['manana', 'ma\u00f1ana'],
  ['Ano', 'A\u00f1o'], ['ano', 'a\u00f1o'],
  ['Anos', 'A\u00f1os'], ['anos', 'a\u00f1os'],
  ['Pequeno', 'Peque\u00f1o'], ['pequeno', 'peque\u00f1o'],
  ['Pequena', 'Peque\u00f1a'], ['pequena', 'peque\u00f1a'],
  ['Pequenos', 'Peque\u00f1os'], ['pequenos', 'peque\u00f1os'],
  ['Pequenas', 'Peque\u00f1as'], ['pequenas', 'peque\u00f1as'],
  ['Bano', 'Ba\u00f1o'], ['bano', 'ba\u00f1o'],
  ['Banos', 'Ba\u00f1os'], ['banos', 'ba\u00f1os'],
  ['Suenos', 'Sue\u00f1os'], ['suenos', 'sue\u00f1os'],
  ['Sueno', 'Sue\u00f1o'], ['sueno', 'sue\u00f1o'],
  ['Dificil', 'Dif\u00edcil'], ['dificil', 'dif\u00edcil'],
  ['Facil', 'F\u00e1cil'], ['facil', 'f\u00e1cil'],
  ['Rapido', 'R\u00e1pido'], ['rapido', 'r\u00e1pido'],
  ['Rapida', 'R\u00e1pida'], ['rapida', 'r\u00e1pida'],
  ['Rapidamente', 'R\u00e1pidamente'], ['rapidamente', 'r\u00e1pidamente'],
  ['Frio', 'Fr\u00edo'], ['frio', 'fr\u00edo'],
  ['Fria', 'Fr\u00eda'], ['fria', 'fr\u00eda'],
  ['Vacio', 'Vac\u00edo'], ['vacio', 'vac\u00edo'],
  ['Vacia', 'Vac\u00eda'], ['vacia', 'vac\u00eda'],
  ['Unico', '\u00danico'], ['unico', '\u00fanico'],
  ['Unica', '\u00danica'], ['unica', '\u00fanica'],
  ['Ultimo', '\u00daltimo'], ['ultimo', '\u00faltimo'],
  ['Ultima', '\u00daltima'], ['ultima', '\u00faltima'],
  ['Proximo', 'Pr\u00f3ximo'], ['proximo', 'pr\u00f3ximo'],
  ['Proxima', 'Pr\u00f3xima'], ['proxima', 'pr\u00f3xima'],
  ['Petalo', 'P\u00e9talo'], ['petalo', 'p\u00e9talo'],
  ['Petalos', 'P\u00e9talos'], ['petalos', 'p\u00e9talos'],
  ['Musica', 'M\u00fasica'], ['musica', 'm\u00fasica'],
  ['Camara', 'C\u00e1mara'], ['camara', 'c\u00e1mara'],
  ['Fotografia', 'Fotograf\u00eda'], ['fotografia', 'fotograf\u00eda'],
  ['Fotografias', 'Fotograf\u00edas'], ['fotografias', 'fotograf\u00edas'],
  ['Enfermeria', 'Enfermer\u00eda'], ['enfermeria', 'enfermer\u00eda'],
  ['Cafeteria', 'Cafeter\u00eda'], ['cafeteria', 'cafeter\u00eda'],
  ['Energia', 'Energ\u00eda'], ['energia', 'energ\u00eda'],
  ['Maquina', 'M\u00e1quina'], ['maquina', 'm\u00e1quina'],
  ['Telefono', 'Tel\u00e9fono'], ['telefono', 'tel\u00e9fono'],
  ['Arbol', '\u00c1rbol'], ['arbol', '\u00e1rbol'],
  ['Purpura', 'P\u00farpura'], ['purpura', 'p\u00farpura'],
  ['Estomago', 'Est\u00f3mago'], ['estomago', 'est\u00f3mago'],
  ['Lampara', 'L\u00e1mpara'], ['lampara', 'l\u00e1mpara'],
  ['Quiza', 'Quiz\u00e1'], ['quiza', 'quiz\u00e1'],
  ['Quizas', 'Quiz\u00e1s'], ['quizas', 'quiz\u00e1s'],
  ['Corazon', 'Coraz\u00f3n'], ['corazon', 'coraz\u00f3n'],
  ['Habitacion', 'Habitaci\u00f3n'], ['habitacion', 'habitaci\u00f3n'],
  ['Conversacion', 'Conversaci\u00f3n'], ['conversacion', 'conversaci\u00f3n'],
  ['Situacion', 'Situaci\u00f3n'], ['situacion', 'situaci\u00f3n'],
  ['Atencion', 'Atenci\u00f3n'], ['atencion', 'atenci\u00f3n'],
  ['Opcion', 'Opci\u00f3n'], ['opcion', 'opci\u00f3n'],
  ['Opciones', 'Opciones'], ['opciones', 'opciones'],
  ['Imaginacion', 'Imaginaci\u00f3n'], ['imaginacion', 'imaginaci\u00f3n'],
  ['Preocupacion', 'Preocupaci\u00f3n'], ['preocupacion', 'preocupaci\u00f3n'],
  ['Verificacion', 'Verificaci\u00f3n'], ['verificacion', 'verificaci\u00f3n'],
  ['Graduacion', 'Graduaci\u00f3n'], ['graduacion', 'graduaci\u00f3n'],
  ['Transmision', 'Transmisi\u00f3n'], ['transmision', 'transmisi\u00f3n'],
  ['Inyeccion', 'Inyecci\u00f3n'], ['inyeccion', 'inyecci\u00f3n'],
  ['Restriccion', 'Restricci\u00f3n'], ['restriccion', 'restricci\u00f3n'],
  ['Direccion', 'Direcci\u00f3n'], ['direccion', 'direcci\u00f3n'],
  ['Sensacion', 'Sensaci\u00f3n'], ['sensacion', 'sensaci\u00f3n'],
  ['Explicacion', 'Explicaci\u00f3n'], ['explicacion', 'explicaci\u00f3n'],
  ['Investigacion', 'Investigaci\u00f3n'], ['investigacion', 'investigaci\u00f3n'],
  ['Administracion', 'Administraci\u00f3n'], ['administracion', 'administraci\u00f3n'],
  ['Informacion', 'Informaci\u00f3n'], ['informacion', 'informaci\u00f3n'],
  ['Desaparicion', 'Desaparici\u00f3n'], ['desaparicion', 'desaparici\u00f3n'],
  ['Decision', 'Decisi\u00f3n'], ['decision', 'decisi\u00f3n'],
  ['Presion', 'Presi\u00f3n'], ['presion', 'presi\u00f3n'],
  ['Tension', 'Tensi\u00f3n'], ['tension', 'tensi\u00f3n'],
  ['Sesion', 'Sesi\u00f3n'], ['sesion', 'sesi\u00f3n'],
  ['Salon', 'Sal\u00f3n'], ['salon', 'sal\u00f3n'],
  ['Esta', 'Est\u00e1'], ['esta', 'est\u00e1'],
  ['Estas', 'Est\u00e1s'], ['estas', 'est\u00e1s'],
  ['Estan', 'Est\u00e1n'], ['estan', 'est\u00e1n'],
  ['Estare', 'Estar\u00e9'], ['estare', 'estar\u00e9'],
  ['Estaras', 'Estar\u00e1s'], ['estaras', 'estar\u00e1s'],
  ['Estara', 'Estar\u00e1'], ['estara', 'estar\u00e1'],
  ['Estaran', 'Estar\u00e1n'], ['estaran', 'estar\u00e1n'],
  ['Estaria', 'Estar\u00eda'], ['estaria', 'estar\u00eda'],
  ['Tendre', 'Tendr\u00e9'], ['tendre', 'tendr\u00e9'],
  ['Tendras', 'Tendr\u00e1s'], ['tendras', 'tendr\u00e1s'],
  ['Tendra', 'Tendr\u00e1'], ['tendra', 'tendr\u00e1'],
  ['Podre', 'Podr\u00e9'], ['podre', 'podr\u00e9'],
  ['Podras', 'Podr\u00e1s'], ['podras', 'podr\u00e1s'],
  ['Podra', 'Podr\u00e1'], ['podra', 'podr\u00e1'],
  ['Podria', 'Podr\u00eda'], ['podria', 'podr\u00eda'],
  ['Podrias', 'Podr\u00edas'], ['podrias', 'podr\u00edas'],
  ['Dare', 'Dar\u00e9'], ['dare', 'dar\u00e9'],
  ['Dara', 'Dar\u00e1'], ['dara', 'dar\u00e1'],
  ['Ire', 'Ir\u00e9'], ['ire', 'ir\u00e9'],
  ['Ira', 'Ir\u00e1'], ['ira', 'ir\u00e1'],
  ['Volvere', 'Volver\u00e9'], ['volvere', 'volver\u00e9'],
  ['Volveras', 'Volver\u00e1s'], ['volveras', 'volver\u00e1s'],
  ['Volvera', 'Volver\u00e1'], ['volvera', 'volver\u00e1'],
  ['Habia', 'Hab\u00eda'], ['habia', 'hab\u00eda'],
  ['Habiamos', 'Hab\u00edamos'], ['habiamos', 'hab\u00edamos'],
  ['Envie', 'Envi\u00e9'], ['envie', 'envi\u00e9'],
  ['Encontre', 'Encontr\u00e9'], ['encontre', 'encontr\u00e9'],
  ['Llegue', 'Llegu\u00e9'], ['llegue', 'llegu\u00e9'],
  ['Cerre', 'Cerr\u00e9'], ['cerre', 'cerr\u00e9'],
  ['Deje', 'Dej\u00e9'], ['deje', 'dej\u00e9'],
  ['Extendi', 'Extend\u00ed'], ['extendi', 'extend\u00ed'],
  ['Escuche', 'Escuch\u00e9'], ['escuche', 'escuch\u00e9'],
  ['Senti', 'Sent\u00ed'], ['senti', 'sent\u00ed'],
  ['Recorde', 'Record\u00e9'], ['recorde', 'record\u00e9'],
  ['Gustaria', 'Gustar\u00eda'], ['gustaria', 'gustar\u00eda'],
  ['Recordaras', 'Recordar\u00e1s'], ['recordaras', 'recordar\u00e1s'],
  ['Recordara', 'Recordar\u00e1'], ['recordara', 'recordar\u00e1'],
  ['Leido', 'Le\u00eddo'], ['leido', 'le\u00eddo'],
  ['Oido', 'O\u00eddo'], ['oido', 'o\u00eddo'],
  ['Raiz', 'Ra\u00edz'], ['raiz', 'ra\u00edz'],
  ['Reia', 'Re\u00eda'], ['reia', 're\u00eda'],
  ['Sonrie', 'Sonr\u00ede'], ['sonrie', 'sonr\u00ede'],
  ['Sonrio', 'Sonri\u00f3'], ['sonrio', 'sonri\u00f3'],
];

const PHRASE_REPLACEMENTS = [
  [/\bT\u00fa me has cuidado\b/g, 'T\u00fa me has ayudado'],
  [/\bQue no\b/g, 'Que no'],
  [/\bLa pr\u00f3xima vez que vengas a est\u00e1 hora\b/g, 'La pr\u00f3xima vez que vengas a esta hora'],
  [/\bA partir de hoy, soy estudiante de est\u00e1 escuela\b/g, 'A partir de hoy, soy estudiante de esta escuela'],
  [/\bPor redes sociales\b/g, 'por redes sociales'],
  [/\bme esta app\b/g, 'esta app'],
  [/\best\u00e1 escuela\b/g, 'esta escuela'],
  [/\best\u00e1 sala\b/g, 'esta sala'],
  [/\best\u00e1 ma\u00f1ana\b/g, 'esta ma\u00f1ana'],
  [/\best\u00e1 vez\b/g, 'esta vez'],
  [/\best\u00e1 noche\b/g, 'esta noche'],
  [/\best\u00e1 foto\b/g, 'esta foto'],
  [/\best\u00e1 canci\u00f3n\b/g, 'esta canci\u00f3n'],
  [/\best\u00e1 mesa\b/g, 'esta mesa'],
  [/\best\u00e1 azotea\b/g, 'esta azotea'],
  [/\best\u00e1 app\b/g, 'esta app'],
  [/\best\u00e1 conversaci\u00f3n\b/g, 'esta conversaci\u00f3n'],
  [/\best\u00e1 situaci\u00f3n\b/g, 'esta situaci\u00f3n'],
  [/\best\u00e1 habitaci\u00f3n\b/g, 'esta habitaci\u00f3n'],
  [/\best\u00e1 persona\b/g, 'esta persona'],
  [/\best\u00e1 hora\b/g, 'esta hora'],
  [/\bno s\u00e9 mueve\b/g, 'no se mueve'],
  [/\bno s\u00e9 mueven\b/g, 'no se mueven'],
  [/\bno s\u00e9 ve\b/g, 'no se ve'],
  [/\bNo s\u00e9 por que\b/g, 'No s\u00e9 por qu\u00e9'],
  [/\bno s\u00e9 por que\b/g, 'no s\u00e9 por qu\u00e9'],
  [/\bNo s\u00e9 mueve\b/g, 'No se mueve'],
  [/\bNo s\u00e9 mueven\b/g, 'No se mueven'],
  [/\bNo s\u00e9 ve\b/g, 'No se ve'],
  [/\{name\}, te gustar\u00eda\b/g, '{name}, \u00bfte gustar\u00eda'],
  [/\*...! /g, '*\u00a1...! '],
  [/"...! /g, '"\u00a1...! '],
  [/\bEst\u00e1 es\b/g, 'Esta es'],
  [/\bEst\u00e1 persona\b/g, 'Esta persona'],
  [/\bEst\u00e1 ansiedad\b/g, 'Esta ansiedad'],
  [/\bEst\u00e1 habitaci\u00f3n\b/g, 'Esta habitaci\u00f3n'],
  [/\bEst\u00e1 noche\b/g, 'Esta noche'],
  [/\bEst\u00e1 vez\b/g, 'Esta vez'],
  [/\bEst\u00e1 canci\u00f3n\b/g, 'Esta canci\u00f3n'],
  [/\bEst\u00e1 foto\b/g, 'Esta foto'],
  [/\bEst\u00e1 sala\b/g, 'Esta sala'],
  [/\bEst\u00e1 escuela\b/g, 'Esta escuela'],
  [/\bEst\u00e1 app\b/g, 'Esta app'],
  [/\bT\u00fa asiento\b/g, 'Tu asiento'],
  [/\bt\u00fa asiento\b/g, 'tu asiento'],
  [/\bT\u00fa nombre\b/g, 'Tu nombre'],
  [/\bt\u00fa nombre\b/g, 'tu nombre'],
  [/\bT\u00fa tutora\b/g, 'Tu tutora'],
  [/\bt\u00fa tutora\b/g, 'tu tutora'],
  [/\bT\u00fa mochila\b/g, 'Tu mochila'],
  [/\bt\u00fa mochila\b/g, 'tu mochila'],
  [/\bprimer a\u00f1o\b/g, 'primero'],
  [/\btercer a\u00f1o\b/g, 'tercero'],
  [/\bsegundo a\u00f1o\b/g, 'segundo'],
  [/\bprimer d\u00eda\b/g, 'primer d\u00eda'],
  [/\bpara est\u00f3 est\u00e1\b/g, 'para esto est\u00e1'],
  [/\bLa cafeter\u00eda no est\u00e1 mal\b/g, 'La cafeter\u00eda no est\u00e1 mal'],
];

function replaceWholeWords(text) {
  let out = text;
  for (const [from, to] of WORD_REPLACEMENTS) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, 'g'), to);
  }
  for (const [from, to] of PHRASE_REPLACEMENTS) {
    out = out.replace(from, to);
  }
  return out;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addOpeningMark(text, closeMark, openMark) {
  let out = text;
  let offset = 0;
  const original = [...text];

  for (let i = 0; i < original.length; i++) {
    if (original[i] !== closeMark) continue;

    const q = i + offset;
    let start = Math.max(
      out.lastIndexOf('\n', q - 1),
      out.lastIndexOf('.', q - 1),
      out.lastIndexOf('!', q - 1),
      out.lastIndexOf('?', q - 1)
    ) + 1;

    const segment = out.slice(start, q);
    if (segment.includes(openMark)) continue;

    while (start < q && /[\s"'\*\)\]]/.test(out[start])) start++;
    if (out.startsWith('...', start)) start += 3;
    while (start < q && /\s/.test(out[start])) start++;

    if (start < q && /[A-Za-z\u00c0-\u017f]/.test(out[start])) {
      out = out.slice(0, start) + openMark + out.slice(start);
      offset += openMark.length;
    }
  }
  return out;
}

function polishQuestionWords(text) {
  return text
    .replace(/\u00bfQue\b/g, '\u00bfQu\u00e9')
    .replace(/\u00bfque\b/g, '\u00bfqu\u00e9')
    .replace(/\u00bfComo\b/g, '\u00bfC\u00f3mo')
    .replace(/\u00bfcomo\b/g, '\u00bfc\u00f3mo')
    .replace(/\u00bfDonde\b/g, '\u00bfD\u00f3nde')
    .replace(/\u00bfdonde\b/g, '\u00bfd\u00f3nde')
    .replace(/\u00bfAdonde\b/g, '\u00bfAd\u00f3nde')
    .replace(/\u00bfadonde\b/g, '\u00bfad\u00f3nde')
    .replace(/\u00bfQuien\b/g, '\u00bfQui\u00e9n')
    .replace(/\u00bfquien\b/g, '\u00bfqui\u00e9n')
    .replace(/\u00bfCual\b/g, '\u00bfCu\u00e1l')
    .replace(/\u00bfcual\b/g, '\u00bfcu\u00e1l')
    .replace(/\u00bfCuando\b/g, '\u00bfCu\u00e1ndo')
    .replace(/\u00bfcuando\b/g, '\u00bfcu\u00e1ndo')
    .replace(/\u00bfCuanto\b/g, '\u00bfCu\u00e1nto')
    .replace(/\u00bfcuanto\b/g, '\u00bfcu\u00e1nto')
    .replace(/\u00bfPor que\b/g, '\u00bfPor qu\u00e9')
    .replace(/\u00bfpor que\b/g, '\u00bfpor qu\u00e9')
    .replace(/\u00bfPor qu\u00e9 no\b/g, '\u00bfPor qu\u00e9 no')
    .replace(/\u00bfSi\?/g, '\u00bfS\u00ed?')
    .replace(/\u00bfsi\?/g, '\u00bfs\u00ed?');
}

function polishExclamations(text) {
  return text
    .replace(/\u00a1Si([!,.])/g, '\u00a1S\u00ed$1')
    .replace(/\u00a1si([!,.])/g, '\u00a1s\u00ed$1');
}

function polishCommonFragments(text) {
  return text
    .replace(/\bSi,\b/g, 'S\u00ed,')
    .replace(/\bsi,\b/g, 's\u00ed,')
    .replace(/\bAh, si\b/g, 'Ah, s\u00ed')
    .replace(/\bah, si\b/g, 'ah, s\u00ed')
    .replace(/\bOh, que\b/g, 'Oh, qu\u00e9')
    .replace(/\boh, que\b/g, 'oh, qu\u00e9')
    .replace(/\bno se (qu\u00e9|qui\u00e9n|c\u00f3mo|d\u00f3nde|cu\u00e1ndo|cu\u00e1l|si)\b/g, 'no s\u00e9 $1')
    .replace(/\bNo se (qu\u00e9|qui\u00e9n|c\u00f3mo|d\u00f3nde|cu\u00e1ndo|cu\u00e1l|si)\b/g, 'No s\u00e9 $1')
    .replace(/\bse que\b/g, 's\u00e9 que')
    .replace(/\bSe que\b/g, 'S\u00e9 que')
    .replace(/\btu eres\b/g, 't\u00fa eres')
    .replace(/\bTu eres\b/g, 'T\u00fa eres')
    .replace(/\by tu\b/g, 'y t\u00fa')
    .replace(/\bY tu\b/g, 'Y t\u00fa')
    .replace(/\ba mi\b/g, 'a m\u00ed')
    .replace(/\bA mi\b/g, 'A m\u00ed')
    .replace(/\bde mi\b/g, 'de m\u00ed')
    .replace(/\bDe mi\b/g, 'De m\u00ed')
    .replace(/\bpor mi\b/g, 'por m\u00ed')
    .replace(/\bPor mi\b/g, 'Por m\u00ed')
    .replace(/\bmas profundo\b/g, 'm\u00e1s profundo')
    .replace(/\bm\u00e1s que\b/g, 'm\u00e1s que')
    .replace(/\bNo est\u00e1 mal\b/g, 'No est\u00e1 mal');
}

function polishString(value) {
  if (typeof value !== 'string' || value.length === 0) return value;
  let out = value;
  out = replaceWholeWords(out);
  out = polishCommonFragments(out);
  out = addOpeningMark(out, '?', '\u00bf');
  out = addOpeningMark(out, '!', '\u00a1');
  out = polishQuestionWords(out);
  out = polishExclamations(out);
  out = polishCommonFragments(out);
  for (const [from, to] of PHRASE_REPLACEMENTS) {
    out = out.replace(from, to);
  }
  return out;
}

function polishEntry(entry) {
  if (!entry || typeof entry !== 'object') return entry;
  if (typeof entry.text === 'string') entry.text = polishString(entry.text);
  if (Array.isArray(entry.choices)) entry.choices = entry.choices.map(polishString);
  return entry;
}

let changedFiles = 0;
let changedEntries = 0;

for (const file of fs.readdirSync(ES_DIR).filter(f => f.endsWith('.json')).sort()) {
  const full = path.join(ES_DIR, file);
  const before = fs.readFileSync(full, 'utf8');
  const data = JSON.parse(before);
  const beforeEntries = JSON.stringify(data);

  for (const key of Object.keys(data)) {
    const beforeEntry = JSON.stringify(data[key]);
    polishEntry(data[key]);
    if (JSON.stringify(data[key]) !== beforeEntry) changedEntries++;
  }

  if (JSON.stringify(data) !== beforeEntries) {
    fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf8');
    changedFiles++;
    console.log(`polished ${file}`);
  }
}

console.log(`Spanish polish complete: ${changedFiles} files, ${changedEntries} entries touched.`);
