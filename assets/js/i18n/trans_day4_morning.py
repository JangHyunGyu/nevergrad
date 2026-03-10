import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day4_morning_start_4'] = {'name': 'Moi', 'text': "*Je me regarde dans le miroir. Mon visage est p\u00e2le. Les cernes sous les yeux sont profonds. Je ressemble \u00e0 quelqu'un d'autre compar\u00e9 \u00e0 il y a trois jours.*"}
T['day4_morning_start_5'] = {'name': 'Moi', 'text': "*...Je dois aller \u00e0 l'\u00e9cole. Non, je dois\u00a0? Qu'est-ce qui se passe si je n'y vais pas\u00a0? Mme Eunsu viendra me chercher\u00a0? Sea me contactera\u00a0?*"}
T['day4_morning_start_6'] = {'name': 'Moi', 'text': "*...L'appli de s\u00e9curit\u00e9. La g\u00e9olocalisation. Ils savent peut-\u00eatre d\u00e9j\u00e0 o\u00f9 je suis.*"}
T['day4_morning_start_7'] = {'name': 'Moi', 'text': "*Je dois y aller. Ne pas y aller les rendrait encore plus m\u00e9fiants. Je dois aussi retrouver Yuna.*"}
T['day4_morning_start_8'] = {'name': 'Moi', 'text': "*Mes mains tremblent en enfilant l'uniforme. ...J'ai serr\u00e9 le poing pour arr\u00eater le tremblement.*"}
T['day4_morning_start_9'] = {'name': 'Moi', 'text': "*...Je dois aller \u00e0 l'\u00e9cole.*"}
T['day4_morning_commute'] = {'name': 'Moi', 'text': "*Le chemin vers l'\u00e9cole. Mes pas sont lourds.*"}
T['day4_morning_commute_2'] = {'name': 'Moi', 'text': "*Jusqu'hier, ce chemin \u00e9tait joli avec ses cerisiers en fleurs. Aujourd'hui... on dirait un chemin vers un cimeti\u00e8re.*"}
T['day4_morning_commute_3'] = {'name': 'Moi', 'text': "*C'est exag\u00e9r\u00e9. Non\u00a0? ...J'esp\u00e8re que c'est exag\u00e9r\u00e9.*"}
T['day4_morning_gate_4'] = {'name': 'Moi', 'text': "*Tout le monde sourit. Le m\u00eame sourire exact. Les coins de la bouche relev\u00e9s au m\u00eame angle. Comme si c'\u00e9tait r\u00e9p\u00e9t\u00e9.*"}
T['day4_morning_gate_5'] = {'name': 'Moi', 'text': "*...C'\u00e9tait toujours comme \u00e7a\u00a0? C'\u00e9tait d\u00e9j\u00e0 comme \u00e7a le premier jour\u00a0? Ma m\u00e9moire... n'est pas s\u00fbre.*"}
T['day4_morning_gate_6'] = {'name': 'Moi', 'text': "*Mme Eunsu est debout devant le portail. ...Pourquoi la professeure est-elle au portail\u00a0? Normalement elle est dans la salle des profs.*"}
T['day4_morning_eunsu_3'] = {'name': 'Professeure principale', 'text': "\"Est-ce que je peux te tenir la main\u00a0? Je t'am\u00e8nerai \u00e0 l'\u00e9cole en toute s\u00e9curit\u00e9.\""}
T['day4_morning_eunsu_4'] = {'name': 'Moi', 'text': "*La professeure tend la main. Elle sourit. Un sourire chaleureux. ...Ce sourire \u00e9tait-il toujours aussi effrayant\u00a0?*", 'choices': ["Prendre sa main", "Dire que \u00e7a va"]}
T['day4_morning_eunsu_comply_2'] = {'name': 'Professeure principale', 'text': "\"Allez, on y va.\""}
T['day4_morning_eunsu_comply_3'] = {'name': 'Moi', 'text': "*La professeure prend ma main et m'am\u00e8ne jusqu'\u00e0 la classe. ...Escorte ou convoyage, impossible de dire.*"}
T['day4_morning_eunsu_refuse_3'] = {'name': 'Professeure principale', 'text': "\"Mais {name}, il vaut mieux ne pas se promener seul dans cette \u00e9cole.\""}
T['day4_morning_eunsu_refuse_4'] = {'name': 'Professeure principale', 'text': "\"...**C'est dangereux.**\""}
T['day4_morning_classroom_4'] = {'name': 'Moi', 'text': "*...Personne ne s'en pr\u00e9occupe. L'\u00e9l\u00e8ve \u00e0 c\u00f4t\u00e9 regarde bla\u00e7amment la place vide de Yuna puis d\u00e9tourne les yeux.*"}
T['day4_morning_classroom_5'] = {'name': 'Moi', 'text': "\"Yuna n'est pas venue...\""}
T['day4_morning_sea_4'] = {'name': 'Moi', 'text': "*Transf\u00e9r\u00e9e subitement\u00a0? La nuit derni\u00e8re\u00a0? Yuna n'avait jamais dit une chose pareille... Hier Yuna m'avait donn\u00e9 une carte m\u00e9moire. Elle avait dit que 'des \u00e9l\u00e8ves transf\u00e9r\u00e9s avaient disparu'. Quelqu'un qui a dit \u00e7a se serait subitement transf\u00e9r\u00e9\u00a0?*"}
T['day4_morning_sea_5'] = {'name': 'Han Sea', 'text': "\"Ne t'inqui\u00e8te pas pour \u00e7a. Tu m'as, moi, {name}.\""}
T['day4_morning_sea_6'] = {'name': 'Moi', 'text': "*Sea sourit. ...Ce sourire est particuli\u00e8rement froid aujourd'hui.*"}
T['day4_morning_class_5'] = {'name': 'Professeure principale', 'text': "\"Mais vouloir quitter cette \u00e9cole... c'est comme jeter une part de soi-m\u00eame.\""}
T['day4_morning_class_6'] = {'name': 'Professeure principale', 'text': "\"N'est-ce pas, **{name}\u00a0?**\""}
T['day4_morning_class_7'] = {'name': 'Moi', 'text': "*...La professeure ne regarde que moi. Tous les regards de la classe sont braqu\u00e9s sur moi. 30 paires d'yeux. Toutes souriantes. Toutes avec le m\u00eame sourire.*"}
T['day4_morning_class_8'] = {'name': 'Moi', 'text': "\"...Oui.\""}
T['day4_morning_class_9'] = {'name': 'Moi', 'text': "*Ce seul mot a \u00e0 peine r\u00e9ussi \u00e0 sortir de ma bouche. La professeure sourit avec satisfaction. ...Je veux sortir de cette classe. Tout de suite.*"}

apply_translations('day4_morning.json', T)
