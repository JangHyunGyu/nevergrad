import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

# day5_ending_true_9 through _25 and subtitle
T['day5_ending_true_9'] = {'name': 'Moi', 'text': '*Une semaine plus tard.*'}
T['day5_ending_true_10'] = {'name': 'Moi', 'text': "*Je suis venu sur la colline qui surplombe l'\u00e9cole. Avec Yuna. L'\u00e9cole est ferm\u00e9e. Un ruban jaune est enroul\u00e9 autour du portail. Les \u00e9l\u00e8ves ont \u00e9t\u00e9 transf\u00e9r\u00e9s dans d'autres \u00e9coles.*"}
T['day5_ending_true_11'] = {'name': 'Choi Yuna', 'text': '"Senpai."'}
T['day5_ending_true_12'] = {'name': 'Moi', 'text': '*Yuna tient un appareil photo. Un nouvel appareil photo.*'}
T['day5_ending_true_13'] = {'name': 'Choi Yuna', 'text': '"On l\'a fait."'}
T['day5_ending_true_14'] = {'name': 'Moi', 'text': '*Yuna sourit. Un vrai sourire que je n\'ai jamais vu avant. Ses yeux sourient. Un sourire qui ne se cache pas derri\u00e8re un appareil photo.*'}
T['day5_ending_true_15'] = {'name': 'Moi', 'text': "*Le sort des \u00e9l\u00e8ves transf\u00e9r\u00e9s disparus se r\u00e9v\u00e8le. Certains ont \u00e9t\u00e9 retrouv\u00e9s dans d'autres \u00e9tablissements. On dit que leurs souvenirs reviennent.*"}
T['day5_ending_true_16'] = {'name': 'Moi', 'text': "*Sea est... \u00e0 l'h\u00f4pital. Elle re\u00e7oit un suivi psychologique. Une enfant \u00e9lev\u00e9e et '\u00e9duqu\u00e9e' dans cette \u00e9cole depuis l'enfance. Une enfant qui \u00e9tait \u00e0 la fois surveillante et victime. ...Je dois aller lui rendre visite un jour. Pas encore, mais un jour.*"}
T['day5_ending_true_17'] = {'name': 'Moi', 'text': "*Le vent souffle. L'herbe sur la colline se balance. Et alors \u2014 dans le vent \u2014 un p\u00e9tale de cerisier est arriv\u00e9 en volant. Un p\u00e9tale de cerisier dont on ne sait pas d'o\u00f9 il vient. J'ai sorti de ma poche le p\u00e9tale de cerisier que j'avais ramass\u00e9 le Jour 4. Je l'ai laiss\u00e9 partir dans le vent.*"}
T['day5_ending_true_18'] = {'name': 'Lee Seolhwa', 'text': '"...Merci."'}
T['day5_ending_true_19'] = {'name': 'Lee Seolhwa', 'text': '"Maintenant moi aussi... je peux partir."'}
T['day5_ending_true_20'] = {'name': 'Moi', 'text': "*Le p\u00e9tale de cerisier monte haut dans le ciel port\u00e9 par le vent. Vers la lumi\u00e8re. Seolhwa a enfin obtenu son dipl\u00f4me de cette cruelle salle de classe. L'\u00e2me qui \u00e9tait encha\u00een\u00e9e depuis un an... enfin.*"}
T['day5_ending_true_21'] = {'name': 'Moi', 'text': "*L'odeur de la pluie, l'odeur de la terre mouill\u00e9e, et un vent froid. Pas d'odeur de d\u00e9sinfectant, pas de doux parf\u00fcm d'ambiance. Toutes ces sensations \u00e2pres et d\u00e9sagr\u00e9ables... prouvaient que j'\u00e9tais vivant dans le monde r\u00e9el.*"}
T['day5_ending_true_22'] = {'name': 'Choi Yuna', 'text': '"Senpai, vous pleurez."'}
T['day5_ending_true_23'] = {'name': 'Moi', 'text': '"...Oui. Un peu."'}
T['day5_ending_true_24'] = {'name': 'Choi Yuna', 'text': '"...Moi aussi."'}
T['day5_ending_true_25'] = {'name': 'Moi', 'text': "*Yuna se tient \u00e0 c\u00f4t\u00e9 de moi et regarde le soleil couchant. Elle n'a pas essuy\u00e9 ses larmes. Moi non plus. La pluie s'est arr\u00eat\u00e9e. La lumi\u00e8re du soleil descend \u00e0 travers les nuages. Un vent charg\u00e9 de pluie souffle. Il fait chaud.*"}
T['day5_ending_true_subtitle'] = {'name': '', 'text': 'Dipl\u00f4me \u2014 De la salle de classe qui n\'a jamais dipl\u00f4m\u00e9, enfin.'}

