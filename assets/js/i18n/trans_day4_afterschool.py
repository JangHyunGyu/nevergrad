import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day4_after_start_3'] = {'name': 'Moi', 'text': "*...Maintenant que je sais ce qui se cache derri\u00e8re le sourire de Sea, ce sourire me para\u00eet diff\u00e9rent.*"}
T['day4_after_start_4'] = {'name': 'Moi', 'text': "*Le sous-sol. L'escalier dans la cam\u00e9ra de Yuna. Ce que Seolhwa a grav\u00e9 sur le toit : 'La r\u00e9ponse est dans le sous-sol'. Tout pointe vers le m\u00eame endroit.*"}
T['day4_after_basement_10'] = {'name': 'Moi', 'text': "***Lits. Plusieurs. Lits m\u00e9dicaux. Des sangles en cuir sur les accoudoirs.***"}
T['day4_after_basement_11'] = {'name': 'Moi', 'text': "***Mat\u00e9riel m\u00e9dical. \u00c9crans. Armoires remplies de produits chimiques. Seringues align\u00e9es en rang\u00e9es.***"}
T['day4_after_basement_12'] = {'name': 'Moi', 'text': "*...Ce n'est pas une infirmerie. C'est... un laboratoire.*"}
T['day4_after_basement_13'] = {'name': 'Moi', 'text': "*Mes mains tremblent. Mes jambes tremblent. Je veux fuir. Mais je dois voir. Jusqu'au bout.*"}
T['day4_after_basement_14'] = {'name': 'Moi', 'text': "*Un tableau accrouch\u00e9 au mur. Il indique 'Registre des r\u00e9actions des sujets'. Des noms et des num\u00e9ros list\u00e9s. Sujet #1... #3... #7... #12... La plupart avec un X rouge \u00e0 c\u00f4t\u00e9 des noms. 'Reconstruction mn\u00e9monique \u00e9chou\u00e9e', 'Effets secondaires : dissociation de la personnalit\u00e9', 'Traitement termin\u00e9'...*"}
T['day4_after_basement_15'] = {'name': 'Moi', 'text': "*#7 \u2014 Lee Seolhwa. \u00c0 c\u00f4t\u00e9 du X il y a une note : 'Effet inverse. Conservation int\u00e9grale de la m\u00e9moire. Confinement impossible. Traitement final ex\u00e9cut\u00e9.' ...Seolhwa.*"}
T['day4_after_basement_16'] = {'name': 'Moi', 'text': "*J'ai ouvert un tiroir du bureau. Une pile de documents. Mes mains tremblent tellement que je peux \u00e0 peine les tenir. 'Protocole de manipulation de la m\u00e9moire \u2014 ver.4.2'*"}
T['day4_after_basement_17'] = {'name': 'Moi', 'text': "*'Proc\u00e9dures d'acquisition d'\u00e9l\u00e8ves transf\u00e9r\u00e9s : Couper les liens avec l'\u00e9cole d'origine \u2192 Induire l'adaptation au nouvel environnement \u2192 Administration progressive de m\u00e9dicaments sur 5 jours \u2192 Reconstruction mn\u00e9monique \u2192 V\u00e9rification de la conformit\u00e9'*"}
T['day4_after_basement_18'] = {'name': 'Moi', 'text': "*'Approuv\u00e9 par le Conseil : Programme Sp\u00e9cial de Correction Comportementale Autonome pour \u00c9l\u00e8ves Inadapt\u00e9s (Nom de code interne : Nevergrad) \u2014 Recherche en Restructuration Cognitive pour une Conformit\u00e9 Totale' ...Un programme de correction comportementale. Rien qu'\u00e0 lire le nom, \u00e7a ressemble \u00e0 une initiative sociale normale. Nom de code 'Nevergrad'. Le nom de cette \u00e9cole et... le vrai nom de l'exp\u00e9rience.*"}
T['day4_after_basement_19'] = {'name': 'Moi', 'text': "*J'ai d\u00e9pli\u00e9 un autre document. 'Sujet #13 \u2014 En cours'. Une photo est jointe. ...Ma photo. Mes jambes se sont d\u00e9rob\u00e9es. J'ai d\u00fb m'appuyer contre le mur. Je n'arrive plus \u00e0 respirer. ...Num\u00e9ro 13. Mon num\u00e9ro. Ils me ciblaient d\u00e8s le d\u00e9but...*"}
T['day4_after_basement_20'] = {'name': 'Moi', 'text': "*...! Du coin, un bruit. Un petit g\u00e9missement. Quelqu'un est l\u00e0. La n\u00e9on clignote. \u00c0 chaque \u00e9clair de lumi\u00e8re, j'aper\u00e7ois quelqu'un allong\u00e9 dans le coin.*"}
T['day4_after_basement_21'] = {'name': 'Choi Yuna', 'text': "\"...Senpai... ?\""}
T['day4_after_basement_22'] = {'name': 'Moi', 'text': "*C'est Yuna. Effondr\u00e9e sur un lit dans le coin.*"}
T['day4_after_basement_23'] = {'name': 'Choi Yuna', 'text': "\"Senpai... c'est bien toi... ? ...Comment tu es arriv\u00e9(e)...\""}
T['day4_after_basement_24'] = {'name': 'Moi', 'text': "*Je me suis approch\u00e9(e). Le visage de Yuna est p\u00e2le. Ses l\u00e8vres sont gerss\u00e9es. Le dessous de ses yeux est sombrement creus\u00e9. Des marques d'aiguille sur le bras. Plusieurs. Des fra\u00eeches aux anciennes. ...Yuna n'a pas 'transf\u00e9r\u00e9'. Elle \u00e9tait ici. D\u00e8s le d\u00e9but.*"}
T['day4_after_basement_25'] = {'name': 'Choi Yuna', 'text': "\"...Senpai, il faut... sortir d'ici. Vite...\""}
T['day4_after_basement_26'] = {'name': 'Moi', 'text': "*Yuna attrape ma manche. Sa main n'a plus de force.*"}
T['day4_after_basement_timer'] = {'name': 'Choi Yuna', 'text': "\"Ils arrivent... bient\u00f4t. Tous les jours \u00e0 cette heure-l\u00e0...\"", 'choices': ["Emmener Yuna et partir", "Se cacher pour l'instant"]}
T['day4_after_basement_rescue_3'] = {'name': 'Choi Yuna', 'text': "\"...Oui. Lentement mais...\""}
T['day4_after_basement_rescue_4'] = {'name': 'Moi', 'text': "*J'ai trouv\u00e9 une autre sortie du c\u00f4t\u00e9 oppos\u00e9. Il y a une petite porte pr\u00e8s de la gaine de ventilation. Elle semble mener \u00e0 l'ext\u00e9rieur.*"}
T['day4_after_basement_rescue_5'] = {'name': 'Moi', 'text': "*Soutenant Yuna, j'ai ouvert la porte et me suis gliss\u00e9(e) dans l'obscurit\u00e9.*"}
T['day4_after_basement_hide_3'] = {'name': 'Moi', 'text': "*...C'est l'infirmi\u00e8re Riin. Elle entre en portant un plateau de m\u00e9dicaments. J'ai retenu mon souffle. Mon c\u0153ur cogne contre mes c\u00f4tes. Je vais me faire rep\u00e9rer\u00a0? Elle entendra mon c\u0153ur battre\u00a0?*"}
T['day4_after_basement_hide_4'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin prend des m\u00e9dicaments dans l'armoire et... est partie. La porte se ferme. Les pas s'\u00e9loignent.*"}
T['day4_after_basement_hide_5'] = {'name': 'Moi', 'text': "*...On s'en est sorti(e). Je dois faire sortir Yuna. Maintenant.*"}
T['day4_after_sea_6'] = {'name': 'Moi', 'text': "*Sea s'assied sur une chaise. Elle leve les yeux vers moi.*"}
T['day4_after_sea_7'] = {'name': 'Han Sea', 'text': "\"Quand {name} est avec Yuna, ton expression... n'est pas bonne. M\u00eame avec Mme Eunsu. Et avec l'infirmi\u00e8re Riin.\""}
T['day4_after_sea_8'] = {'name': 'Moi', 'text': "*La voix de Sea baisse.*"}
T['day4_after_sea_force'] = {'name': 'Han Sea', 'text': "\"Quand tu es avec moi, {name} a l'air plus \u00e0 l'aise. ...Tu n'as besoin de regarder que moi\u00a0?\"", 'choices': ["D'accord", "C'est un peu..."]}
T['day4_after_sea_accept_3'] = {'name': 'Moi', 'text': "*Sea sourit. Mais cette fois le sourire ne s'arr\u00eate pas. Ses coins de bouche relev\u00e9s semblent fig\u00e9s.*"}
T['day4_after_sea_accept_4'] = {'name': 'Han Sea', 'text': "\"**Ma personne.**\""}
T['day4_after_sea_crack_3'] = {'name': 'Moi', 'text': "*Sa voix a chang\u00e9. La voix ferme est... en train de vaciller.*"}
T['day4_after_sea_crack_4'] = {'name': 'Han Sea', 'text': "\"Je ne sais pas comment c'est dehors. J'ai pass\u00e9 toute ma vie \u00e0 faire ce que Mme Eunsu me disait.\""}
T['day4_after_sea_crack_5'] = {'name': 'Han Sea', 'text': "\"Elle m'a dit de me rapprocher des nouveaux \u00e9l\u00e8ves... de faire des rapports.\""}
T['day4_after_sea_crack_6'] = {'name': 'Moi', 'text': "*Sea a serr\u00e9 ses mains sur ses genoux. Ses jointures ont blanchi.*"}
T['day4_after_sea_crack_7'] = {'name': 'Han Sea', 'text': "\"...Je croyais que c'\u00e9tait tout. Je croyais que c'\u00e9tait bien faire.\""}
T['day4_after_sea_crack_8'] = {'name': 'Han Sea', 'text': "\"Mais les \u00e9l\u00e8ves que je signalais changeaient un \u00e0 un. Seolhwa... a totalement disparu.\""}
T['day4_after_sea_crack_9'] = {'name': 'Han Sea', 'text': "\"...C'est l\u00e0 que j'ai eu peur pour la premi\u00e8re fois.\""}
T['day4_after_sea_crack_10'] = {'name': 'Moi', 'text': "*La voix de Sea diminue. \u00c0 peine audible.*"}
T['day4_after_sea_crack_11'] = {'name': 'Han Sea', 'text': "\"Mais je pensais que {name}... serait diff\u00e9rent(e).\""}
T['day4_after_sea_crack_12'] = {'name': 'Moi', 'text': "*Les yeux de Sea vacillent.*"}
T['day4_after_sea_crack_13'] = {'name': 'Han Sea', 'text': "\"En fin de compte toi aussi... tu vas t'enfuir et me laisser ici seule.\""}
T['day4_after_sea_crack_14'] = {'name': 'Han Sea', 'text': "\"Tu vas m'abandonner.\""}
T['day4_after_sea_crack_15'] = {'name': 'Moi', 'text': "*Sea me regarde. Des larmes se forment dans ses yeux.*"}
T['day4_after_sea_crack_16'] = {'name': 'Han Sea', 'text': "\"J'ai vraiment craqu\u00e9 pour toi. Pas de la surveillance. Sinc\u00e8rement. Ce n'est pas du jeu. \u00c7a au moins... crois-le.\""}
T['day4_after_sea_crack_17'] = {'name': 'Moi', 'text': "*Un instant, la peur a travers\u00e9 les yeux de Sea. Une vraie \u00e9motion. Brute sous le masque. Sea aussi est emprisonn\u00e9e dans quelque chose. Cette \u00e9cole. Mme Eunsu. La cage appel\u00e9e 'un r\u00f4le'. \u00c7a a disparu rapidement. Sea essuie ses larmes. Sourit. Remet le masque.*"}
T['day4_after_sea_crack_18'] = {'name': 'Han Sea', 'text': "\"...Oublie. Oublie tout ce que j'ai dit.\""}
T['day4_after_sea_crack_19'] = {'name': 'Moi', 'text': "*Sea m'a serr\u00e9(e) dans ses bras. Ses mains se resserrent dans mon dos. J'ai du mal \u00e0 respirer. ...Je sais que ce n'est pas un c\u00e2lin. C'est de l'obsession.*"}
T['day4_after_sea_crack_20'] = {'name': 'Moi', 'text': "*Mais les \u00e9paules de Sea tremblent. L\u00e9g\u00e8rement. Tout doucement. Ce tremblement... c'est pas que de l'obsession. C'est de la peur. La peur d'\u00eatre seule si elle me l\u00e2che. ...Sea est aussi une victime. Comprendre \u00e7a ne rend pas la situation moins effrayante.*"}
T['day4_after_evidence_7'] = {'name': 'Professeure principale', 'text': "\"...{name}. Tu es encore l\u00e0\u00a0?\""}
T['day4_after_evidence_8'] = {'name': 'Moi', 'text': "*J'ai lev\u00e9 la t\u00eate. Mme Eunsu est debout \u00e0 la porte de la salle. ...Depuis quand est-elle l\u00e0\u00a0? Je n'ai pas entendu ses pas. L'expression de Mme Eunsu est complexe. Ni en col\u00e8re, ni triste... juste \u00e9puis\u00e9e.*"}
T['day4_after_evidence_9'] = {'name': 'Moi', 'text': "*Le regard de la professeure balaie la carte m\u00e9moire et le fragment de photo sur mon bureau.*"}
T['day4_after_evidence_timer'] = {'name': 'Moi', 'text': "*Le regard de la professeure balaie la carte m\u00e9moire et le fragment de photo sur mon bureau.*", 'choices': ["Fuir", "Rester immobile"]}
T['day4_after_evidence_run_3'] = {'name': 'Moi', 'text': "*Elle ne court pas apr\u00e8s. Elle reste sur place et parle.*"}
T['day4_after_evidence_run_4'] = {'name': 'Professeure principale', 'text': "\"Reviens, {name}. Peu importe o\u00f9 tu cours, tu ne feras que te blesser.\""}
T['day4_after_evidence_run_5'] = {'name': 'Professeure principale', 'text': "\"Tu n'as qu'\u00e0 faire ce que ta professeure te dit ici. C'est le plus s\u00fbr.\""}
T['day4_after_evidence_run_6'] = {'name': 'Moi', 'text': "*En courant dans le couloir, j'ai regard\u00e9 en arri\u00e8re. Mme Eunsu est appuy\u00e9e contre le chambranle. Une expression apitoy\u00e9e.*"}
T['day4_after_evidence_run_7'] = {'name': 'Moi', 'text': "*...Cette personne croit sinc\u00e8rement qu'elle a raison. C'est encore plus effrayant. Pas le temps de r\u00e9fl\u00e9chir davantage. Je dois courir.*"}
T['day4_after_evidence_stay'] = {'name': 'Moi', 'text': "*Mon corps s'est fig\u00e9. Je ne peux pas bouger. ...Je dois fuir, mais mes jambes ne r\u00e9pondent pas.*"}
T['day4_after_evidence_stay_2'] = {'name': 'Professeure principale', 'text': "\"Tu as tout vu.\""}
T['day4_after_evidence_stay_3'] = {'name': 'Moi', 'text': "*Mme Eunsu entre lentement dans la salle. Un pas. Un pas.*"}
T['day4_after_evidence_stay_4'] = {'name': 'Professeure principale', 'text': "\"...Les documents.\""}
T['day4_after_evidence_stay_5'] = {'name': 'Moi', 'text': "*La professeure pousse un soupir. Long et profond. Une expression que je n'avais jamais vue.*"}
T['day4_after_evidence_stay_6'] = {'name': 'Professeure principale', 'text': "\"...Je ne voulais pas que \u00e7a se passe comme \u00e7a d\u00e8s le d\u00e9but, {name}.\""}
T['day4_after_evidence_stay_7'] = {'name': 'Moi', 'text': "*La professeure se place devant moi. Tout pr\u00e8s.*"}
T['day4_after_evidence_stay_8'] = {'name': 'Professeure principale', 'text': "\"\u00c7a va, {name}. Ta professeure arrangera tout.\""}
T['day4_after_evidence_stay_9'] = {'name': 'Moi', 'text': "*La main de la professeure caresse ma t\u00eate. Doucement. Chaleureusement.*"}
T['day4_after_evidence_stay_10'] = {'name': 'Professeure principale', 'text': "\"...**Tu n'as qu'\u00e0 rester ici.**\""}

apply_translations('day4_afterschool.json', T)
