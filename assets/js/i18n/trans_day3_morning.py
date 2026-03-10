import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day3_morning_3'] = {'name': 'Moi', 'text': "*Je n'ai pas pu dormir correctement apr\u00e8s m'\u00eatre r\u00e9veill\u00e9(e) aux premi\u00e8res heures du matin. Mes yeux sont secs.*"}
T['day3_morning_4'] = {'name': 'Moi', 'text': "*J'ai regard\u00e9 dans le miroir. Mon teint est mauvais. Des cernes sous les yeux.*"}
T['day3_morning_5'] = {'name': 'Moi', 'text': "*...Seulement 3 jours depuis le transfert et je suis d\u00e9j\u00e0 dans cet \u00e9tat.*"}
T['day3_morning_milk'] = {'name': 'Moi', 'text': "*J'ouvre le r\u00e9frig\u00e9rateur pour prendre le petit-d\u00e9jeuner et... quelque chose cloche. Le lait achet\u00e9 hier est l\u00e0. Mais sa position a chang\u00e9.*"}
T['day3_morning_milk_2'] = {'name': 'Moi', 'text': "*...C'est moi qui l'ai d\u00e9plac\u00e9 ? Je dois juste \u00eatre fatigu\u00e9(e). Je laisse couler.*"}
T['day3_morning_gate'] = {'name': 'Moi', 'text': "*Je suis arriv\u00e9(e) \u00e0 l'\u00e9cole.*"}
T['day3_morning_gate_2'] = {'name': 'Moi', 'text': "*Sea n'attend pas aujourd'hui.*"}
T['day3_morning_gate_3'] = {'name': 'Moi', 'text': "*...\u00c7a me d\u00e9range justement. Hier elle attendait m\u00eame 10 minutes en avance. Qu'est-ce qui est diff\u00e9rent aujourd'hui ?*"}
T['day3_morning_locker_4'] = {'name': 'Moi', 'text': "*Mais dans un coin, quelque chose... un fragment de photo ? Une photo d'identit\u00e9 coup\u00e9e en deux.*"}
T['day3_morning_photo'] = {'name': 'Moi', 'text': "*Seule la moiti\u00e9 d'un visage reste. Impossible de savoir qui c'est. ...Pourquoi cette photo a-t-elle \u00e9t\u00e9 coup\u00e9e ?*"}
T['day3_morning_photo_2'] = {'name': 'Moi', 'text': "*J'ai mis la photo dans ma poche. Pour une raison quelconque... \u00e7a me semblait mal de la jeter.*"}
T['day3_morning_seolhwa'] = {'name': 'Moi', 'text': "*Je me suis engag\u00e9(e) dans le couloir en direction de la classe.*"}
T['day3_morning_seolhwa_2'] = {'name': 'Moi', 'text': "*...Quelqu'un se tient debout au bout du couloir.*"}
T['day3_morning_seolhwa_3'] = {'name': 'Moi', 'text': "*Un visage p\u00e2le. Des yeux qui regardent dans le vide. Qui me regarde.*"}
T['day3_morning_seolhwa_4'] = {'name': 'Moi', 'text': "*C'est Seolhwa. J'en suis certain(e). Cette fois elle ne dispara\u00eet pas. Mon c\u0153ur bat vite. ...J'essaie de m'approcher.*"}
T['day3_morning_seolhwa_5'] = {'name': 'Moi', 'text': "*Un pas. Deux pas. \u00c0 chaque pas que je fais, le couloir semble s'allonger. Mes pas r\u00e9sonnent. La bouche de Seolhwa bouge.*"}
T['day3_morning_seolhwa_voice'] = {'name': 'Lee Seolhwa', 'text': "\"...N'approche pas.\""}
T['day3_morning_seolhwa_voice_2'] = {'name': 'Lee Seolhwa', 'text': "\"...Pas encore.\""}
T['day3_morning_seolhwa_gone'] = {'name': 'Moi', 'text': "*La premi\u00e8re fois que j'entends la voix de Seolhwa. Petite et tremblante, mais... claire. 'Pas encore' ?*"}
T['day3_morning_seolhwa_gone_2'] = {'name': 'Moi', 'text': "*J'ai clign\u00e9 des yeux et elle avait disparu. Je suis seul(e) dans le couloir. Personne.*"}
T['day3_morning_seolhwa_gone_3'] = {'name': 'Moi', 'text': "*...J'ai clairement entendu une voix l\u00e0. Elle a dit 'pas encore.' Qu'est-ce que \u00e7a veut dire ? Ne viens pas encore ? Alors quand ?*"}
T['day3_morning_cherry'] = {'name': 'Moi', 'text': "*Quelque chose par terre. L'endroit o\u00f9 Seolhwa se tenait. ...Un unique p\u00e9tale de cerisier.*"}
T['day3_morning_cherry_2'] = {'name': 'Moi', 'text': "*Je le ramasse et regarde. Un vrai p\u00e9tale de cerisier. Mais... ce n'est pas la saison des cerisiers. Il n'y a pas de cerisiers en fleurs sur le campus. D'o\u00f9 vient-il ?*"}
T['day3_morning_class_sea_2'] = {'name': 'Han Sea', 'text': "\"Bonjour, {name}. Tu es un peu en retard aujourd'hui ?\""}
T['day3_morning_class_sea_3'] = {'name': 'Moi', 'text': "\"Oh, un peu.\""}
T['day3_morning_class_reply'] = {'name': 'Moi', 'text': "*...Elle peut voir au premier coup d'\u0153il que je n'ai pas bien dormi ? Bah, avec des cernes pareils, bien s\u00fbr qu'elle peut.*"}
T['day3_morning_class_sea_sleep'] = {'name': 'Han Sea', 'text': "\"Tu as mauvaise mine. Tu n'as pas bien dormi cette nuit ?\""}
T['day3_morning_class_sea_sleep_2'] = {'name': 'Moi', 'text': "*...La professeure dit la m\u00eame chose.*"}
T['day3_morning_class_eunsu'] = {'name': 'Park Eunsu', 'text': "\"{name}, tu as l'air un peu fatigu\u00e9(e) aujourd'hui. Tu as bien dormi ?\""}
T['day3_morning_class_eunsu_2'] = {'name': 'Moi', 'text': "*J'imagine que mon visage a vraiment l'air aussi mauvais que \u00e7a.*"}
T['day3_morning_class_eunsu_reply'] = {'name': 'Moi', 'text': "\"J'ai un peu tourn\u00e9 et retourn\u00e9.\""}
T['day3_morning_class_eunsu_3'] = {'name': 'Professeure principale', 'text': "\"C'est \u00e7a ? Tu peux somnoler pendant le cours si tu manques de sommeil. C'est la premi\u00e8re semaine, c'est une p\u00e9riode d'adaptation.\""}
T['day3_morning_class_eunsu_4'] = {'name': 'Moi', 'text': "*La professeure sourit et se retourne. ...C'est gentil \u00e0 dire mais pour une raison ou une autre, \u00e7a met mal \u00e0 l'aise.*"}
T['day3_morning_pencil'] = {'name': 'Moi', 'text': "*Je m'assieds et ouvre le tiroir du bureau... la trousse que j'avais laiss\u00e9e hier a \u00e9t\u00e9 d\u00e9plac\u00e9e.*"}
T['day3_morning_pencil_2'] = {'name': 'Moi', 'text': "*Je l'avais clairement mise \u00e0 gauche, mais elle est \u00e0 droite maintenant. L'ordre des crayons \u00e0 l'int\u00e9rieur est diff\u00e9rent aussi.*"}
T['day3_morning_pencil_3'] = {'name': 'Moi', 'text': "*...Quelqu'un a fouill\u00e9 ? Ou le responsable du m\u00e9nage l'a touch\u00e9e ? ...C'est pas grand-chose, mais je me sens un peu mal \u00e0 l'aise.*"}

apply_translations('day3_morning.json', T)