# postcredit Korean entries
T['day5_postcredit_6'] = {'name': '???', 'text': '"La proposition de r\u00e9affectation du personnel a bien \u00e9t\u00e9 soumise\u00a0?"'}
T['day5_postcredit_7'] = {'name': 'Moi', 'text': "*L'\u00e9cran du moniteur change. Photos d'une nouvelle \u00e9cole. Nouveaux uniformes. Nouveaux noms. Le titre du fichier est visible. 'Programme de correction des \u00e9l\u00e8ves inadapt\u00e9s \u2014 Plan de mise en \u0153uvre ann\u00e9e 2'.*"}
T['day5_postcredit_8'] = {'name': 'Moi', 'text': "*...Un nouveau profil d'\u00e9l\u00e8ve transf\u00e9r\u00e9 appara\u00eet \u00e0 l'\u00e9cran. L'\u00e9l\u00e8ve sur la photo sourit. Un visage qui ne sait rien.*"}

# day5_ending_escape Korean entries
T['day5_ending_escape_5'] = {'name': 'Moi', 'text': '*Mais. Yuna est encore l\u00e0-bas.*'}
T['day5_ending_escape_6'] = {'name': 'Moi', 'text': "*Le visage de Yuna dans le sous-sol remonte. Son visage p\u00e2le. Un bras tatonn\u00e9 de marques d'injection. La voix tremblante qui m'appelait 'senpai'.*"}
T['day5_ending_escape_7'] = {'name': 'Moi', 'text': '*...Je n\'ai pas pu la sauver.*'}
T['day5_ending_escape_8'] = {'name': 'Moi', 'text': "*Cette culpabilit\u00e9... je dois la porter toute ma vie. Elle ne sera pas lav\u00e9e par la pluie.*"}
T['day5_ending_escape_9'] = {'name': 'Moi', 'text': "*Je me suis arr\u00eat\u00e9 et j'ai lev\u00e9 les yeux vers le ciel. La pluie se d\u00e9verse sur mon visage. Froid.*"}
T['day5_ending_escape_10'] = {'name': 'Moi', 'text': "*J'ai surviv\u00e9. J'ai surviv\u00e9. Est-ce que \u00e7a seul... suffit\u00a0? ...Ce n'est pas suffisant. Mais j'ai surviv\u00e9. Parce que j'ai surviv\u00e9, il y a des choses que je peux encore faire.*"}
T['day5_ending_escape_11'] = {'name': 'Moi', 'text': "*J'ai recommenc\u00e9 \u00e0 marcher. Dans la pluie.*"}
T['day5_ending_escape_ghost'] = {'name': '', 'text': '"...Je vous attendrai, senpai."'}
T['day5_ending_escape_subtitle'] = {'name': '', 'text': 'Survivant \u2014 Le poids de celui qui a v\u00e9cu.'}

