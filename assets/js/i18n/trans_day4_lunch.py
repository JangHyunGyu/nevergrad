import sys
sys.path.insert(0, 'assets/js/i18n')
from translate_helper import apply_translations

T = {}

T['day4_lunch_start_3'] = {'name': 'Moi', 'text': "*Yuna. Je dois retrouver Yuna. Je ne peux pas croire qu'elle aurait 'subitement transf\u00e9r\u00e9'.*"}
T['day4_lunch_start_4'] = {'name': 'Moi', 'text': "*Ou alors... l'infirmerie. Le m\u00e9dicament de Riin. Je dois savoir ce que c'est.*"}
T['day4_lunch_start_5'] = {'name': 'Moi', 'text': "*Il y a aussi le toit. Ce que Seolhwa a dit dans le r\u00eave. Il y a peut-\u00eatre des indices l\u00e0-bas.*"}
T['day4_lunch_search_7'] = {'name': 'Moi', 'text': "*Le casier de Yuna. Un autocollant avec son num\u00e9ro dessus. 'Choi Yuna'. L'autocollant est \u00e0 moiti\u00e9 d\u00e9coll\u00e9. Traces que quelqu'un a essay\u00e9 de l'arracher.*"}
T['day4_lunch_search_8'] = {'name': 'Moi', 'text': "*J'ai ouvert le casier. ...Vide. Ni sac, ni manuels, ni photos... Tout a disparu. Comme si personne ne l'avait jamais utilis\u00e9.*"}
T['day4_lunch_search_9'] = {'name': 'Moi', 'text': "*C'est propre. **Trop** propre. Pas un grain de poussi\u00e8re. Quelqu'un l'a 'rang\u00e9'. Il y a deux jours, Yuna me montrait des photos depuis ce casier. Ce casier qui \u00e9tait couvert de photos de chats... vide comme r\u00e9initialis\u00e9 en usine.*"}
T['day4_lunch_search_10'] = {'name': 'Moi', 'text': "*...Attends. Le fond du casier. La planche est l\u00e9g\u00e8rement soul\u00e9v\u00e9e. J'ai soulev\u00e9 le bord avec mon ongle. Un double fond.*"}
T['day4_lunch_search_11'] = {'name': 'Moi', 'text': "*Quelque chose est gliss\u00e9 dans l'espace. C'est l'appareil photo de Yuna. D\u00e9lib\u00e9r\u00e9ment cach\u00e9 sous la planche. Elle a calcul\u00e9 que celui qui a vid\u00e9 le casier ne d\u00e9monterait pas le fond. ...Laiss\u00e9 pour quelqu'un qui trouverait. C'est-\u00e0-dire, pour moi.*"}
T['day4_lunch_search_12'] = {'name': 'Moi', 'text': "*J'ai allum\u00e9 l'appareil photo. L'indicateur de batterie clignote. Presque vide. Une seule derni\u00e8re photo appara\u00eet \u00e0 l'\u00e9cran.*"}
T['day4_lunch_search_13'] = {'name': 'Moi', 'text': "*...Des escaliers descendant sous terre. Des escaliers sombres. Quelque part dans l'ancien b\u00e2timent. Un endroit qu'on ne peut pas voir.*"}
T['day4_lunch_search_14'] = {'name': 'Moi', 'text': "*Dans le coin de la photo, il y a une \u00e9criture \u00e0 la main. 'Ici en dessous \u2014 Yu'. Le dernier message de Yuna.*"}
T['day4_lunch_search_15'] = {'name': 'Moi', 'text': "*L'appareil s'est \u00e9teint. Batterie \u00e0 plat. ...Mais c'est suffisant.*"}
T['day4_lunch_search_16'] = {'name': 'Moi', 'text': "*Yuna n'a pas 'subitement transf\u00e9r\u00e9'. Yuna a d\u00e9couvert quelque chose, et alors \u2014*"}
T['day4_lunch_search_17'] = {'name': 'Moi', 'text': "*...Le sous-sol. Quelque part dans cette \u00e9cole il y a un sous-sol.*"}
T['day4_lunch_nurse_5'] = {'name': 'Moi', 'text': "*Un liquide transparent. Les graduations de la seringue sont pr\u00e9cis\u00e9ment calibr\u00e9es. Des gestes habitu\u00e9s.*"}
T['day4_lunch_nurse_6'] = {'name': 'Moi', 'text': "*...Elle s'arr\u00eate en me voyant. On voit ses \u00e9paules se figer.*"}
T['day4_lunch_nurse_7'] = {'name': 'Kang Riin', 'text': "\"...Tu m'as fait peur. Frappe avant d'entrer.\""}
T['day4_lunch_nurse_8'] = {'name': 'Moi', 'text': "*Elle range rapidement la seringue dans un tiroir. Sourit. Mais ses mains tremblent.*"}
T['day4_lunch_nurse_9'] = {'name': 'Kang Riin', 'text': "\"Qu'est-ce qui t'am\u00e8ne\u00a0? C'est l'heure du d\u00e9jeuner.\""}
T['day4_lunch_nurse_10'] = {'name': 'Moi', 'text': "\"...J'ai un peu mal \u00e0 la t\u00eate.\""}
T['day4_lunch_nurse_11'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin s'approche. Elle va poser sa main sur mon front. ...Cette main tenait une seringue il y a un instant. Qu'est-ce qu'elle y mettait\u00a0?*"}
T['day4_lunch_nurse_timer'] = {'name': 'Kang Riin', 'text': "\"Pas de fi\u00e8vre. La boisson d'hier, c'\u00e9tait comment\u00a0? ...Tu dors bien\u00a0?\"", 'choices': ["Demander des nouvelles de Yuna", "Ne rien dire"]}
T['day4_lunch_nurse_ask'] = {'name': 'Moi', 'text': "\"J'ai entendu que Yuna... avait subitement transf\u00e9r\u00e9. La nuit derni\u00e8re.\""}
T['day4_lunch_nurse_ask_2'] = {'name': 'Moi', 'text': "*L'expression de l'infirmi\u00e8re Riin a chang\u00e9 tr\u00e8s l\u00e9g\u00e8rement. 0,3 secondes. Tr\u00e8s bri\u00e8vement.*"}
T['day4_lunch_nurse_ask_3'] = {'name': 'Kang Riin', 'text': "\"...Yuna\u00a0? Ah, Choi Yuna. Je vois. C'\u00e9tait soudain.\""}
T['day4_lunch_nurse_ask_4'] = {'name': 'Moi', 'text': "\"Est-ce que Yuna est pass\u00e9e \u00e0 l'infirmerie hier\u00a0?\""}
T['day4_lunch_nurse_ask_5'] = {'name': 'Kang Riin', 'text': "\"...\""}
T['day4_lunch_nurse_ask_6'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin me regarde. Elle sourit, mais ses yeux ne sourient pas.*"}
T['day4_lunch_nurse_ask_7'] = {'name': 'Kang Riin', 'text': "\"...Pourquoi tu me fixe comme \u00e7a\u00a0? {name}, tu n'aurais pas des pens\u00e9es \u00e9tranges en ce moment\u00a0?\""}
T['day4_lunch_nurse_ask_8'] = {'name': 'Moi', 'text': "*Sa voix est devenue froide. Juste un instant. Puis s'est radoucie.*"}
T['day4_lunch_nurse_ask_9'] = {'name': 'Kang Riin', 'text': "\"Yuna va bien. Elle est rentr\u00e9e dans son ancienne \u00e9cole. Il n'y a pas de quoi s'inqui\u00e9ter.\""}
T['day4_lunch_nurse_ask_10'] = {'name': 'Moi', 'text': "*'Pas de quoi s'inqui\u00e9ter.' Mme Eunsu a dit la m\u00eame chose. Sea aussi. La main de l'infirmi\u00e8re Riin tremble \u00e0 nouveau. ...La main qui ferme l'armoire. Les flacons de m\u00e9dicaments s'entrechoquent \u00e0 l'int\u00e9rieur. Est-ce que cette personne se bat aussi contre quelque chose\u00a0? Ou bien... m'observe-t-elle\u00a0?*"}
T['day4_lunch_nurse_silent'] = {'name': 'Moi', 'text': "*Je n'ai rien dit. L'infirmi\u00e8re Riin m'observe tranquillement.*"}
T['day4_lunch_nurse_silent_2'] = {'name': 'Kang Riin', 'text': "\"...Je te donne un m\u00e9dicament\u00a0? Pour le mal de t\u00eate.\""}
T['day4_lunch_nurse_silent_3'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re sort des m\u00e9dicaments d'un tiroir. Deux comprim\u00e9s blancs. ...Est-ce que je peux les prendre\u00a0? Seolhwa avait dit : 'Ils ont donn\u00e9 un m\u00e9dicament. Un m\u00e9dicament pour effacer les souvenirs.'*"}
T['day4_lunch_nurse_silent_4'] = {'name': 'Moi', 'text': "\"\u00c7a va. Je crois que \u00e7a ira avec un peu de repos.\""}
T['day4_lunch_nurse_silent_5'] = {'name': 'Kang Riin', 'text': "\"...D'accord.\""}
T['day4_lunch_nurse_silent_6'] = {'name': 'Moi', 'text': "*L'infirmi\u00e8re Riin remet les m\u00e9dicaments dans le tiroir. Je vois la seringue qu'elle y avait mis tout \u00e0 l'heure. J'ai d\u00e9tourn\u00e9 les yeux. J'ai fait semblant de ne pas avoir vu. ...Mon c\u0153ur bat trop vite.*"}
T['day4_lunch_rooftop_6'] = {'name': 'Moi', 'text': "*Quelque chose est grav\u00e9 sous la rambarde. Des lettres grat\u00e9es comme avec un couteau. Rouill\u00e9es. On dirait que c'est vieux. 'Il n'y a qu'une seule sortie. \u2014 Lee Seolhwa'*"}
T['day4_lunch_rooftop_7'] = {'name': 'Moi', 'text': "*...Seolhwa a grav\u00e9 \u00e7a. Il y a un an. J'ai suivi les lettres du doigt. Elle a grav\u00e9 profond. Avec force. D\u00e9sesp\u00e9r\u00e9ment.*"}
T['day4_lunch_rooftop_8'] = {'name': 'Moi', 'text': "*'La sortie est unique.' ...Laquelle\u00a0? Une \u00e9vasion\u00a0? Ou... Il y a encore de plus petits mots en dessous. \u00c0 peine visibles. 'La r\u00e9ponse est dans le sous-sol'*"}
T['day4_lunch_rooftop_9'] = {'name': 'Moi', 'text': "*Le sous-sol. La photo de l'appareil de Yuna montrait aussi des escaliers descendant sous terre.*"}
T['day4_lunch_rooftop_10'] = {'name': 'Moi', 'text': "*Sur le sol du toit il y a un unique p\u00e9tale de cerisier. Qui fr\u00e9mit l\u00e9g\u00e8rement dans la brise. ...Ce n'est pas la saison des cerisiers. Je l'avais aussi vu le matin du 3\u00e8me jour dans le couloir.*"}
T['day4_lunch_rooftop_11'] = {'name': 'Moi', 'text': "*Les traces de Seolhwa. La preuve que Seolhwa \u00e9tait ici. M\u00eame quand tout le reste est effac\u00e9... \u00e7a reste. J'ai mis le p\u00e9tale de cerisier dans ma poche. ...J'avais l'impression de devoir l'emporter.*"}
T['day4_lunch_rooftop_12'] = {'name': 'Moi', 'text': "*...Le sous-sol. Je dois le trouver apr\u00e8s les cours. Ces escaliers que Yuna a photographi\u00e9s.*"}
T['day4_lunch_rooftop_13'] = {'name': 'Moi', 'text': "*Je descends en h\u00e2te.*"}
T['day4_lunch_ghost'] = {'name': '', 'text': "**\"Sous-sol\"**"}

apply_translations('day4_lunch.json', T)
