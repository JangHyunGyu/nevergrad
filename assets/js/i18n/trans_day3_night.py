import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day3_night_start_2'] = {'name': 'Moi', 'text': "*...Attends. La serrure de la porte d'entr\u00e9e \u00e9tait bizarre. Je l'avais clairement ferm\u00e9e en partant ce matin... j'ai d\u00fb tourner une fois de plus avant qu'elle s'ouvre\u00a0?*"}
T['day3_night_start_3'] = {'name': 'Moi', 'text': "*...La serrure doit juste avoir un probl\u00e8me. Cet appartement est un peu vieux.*"}
T['day3_night_start_4'] = {'name': 'Moi', 'text': "*En mangeant le d\u00eener, j'essaie de passer en revue les \u00e9v\u00e9nements de la journ\u00e9e.*"}
T['day3_night_start_5'] = {'name': 'Moi', 'text': "*Le casier graft\u00e9. La photo d'identit\u00e9 coup\u00e9e en deux. Seolhwa dans le couloir. Les mots 'pas encore'. Le p\u00e9tale de cerisier.*"}
T['day3_night_start_6'] = {'name': 'Moi', 'text': "*La carte m\u00e9moire de Yuna. L'histoire des \u00e9l\u00e8ves transf\u00e9r\u00e9s qui ont disparu. La porte du toit verrouill\u00e9e.*"}
T['day3_night_start_7'] = {'name': 'Moi', 'text': "*La jalousie de Sea. Le m\u00e9dicament de Riin. Les documents d'Eunsu. ...Trop. C'est difficile \u00e0 croire qu'autant de choses se soient pass\u00e9es en seulement 3 jours.*"}
T['day3_night_sea_msg'] = {'name': 'Moi', 'text': "*Mon t\u00e9l\u00e9phone vibre. C'est Sea.*"}
T['day3_night_sea_msg_2'] = {'name': 'Moi', 'text': "*Sea : '{name}, c'\u00e9tait bien aujourd'hui\u00a0! On y va ensemble demain aussi\u00a0\u2665'*"}
T['day3_night_sea_msg_3'] = {'name': 'Moi', 'text': "*Une minute plus tard. Sea : 'R\u00e9ponds avant de dormir'*"}
T['day3_night_sea_msg_4'] = {'name': 'Moi', 'text': "*Trois minutes plus tard. Sea : '...'*"}
T['day3_night_sea_msg_5'] = {'name': 'Moi', 'text': "*Deux minutes plus tard. Sea : '{name}\u00a0?'*"}
T['day3_night_sea_msg_6'] = {'name': 'Moi', 'text': "*Sea : 'Pourquoi tu lis pas\u00a0?'*"}
T['day3_night_sea_msg_7'] = {'name': 'Moi', 'text': "*Sea : 'Tu dors... c'est \u00e7a\u00a0?'*"}
T['day3_night_sea_msg_8'] = {'name': 'Moi', 'text': "*...6 messages en 13 minutes. Les messages s'accumulent sans \u00eatre lus.*"}
T['day3_night_sea_msg_9'] = {'name': 'Moi', 'text': "*J'ai retourn\u00e9 le t\u00e9l\u00e9phone face contre la table. Il vibre. Un autre. ...Je l'ignore.*"}
T['day3_night_recall_5'] = {'name': 'Moi', 'text': "*...C'est \u00e9trange. Mes souvenirs d'avant mon arriv\u00e9e dans cette \u00e9cole sont... flous.*"}
T['day3_night_recall_6'] = {'name': 'Moi', 'text': "*Pourquoi ai-je transf\u00e9r\u00e9 ici\u00a0? Je disais que c'\u00e9tait \u00e0 cause du travail de mes parents... mais quel travail\u00a0?*"}
T['day3_night_recall_7'] = {'name': 'Moi', 'text': "*Mes parents\u00a0? Le contact... quand les ai-je contact\u00e9s pour la derni\u00e8re fois\u00a0? ...Je... ne m'en souviens pas.*"}
T['day3_night_recall_8'] = {'name': 'Moi', 'text': "*Les visages de mes anciens amis d'\u00e9cole\u00a0? ...Minsu. Le visage de Minsu est... flou. Il \u00e9tait encore net hier.*"}
T['day3_night_recall_9'] = {'name': 'Moi', 'text': "*...C'est quoi \u00e7a. Pourquoi je ne me souviens plus\u00a0?*"}
T['day3_night_stat_crack_3'] = {'name': 'Moi', 'text': "*...Quelque chose ne va pas. Ce sentiment n'est pas de 'l'affection'. C'est...*"}
T['day3_night_stat_crack_4'] = {'name': 'Moi', 'text': "*...De la peur\u00a0?*"}
T['day3_night_stat_crack_5'] = {'name': 'Moi', 'text': "*Pourquoi j'ai peur\u00a0? Pourquoi je tremble en ce moment\u00a0?*"}
T['day3_night_nightmare_9'] = {'name': 'Moi', 'text': "*Je cours. Je suis \u00e0 bout de souffle. Mes jambes sont lourdes. Je ne dois pas regarder en arri\u00e8re. Surtout pas regarder en arri\u00e8re.*"}
T['day3_night_nightmare_10'] = {'name': '???', 'text': "\"\u00c7a ne fait pas mal. \u00c7a ne fait pas mal. \u00c7a ne fait pas mal. \u00c7anefaitpasmal\u00e7anefaitpasmal\u00e7anefait...*"}
T['day3_night_nightmare_11'] = {'name': 'Moi', 'text': "*...Cul-de-sac. Un mur.*"}
T['day3_night_nightmare_12'] = {'name': 'Moi', 'text': "*Je me retourne... Trois ombres se tiennent l\u00e0. Elles sourient. Toutes les trois avec le m\u00eame sourire.*"}
T['day3_night_nightmare_13'] = {'name': 'Moi', 'text': "*Jusqu'hier je trouvais ce sourire 'chaleureux'.*"}
T['day3_night_nightmare_14'] = {'name': 'Moi', 'text': "*Les ombres s'approchent. Pas apr\u00e8s pas. Il n'y a nulle part o\u00f9 fuir.*"}
T['day3_night_seolhwa_5'] = {'name': 'Moi', 'text': "*La voix de Seolhwa tremble. Mais elle est claire. Pour la premi\u00e8re fois elle parle en vraies phrases.*"}
T['day3_night_seolhwa_6'] = {'name': 'Lee Seolhwa', 'text': "\"Au d\u00e9but tout allait bien. La professeure \u00e9tait gentille, Sea me souriait, l'infirmi\u00e8re Riin me pr\u00e9parait du th\u00e9.\""}
T['day3_night_seolhwa_7'] = {'name': 'Lee Seolhwa', 'text': "\"...Tout \u00e9tait chaleureux. Je croyais que cette \u00e9cole \u00e9tait un paradis.\""}
T['day3_night_seolhwa_8'] = {'name': 'Moi', 'text': "*Seolhwa marque une pause. Elle essuie ses larmes. Sa main est transparente.*"}
T['day3_night_seolhwa_9'] = {'name': 'Lee Seolhwa', 'text': "\"...C'\u00e9tait tous des mensonges. Tout.\""}
T['day3_night_seolhwa_10'] = {'name': 'Lee Seolhwa', 'text': "\"Ils m'ont donn\u00e9... un m\u00e9dicament... pour effacer les souvenirs... chaque jour... petit \u00e0 petit...\""}
T['day3_night_seolhwa_11'] = {'name': 'Lee Seolhwa', 'text': "\"...Je ne l'ai pas... aval\u00e9. J'ai... cach\u00e9 le m\u00e9dicament. Pour prot\u00e9ger mes souvenirs...\""}
T['day3_night_seolhwa_12'] = {'name': 'Lee Seolhwa', 'text': "\"Et alors...\""}
T['day3_night_seolhwa_13'] = {'name': 'Moi', 'text': "*Seolhwa regarde sa propre main. La main est transparente. Les carreaux du couloir sont visibles \u00e0 travers ses doigts.*"}
T['day3_night_seolhwa_14'] = {'name': 'Lee Seolhwa', 'text': "\"**...Je suis devenue comme \u00e7a.**\""}
T['day3_night_seolhwa_15'] = {'name': 'Lee Seolhwa', 'text': "\"Personne ne peut me voir. Personne ne se souvient de mon nom. J'ai \u00e9t\u00e9 effac\u00e9e de la feuille de pr\u00e9sence aussi.\""}
T['day3_night_seolhwa_16'] = {'name': 'Lee Seolhwa', 'text': "\"...Je ne sais m\u00eame pas si je suis morte ou vivante. Je suis juste... li\u00e9e ici.\""}
T['day3_night_seolhwa_17'] = {'name': 'Moi', 'text': "*Seolhwa me regarde. Des yeux mouill\u00e9s de larmes qui me fixent droit dans les yeux.*"}
T['day3_night_seolhwa_18'] = {'name': 'Lee Seolhwa', 'text': "\"Ne fais pas confiance \u00e0 ces gens. **Cinq jours.** Le temps qu'il te reste.\""}
T['day3_night_seolhwa_19'] = {'name': 'Lee Seolhwa', 'text': "\"**Dans cinq jours... tu dois sortir d'ici.** Avant de finir comme moi.\""}
T['day3_night_seolhwa_20'] = {'name': 'Lee Seolhwa', 'text': "\"...Et, {name}.\""}
T['day3_night_seolhwa_21'] = {'name': 'Lee Seolhwa', 'text': "\"Souviens-toi... de moi.\""}
T['day3_night_seolhwa_22'] = {'name': 'Lee Seolhwa', 'text': "\"Personne ne se souvient. Ici. Pas m\u00eame qu'une personne comme moi ait exist\u00e9.\""}
T['day3_night_seolhwa_23'] = {'name': 'Moi', 'text': "*La silhouette de Seolhwa commence \u00e0 se dissoudre. Devenant transparente depuis les bords. Elle a souri une derni\u00e8re fois. Triste, mais... le premier sourire que j'ai vu d'elle. Le mot 'cinq jours' et le dernier sourire de Seolhwa ne veulent pas quitter mon esprit.*"}
T['day3_night_wakeup_4'] = {'name': 'Moi', 'text': "*Le nom Seolhwa. Il \u00e9tait clairement sur la feuille de pr\u00e9sence... non, il n'y \u00e9tait pas.*"}
T['day3_night_wakeup_5'] = {'name': 'Moi', 'text': "*Une main transparente. Des larmes. 'Cinq jours.'*"}
T['day3_night_wakeup_6'] = {'name': 'Moi', 'text': "*...Ce n'est pas juste un r\u00eave. Quelque chose m'avertit.*"}
T['day3_night_wakeup_7'] = {'name': 'Moi', 'text': "*'Sortir en cinq jours.' ...De cette \u00e9cole\u00a0? ...Ou de tout \u00e7a\u00a0?*"}
T['day3_night_wakeup_8'] = {'name': 'Moi', 'text': "*Je sors le fragment de photo que j'ai ramass\u00e9 tout \u00e0 l'heure. La photo d'identit\u00e9 coup\u00e9e en deux. ...Le propri\u00e9taire de cette photo a-t-il aussi \u00e9t\u00e9 'trait\u00e9'\u00a0?*"}
T['day3_night_wakeup_9'] = {'name': 'Moi', 'text': "*Qu'est-ce que je fais \u00e0 partir de demain\u00a0?*"}
T['day3_night_investigate_3'] = {'name': 'Moi', 'text': "*...Je dois tout relier. Demain. D'une fa\u00e7on ou d'une autre.*"}
T['day3_night_deny_3'] = {'name': 'Moi', 'text': "*J'ai remont\u00e9 la couverture et ferm\u00e9 les yeux.*"}
T['day3_night_ghost_msg'] = {'name': '', 'text': "Est-ce que \u00e7a va vraiment aller\u00a0?"}

apply_translations('day3_night.json', T)