# day5_ending_resist Korean entries
T['day5_ending_resist_5'] = {'name': 'Moi', 'text': "*L'\u00e9cole est visible en contrebas. Envelopp\u00e9e de brume. Irr\u00e9ellement. Comme un r\u00eave. ...Ce n'est pas un r\u00eave. Je me suis vraiment \u00e9chapp\u00e9.*"}
T['day5_ending_resist_6'] = {'name': 'Moi', 'text': "*La lumi\u00e8re scintille \u00e0 c\u00f4t\u00e9 de moi. Seolhwa est debout l\u00e0. Translucide dans la lumi\u00e8re de l'aube. ...Elle sourit. Un sourire qui n'est pas triste. Une expression que je n'ai jamais vue avant.*"}
T['day5_ending_resist_7'] = {'name': 'Lee Seolhwa', 'text': '"...Maintenant c\'est ton tour."'}
T['day5_ending_resist_8'] = {'name': 'Lee Seolhwa', 'text': '"Ne finis pas comme moi. Rentre... et vis."'}
T['day5_ending_resist_9'] = {'name': 'Moi', 'text': "*Le corps de Seolhwa commence \u00e0 se fondre dans la lumi\u00e8re de l'aube. Par les bords. En scintillant.*"}
T['day5_ending_resist_10'] = {'name': 'Lee Seolhwa', 'text': '"...Et parfois. Souviens-toi de moi."'}
T['day5_ending_resist_11'] = {'name': 'Moi', 'text': "*La silhouette de Seolhwa se fond compl\u00e8tement dans la lumi\u00e8re du matin et dispara\u00eet. Un unique p\u00e9tale de cerisier est rest\u00e9. Il fr\u00e9mit dans le vent... puis s'envole. ...Merci.*"}
T['day5_ending_resist_12'] = {'name': 'Moi', 'text': "*Ce n'est pas encore termin\u00e9. Yuna est encore l\u00e0-bas. J'ai les preuves. Il faut que \u00e7a soit r\u00e9v\u00e9l\u00e9. J'ai commenc\u00e9 \u00e0 descendre la colline derri\u00e8re l'\u00e9cole. L'aube se l\u00e8ve. Le chemin est visible.*"}
T['day5_ending_resist_subtitle'] = {'name': '', 'text': "\u00c9vasion inachev\u00e9e \u2014 Ce n'est pas encore termin\u00e9."}

# day5_ending_cage Korean entries
T['day5_ending_cage_5'] = {'name': 'Moi', 'text': '*Le m\u00eame matin. La m\u00eame salle de classe. Les m\u00eames cours.*'}
T['day5_ending_cage_6'] = {'name': 'Moi', 'text': "*...Je n'ai plus le compte du nombre de matins. Hier c'\u00e9tait pareil. Avant-hier aussi. Il y a trois jours, il y a une semaine, il y a un mois... tous le m\u00eame jour.*"}
T['day5_ending_cage_7'] = {'name': 'Moi', 'text': '*Mme Eunsu sourit. Sea sourit. Riin sourit. Tout le monde sourit. Je souris aussi.*'}
T['day5_ending_cage_8'] = {'name': 'Moi', 'text': "*...Naturellement. Les coins de mes l\u00e8vres se soul\u00e8vent sans effort. Je crois que \u00e7a me faisait peur avant... depuis quand \u00e7a ne me fait plus peur\u00a0?*"}
T['day5_ending_cage_9'] = {'name': 'Han Sea', 'text': '"{name}, j\'ai encore fait des saucisses de pieuvre aujourd\'hui."'}
T['day5_ending_cage_10'] = {'name': 'Moi', 'text': "*C'est bon. C'est bon tous les jours. Apr\u00e8s les cours. La salle du conseil \u00e9tudiant. On mange des g\u00e2teaux avec Sea en riant. Je ne me souviens pas de quoi on a parl\u00e9, mais... on a ri.*"}
T['day5_ending_cage_11'] = {'name': 'Moi', 'text': "*La nuit. Je m'endors. Pas de r\u00eaves. Le matin. J'ouvre les yeux.*"}
T['day5_ending_cage_12'] = {'name': 'Park Eunsu', 'text': '"Bonjour, {name}."'}
T['day5_ending_cage_13'] = {'name': 'Moi', 'text': '*...Le m\u00eame bonjour. Le m\u00eame sourire.*'}
T['day5_ending_cage_14'] = {'name': 'Moi', 'text': '*...Pourquoi est-ce que je souris\u00a0?*'}
T['day5_ending_cage_15'] = {'name': 'Moi', 'text': "*Il manque quelque chose. Il y a un trou dans ma m\u00e9moire. J'ai l'impression d'avoir oubli\u00e9 quelque chose. Quelque chose d'important. ...Le nom de quelqu'un. Une main transparente. Un p\u00e9tale de cerisier. Les mots '\u00e9chappe-toi'. ...C'\u00e9tait quoi\u00a0?*"}
T['day5_ending_cage_16'] = {'name': 'Moi', 'text': "*Quand j'essaie d'y penser, j'ai mal \u00e0 la t\u00eate. Laissons tomber. N'y pensons plus. C'est s\u00fbr ici. Parce que la professeure me prot\u00e8ge. ...Je souris aussi. Le m\u00eame sourire. Au m\u00eame angle.*"}
T['day5_ending_cage_subtitle'] = {'name': '', 'text': 'Cage \u2014 Une vie scolaire \u00e9ternelle.'}

