import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day2_lunch_sea_1'] = {'name': 'Han Sea', 'text': "\u00ab\u00a0J'ai encore pr\u00e9par\u00e9 le d\u00e9jeuner aujourd'hui. J'ai remarqu\u00e9 que tu avais beaucoup aim\u00e9 l'omelette hier, alors j'en ai mis davantage.\u00a0\u00bb"}
T['day2_lunch_sea_5'] = {'name': 'Moi', 'text': "\u00ab\u00a0...Tu t'es lev\u00e9(e) \u00e0 quelle heure pour pr\u00e9parer tout \u00e7a ?\u00a0\u00bb"}
T['day2_lunch_sea_6'] = {'name': 'Han Sea', 'text': "\u00ab\u00a0\u00c7a me rend heureuse quand tu manges tout. Ne laisse rien.\u00a0\u00bb"}
T['day2_lunch_sea_7'] = {'name': 'Moi', 'text': "*Sea sourit. Mais quelque chose me tracasse. C'est vrai que j'ai beaucoup mang\u00e9 l'omelette hier. Mais comment s'en souvient-elle aussi pr\u00e9cis\u00e9ment ? Jusqu'aux portions ?*"}
T['day2_lunch_sea_8'] = {'name': 'Moi', 'text': "*...Elle doit juste \u00eatre observatrice. C'est la d\u00e9l\u00e9gu\u00e9e, apr\u00e8s tout.*"}
T['day2_lunch_sea_9'] = {'name': 'Moi', 'text': "*On a parl\u00e9 de plein de choses en mangeant. Musique, jeux, films...*"}
T['day2_lunch_sea_10'] = {'name': 'Moi', 'text': "*Sea me tend un \u00e9couteur. Une douce m\u00e9lodie joue. ...Partager les \u00e9couteurs nous rapproche naturellement. Les cheveux de Sea sentent le shampoing.*"}
T['day2_lunch_sea_11'] = {'name': 'Han Sea', 'text': "\u00ab\u00a0...C'est bien, non ?\u00a0\u00bb"}
T['day2_lunch_sea_12'] = {'name': 'Moi', 'text': "\u00ab\u00a0Ouais, c'est bien.\u00a0\u00bb"}
T['day2_lunch_sea_13'] = {'name': 'Han Sea', 'text': "\u00ab\u00a0...{name}, tu passes du temps avec beaucoup d'autres gens en dehors de moi ?\u00a0\u00bb"}
T['day2_lunch_sea_14'] = {'name': 'Moi', 'text': "\u00ab\u00a0\u00c7a ne fait que deux jours, alors...\u00a0\u00bb"}
T['day2_lunch_sea_15'] = {'name': 'Moi', 'text': "*Sea saisit doucement le dos de ma main. Doux, mais... des doigts qui n'ont aucune intention de l\u00e2cher prise.*"}
T['day2_lunch_sea_16'] = {'name': 'Han Sea', 'text': "\u00ab\u00a0...O\u00f9 que soit {name}, quoi que tu fasses, je le saurai toujours. C'est \u00e7a l'amiti\u00e9.\u00a0\u00bb"}
T['day2_lunch_sea_17'] = {'name': 'Moi', 'text': "*Sea l'a dit doucement. Elle sourit. Mais si ses yeux sourient aussi... je n'arrive pas vraiment \u00e0 le dire. Quand j'ai essay\u00e9 de retirer doucement ma main, Sea l'a serr\u00e9e plus fort. ...Puis l\u00e2ch\u00e9e naturellement une seconde apr\u00e8s, en souriant.*"}
T['day2_lunch_sea_18'] = {'name': 'Han Sea', 'text': "\u00ab\u00a0...Je plaisante. Je veux juste dire que je t'aime bien, {name}.\u00a0\u00bb"}
T['day2_lunch_sea_19'] = {'name': 'Moi', 'text': "*C'\u00e9tait quoi \u00e7a ? ...C'est juste une amie proche qui blaguait, probablement.*"}

