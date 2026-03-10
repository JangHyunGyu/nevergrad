import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day2_night_phone_1'] = {'name': 'Moi', 'text': "*Je v\u00e9rifie \u00e0 nouveau mon t\u00e9l\u00e9phone.*"}
T['day2_night_phone_2'] = {'name': 'Moi', 'text': "*Le groupe de mon ancienne \u00e9cole. Le message que j'ai envoy\u00e9 hier... affichait 'Lu par 0', mais maintenant il dit 'Lu par 3'.*"}
T['day2_night_phone_3'] = {'name': 'Moi', 'text': "*Donc ils l'ont lu. Mais personne n'a r\u00e9pondu. ...Ils doivent \u00eatre occup\u00e9s.*"}
T['day2_night_phone_4'] = {'name': 'Moi', 'text': "*J'ai envoy\u00e9 un message priv\u00e9 \u00e0 Minsu. 'Hé Minsu, j'ai transf\u00e9r\u00e9, pourquoi t'as pas donn\u00e9 de nouvelles lol'*"}
T['day2_night_phone_5'] = {'name': 'Moi', 'text': "*10 minutes plus tard.*", 'messengerDelay': 5000, 'messengerTypingName': 'Minsu'}
T['day2_night_phone_6'] = {'name': 'Moi', 'text': "*...Pourquoi il tape aussi longtemps ? Ce mec r\u00e9pond normalement en une seconde.*"}
T['day2_night_phone_7'] = {'name': 'Moi', 'text': "*5 secondes. L'indicateur de frappe continue de clignoter. Il \u00e9crit un message long ?*"}
T['day2_night_phone_8'] = {'name': 'Moi', 'text': "*La r\u00e9ponse est arriv\u00e9e.*"}
T['day2_night_phone_9'] = {'name': 'Moi', 'text': "*Minsu : 'Ouais \u00e7a va. C'est comment l\u00e0-bas ?'*"}
T['day2_night_phone_10'] = {'name': 'Moi', 'text': "*...C'est quoi \u00e7a. J'ai demand\u00e9 pourquoi il n'avait pas donn\u00e9 de nouvelles, mais il ignore \u00e7a et dit juste 'c'est comment l\u00e0-bas ?'?*"}
T['day2_night_phone_11'] = {'name': 'Moi', 'text': "*C'est vraiment Minsu ? Normalement il dirait 'hé l'idiot lmaooo finalement tu r\u00e9ponds' avec une s\u00e9rie de jurons.*"}
T['day2_night_phone_12'] = {'name': 'Moi', 'text': "*'\u00c7a va.' ...C'est ce qu'il a choisi apr\u00e8s 5 secondes de frappe ?*"}

T['day2_night_msg_1'] = {'name': 'Moi', 'text': "*Il y a un message de Sea.*"}
T['day2_night_msg_2'] = {'name': 'Moi', 'text': "*Sea : 'Merci pour aujourd'hui. D'\u00eatre venu dans la salle du conseil \u00e9tudiant.'*"}
T['day2_night_msg_3'] = {'name': 'Moi', 'text': "*Sea : 'On mange encore ensemble demain !'*"}
T['day2_night_msg_4'] = {'name': 'Moi', 'text': "*Sea : '...\u00catre avec {name}, c'est bien.'*"}
T['day2_night_msg_5'] = {'name': 'Moi', 'text': "*...Le troisi\u00e8me message. 'C'est bien.' Est-ce juste de la gentillesse, ou \u00e7a veut dire autre chose. ...Peut-\u00eatre les deux.*"}
T['day2_night_msg_6'] = {'name': 'Moi', 'text': "*J'envoie une r\u00e9ponse. 'Moi aussi j'ai pass\u00e9 une bonne journ\u00e9e. \u00c0 demain.'*"}
T['day2_night_msg_7'] = {'name': 'Moi', 'text': "*Sea : '\u2661' ...Un c\u0153ur. Elle est vraiment audacieuse.*"}

T['day2_night_sleep_1'] = {'name': 'Moi', 'text': "*Je m'allonge et regarde le plafond.*"}
T['day2_night_sleep_2'] = {'name': 'Moi', 'text': "*L'histoire des contacts de mon ancienne \u00e9cole me tracasse un peu, mais... bah, \u00e7a s'arrangera demain. Je ferme les yeux. Fatigu\u00e9. Ma conscience se brouille.*"}

T['day2_night_dream_1'] = {'name': 'Moi', 'text': "*...Je marche dans un couloir sombre.*"}
T['day2_night_dream_7'] = {'name': 'Moi', 'text': "*Quelqu'un se tient debout au bout du couloir. Un visage p\u00e2le. Des yeux qui regardent dans le vide. De longs cheveux noirs.*"}
T['day2_night_dream_8'] = {'name': 'Moi', 'text': "*...La fille du fond de la classe ? Seolhwa ?*"}
T['day2_night_dream_9'] = {'name': 'Moi', 'text': "*Je m'approche. Un pas, deux pas. Mes pas r\u00e9sonnent. Sa bouche bouge.*"}
T['day2_night_dream_10'] = {'name': '???', 'text': "\"...Souviens-toi... de moi...\""}
T['day2_night_dream_11'] = {'name': 'Moi', 'text': "*J'ai tendu la main. Presque \u00e0 port\u00e9e. Juste au moment o\u00f9 mes doigts allaient toucher\u2014*"}
T['day2_night_dream_12'] = {'name': 'Moi', 'text': "*Ma vision s'obscurcit comme si le sol s'effondrait. Je tombe. Sans fin.*"}

T['day2_night_wake_1'] = {'name': 'Moi', 'text': "*...! Je me suis r\u00e9veill\u00e9(e) tremp\u00e9(e) de sueur. Mon c\u0153ur bat \u00e0 tout rompre.*"}
T['day2_night_wake_2'] = {'name': 'Moi', 'text': "*Je regarde l'horloge. 3 h 47 du matin.*"}
T['day2_night_wake_3'] = {'name': 'Moi', 'text': "*Un r\u00eave. Juste un r\u00eave. ...N'est-ce pas ?*"}
T['day2_night_wake_4'] = {'name': 'Moi', 'text': "*...Mais pourquoi le visage de Seolhwa reste-t-il aussi vivace dans mon esprit ?*"}
T['day2_night_wake_5'] = {'name': 'Moi', 'text': "*Je bois un verre d'eau et me recouche. Le sommeil ne vient pas facilement.*"}

apply_translations('day2_night.json', T)
