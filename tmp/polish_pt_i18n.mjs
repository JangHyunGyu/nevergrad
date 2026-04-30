#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KO_DIR = path.join(ROOT, 'assets', 'js', 'i18n', 'ko');
const PT_DIR = path.join(ROOT, 'assets', 'js', 'i18n', 'pt');

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
    day2_after_sea_1: {
      text: '"Você veio? Obrigada por vir de novo hoje."',
    },
    day2_after_sea_12: {
      text: '"Nossa turma... ainda não entregou. Eu sou a presidente de turma e mesmo assim isso aconteceu?"',
    },
    day2_after_sea_18: {
      text: '"Antes de você vir, {name}, eu sempre ficava sozinha aqui."',
    },
    day2_after_sea_19: {
      text: '"Todo mundo mantém distância porque eu sou a presidente de turma. Eles sorriem, mas... mantêm distância."',
    },
    day2_after_sea_21: {
      text: '"Para ser sincera... às vezes eu me sinto sozinha."',
    },
  },
  'day2_morning.json': {
    day2_morning_seolhwa_2: {
      text: '*Intervalo. Dou uma olhada para trás. Meus olhos encontram os de Seolhwa.*',
    },
  },
  'day2_night.json': {
    day2_night_start: {
      text: '*Verifiquei o celular.*',
    },
    day2_night_phone_1: {
      text: "*O grupo da antiga escola. 'Lido por 3'. Ninguém respondeu. Já faz dois dias.*",
    },
    day2_night_phone_2: {
      text: "*Mandei mensagem para Minsu. 'Ei, Minsu, eu me transferi e você nem fala comigo? kkk'*",
    },
    day2_night_phone_3: {
      text: "*Dez minutos depois. O indicador '...' apareceu. Minsu está digitando.*",
    },
    day2_night_phone_4: {
      text: '*Cinco segundos. O indicador continua piscando. Será que ele está escrevendo uma mensagem longa?*',
    },
    day2_night_phone_5: {
      text: '*A resposta chegou.*',
    },
    day2_night_phone_6: {
      text: "*Minsu: 'Sim, estou bem. E aí, como estão as coisas por aí?'*",
    },
    day2_night_phone_7: {
      text: "*...O que é isso? Normalmente ele viria com um 'ei, seu idiota kkkkk' e me xingaria de brincadeira. Por que está tão seco?*",
    },
    day2_night_phone_8: {
      text: "*'Sim, estou bem.' ...Ele ficou cinco segundos digitando e escolheu justo isso?*",
    },
    day2_night_phone_9: {
      text: "*Respondi: 'Por que está falando desse jeito? kkk Aconteceu alguma coisa?'*",
    },
    day2_night_phone_10: {
      text: '*Um minuto. Dois minutos. O indicador de digitação apareceu de novo.*',
    },
    day2_night_phone_11: {
      text: "*Minsu: 'Não, nada não kkk Só estava ocupado'*",
    },
    day2_night_phone_12: {
      text: '*...Não sei por quê, mas o jeito de falar dele parece diferente. Deve ter estado ocupado mesmo.*',
    },
    day2_night_phone_13: {
      text: '*...Quero perguntar mais. Vou responder ao Minsu.*',
    },
    day2_night_ft_messenger: {
      text: '*Mandei outra mensagem para Minsu.*',
    },
    day2_night_flash_5: {
      text: '*Abri os olhos. Há suor na minha testa.*',
    },
  },
  'day3_afterschool.json': {
    day3_after_start: {
      text: '*A chamada final terminou. A sala de aula se esvazia depressa. Pela janela, vejo alunos se reunindo em pequenos grupos no pátio.*',
    },
    day3_after_start_2: {
      text: '*O dia inteiro foi estranho. Desde a manhã. O déjà-vu no caminho para a escola, o silêncio na sala, os olhos de Sea. Tudo.*',
    },
    day3_after_start_3: {
      text: '*...Será que eu vou direto para casa? Não. Sinto que preciso fazer alguma coisa. Não consigo simplesmente ir embora carregando esse incômodo.*',
    },
    day3_after_riin_6: {
      text: '"Não, é só... minha cabeça está meio confusa."\n\n*A professora Riin me encara. Por um bom tempo. O olhar dela não é o de uma médica vendo um paciente, nem o de uma professora vendo um aluno. É algo mais... complicado.*',
    },
    day3_after_riin_6a: {
      text: '"Tenho uma bebida revigorante aqui. Uma mistura de vitaminas e ervas."',
    },
    day3_after_riin_7: {
      text: '*A professora Riin tira uma pequena garrafa do armário e despeja o conteúdo em um copo. Um líquido lilás-claro. A cor é estranha demais para vitamina.*\n\n*Riin me entrega o copo. Suas mãos tremem de leve. Desta vez está mais claro. O anelar e o mindinho tremem quase imperceptivelmente.*\n\n*Olho para os olhos da professora Riin. Há... algo ali. Debaixo do sorriso, alguma coisa. Desespero? Arrependimento?*',
    },
    day3_after_riin_choice: {
      text: '*Devo beber?*',
      choices: ['Beber', 'Recusar educadamente'],
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
    day3_lunch_start: {
      text: '*Hora do almoço. Abri a gaveta da carteira e encontrei um bilhete.*',
    },
    day3_lunch_note_yuna: {
      text: "*'Senpai, venha ao terraço na hora do almoço. Venha sozinho, por favor. É importante. - Yuna'*",
    },
    day3_lunch_note_yuna_2: {
      text: '*...Yuna mandou isso. A caloura do clube de fotografia que conheci na biblioteca. Algo importante... o que será?*',
    },
    day3_lunch_note_unknown: {
      text: "*'Senpai, venha ao terraço na hora do almoço. Venha sozinho, por favor. É importante. - Yuna'*",
    },
    day3_lunch_note_unknown_2: {
      text: '*...Yuna? Não conheço esse nome. Tem alguma Yuna na minha turma? Não, eu já decorei mais ou menos os nomes da classe, e não havia nenhuma Yuna.*',
    },
    day3_lunch_note_unknown_3: {
      text: '*Será uma brincadeira? Ou alguém de outra turma colocou na carteira errada.*\n\n*Guardei o bilhete no bolso. Fiquei incomodado, mas ir sozinho encontrar alguém que nem conheço... melhor ignorar.*',
    },
    day3_lunch_choice_no_yuna: {
      text: '*...O que eu faço?*',
      choices: ['Almoçar com Sea', 'Ir à enfermaria', 'Ficar sozinho na sala'],
    },
    day3_lunch_choice: {
      text: '*...O que eu faço?*',
      choices: ['Ir ao terraço', 'Almoçar com Sea', 'Ir à enfermaria', 'Ficar sozinho na sala'],
    },
    day3_lunch_rooftop_2: {
      text: '*Yuna me entrega a câmera sem dizer nada.*',
    },
    day3_lunch_rooftop_3: {
      text: '*Suas mãos tremem. As mãos de Yuna. Os nós dos dedos que seguram a câmera estão brancos.*',
    },
    day3_lunch_rooftop_5: {
      text: '*Peguei a câmera. Há uma foto na tela.*',
    },
    day3_lunch_rooftop_6: {
      text: "*Um aluno parado diante do portão da escola. Cabelo preto curto. Uniforme engomado. Crachá: 'Kim Dojin'.*",
    },
    day3_lunch_rooftop_7: {
      text: '*Passei para a próxima.*',
    },
    day3_lunch_rooftop_8: {
      text: "*O mesmo portão. Outro aluno. Cabelo castanho. Crachá: 'Park Seojin'.*",
    },
    day3_lunch_rooftop_9: {
      text: '*Passei para a próxima.*',
    },
    day3_lunch_rooftop_10: {
      text: "*Um garoto de cabelo comprido. Rosto abatido. Crachá: 'Kim Taeho'.*",
    },
    day3_lunch_rooftop_4: {
      text: '"...Passe para a próxima."',
    },
    day3_lunch_riin_6: {
      text: '*A professora Riin se vira e tira alguma coisa do armário. Vejo suas costas. Seus ombros hesitam por um instante. Uma pausa breve, como se ela estivesse tomando uma decisão.*',
    },
    day3_lunch_riin_7: {
      text: '"Hoje, em especial... quer uma bebida revigorante feita pela professora?"',
    },
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
    day4_morning_start: {
      text: '*Manhã do 4º dia. Abri os olhos antes do alarme tocar. 5h38 da manhã.*',
    },
    day4_morning_start_2: {
      text: "*As letras na parede continuam ali. 'Saia daqui'. Não foi sonho.*",
    },
    day4_morning_start_3: {
      text: '*Passei a ponta dos dedos pelas letras. São marcas arranhadas com unha. Fundas. Não foi algo feito de uma vez só.*',
    },
    day4_morning_start_4: {
      text: '*...A parte de baixo das minhas unhas está ferida. Não estava assim antes de eu dormir ontem.*',
    },
    day4_morning_start_5: {
      text: '*Será que fui eu que escrevi isso dormindo?*',
    },
    day4_morning_start_6: {
      text: '*Ou será que eu estava acordado e não me lembro?*',
    },
    day4_morning_start_7: {
      text: '*Fiquei diante do espelho. ...Está embaçado de novo. Quando tento limpar, paro.*',
    },
    day4_morning_start_8: {
      text: '*Do outro lado do espelho embaçado, vejo uma forma refletida. Borrada. O contorno de uma pessoa. ...É o meu contorno. Então por que parece tão estranho?*',
    },
    day4_morning_start_9: {
      text: '*Parece haver algo sobreposto no vapor. Outro rosto por cima do meu. ...Deve ser impressão minha.*',
    },
    day4_morning_start_10: {
      text: '*...Não limpei. Por algum motivo, tenho medo de olhar para o meu rosto. Até ontem eu achava que não limpava por preguiça. Hoje, não tenho tanta certeza.*',
    },
    day4_morning_start_11: {
      text: '*O instinto diz: não limpe.*',
    },
    day4_morning_start_12: {
      text: '*Lavei o rosto de qualquer jeito. Escovei os dentes de costas para o espelho. Eu sei que é anormal. Ter medo de um simples espelho.*',
    },
    day4_morning_start_13: {
      text: '*Minhas mãos tremem enquanto visto o uniforme. Errei os botões três vezes.*',
    },
    day4_morning_start_14: {
      text: '*A luz da manhã entra pela fresta das cortinas. O dia está claro. Mas, sob a janela, há alguém parado na calçada. Terno. Óculos escuros. Braços cruzados, olhando para cá.*',
    },
    day4_morning_start_15: {
      text: '*Dois segundos. Pisquei. Sumiu. ...Ele estava mesmo ali? De verdade?*',
    },
    day4_morning_start_16: {
      text: '*É o tipo de pessoa que sinto já ter visto em algum lugar. Não parece responsável por aluno, nem morador do bairro. Alguém que não combina com esta vizinhança.*',
    },
    day4_morning_start_16_yuna: {
      text: "*As palavras de Yuna voltam à minha cabeça. 'Sempre tem as mesmas pessoas ao redor desta escola. Gente que não parece responsável por aluno nem morador daqui.'*",
    },
    day4_morning_start_17: {
      text: '*Parei diante da porta de entrada. Pela fresta de baixo, vejo uma sombra. Duas pernas. Alguém está parado bem na frente.*',
    },
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
    day4_night_mirror_hit2: {
      text: '*Meu campo de visão se estreita. Encaro o espelho. Meu rosto. Estou olhando para o meu rosto.*',
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
    day5_after_ghost_11: {
      text: '"...Professora. Não existe décimo quarto."',
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
    day5_lunch_seolhwa_guide_5: {
      text: '"...Senpai, você está murmurando sozinho."',
    },
  },
  'day5_morning.json': {
    day5_morning_plan_escape: {
      text: '*O que decidi ontem à noite foi fugir. Primeiro, sair vivo. As provas vêm depois.*',
    },
    day5_morning_plan_expose: {
      text: '*O que decidi ontem à noite foi expor tudo. Não vou abrir mão nem de sobreviver, nem de deixar registros para trás.*',
    },
    day5_morning_plan_confront: {
      text: '*O que decidi ontem à noite foi encarar. Com a mão trêmula, escrevi que não fugiria e veria isto até o fim.*',
    },
    day5_morning_dawn_1: {
      text: '*Quatro da manhã. Não consegui dormir. Não, eu não podia dormir.*',
    },
    day5_morning_dawn_2: {
      text: '*Olho para o relógio no escuro. O ponteiro fluorescente treme. Não, são minhas mãos que estão tremendo.*',
    },
    day5_morning_dawn_3: {
      text: '*Confiro a mochila. O que deixei preparado: anotações escritas à mão, celular, provas que consegui guardar. Se tirarem a mochila de mim, acabou. A bateria está em 68%. Depois de hesitar sobre levar ou não o carregador, acabei colocando também. Não sei quando vou poder usar.*',
    },
    day5_morning_dawn_4: {
      text: '*Tirei o caderno. O plano que escrevi ontem à noite. A letra está tremida, e metade é difícil de ler. Ainda assim, está tudo na minha cabeça. Meu corpo se lembra. Afinal, já repetiu isso doze vezes.*',
    },
    day5_morning_dawn_5: {
      text: '*Amarrei bem os cadarços. Talvez eu precise correr.*',
    },
    day5_morning_dawn_6: {
      text: '*Fiquei diante da porta. Parei por um instante.*',
    },
    day5_morning_dawn_7: {
      text: '*Do outro lado da porta. O corredor. O corredor de uma pensão às quatro da manhã sempre foi silencioso assim? Não. Sempre foi silencioso. Só que antes esse silêncio era apenas silêncio.*',
    },
    day5_morning_dawn_8: {
      text: '*Prendi a respiração e abri a porta. Corredor. Só a luz verde da saída de emergência se espalha pelo chão. Não há ninguém.*',
    },
    day5_morning_dawn_9: {
      text: '*Não haver ninguém é ainda mais estranho. Se estão me vigiando, eu quase preferia que aparecessem onde eu pudesse ver.*',
    },
    day5_morning_dawn_10: {
      text: '*Desci as escadas abafando meus passos. Rua de madrugada. Os postes brilham em laranja. Não há sinal de ninguém. Nem carros. Só o vento.*',
    },
    day5_morning_dawn_11: {
      text: '*Estou sozinho. Completamente sozinho.*\n\n*...Não. Durante doze vezes, eu sempre estive sozinho. Toda vez perdendo a memória, toda vez voltando ao começo, toda vez sem saber de nada. Se isso não é estar sozinho, então o que é?*',
    },
    day5_morning_dawn_12: {
      text: '*Caminhei. Vinte minutos até a escola. A estrada de madrugada está vazia; só meus passos ecoam.*\n\n*Vou para a escola. Todas as pistas que juntei até ontem apontam para a parte de baixo do prédio antigo. Preciso começar pelo subsolo.*',
    },
    day5_morning_rescue_13: {
      text: '"...Alguns meses depois, aquela pessoa se transferiu para cá com outro nome. Tinha o mesmo rosto, mas não me reconheceu."',
    },
    day5_morning_true_30: {
      text: '"Senpai... daqui a pouco a professora Riin desce. Ela sempre vem aplicar os remédios."',
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
    day5_ending_ghost_14: {
      text: '"...Professora. Não existe décimo quarto."',
    },
  },
};

const REPLACEMENTS = [
  [/\bAluno\(a\) transferido\(a\)\b/g, 'Estudante transferido'],
  [/\baluno\(a\) transferido\(a\)\b/g, 'estudante transferido'],
  [/\bum\(a\) aluno\(a\) transferido\(a\)\b/g, 'um estudante transferido'],
  [/\bo\(a\) aluno\(a\) transferido\(a\)\b/g, 'o estudante transferido'],
  [/\bnovo\(a\)\b/g, 'novo'],
  [/sentado\(a\)/g, 'sentado'],
  [/perdido\(a\)/g, 'perdido'],
  [/novato\(a\)/g, 'novato'],
  [/único\(a\)/g, 'único'],
  [/ignorado\(a\)/g, 'ignorado'],
  [/notado\(a\)/g, 'notado'],
  [/surpreso\(a\)/g, 'surpreso'],
  [/nervoso\(a\)/g, 'nervoso'],
  [/cansado\(a\)/g, 'cansado'],
  [/adormecido\(a\)/g, 'adormecido'],
  [/sozinho\(a\)/g, 'sozinho'],
  [/próximo\(a\)/g, 'próximo'],
  [/honesto\(a\)/g, 'honesto'],
  [/interessado\(a\)/g, 'interessado'],
  [/esquecido\(a\)/g, 'esquecido'],
  [/Obrigado\(a\)/g, 'Obrigado'],
  [/Bem-vindo\(a\)/g, 'Bem-vindo'],
  [/bem-vindo\(a\)/g, 'bem-vindo'],
  [/tê-lo\(a\)/g, 'tê-lo'],
  [/aluno\(a\)/g, 'aluno'],
  [/Aluno\(a\)/g, 'Aluno'],
  [/Um\(a\)/g, 'Um'],
  [/um\(a\)/g, 'um'],
  [/o\(a\)/g, 'o'],
  [/pelo\(a\)/g, 'pelo'],
  [/sozinha\(o\)/g, 'sozinho'],
  [/aluna \(o aluno\) transferida\(o\)/g, 'aluno transferido'],
  [/transferida\(o\)/g, 'transferido'],
  [/fofo\(a\)/g, 'bonitinho'],
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
  [/\bAbrir a porta\b/g, 'Abri a porta'],
  [/\bAbra meus olhos\b/g, 'Abri os olhos'],
  [/\bAbra os olhos\b/g, 'Abri os olhos'],
  [/\bPegue\b/g, 'Peguei'],
  [/\bJogue o conteúdo\b/g, 'Despejo o conteúdo'],
  [/\bOlhe nos olhos da professora Riin\b/g, 'Olho nos olhos da professora Riin'],
  [/\bOlhe nos olhos do professora Riin\b/g, 'Olho nos olhos da professora Riin'],
  [/\bDesta vez é mais certo\b/g, 'Desta vez está mais claro'],
  [/\bDesesperado\? arrependimento\?/g, 'Desespero? Arrependimento?'],
  [/\bficar na aula\b/g, 'ficar na sala'],
  [/\bFique na aula\b/g, 'Fico na sala'],
  [/\bFicou em frente\b/g, 'Fiquei em frente'],
  [/\bO corpo se moveu primeiro\b/g, 'Meu corpo se moveu primeiro'],
  [/\bEu vou com Sea\b/g, 'Ir com Sea'],
  [/\bEu estou sozinho\b/g, 'Ficar sozinho'],
  [/\bpare na sala do professor\b/g, 'Passar na sala dos professores'],
  [/\bPasse na enfermaria\b/g, 'Passar na enfermaria'],
  [/\brecusar educadamente\b/g, 'Recusar educadamente'],
  [/\*Mar:/g, '*Sea:'],
  [/‘Mar:/g, "'Sea:"],
  [/'Mar:/g, "'Sea:"],
  [/\bProfessora Riin tira\b/g, 'A professora Riin tira'],
  [/\bA professora Riin está parado\b/g, 'A professora Riin está parada'],
  [/\bdo professora Riin\b/g, 'da professora Riin'],
  [/\bLiin\b/g, 'Riin'],
  [/\bsaudável\b/g, 'revigorante'],
  [/\bNão consigo ler exatamente qual é a expressão\b/g, 'Não consigo decifrar exatamente aquela expressão'],
  [/\.{4,}/g, '...'],
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
    const entry = {};
    if (Object.prototype.hasOwnProperty.call(koEntry, 'speaker')) {
      entry.speaker = koEntry.speaker;
    } else if (Object.prototype.hasOwnProperty.call(existing, 'speaker')) {
      entry.speaker = existing.speaker;
    }
    entry.text = existing.text ?? koEntry.text ?? '';
    if (Array.isArray(koEntry.choices)) entry.choices = existing.choices ?? koEntry.choices;

    result[key] = normalizeEntry(mergeEntry(entry, fileOverrides[key]));
  }

  fs.writeFileSync(ptPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`polished ${file}`);
}