T['day2_lunch_yuna_1'] = {'name': 'Moi', 'text': "*J'entre dans la biblioth\u00e8que pour trouver Yuna qui bricole un appareil photo \u00e0 un bureau.*"}
T['day2_lunch_yuna_4'] = {'name': 'Moi', 'text': "\u00ab\u00a0C'est vraiment bien rendu. La composition est super.\u00a0\u00bb"}
T['day2_lunch_yuna_5'] = {'name': 'Moi', 'text': "*La colline, le gymnase, le terrain... De belles photos. Beaucoup de cad\u00e0ges o\u00f9 la lumi\u00e8re est tomb\u00e9e \u00e0 merveille.*"}
T['day2_lunch_yuna_6'] = {'name': 'Yuna', 'text': "\u00ab\u00a0Vraiment ?! La lumi\u00e8re \u00e9tait belle aujourd'hui. C'est la plus jolie heure de la journ\u00e9e.\u00a0\u00bb"}
T['day2_lunch_yuna_7'] = {'name': 'Moi', 'text': "\u00ab\u00a0T'as pris le chat aussi. Un tigr\u00e9 ?\u00a0\u00bb"}
T['day2_lunch_yuna_8'] = {'name': 'Yuna', 'text': "\u00ab\u00a0Oui ! Je lui ai donn\u00e9 une bo\u00eete de thon aujourd'hui et il a ador\u00e9. Regarde cette expression.\u00a0\u00bb"}
T['day2_lunch_yuna_9'] = {'name': 'Moi', 'text': "*Je continue de faire d\u00e9filer les photos... mais plus j'avance, plus le ton change. Une pile de documents devant la salle des profs. L'armoire \u00e0 m\u00e9dicaments de l'infirmerie. Un escalier descendant sous terre.*"}
T['day2_lunch_yuna_10'] = {'name': 'Moi', 'text': "\u00ab\u00a0Celle-l\u00e0... c'est pas une photo de paysage.\u00a0\u00bb"}
T['day2_lunch_yuna_11'] = {'name': 'Yuna', 'text': "\u00ab\u00a0Oh, c'\u00e9tait... un accident. Je vais l'effacer.\u00a0\u00bb"}
T['day2_lunch_yuna_12'] = {'name': 'Moi', 'text': "*Yuna ferme l'appareil photo \u00e0 la h\u00e2te. La fille qui \u00e9tait si heureuse \u00e0 parler du chat un moment plus t\u00f4t est soudainement devenue rigide.*"}
T['day2_lunch_yuna_13'] = {'name': 'Yuna', 'text': "\u00ab\u00a0Senpai... tu reviendras demain, n'est-ce pas ? ...S'il te pla\u00eet, reviens.\u00a0\u00bb"}
T['day2_lunch_yuna_14'] = {'name': 'Moi', 'text': "*Il y avait du poids dans \u00ab s'il te pla\u00eet \u00bb. ...Pourquoi aussi s\u00e9rieux ?*"}

