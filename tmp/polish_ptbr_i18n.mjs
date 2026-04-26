#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KO_DIR = path.join(ROOT, 'assets', 'js', 'i18n', 'ko');
const PT_DIR = path.join(ROOT, 'assets', 'js', 'i18n', 'pt-BR');

const NAME_MAP = {
  '나': 'Eu',
  '세아': 'Sea',
  '한세아': 'Han Sea',
  '은수': 'Eunsu',
  '박은수': 'Park Eunsu',
  '리인': 'Riin',
  '강리인': 'Kang Riin',
  '유나': 'Yuna',
  '최유나': 'Choi Yuna',
  '설화': 'Seolhwa',
  '이설화': 'Lee Seolhwa',
  '선생님': 'Professora',
  '담임교사': 'Professora titular',
  '옆자리 학생': 'Aluno do lado',
  '옆자리 남학생': 'Garoto do assento ao lado',
  '여학생A': 'Garota A',
  '여학생B': 'Garota B',
  '여학생': 'Garota',
  '남학생B': 'Garoto B',
  '남학생': 'Garoto',
  '급우A': 'Colega A',
  '급우B': 'Colega B',
  '민수': 'Minsu',
  '[교내 방송]': 'Transmissao da escola',
  '???': '???',
  '': '',
};