# day5_ending_forget Korean entries
T['day5_ending_forget_6'] = {'name': 'Moi', 'text': "*J'ai ouvert les yeux. Je vois le plafond. Un plafond inconnu. ...Non, pas inconnu. C'est ma chambre.*"}
T['day5_ending_forget_7'] = {'name': 'Moi', 'text': "*...C'est le matin.*"}
T['day5_ending_forget_8'] = {'name': 'Moi', 'text': "*Je me suis lev\u00e9. Je m'\u00e9tire. Des fleurs de cerisier sont visibles par la fen\u00eatre. C'est beau.*"}
T['day5_ending_forget_9'] = {'name': 'Moi', 'text': "*Aujourd'hui est... mon premier jour de transfert.*"}
T['day5_ending_forget_10'] = {'name': 'Moi', 'text': "*Une nouvelle \u00e9cole. Une nouvelle classe. De nouveaux amis. Mon c\u0153ur bat la chamade. Un peu stressant, mais... aussi excitant. Quelles sortes de personnes y aura-t-il\u00a0?*"}
T['day5_ending_forget_11'] = {'name': 'Moi', 'text': "*J'ai enfl\u00e9 mon uniforme. Je me regarde dans le miroir.*"}
T['day5_ending_forget_12'] = {'name': 'Moi', 'text': "*Pour une raison que j'ignore... des larmes coulent. Pourquoi est-ce que je pleure\u00a0? Je ne suis pas triste. Rien n'est triste.*"}
T['day5_ending_forget_13'] = {'name': 'Moi', 'text': "*J'ai essuy\u00e9 mes larmes. Bizarre. Pourquoi ai-je pleur\u00e9. ...Ce doit \u00eatre mon \u00e9tat d'\u00e2me. Nerv\u00e9 parce que c'est le premier jour.*"}
T['day5_ending_forget_14'] = {'name': 'Moi', 'text': "*J'ai pris mon t\u00e9l\u00e9phone. Aucun nom dans les contacts. Une liste de contacts vide. ...C'\u00e9tait comme \u00e7a avant\u00a0? Et les amis de mon ancienne \u00e9cole\u00a0? ...O\u00f9 \u00e9tait mon ancienne \u00e9cole\u00a0? ...Je ne m'en souviens pas. C'est bien. Je me ferai de nouveaux amis.*"}
T['day5_ending_forget_15'] = {'name': 'Moi', 'text': "*J'ai ouvert la porte d'entr\u00e9e. Des p\u00e9tales de cerisier arrivent en volant. C'est beau. ...Pourquoi ma poitrine fait-elle mal quand je vois des p\u00e9tales de cerisier\u00a0?*"}
T['day5_ending_forget_ghost'] = {'name': '', 'text': '"Fuis"'}
T['day5_ending_forget_16'] = {'name': 'Moi', 'text': "*...J'ai cru entendre quelque chose. C'est mon imagination. Allons \u00e0 l'\u00e9cole.*"}
T['day5_ending_forget_sea_max'] = {'name': 'Moi', 'text': "*Une fille est debout devant le portail de l'\u00e9cole. Un sourire radieux. Un brassard de d\u00e9l\u00e9gu\u00e9e de classe.*"}
T['day5_ending_forget_sea_max_2'] = {'name': 'Han Sea', 'text': '"Salut\u00a0! Tu es l\'\u00e9l\u00e8ve qui a transf\u00e9r\u00e9 aujourd\'hui, non\u00a0? Je vais te montrer."'}
T['day5_ending_forget_sea_max_3'] = {'name': 'Moi', 'text': "*...Cette personne, j'ai l'impression de l'avoir vue quelque part. O\u00f9 \u00e9tait-ce\u00a0? ...Je ne me souviens pas.*"}
T['day5_ending_forget_sea_max_4'] = {'name': 'Han Sea', 'text': '"Viens par ici. ...{name}."'}
T['day5_ending_forget_subtitle'] = {'name': '', 'text': 'R\u00e9initialisation \u2014 Tout recommence depuis le d\u00e9but.'}