T['day2_lunch_riin_1'] = {'name': 'Moi', 'text': "*Je vais \u00e0 l'infirmerie et l'infirmi\u00e8re Riin m'accueille comme si elle m'attendait.*"}
T['day2_lunch_riin_4'] = {'name': 'Moi', 'text': "*Elle enroule le brassard de tension autour de mon bras. Les mains de Riin sont froides. Mais d'une douceur inattendue.*"}
T['day2_lunch_riin_5'] = {'name': 'Kang Riin', 'text': "\u00ab\u00a0Tension art\u00e9rielle normale. Vision... les deux yeux sont bons. Poids... en bonne sant\u00e9 pour ton \u00e2ge.\u00a0\u00bb"}
T['day2_lunch_riin_6'] = {'name': 'Kang Riin', 'text': "\u00ab\u00a0Bien. ...Mais j'ai quelques questions de plus. Le formulaire de transfert est un peu d\u00e9taill\u00e9.\u00a0\u00bb"}
T['day2_lunch_riin_7'] = {'name': 'Kang Riin', 'text': "\u00ab\u00a0Ton rythme de sommeil ? Tu dors combien d'heures en moyenne ? Tu r\u00eaves souvent ?\u00a0\u00bb"}
T['day2_lunch_riin_8'] = {'name': 'Moi', 'text': "\u00ab\u00a07 heures environ. Des r\u00eaves... parfois ?\u00a0\u00bb"}
T['day2_lunch_riin_9'] = {'name': 'Kang Riin', 'text': "\u00ab\u00a0Des allergies m\u00e9dicamenteuses ? C\u00f4t\u00e9 s\u00e9datifs ?\u00a0\u00bb"}
T['day2_lunch_riin_10'] = {'name': 'Moi', 'text': "*Pour un bilan de sant\u00e9, les questions sont un peu d\u00e9taill\u00e9es. Est-ce qu'une infirmi\u00e8re scolaire pose vraiment des questions sur les habitudes de sommeil et les allergies aux s\u00e9datifs ?*"}
T['day2_lunch_riin_11'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin \u00e9crit quelque chose. \u00c7a ressemble \u00e0 un dossier de sant\u00e9... mais le formulaire semble un peu diff\u00e9rent des formes habituelles.*"}
T['day2_lunch_riin_12'] = {'name': 'Kang Riin', 'text': "\u00ab\u00a0Voil\u00e0, c'est fait. Tu es en bonne sant\u00e9. Pas de probl\u00e8me.\u00a0\u00bb"}
T['day2_lunch_riin_13'] = {'name': 'Kang Riin', 'text': "\u00ab\u00a0...Viens me voir souvent \u00e0 l'avenir. Je prendrai bien soin de toi.\u00a0\u00bb"}
T['day2_lunch_riin_14'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin sourit et me tient la porte. Elle est bienveillante.*"}

T['day2_lunch_rooftop_1'] = {'name': 'Moi', 'text': "*Je monte les escaliers pour aller sur le toit quand j'entends une voix depuis le palier interm\u00e9diaire.*"}
T['day2_lunch_rooftop_4'] = {'name': 'Moi', 'text': "*De quoi parle-t-elle ? De qui ? Quand j'ai fait du bruit, la professeure a raccroch\u00e9 rapidement. Son expression s'est fig\u00e9e un instant quand elle s'est retourn\u00e9e, puis s'est imm\u00e9diatement d\u00e9tendue.*"}
T['day2_lunch_rooftop_5'] = {'name': 'Professeure principale', 'text': "\u00ab\u00a0{name} ? ...Tu vas sur le toit ? Tu aurais pu manger en classe.\u00a0\u00bb"}
T['day2_lunch_rooftop_6'] = {'name': 'Moi', 'text': "\u00ab\u00a0Je voulais prendre l'air.\u00a0\u00bb"}
T['day2_lunch_rooftop_7'] = {'name': 'Professeure principale', 'text': "\u00ab\u00a0Bien s\u00fbr, prendre l'air c'est bien. Mais ne t'approche pas de la rambarde. C'est dangereux.\u00a0\u00bb"}
T['day2_lunch_rooftop_8'] = {'name': 'Moi', 'text': "*La professeure a souri et est pass\u00e9e. C'\u00e9tait probablement juste un appel de boulot. ...Mais que veut dire \u00ab proc\u00e9der comme pr\u00e9vu \u00bb ?*"}
T['day2_lunch_rooftop_9'] = {'name': 'Moi', 'text': "*J'ai atteint le toit. Le vent souffle. Un peu plus froid qu'hier.*"}
T['day2_lunch_rooftop_10'] = {'name': 'Moi', 'text': "*Pas envie d'y r\u00e9fl\u00e9chir. Je vais juste profiter de la brise.*"}

apply_translations('day2_lunch.json', T)