const OVERRIDES = {
  'day1_morning.json': {
    day1_opening_5: {
      text: "*Transferência. Minha primeira vez. Não tive escolha por causa do trabalho dos meus pais, mas, sinceramente, estou um pouco inquieto. A palavra 'transferido' carrega duas coisas ao mesmo tempo: 'chamar atenção' e 'ficar sozinho'. Nenhuma das duas soa muito bem.*",
    },
    day1_gate_1: {
      text: '*Parei diante do portão de uma escola desconhecida.*',
    },
    day1_gate_5: {
      text: '*Respiro fundo uma vez. Vamos entrar. Ficar parado aqui não vai fazer a escola vir até mim.*',
    },
    day1_sea_meet_1: {
      text: 'Você é o aluno transferido? Ouvi dizer que chegava alguém hoje.',
    },
    day1_sea_meet_7: {
      text: 'A professora titular me contou. Ela avisou antes que chegaria um aluno transferido.',
    },
    day1_sea_meet_18: {
      text: '*...Encontrar alguém assim logo no primeiro dia de transferência.*',
    },
    day1_gate_ngp_classroom: {
      text: '*Abri os olhos. A sala de aula. Estou sentado na minha carteira. Última fileira, perto da janela. A data escrita no quadro. A data de hoje.*',
    },
    day1_classroom_3: {
      text: "*...Estou nervoso. Ouço murmúrios. 'Aquele ali é o transferido.' 'De onde será que veio?' Coisas assim.*",
    },
    day1_eunsu_2: {
      text: 'Muito bem, pessoal. Hoje vou apresentar um novo aluno transferido.',
    },
    day1_eunsu_9: {
      text: 'Olá. Sou {name}. Vim transferido da Escola XX. Conto com vocês.',
    },
    day1_xover_seolhwa_1: {
      text: '*Enquanto caminho pelo corredor, alguém está parado ali. No fim do corredor. Onde a luz não alcança.*',
    },
  },
  'day2_afterschool.json': {
    day2_after_eunsu_2: {
      text: "\"Como você acabou de se transferir, ainda não deve ter cadastrado o 'Aplicativo de Segurança do Aluno'. Sem ele, você nem consegue usar o refeitório.\"",
    },
  },
  'day2_morning.json': {
    day2_morning_seolhwa_2: {
      text: '*Intervalo. Dou uma olhada para trás. Meus olhos encontram os de Seolhwa.*',
    },
  },
  'day2_night.json': {
    day2_night_flash_5: {
      text: '*Abri os olhos. Há suor na minha testa.*',
    },
  },
  'day3_afterschool.json': {
    day3_after_start_2: {
      text: '*O dia inteiro foi estranho. Desde a manhã. O déjà-vu no caminho para a escola, o silêncio na sala, os olhos de Sea. Tudo.*',
    },
    day3_after_riin_6: {
      text: '"Não, é só... minha cabeça está meio confusa."\n\n*A professora Riin me encara. Por um bom tempo. O olhar dela não é o de uma médica vendo um paciente, nem o de uma professora vendo um aluno. É algo mais... complicado.*',
    },
    day3_after_riin_drink_5: {
      text: '*A professora Riin despeja o resto da bebida na pia. Vejo suas costas. Seus ombros estão duros.*',
    },
    day3_after_riin_refuse_2: {
      text: '*A mão da professora Riin para. A força abandona os dedos que seguram o copo.*\n\n*Ela o leva embora. Despeja o conteúdo na pia. Vejo suas costas. Por trás do sorriso... alívio. Um alívio evidente.*',
    },
    day3_after_riin_refuse_3: {
      text: '*A professora Riin se vira. Seus olhos estão vermelhos. Ela pisca rápido para esconder.*',
    },
    day3_after_eunsu_3: {
      text: "*Há documentos abertos sobre a mesa. Dá para ver daqui também. Papel amarelo. Formato de tabela. Letras grossas no topo. **'Livro de Controle de Sujeitos'**.*\n\n*Sujeitos?*",
    },
  },
  'day3_lunch.json': {
    day3_lunch_riin_4: {
      text: '*A professora Riin aponta para a cama. Eu me sento. Ela pousa a mão na minha testa. Uma mão fria.*',
    },
    day3_lunch_riin_choice: {
      text: '*A professora Riin sorri. Um sorriso suave. Mas seus olhos... parecem estar segurando alguma coisa. Não consigo ler exatamente que expressão é aquela.*',
      choices: ['Beber', 'Recusar'],
    },
    day3_lunch_riin_drink_3: {
      text: '*A professora Riin pega o copo. No instante em que se vira, morde o lábio com força.*',
    },
    day3_lunch_riin_refuse_2: {
      text: '*A professora Riin pega o copo. Despeja o conteúdo na pia. Vejo suas costas. A tensão sai dos ombros dela. ...Alívio?*',
    },
    day3_lunch_alone_1: {
      text: '*Fico na sala e como sozinho. Pela janela, dá para ver o campo. Alguns alunos jogam futebol.*',
    },
  },
  'day3_morning.json': {
    day3_morning_commute_1: {
      text: '*Saio de casa e sigo para a escola. O ar da manhã está frio.*',
    },
  },
  'day3_night.json': {
    day3_night_seolhwa_4: {
      text: '*...É Seolhwa. Rosto pálido. Cabelo branco-prateado. Olhos úmidos. A figura de uma garota frágil. Ela está de uniforme. No meio da noite. No meu quarto. ...É uma alucinação? É real? A porta está trancada. Como ela entrou?*',
    },
    day3_night_deny: {
      text: '*...Deve ser só estresse. Fiquei sensível por causa da transferência. Amanhã tudo vai melhorar.*',
    },
    day3_night_deny_2: {
      text: '*Puxei a coberta. Fechei os olhos. As letras na parede continuaram gravadas atrás das minhas pálpebras.*',
    },
    day3_xover_glitch_1: {
      text: '*...Vejo um corredor. Isto não é um quarto.*',
    },
    day3_xover_glitch_6: {
      text: '*Abri os olhos. É o quarto. ...Foi um sonho?*',
    },
  },
  'day4_afterschool.json': {
    day4_after_riin_2: {
      text: "*A professora Riin está sentada à mesa. Estava organizando documentos. Quando entro, sua mão para. Ela vira os papéis. Devagar. Naturalmente. Mas eu vi. O título: 'Registros de Medicação S-13'.*",
    },
    day4_after_riin_15: {
      text: '*A professora Riin tira algo do bolso. Uma chave. Uma pequena chave de metal.*',
    },
    day4_after_riin_21: {
      text: '*A professora Riin olha para mim. Pela primeira vez, não com olhos de professora da enfermaria.*',
    },
    day4_after_riin_26: {
      text: '*A professora Riin olha pela janela. O sol se põe. A enfermaria se tinge de laranja.*',
    },
  },
  'day4_lunch.json': {
    day4_lunch_nurse_1: {
      text: '*A professora Riin está diante do armário de remédios, passando alguma coisa para uma seringa.*',
    },
  },
  'day4_morning.json': {
    day4_morning_commute: {
      text: '*A caminho da escola. Uma notificação do aplicativo de segurança apareceu no meu celular.*',
    },
    day4_morning_sea_7: {
      text: '"Yuna...? Ah, por acaso é aquela garota que se transferiu no ano passado?"',
    },
  },
  'day4_night.json': {
    day4_night_mirror_hit1_5: {
      text: '*Olhei para trás. Seolhwa está ali. Nítida. O cabelo branco-prateado brilha sob a luz fluorescente. Seus olhos estão úmidos.*',
    },
  },
  'day5_afterschool.json': {
    day5_after_caught_1: {
      text: '*...Abri os olhos. A luz fluorescente pisca. Teto de concreto. Estou no porão.*',
    },
    day5_after_caught_7: {
      text: '*A professora Riin desinfeta a parte interna do meu cotovelo. O frio do algodão com álcool toca minha pele. ...Não posso desistir aqui.*',
    },
    day5_after_caught_submit_1: {
      text: '*...Minha força vai embora. Não me resta energia para resistir. Minha cabeça cai. Meus olhos se fecham.*',
    },
    day5_after_confront_20: {
      text: '*A seringa e a saída de emergência. Esquecimento e memória. A gaiola e o céu. Consigo ver Seolhwa. Atrás da professora. Debaixo da escada. Como um contorno borrado. Ela não diz nada. Só está olhando para mim.*',
    },
  },
  'day5_lunch.json': {
    day5_lunch_right_5: {
      text: '*A professora Riin está parada diante do armário. Não usa jaleco. Roupas comuns. Parece pronta para ir embora.*',
    },
    day5_lunch_right_10: {
      text: '*Recuei. Minhas costas bateram no batente da porta. Não há para onde fugir.*\n\n*A professora Riin ergueu a seringa. Uma gota de líquido caiu da ponta da agulha. Minhas pernas perderam a força.*',
    },
    day5_lunch_right_15: {
      text: '*A professora Riin abriu a tampa do frasco de remédio. Levou-o ao nariz. Sentiu o cheiro. E tomou um gole.*',
    },
    day5_lunch_right_20: {
      text: '*A professora Riin esfregou o rótulo do frasco com o polegar. Por baixo da etiqueta colada por cima, aparecia um código comum de soro hospitalar.*',
    },
    day5_lunch_right_36: {
      text: '*...Então era por isso que aqui estava tão silencioso. Riin desligou o sistema de rastreamento desta área. Também foi ela quem baixou a persiana. O único ponto cego fora do alcance dos olhos de Eunsu.*',
    },
    day5_lunch_right_39: {
      text: '*A professora Riin está me estendendo a chave. Uma pequena chave prateada. Sua mão treme.*',
    },
    day5_lunch_right_c3_2: {
      text: '*A professora Riin pegou a seringa e a cravou no próprio braço. O diluente inerte.*',
    },
  },
  'day5_morning.json': {
    day5_morning_dawn_12: {
      text: '*Caminhei. Vinte minutos até a escola. A estrada de madrugada está vazia; só meus passos ecoam.*\n\n*Vou para a escola. Todas as pistas que juntei até ontem apontam para a parte de baixo do prédio antigo. Preciso começar pelo subsolo.*',
    },
    day5_morning_rescue_13: {
      text: '"...Alguns meses depois, aquela pessoa se transferiu para cá com outro nome. Tinha o mesmo rosto, mas não me reconheceu."',
    },
  },
  'day5_night.json': {
    day5_ending_true_30: {
      text: '*...Eu me lembro. De tudo. Dos doze eus. De Seolhwa. De Eunsu. De Riin. De Sea. De Yuna.*',
    },
    day5_ending_forget_18: {
      text: '*Tenho que ir para a escola. Uma escola nova.*',
    },
    day5_ending_ghost_18: {
      text: '*Mas, às vezes, à noite. Quando olho no espelho... acho que vejo cabelos branco-prateados. Por uma fração de segundo.*',
    },
  },
};

