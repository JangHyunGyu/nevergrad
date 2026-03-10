import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day3_lunch_note'] = {'name': 'Moi', 'text': "*'Senpai, merci de venir sur le toit \u00e0 l'heure du d\u00e9jeuner. Viens seul(e). - Yuna'*"}
T['day3_lunch_note_2'] = {'name': 'Moi', 'text': "*...L'atmosph\u00e8re semble grave. Qu'est-ce que je fais\u00a0?*"}
T['day3_lunch_choice'] = {'name': 'Moi', 'text': "*C'est l'heure du d\u00e9jeuner.*", 'choices': ["Aller sur le toit", "Manger avec Sea", "Passer \u00e0 l'infirmerie", "Rester en classe"]}
T['day3_lunch_rooftop_6'] = {'name': 'Moi', 'text': "*...! Soudain, la porte du toit se referme avec un BANG.*"}
T['day3_lunch_sea'] = {'name': 'Han Sea', 'text': "\"Tu manges avec moi aujourd'hui\u00a0? J'ai fait particuli\u00e8rement attention au repas.\""}
T['day3_lunch_sea_2'] = {'name': 'Moi', 'text': "*Sea sourit. ...Mais ce sourire est diff\u00e9rent d'hier. Un sourire qui cache quelque chose.*"}
T['day3_lunch_sea_3'] = {'name': 'Han Sea', 'text': "\"...Tu vois souvent Yuna ces derniers temps\u00a0?\""}
T['day3_lunch_sea_4'] = {'name': 'Moi', 'text': "\"Yuna\u00a0? Pas vraiment.\""}
T['day3_lunch_sea_5'] = {'name': 'Han Sea', 'text': "\"...Ah bon\u00a0?\""}
T['day3_lunch_sea_6'] = {'name': 'Han Sea', 'text': "\"Tu ne me caches rien, {name}\u00a0?\""}
T['day3_lunch_sea_7'] = {'name': 'Moi', 'text': "*Ses yeux ne sourient pas. J'en suis certain(e). ...C'est la premi\u00e8re fois que j'ai peur de cette personne.*"}
T['day3_lunch_sea_8'] = {'name': 'Han Sea', 'text': "\"...Je plaisantais. Mange.\""}
T['day3_lunch_riin'] = {'name': 'Moi', 'text': "*Je suis all\u00e9(e) \u00e0 l'infirmerie. J'ai mal \u00e0 la t\u00eate, probablement \u00e0 cause du r\u00eave de la nuit derni\u00e8re.*"}
T['day3_lunch_riin_2'] = {'name': 'Kang Riin', 'text': "\"Tu n'as pas bonne mine\u00a0? Tu n'as pas bien dormi l\u00e0 aussi\u00a0?\""}
T['day3_lunch_riin_3'] = {'name': 'Kang Riin', 'text': "\"Aujourd'hui, sp\u00e9cialement... tu veux que je te donne la boisson sant\u00e9 que j'ai pr\u00e9par\u00e9e\u00a0? C'est un m\u00e9lange de vitamines et d'herbes.\""}
T['day3_lunch_riin_4'] = {'name': 'Moi', 'text': "*Elle me tend une tasse remplie d'un liquide violet p\u00e2le. ...Une vague odeur m\u00e9dicinale.*"}
T['day3_lunch_riin_choice'] = {'name': 'Moi', 'text': "*Je la bois\u00a0?*", 'choices': ["Je la bois", "Je refuse"]}
T['day3_lunch_riin_drink'] = {'name': 'Moi', 'text': "*Je l'ai bue. ...Le go\u00fbt est correct, mais une amertume reste sur le bout de la langue.*"}
T['day3_lunch_riin_drink_2'] = {'name': 'Kang Riin', 'text': "\"Bien. L'effet se fera sentir rapidement.\""}
T['day3_lunch_riin_refuse'] = {'name': 'Kang Riin', 'text': "\"...D'accord, je n'insisterai pas.\""}
T['day3_lunch_riin_refuse_2'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin reprend la tasse avec un air d\u00e9\u00e7u.*"}
T['day3_lunch_alone'] = {'name': 'Moi', 'text': "*Je reste en classe et mange seul(e). Les autres \u00e9l\u00e8ves sont tous sortis et la salle est vide.*"}
T['day3_lunch_alone_2'] = {'name': 'Moi', 'text': "*...Je regarde vers l'arri\u00e8re. Le bureau de Seolhwa. Il y a quelque chose dessus. Des mots \u00e9crits au crayon. Flous mais lisibles.*"}
T['day3_lunch_alone_3'] = {'name': 'Moi', 'text': "*'Sors d'ici'*"}
T['day3_lunch_alone_4'] = {'name': 'Moi', 'text': "*...Qui a \u00e9crit \u00e7a\u00a0? Une blague\u00a0? ...Il y a des traces d'effacement. On dirait que \u00e7a a \u00e9t\u00e9 \u00e9crit et effac\u00e9 plusieurs fois.*"}

apply_translations('day3_lunch.json', T)