# day5_ending_ghost Korean entries
T['day5_ending_ghost_6'] = {'name': 'Moi', 'text': "*J'ai lev\u00e9 la main. Je l'ai soulevée. ...Elle est transparente. Entre mes doigts, les carreaux du couloir sont visibles.*"}
T['day5_ending_ghost_7'] = {'name': 'Moi', 'text': "*Je suis devenu comme Seolhwa. Je suis... un \u00eatre enchan\u00e9 \u00e0 cette \u00e9cole.*"}
T['day5_ending_ghost_8'] = {'name': 'Moi', 'text': "*J'ai essay\u00e9 de marcher. Aucun bruit de pas. Je passe devant des salles de classe. Des \u00e9l\u00e8ves sont assis \u00e0 l'int\u00e9rieur. Ils \u00e9tudient. Personne ne me regarde.*"}
T['day5_ending_ghost_9'] = {'name': 'Moi', 'text': "*Un \u00e9l\u00e8ve passe \u00e0 travers moi. Son bras a travers\u00e9 mon corps. Aucune sensation. ...Invisible. Inaudible. Intouchable.*"}
T['day5_ending_ghost_10'] = {'name': 'Moi', 'text': "*Mon nom. Quel \u00e9tait mon nom\u00a0? ...Je ne m'en souviens plus. Il aura \u00e9t\u00e9 effac\u00e9 du registre de pr\u00e9sence. Comme Seolhwa. Le temps passe. Je ne sais pas combien. Les saisons changent. Les cerisiers fleurissent et tombent.*"}
T['day5_ending_ghost_11'] = {'name': 'Moi', 'text': "*...Un nouvel \u00e9l\u00e8ve transf\u00e9r\u00e9 arrive.*"}
T['day5_ending_ghost_12'] = {'name': 'Moi', 'text': "*La porte de la salle de classe s'ouvre, et un visage inconnu entre. Une expression tendue. Des yeux excit\u00e9s. ...Moi aussi j'\u00e9tais comme \u00e7a au d\u00e9but.*"}
T['day5_ending_ghost_13'] = {'name': '???', 'text': '"Bonjour\u00a0! \u00c0 partir d\'aujourd\'hui je suis transf\u00e9r\u00e9 dans cette \u00e9cole..."'}
T['day5_ending_ghost_14'] = {'name': 'Moi', 'text': "*Mme Eunsu sourit et l'accueille. Sea agite la main. Riin sourit depuis l'infirmerie. Le m\u00eame sch\u00e9ma. Les m\u00eames sourires. Le m\u00eame pi\u00e8ge.*"}
T['day5_ending_ghost_15'] = {'name': 'Moi', 'text': "*...Cette fois, c'est \u00e0 moi d'avertir. Comme Seolhwa l'a fait pour moi. Je me suis approch\u00e9 de l'\u00e9l\u00e8ve transf\u00e9r\u00e9. J'ai essay\u00e9 de toucher son \u00e9paule avec une main invisible. Il ne le sent pas.*"}
T['day5_ending_ghost_whisper'] = {'name': '', 'text': '"Sors d\'ici"'}
T['day5_ending_ghost_16'] = {'name': 'Moi', 'text': "*J'ai essay\u00e9 de graver des mots dans la bo\u00eete de dialogue. Comme Seolhwa l'a fait. En texte fant\u00f4me. ...\u00c7a s'\u00e9crit. Tr\u00e8s petit. Faiblement.*"}
T['day5_ending_ghost_17'] = {'name': 'Moi', 'text': "*L'\u00e9l\u00e8ve transf\u00e9r\u00e9 a regard\u00e9 l'\u00e9cran. S'est arr\u00eat\u00e9 un instant. ...Et est pass\u00e9 \u00e0 autre chose. N'y a pas pr\u00eat\u00e9 attention. ...\u00c9videmment. Moi aussi j'\u00e9tais comme \u00e7a au d\u00e9but.*"}
T['day5_ending_ghost_18'] = {'name': 'Moi', 'text': "*Mais je continuerai. Chaque jour. Chaque instant. Jusqu'\u00e0 ce que cet enfant apprenne la v\u00e9rit\u00e9. Comme Seolhwa l'a fait pour moi. Comme elle n'a pas abandonn\u00e9. ...Je suis l\u00e0. Invisible, mais. Incapable d'obtenir mon dipl\u00f4me, mais. D'ici, je continuerai \u00e0 avertir.*"}
T['day5_ending_ghost_subtitle'] = {'name': '', 'text': 'R\u00e9manence \u2014 Les traces de celui qui n\'a jamais dipl\u00f4m\u00e9.'}

apply_translations('day5_night.json', T)