const REPLACEMENTS = [
  [/\bAluno\(a\) transferido\(a\)\b/g, 'Estudante transferido'],
  [/\baluno\(a\) transferido\(a\)\b/g, 'estudante transferido'],
  [/\bum\(a\) aluno\(a\) transferido\(a\)\b/g, 'um estudante transferido'],
  [/\bo\(a\) aluno\(a\) transferido\(a\)\b/g, 'o estudante transferido'],
  [/\bnovo\(a\)\b/g, 'novo'],
  [/\bansioso\(a\)\b/g, 'ansioso'],
  [/\bparado\(a\)\b/g, 'parado'],
  [/\bSentado\(a\)\b/g, 'Sentado'],
  [/\bsentado\(a\)\b/g, 'sentado'],
  [/\bAquele\(a\)\b/g, 'Aquele'],
  [/\baquele\(a\)\b/g, 'aquele'],
  [/\bele\(a\)\b/g, 'ele'],
  [/\bVocê é o estudante transferido\?/g, 'Você é o aluno transferido?'],
  [/\bTransmissao da escola\b/g, 'Transmissão da escola'],
  [/\bSe-Ah\b/g, 'Sea'],
  [/\bSe-ah\b/g, 'Sea'],
  [/\bSeA\b/g, 'Sea'],
  [/\bO professor Lee In\b/g, 'A professora Riin'],
  [/\bo professor Lee In\b/g, 'a professora Riin'],
  [/\bProfessor Lee In\b/g, 'Professora Riin'],
  [/\bprofessor Lee In\b/g, 'professora Riin'],
  [/\bO professor Lin\b/g, 'A professora Riin'],
  [/\bo professor Lin\b/g, 'a professora Riin'],
  [/\bProfessor Lin\b/g, 'Professora Riin'],
  [/\bprofessor Lin\b/g, 'professora Riin'],
  [/\bprofessor de saúde\b/g, 'professora da enfermaria'],
  [/\bprofessor da enfermaria\b/g, 'professora da enfermaria'],
  [/\bLee In\b/g, 'Riin'],
  [/\bLin\b/g, 'Riin'],
  [/\bconto popular\b/g, 'Seolhwa'],
  [/\bConto popular\b/g, 'Seolhwa'],
  [/\bum conto popular\b/g, 'Seolhwa'],
  [/\bUm conto popular\b/g, 'Seolhwa'],
  [/\bVocê pode ver\b/g, 'Dá para ver'],
  [/\bvocê pode ver\b/g, 'dá para ver'],
  [/\bno seu telefone\b/g, 'no meu celular'],
  [/\bmeus olhos estão vermelhos\b/g, 'os olhos dela estão vermelhos'],
  [/\bMeus olhos estão vermelhos\b/g, 'Os olhos dela estão vermelhos'],
  [/\bMeus olhos estão úmidos\b/g, 'Os olhos dela estão úmidos'],
  [/\bmeus olhos estão úmidos\b/g, 'os olhos dela estão úmidos'],
  [/\bMinha cabeça cai\b/g, 'Minha cabeça pende'],
  [/\bme sinto fraco\b/g, 'perco as forças'],
  [/\bsala de saúde\b/g, 'enfermaria'],
  [/\bSala de saúde\b/g, 'Enfermaria'],
];

