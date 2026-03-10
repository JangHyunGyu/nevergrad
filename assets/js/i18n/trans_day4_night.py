import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day4_night_phone_4'] = {'name': 'Moi', 'text': "*1 minute plus tard. Sea : 'Promis.'*"}
T['day4_night_phone_5'] = {'name': 'Moi', 'text': "*30 secondes plus tard. Sea : 'Promis.'*"}
T['day4_night_phone_6'] = {'name': 'Moi', 'text': "*15 secondes plus tard. Sea : 'Promis?????'*"}
T['day4_night_phone_7'] = {'name': 'Moi', 'text': "*...Le m\u00eame message qui se r\u00e9p\u00e8te. Les intervalles entre les horodatages se raccourcissent.*"}
T['day4_night_phone_8'] = {'name': 'Moi', 'text': "*Sea : 'Je t'attends demain matin devant le portail'*"}
T['day4_night_phone_9'] = {'name': 'Moi', 'text': "*Sea : 'Tu dois venir' Sea : 'Absolument'*"}
T['day4_night_phone_10'] = {'name': 'Moi', 'text': "*...Je ne les ai pas lus. J'ai retourn\u00e9 le t\u00e9l\u00e9phone. Il continue de vibrer. Tap. Tap. Tap.*"}
T['day4_night_phone_11'] = {'name': 'Moi', 'text': "*Un message de Mme Eunsu aussi. Mme Eunsu : 'Est-ce que tu pourrais venir un peu plus t\u00f4t demain\u00a0? J'ai quelque chose \u00e0 te dire.'*"}
T['day4_night_phone_12'] = {'name': 'Moi', 'text': "*Mme Eunsu : 'Il y a quelque chose que je veux te dire, {name}. C'est important.' ...Quelque chose d'important. Quoi\u00a0? Au sujet du 'Traitement Final'\u00a0? J'ai mis le t\u00e9l\u00e9phone dans un tiroir. Les vibrations bourdonnent \u00e0 l'int\u00e9rieur.*"}
T['day4_night_plan_4'] = {'name': 'Moi', 'text': "*Deux. Mme Eunsu supervise tout. S\u00e9lection des \u00e9l\u00e8ves transf\u00e9r\u00e9s, gestion, d\u00e9cision du Traitement Final.*"}
T['day4_night_plan_5'] = {'name': 'Moi', 'text': "*Trois. Riin s'occupe des m\u00e9dicaments. M\u00e9dicament de manipulation des souvenirs. S\u00e9datifs. Injections.*"}
T['day4_night_plan_6'] = {'name': 'Moi', 'text': "*Quatre. Sea est une observatrice. Elle s'approche des \u00e9l\u00e8ves transf\u00e9r\u00e9s et fait des rapports sur leurs comportements. Mais... Sea elle-m\u00eame est aussi pi\u00e9g\u00e9e dans cette \u00e9cole.*"}
T['day4_night_plan_7'] = {'name': 'Moi', 'text': "*Cinq. Yuna est une r\u00e9sistante interne. Elle collectait des preuves. Elle a \u00e9t\u00e9 d\u00e9couverte et emprisonn\u00e9e dans le sous-sol.*"}
T['day4_night_plan_8'] = {'name': 'Moi', 'text': "*Six. Seolhwa \u00e9tait le Sujet #7, il y a un an. Elle a r\u00e9sist\u00e9 \u00e0 l'exp\u00e9rience et a \u00e9t\u00e9 'trait\u00e9e'. Elle est devenue un fant\u00f4me.*"}
T['day4_night_plan_9'] = {'name': 'Moi', 'text': "*Sept. Je suis le Sujet #13. Le 5\u00e8me jour est le dernier. Demain.*"}
T['day4_night_plan_10'] = {'name': 'Moi', 'text': "*J'ai pos\u00e9 le stylo. Mes mains tremblent et l'\u00e9criture est toute de travers.*"}
T['day4_night_plan_11'] = {'name': 'Moi', 'text': "*...Demain. Demain c'est le 5\u00e8me jour. Le 'dernier jour' dont Seolhwa m'avait pr\u00e9venu.*"}
T['day4_night_plan_12'] = {'name': 'Moi', 'text': "*Qu'est-ce que je dois faire\u00a0?*"}
T['day4_night_plan_13'] = {'name': 'Moi', 'text': "*Je pr\u00e9pare mon plan final.*"}
T['day4_night_plan_escape_2'] = {'name': 'Moi', 'text': "*Le portail principal est hors de question. Je suis surveill\u00e9(e). L'appli de s\u00e9curit\u00e9 \u2014 g\u00e9olocalisation GPS. Le portail \u2014 Mme Eunsu le surveille. La sortie de secours de l'ancien b\u00e2timent\u00a0? Yuna sait peut-\u00eatre quelque chose. Si j'ai sauv\u00e9 Yuna... on peut partir ensemble.*"}
T['day4_night_plan_escape_3'] = {'name': 'Moi', 'text': "*J'ai sauvegard\u00e9 les preuves sur mon t\u00e9l\u00e9phone. Une fois dehors, j'appelle directement la police.*"}
T['day4_night_plan_expose_2'] = {'name': 'Moi', 'text': "*Le probl\u00e8me c'est les communications. Le wifi de l'\u00e9cole est probablement surveill\u00e9. Les donn\u00e9es... l'appli de s\u00e9curit\u00e9 les monitore peut-\u00eatre aussi. Il faudrait sortir et utiliser un wifi public... ou copier sur une cl\u00e9 USB et la remettre \u00e0 quelqu'un.*"}
T['day4_night_plan_confront_2'] = {'name': 'Moi', 'text': "*...Je sais que c'est t\u00e9m\u00e9raire. Mais Sea, Riin, peut-\u00eatre m\u00eame Mme Eunsu... est-ce qu'ils ne voudraient pas aussi s'extirper de cette situation\u00a0? Ou peut-\u00eatre que c'est de la na\u00efvet\u00e9 de ma part.*"}
T['day4_night_sleep'] = {'name': 'Moi', 'text': "*...J'ai fait mon plan. Je ne sais pas si c'est le bon. Mais ne rien faire m'amm\u00e8nera \u00e0 finir comme Seolhwa.*"}
T['day4_night_sleep_2'] = {'name': 'Moi', 'text': "*J'ai \u00e9teint la lumi\u00e8re et me suis allong\u00e9(e). Il n'y a aucune chance que je dorme. Je fixe le plafond. L'horloge tic-taque.*"}
T['day4_night_sleep_3'] = {'name': 'Moi', 'text': "*...Je ne sais pas quand j'ai fini par m'endormir.*"}
T['day4_night_seolhwa_12'] = {'name': 'Moi', 'text': "*Le m\u00eame sourire. Le m\u00eame ton. ...Un script inchang\u00e9 apr\u00e8s un an. L'aiguille entre. Un liquide froid se r\u00e9pand dans les veines. La vision se trouble. La sc\u00e8ne change.*"}
T['day4_night_seolhwa_13'] = {'name': 'Moi', 'text': "*La salle des profs. Eunsu range des documents. Seolhwa \u2014 moi \u2014 est debout devant la porte. \u00c0 observer en secret. Je vois le titre du document. 'Sujet #7 \u2014 Rapport Final'*"}
T['day4_night_seolhwa_14'] = {'name': 'Moi', 'text': "*Le contenu est lisible. Les mots sont flous. \u00c0 cause des m\u00e9dicaments. Mais ils s'incrustent dans mon esprit.*"}
T['day4_night_seolhwa_15'] = {'name': 'Moi', 'text': "*\"Protocole de Reconstruction de la M\u00e9moire ver.3.8... Sujet #7 Lee Seolhwa...\"*"}
T['day4_night_seolhwa_16'] = {'name': 'Moi', 'text': "*\"Progression normale jusqu'au Jour 4... Jour 5 ██\u00c9CHEC██...\"*"}
T['day4_night_seolhwa_17'] = {'name': 'Moi', 'text': "*\"Effet inverse constat\u00e9. Le sujet a au contraire conserv\u00e9 ██tous les souvenirs██... R\u00e9sistance aux m\u00e9dicaments confirm\u00e9e...\"*"}
T['day4_night_seolhwa_18'] = {'name': 'Moi', 'text': "*\"Confinement jug\u00e9 impossible... **Jour 5, 23h00 : Ex\u00e9cution du Traitement Final**...\" ...Traitement Final. Le corps de Seolhwa sait ce que \u00e7a signifie. La terreur s'engouffre. La terreur de Seolhwa devient la mienne. La sc\u00e8ne change encore.*"}
T['day4_night_seolhwa_19'] = {'name': 'Moi', 'text': "*Le sous-sol. Les n\u00e9ons clignotent. Attach\u00e9(e) \u00e0 une chaise. Les sangles en cuir enserrent les poignets. Eunsu est debout. Son expression... est la m\u00eame qu'aujourd'hui. Fatigue et complexit\u00e9.*"}
T['day4_night_seolhwa_20'] = {'name': 'Professeure principale', 'text': "\"Pardon, Seolhwa.\""}
T['day4_night_seolhwa_21'] = {'name': 'Moi', 'text': "*Eunsu fait un pas vers moi.*"}
T['day4_night_seolhwa_22'] = {'name': 'Professeure principale', 'text': "\"...Je ferai en sorte que \u00e7a ne fasse pas mal. Une fois que c'est fini, tu te sentiras \u00e0 l'aise.\""}
T['day4_night_seolhwa_23'] = {'name': 'Moi', 'text': "*Depuis derri\u00e8re Eunsu, Riin s'approche en tenant une seringue.*"}
T['day4_night_seolhwa_24'] = {'name': 'Professeure principale', 'text': "\"Ce sera rapide. Garde juste les yeux ferm\u00e9s. ...Fais confiance \u00e0 ta professeure.\""}
T['day4_night_seolhwa_25'] = {'name': 'Moi', 'text': "*Seolhwa \u2014 moi \u2014 a cri\u00e9. Mais aucune voix ne sort. La seringue touche le bras. Froide. Le liquide entre. La vision blanchit. Blanche. Blanche. ...Et puis l'obscurit\u00e9.*"}
T['day4_night_seolhwa_26'] = {'name': 'Moi', 'text': "*...De la lumi\u00e8re filtre \u00e0 travers l'obscurit\u00e9. Seolhwa est debout l\u00e0. Une expression que je n'avais jamais vue. Triste, mais... des yeux r\u00e9solus. Des yeux qui ont pris leur d\u00e9cision. Des mains transparentes serr\u00e9es en poings. La lumi\u00e8re brille entre les doigts.*"}
T['day4_night_seolhwa_27'] = {'name': 'Lee Seolhwa', 'text': "\"...Tu comprends maintenant\u00a0?\""}
T['day4_night_seolhwa_28'] = {'name': 'Lee Seolhwa', 'text': "\"Tout ce qui m'est arriv\u00e9.\""}
T['day4_night_seolhwa_29'] = {'name': 'Moi', 'text': "*La voix de Seolhwa est claire. On est dans un r\u00eave, mais... c'est une vraie voix.*"}
T['day4_night_seolhwa_30'] = {'name': 'Lee Seolhwa', 'text': "\"Le 5\u00e8me jour, 23h. C'est \u00e0 ce moment-l\u00e0 qu'ils font le 'Traitement Final'.\""}
T['day4_night_seolhwa_31'] = {'name': 'Lee Seolhwa', 'text': "\"Il m'est arriv\u00e9 la m\u00eame chose. La nuit du 5\u00e8me jour... c'\u00e9tait fini.\""}
T['day4_night_seolhwa_32'] = {'name': 'Moi', 'text': "*Seolhwa me regarde. Des yeux s\u00e9rieux.*"}
T['day4_night_seolhwa_33'] = {'name': 'Lee Seolhwa', 'text': "\"**Demain soir.** C'est le temps qu'il te reste, {name}.\""}
T['day4_night_seolhwa_34'] = {'name': 'Lee Seolhwa', 'text': "\"...Prot\u00e8ge Yuna. Yuna... ne doit pas finir comme moi.\""}
T['day4_night_seolhwa_35'] = {'name': 'Moi', 'text': "*Les l\u00e8vres de Seolhwa tremblent. Elle retient ses larmes.*"}
T['day4_night_seolhwa_36'] = {'name': 'Lee Seolhwa', 'text': "\"...Et.\""}
T['day4_night_seolhwa_37'] = {'name': 'Moi', 'text': "*Seolhwa essaie de prendre ma main. Sa main transparente passe \u00e0 travers la mienne. \u00c7a ne s'attrape pas.*"}
T['day4_night_seolhwa_38'] = {'name': 'Lee Seolhwa', 'text': "\"Ancien b\u00e2timent, 3\u00e8me \u00e9tage. La sortie de secours. ...C'est le chemin que j'avais trouv\u00e9.\""}
T['day4_night_seolhwa_39'] = {'name': 'Lee Seolhwa', 'text': "\"Je n'ai pas r\u00e9ussi \u00e0 passer par ce chemin... mais toi tu peux, {name}.\""}
T['day4_night_seolhwa_40'] = {'name': 'Moi', 'text': "*La silhouette de Seolhwa commence \u00e0 se disperser comme des parasites depuis les bords.*"}
T['day4_night_seolhwa_41'] = {'name': 'Lee Seolhwa', 'text': "\"...Sors vivant(e).\""}
T['day4_night_seolhwa_42'] = {'name': 'Moi', 'text': "*Seolhwa a souri. Un dernier sourire. Sans larmes, r\u00e9solument. La lumi\u00e8re se disperse. Seolhwa se disperse. Le r\u00eave se disperse.*"}
T['day4_night_wake'] = {'name': 'Moi', 'text': "*Les yeux s'ouvrent. Tremp\u00e9(e) de sueur froide. L'oreiller est mouill\u00e9.*"}
T['day4_night_wake_2'] = {'name': 'Moi', 'text': "*L'horloge. 3h41 du matin. Mon c\u0153ur a l'air de remonter jusqu'\u00e0 ma gorge.*"}
T['day4_night_wake_3'] = {'name': 'Moi', 'text': "*C'\u00e9tait un r\u00eave. Mais... ce n'\u00e9tait pas un r\u00eave. J'ai ressenti directement la terreur de Seolhwa. Le froid de la seringue. Le serrement des sangles en cuir. La signification du 'Traitement Final'.*"}
T['day4_night_wake_4'] = {'name': 'Moi', 'text': "***Demain soir \u00e0 23h. Je dois sortir de cette \u00e9cole avant \u00e7a.***"}
T['day4_night_wake_5'] = {'name': 'Moi', 'text': "*Ancien b\u00e2timent, sortie de secours du 3\u00e8me \u00e9tage. Le chemin que Seolhwa avait trouv\u00e9.*"}
T['day4_night_wake_6'] = {'name': 'Moi', 'text': "*...J'ai pr\u00e9par\u00e9 mon sac. Les preuves. Le t\u00e9l\u00e9phone. Le chargeur. Le minimum. ...Demain. Le dernier jour.*"}

apply_translations('day4_night.json', T)
