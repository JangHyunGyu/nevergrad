import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day3_after_riin_flicker'] = {'name': '', 'text': "Fuis"}
T['day3_after_sea_truth_3'] = {'name': 'Moi', 'text': "*Sea regarde par la fen\u00eatre. Longuement.*"}
T['day3_after_sea_truth_4'] = {'name': 'Han Sea', 'text': "\"...Parfois je me demande. Pourquoi je fais tout \u00e7a.\""}
T['day3_after_sea_truth_5'] = {'name': 'Moi', 'text': "*Sea s'arr\u00eate de parler et secoue la t\u00eate. On dirait qu'elle allait dire quelque chose et l'a raval\u00e9.*"}
T['day3_after_sea_truth_6'] = {'name': 'Han Sea', 'text': "\"...Laisse tomber. Oublie \u00e7a.\""}
T['day3_after_sea_truth_7'] = {'name': 'Moi', 'text': "*Sea sourit \u00e0 nouveau. Cette fois ses yeux sourient aussi. Mais ce moment tout \u00e0 l'heure... je sais que c'\u00e9tait pas du jeu.*"}
T['day3_after_eunsu_peek_4'] = {'name': 'Professeure principale', 'text': "\"...Tu regardais la feuille de pr\u00e9sence\u00a0?\""}
T['day3_after_eunsu_peek_5'] = {'name': 'Moi', 'text': "*Mme Eunsu sourit. Son caf\u00e9 \u00e0 la main. D\u00e9contract\u00e9e. ...Elle savait que je regardais. Non \u2014 **elle m'a laiss\u00e9(e) regarder**.*"}
T['day3_after_eunsu_peek_6'] = {'name': 'Professeure principale', 'text': "\"Quelle consciencieuse. C'est une liste que je g\u00e8re. Un suivi de l'int\u00e9gration des \u00e9l\u00e8ves transf\u00e9r\u00e9s, en quelque sorte.\""}
T['day3_after_eunsu_peek_7'] = {'name': 'Professeure principale', 'text': "\"...Tu as des questions\u00a0?\""}
T['day3_after_eunsu_ignore_3'] = {'name': 'Professeure principale', 'text': "\"C'est un tableau de suivi d'int\u00e9gration des \u00e9l\u00e8ves transf\u00e9r\u00e9s. J'ai \u00e9crit que {name}... s'adapte bien.\""}
T['day3_after_eunsu_ignore_4'] = {'name': 'Moi', 'text': "*Elle range les documents dans un tiroir. Naturellement. Mais les mots 'ton nom est l\u00e0 aussi' restent en m\u00e9moire.*"}

apply_translations('day3_afterschool.json', T)