function applyReplacements(value) {
  if (typeof value !== 'string') return value;
  let out = value;
  for (const [from, to] of REPLACEMENTS) out = out.replace(from, to);
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
}

function normalizeEntry(entry) {
  entry.text = applyReplacements(entry.text);
  if (Array.isArray(entry.choices)) entry.choices = entry.choices.map(applyReplacements);
  return entry;
}

function mergeEntry(base, override) {
  const merged = { ...base, ...override };
  if (override && Object.prototype.hasOwnProperty.call(override, 'choices')) {
    merged.choices = override.choices;
  }
  return merged;
}

for (const file of fs.readdirSync(KO_DIR).filter((name) => name.endsWith('.json')).sort()) {
  const ko = JSON.parse(fs.readFileSync(path.join(KO_DIR, file), 'utf8'));
  const ptPath = path.join(PT_DIR, file);
  const pt = fs.existsSync(ptPath) ? JSON.parse(fs.readFileSync(ptPath, 'utf8')) : {};
  const fileOverrides = OVERRIDES[file] || {};
  const result = {};

  for (const [key, koEntry] of Object.entries(ko)) {
    const existing = pt[key] && typeof pt[key] === 'object' ? { ...pt[key] } : {};
    const entry = {
      name: NAME_MAP[koEntry.name] ?? existing.name ?? koEntry.name ?? '',
      text: existing.text ?? koEntry.text ?? '',
    };
    if (Array.isArray(koEntry.choices)) entry.choices = existing.choices ?? koEntry.choices;

    result[key] = normalizeEntry(mergeEntry(entry, fileOverrides[key]));
  }

  fs.writeFileSync(ptPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`polished ${file}`);
}
