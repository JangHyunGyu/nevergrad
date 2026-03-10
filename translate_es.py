#!/usr/bin/env python3
"""
Translate Korean text remaining in ES JSON files using EN source files.
Detects Korean characters and replaces text/name/choices with Spanish translations.
"""
import json
import re
import os

EN_DIR = r"C:\workspace\nevergrad\assets\js\i18n\en"
ES_DIR = r"C:\workspace\nevergrad\assets\js\i18n\es"

KOREAN_RE = re.compile(r'[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]')

def has_korean(text):
    if not isinstance(text, str):
        return False
    return bool(KOREAN_RE.search(text))

def translate_name(name_en):
    """Map EN name to ES name."""
    mapping = {
        "Me": "Yo",
        "Han Sea": "Han Sea",
        "Lee Seolhwa": "Lee Seolhwa",
        "Choi Yuna": "Choi Yuna",
        "Kang Riin": "Kang Riin",
        "Park Eunsu": "Park Eunsu",
        "Homeroom Teacher": "Tutora",
        "Riin": "Riin",
        "Yuna": "Yuna",
        "Girl A": "Chica A",
        "Boy B": "Chico B",
        "Boy next seat": "Chico del asiento de al lado",
        "???": "???",
        "": "",
    }
    return mapping.get(name_en, name_en)

def translate_text(text_en):
    """Translate EN narration/dialogue to Spanish. Returns text_en unchanged if already handled."""
    # Name references
    t = text_en
    # Replace Me/I with Yo where it's a name field — handled separately
    return t

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

# Manual translation overrides for specific keys that have known ES translations
# Format: {filename: {key: {field: translated_value}}}
# These are the entries where the ES file still has Korean text

OVERRIDES = {}

def add(filename, key, **kwargs):
    if filename not in OVERRIDES:
        OVERRIDES[filename] = {}
    OVERRIDES[filename][key] = kwargs

# ============================================================
# day1_morning.json
# ============================================================
add("day1_morning", "day1_opening_4", text="*Desde hoy soy estudiante de esta escuela.*")
add("day1_morning", "day1_opening_5", text="*...Una transferencia. Es la primera vez. Fue inevitable por el trabajo de mis padres, pero sinceramente estoy un poco ansioso.*")
add("day1_morning", "day1_opening_6", text="*Con los amigos del colegio anterior me mantengo en contacto por redes sociales. Así son las cosas hoy en día.*")
add("day1_morning", "day1_opening_7", text="*Un pétalo de cerezo me roza la punta de la nariz. ...Qué bonito. Lo tomamos como buen augurio.*")
add("day1_morning", "day1_gate_1", text="*Estoy de pie frente a la desconocida entrada de la escuela.*")
add("day1_morning", "day1_gate_2", text="*Es una escuela bastante grande. El edificio está limpio y el patio es amplio. Las instalaciones parecen mejores que las de mi antigua escuela.*")
add("day1_morning", "day1_gate_3", text="*Los estudiantes pasan por la entrada en pequeños grupos. Una escena matutina perfectamente normal: risas y charlas.*")
add("day1_morning", "day1_gate_4", text="*...Nadie me presta atención. Claro. Aún nadie me conoce.*")
add("day1_morning", "day1_gate_5", text="*El corazón me late con fuerza. Nueva escuela, nuevos amigos... Ojalá solo pasen cosas buenas.*")
add("day1_morning", "day1_hallway_2", text="*Camino por el pasillo. No sé a dónde ir.*")
add("day1_morning", "day1_hallway_3", text="*Aunque miro el mapa, no encuentro el aula. Edificio de primero... edificio de segundo... ¿edificio principal? ¿anexo?*")
add("day1_morning", "day1_hallway_4", text="*Pienso en preguntarle a algún estudiante que pase, pero todos van con prisa.*")
add("day1_morning", "day1_sea_meet_1", text="*Perderme el primer día. Por eso me cansa cambiar de colegio.*")
add("day1_morning", "day1_sea_meet_2", name="???", text="\"Oye, ¿eres la nueva? Me dijeron que venías hoy.\"")
add("day1_morning", "day1_sea_meet_3", text="*Me doy la vuelta. Hay una chica de aspecto pulcro de pie.*")
add("day1_morning", "day1_sea_meet_4", text="*Pelo corto, uniforme impecable. Una insignia de delegada de clase en el pecho.*")
add("day1_morning", "day1_sea_meet_5", text="*Sonríe con naturalidad. Da buena impresión.*")
add("day1_morning", "day1_sea_meet_6", name="Han Sea", text="\"Soy Han Sea. Delegada de clase. Tú eres {name}, ¿verdad?\"")
add("day1_morning", "day1_sea_meet_7", text="\"Ah, sí... ¿Cómo sabes mi nombre?\"")
add("day1_morning", "day1_sea_meet_8", name="Han Sea", text="\"Me lo dijo la tutora. Me avisó con antelación que venía una nueva.*\"")
add("day1_morning", "day1_sea_meet_9", text="\"Ah... ya veo.\"")
add("day1_morning", "day1_sea_meet_10", text="*Tiene sentido que la delegada se entere con anticipación.*")
add("day1_morning", "day1_sea_meet_11", name="Han Sea", text="\"¿Buscabas el aula? Ven, te acompaño.\"")
add("day1_morning", "day1_sea_meet_12", text="\"Gracias. Sinceramente ya me estaba perdiendo un poco, el edificio es enorme.\"")
add("day1_morning", "day1_sea_meet_13", name="Han Sea", text="\"A todos les pasa al principio. Yo en primero me di una vuelta entera al edificio buscando el baño.\"")
add("day1_morning", "day1_sea_meet_14", text="*Sea va delante. Señala cosas mientras recorremos el pasillo.*")
add("day1_morning", "day1_sea_meet_15", name="Han Sea", text="\"Aquí está el laboratorio de ciencias, y el aula de música está al fondo. La segunda planta es de tercero, así que probablemente no necesites ir.\"")
add("day1_morning", "day1_sea_meet_16", text="\"Es más complicado de lo que esperaba.\"")
add("day1_morning", "day1_sea_meet_17", name="Han Sea", text="\"Te acostumbras rápido. En una semana lo harás con los ojos cerrados.\"")
add("day1_morning", "day1_sea_meet_18", name="Han Sea", text="\"Ah, y la tienda escolar está al fondo de la primera planta. La cola se alarga durante el almuerzo, así que conviene saberlo de antemano.\"")
add("day1_morning", "day1_sea_meet_19", text="\"Vaya, qué amable. ¿Es porque eres la delegada?\"")
add("day1_morning", "day1_choco_1", name="Han Sea", text="\"Partly because of that... en parte sí...\"")
add("day1_morning", "day1_choco_2", text="*Sea sonríe levemente.*")
add("day1_morning", "day1_choco_3", name="Han Sea", text="\"Pero sobre todo... si veo a alguien nuevo desorientado, simplemente quiero ayudar.\"")
add("day1_morning", "day1_choco_4", text="*Parece buena persona. Encontrarme con alguien tan amable desde mi primer día de transferencia.*")
add("day1_morning", "day1_choco_5", text="*De camino al aula, Sea saca algo de su mochila.*")
add("day1_morning", "day1_choco_6", name="Han Sea", text="\"Ah sí, toma. ¿Te gusta la leche de chocolate, verdad?\"")
add("day1_morning", "day1_choco_7", text="*Me tiende un pequeño tetrabrik de leche de chocolate.*")
add("day1_morning", "day1_choco_8", text="*...¿Leche de chocolate? No le he dicho a nadie que me guste. Ni siquiera recuerdo haber bebido en el colegio anterior.*")
add("day1_morning", "day1_choco_9", text="\"¿Eh? Gracias, pero... ¿por qué?\"")
add("day1_morning", "day1_choco_choice", name="Han Sea", text="\"¿A que viniste sin desayunar porque estabas nerviosa? Con el estómago vacío todo empeora. Al menos bebe esto.\"",
    choices=["\"Gracias, me lo llevo.\"", "\"...¿Cómo sabías que me gustaba esto?\"", "\"En realidad soy más de leche de fresa.\""])
add("day1_morning", "day1_choco_accept_1", text="*Clavo la pajita y doy un sorbo. Es dulce. Está bueno.*")
add("day1_morning", "day1_choco_accept_2", text="\"Está rico. Gracias, Sea.\"")
add("day1_morning", "day1_choco_accept_3", name="Han Sea", text="\"¿A que sí? Tenía el pálpito de que te gustaría la leche de chocolate.\"")
add("day1_morning", "day1_choco_accept_4", text="*¿Un pálpito? Bueno, a la mayoría le gusta.*")
add("day1_morning", "day1_choco_question_1", text="\"...Espera, ¿cómo sabías que me gusta la leche de chocolate?\"")
add("day1_morning", "day1_choco_question_2", name="Han Sea", text="\"...¿Intuición? A la mayoría le gusta. ¿La cambio por la de fresa?\"")
add("day1_morning", "day1_choco_question_3", text="*Por un momento su expresión pareció vacilar. ...¿O no? Quizás solo se desconcertó.*")
add("day1_morning", "day1_choco_question_4", text="\"No, tienes razón. Me gusta. Gracias.\"")
add("day1_morning", "day1_choco_question_5", name="Han Sea", text="\"Menos mal~\"")
add("day1_morning", "day1_choco_question_6", text="*Sea sonríe. Debí imaginarme esa mirada.*")
add("day1_morning", "day1_choco_joke_1", text="\"En realidad soy más de leche de fresa.\"")
add("day1_morning", "day1_choco_joke_2", name="Han Sea", text="\"¿En serio? La próxima vez traigo la de fresa. ¡Te lo prometo!\"")
add("day1_morning", "day1_choco_joke_3", text="\"No, no, esta también está bien. Gracias.\"")
add("day1_morning", "day1_choco_joke_4", text="*Camino bebiendo la leche de chocolate. Está dulce. La tensión empieza a aflojar un poco.*")
add("day1_morning", "day1_classroom_1", text="*Sea me guía al aula.*")
add("day1_morning", "day1_classroom_2", name="Han Sea", text="\"Ya estamos. Entremos.\"")
add("day1_morning", "day1_classroom_3", text="*Abro la puerta y entro — todas las cabezas del aula se vuelven a mirarme.*")
add("day1_morning", "day1_classroom_4", text="*...Estoy nerviosa. Se oye murmullo. 'Es la nueva.' '¿De dónde viene?' Ese tipo de cosas.*")
add("day1_morning", "day1_classroom_5", name="Han Sea", text="\"Tu sitio está allá, junto a la ventana. ¿Quieres dejar tus cosas? Puedes presentarte cuando llegue la tutora.\"")
add("day1_morning", "day1_classroom_6", text="\"Claro, gracias.\"")
add("day1_morning", "day1_classroom_7", text="*Dejo la mochila y me siento. Un asiento junto a la ventana. Por el cristal se ven los cerezos. No está mal.*")
add("day1_morning", "day1_classroom_8", text="*El chico del asiento de al lado se acerca a hablarme.*")
add("day1_morning", "day1_classroom_10", text="\"Del Instituto ○○. Por cosas de mis padres.\"")
add("day1_morning", "day1_classroom_11", name="Chico del asiento de al lado", text="\"¿Ah, sí? Este sitio está bastante bien. El almuerzo es bueno y los profes tampoco están mal.\"")
add("day1_morning", "day1_classroom_12", text="\"Qué alivio. Parece que me adaptaré bien.\"")
add("day1_morning", "day1_eunsu_1", text="*En medio de la charla, se abre la puerta del aula y entra la tutora.*")
add("day1_morning", "day1_eunsu_2", text="*Una profesora joven con gafas. De aspecto cálido y accesible.*")
add("day1_morning", "day1_eunsu_3", name="Park Eunsu", text="\"Bien, chicos. Me gustaría presentarles a una nueva alumna que se une a nosotros hoy.\"")
add("day1_morning", "day1_eunsu_4", text="*El aula queda en silencio.*")
add("day1_morning", "day1_eunsu_5", name="Park Eunsu", text="\"{name}, ¿podrías pasar al frente y presentarte?\"")
add("day1_morning", "day1_eunsu_6", text="*Estar de pie al frente empeora los nervios. Treinta pares de ojos mirándome.*")
add("day1_morning", "day1_eunsu_7", name="Park Eunsu", text="\"Lo he estado esperando. Las transferencias son muy poco frecuentes aquí.\"")
add("day1_morning", "day1_eunsu_8", text="*...¿Poco frecuentes? Supongo que no mucha gente se transfiere a esta escuela.*")
add("day1_morning", "day1_eunsu_9", name="Park Eunsu", text="\"Cuando quieras, adelante.\"")
add("day1_morning", "day1_eunsu_10", text="\"Hola. Soy {name}. Vengo transferida del Instituto ○○. Encantada de conocerles.\"")
add("day1_morning", "day1_eunsu_11", text="*Lo mantuve breve. No sabía qué más decir.*")
add("day1_morning", "day1_eunsu_12", name="Park Eunsu", text="\"¿Tienes algún hobby o algo que te guste? Estoy segura de que todos querrían saber más.\"")
add("day1_morning", "day1_eunsu_13", text="\"Eh... me gusta jugar a videojuegos y escuchar música.\"")
add("day1_morning", "day1_eunsu_14", text="*Algunos se ríen. Probablemente porque es una respuesta muy estándar.*")
add("day1_morning", "day1_eunsu_15", name="Park Eunsu", text="\"Estupendo. Cuidenla mucho, todos. Bien, {name} — tu sitio está en la fila de atrás junto a la ventana. Pasa.\"")
add("day1_morning", "day1_class_1", text="*Vuelvo a mi asiento. Sea me hace un gesto de pulgar arriba. La profesora Eunsu sonríe con calidez.*")
add("day1_morning", "day1_class_2", text="*...Para ser la primera presentación, no estuvo mal. Qué alivio.*")
add("day1_morning", "day1_class_3", text="*Es clase de Literatura. La profesora Eunsu la imparte directamente.*")
add("day1_morning", "day1_class_4", name="Park Eunsu", text="\"Hoy vamos a leer poesía contemporánea. {name}, ¿hasta dónde llegaste en tu anterior escuela?\"")
add("day1_morning", "day1_class_5", text="\"Más o menos al mismo punto, creo.\"")
add("day1_morning", "day1_class_6", name="Park Eunsu", text="\"Perfecto. Puedes seguir desde aquí.\"")
add("day1_morning", "day1_class_7", text="*Asisto a la clase. La profesora Eunsu explica las cosas de una forma realmente interesante. Toda la clase presta atención.*")
add("day1_morning", "day1_break_2", text="*Hora del recreo. Varios estudiantes vienen a hablarme.*")
add("day1_morning", "day1_break_3", name="Chica A", text="\"Éramos curiosos sobre ti~ ¿Cómo era tu anterior colegio?\"")
add("day1_morning", "day1_break_4", text="\"Bastante normal. El edificio era un poco más pequeño que aquí.\"")
add("day1_morning", "day1_break_5", name="Chica A", text="\"Ahh~ Aquí las instalaciones son buenas, pero no hay nada divertido alrededor.\"")
add("day1_morning", "day1_break_6", name="Chico B", text="\"En serio. Solo hay una tienda de conveniencia delante de la escuela.\"")
add("day1_morning", "day1_break_7", text="*Los estudiantes ríen levemente. No es mal ambiente. Creo que puedo adaptarme aquí.*")
add("day1_morning", "day1_break_8", text="*Sea se acerca y se sienta a mi lado.*")
add("day1_morning", "day1_break_9", name="Han Sea", text="\"¿Qué tal tu primera clase? La profesora Eunsu es genial, ¿verdad?\"")
add("day1_morning", "day1_seolhwa_1", text="\"Sí, explica muy bien.\"")
add("day1_morning", "day1_seolhwa_2", name="Han Sea", text="\"Tenemos suerte de que sea nuestra tutora. Es la profesora más popular de toda la escuela.\"")
add("day1_morning", "day1_seolhwa_3", text="*Sea mira a la profesora Eunsu y sonríe. Parece que la admira de verdad.*")
add("day1_morning", "day1_seolhwa_4", text="*Antes de que empiece la segunda clase. Sentada en mi sitio, echo un vistazo atrás.*")
add("day1_morning", "day1_seolhwa_greet_11", name="Chico del asiento de al lado", text="\"Es tan callada que a veces olvido que está ahí.\"")
add("day1_morning", "day1_seolhwa_greet_12", text="\"...Ya veo.\"")
add("day1_morning", "day1_seolhwa_greet_13", text="*Vuelvo a mirar atrás. Seolhwa sigue... ahí sentada. Con la misma expresión. Solo mirando por la ventana.*")
add("day1_morning", "day1_seolhwa_greet_14", text="*Supongo que es del tipo introvertido. Intentaré hablarle de nuevo más tarde.*")
add("day1_morning", "day1_seolhwa_greet_15", text="*...Aunque espera — durante el control de asistencia al inicio de la clase, no recuerdo haber oído que llamaran su nombre. Quizás no lo escuché bien.*")

# ============================================================
# day1_lunch.json
# ============================================================
add("day1_lunch", "day1_lunch_sea_1", text="*Cuando me levanto, Sea se acerca.*")
add("day1_lunch", "day1_lunch_sea_15", name="Han Sea", text="\"Toma, prueba primero la tortilla enrollada. La hice un poco dulce.\"")
add("day1_lunch", "day1_lunch_sea_16", text="*...¿Me va a dar de comer? No, solo me lo está alcanzando. Claro.*")
add("day1_lunch", "day1_lunch_sea_17", text="\"Ah, ya lo tomo yo.\"")
add("day1_lunch", "day1_lunch_sea_18", text="*Lo agarro rápidamente y lo como. ...Está bueno. De verdad.*")
add("day1_lunch", "day1_lunch_sea_19", name="Han Sea", text="\"...¿Qué tal? ¿No está muy salado?\"")
add("day1_lunch", "day1_lunch_sea_20", text="\"No, está genial. Mejor que el de la tienda.\"")
add("day1_lunch", "day1_lunch_sea_21", name="Han Sea", text="\"¿De verdad?!\"")
add("day1_lunch", "day1_lunch_sea_22", text="*La cara de Sea se ilumina. Parece genuinamente feliz.*")
add("day1_lunch", "day1_lunch_sea_23", name="Han Sea", text="\"Qué bien~ Entonces prueba también las salchichas. Las corté en forma de pulpo.\"")
add("day1_lunch", "day1_lunch_sea_24", text="\"¿Forma de pulpo? ...Ah, es verdad.\"")
add("day1_lunch", "day1_lunch_sea_25", text="*Los extremos de las salchichas están cortados en abanico como pequeñas patas. Se tomó la molestia de hacerlo.*")
add("day1_lunch", "day1_lunch_sea_26", name="Han Sea", text="\"Las hago así desde pequeña. Infantil, ¿verdad?\"")
add("day1_lunch", "day1_lunch_sea_27", text="\"No, es tierno. Y está rico.\"")
add("day1_lunch", "day1_lunch_sea_28", name="Han Sea", text="\"...¿Tierno?\"")
add("day1_lunch", "day1_lunch_sea_29", text="*Las mejillas de Sea se tiñen de rosa tenuemente mientras sonríe.*")
add("day1_lunch", "day1_lunch_sea_30", name="Han Sea", text="\"Bueno, come. También hay bolas de arroz.\"")
add("day1_lunch", "day1_lunch_sea_31", text="*Seguimos charlando largo rato sobre la comida — un cumplido tras otro.*")
add("day1_lunch", "day1_lunch_sea_32", text="\"¿Siempre traes fiambrera?\"")
add("day1_lunch", "day1_lunch_sea_33", name="Han Sea", text="\"Sí. El almuerzo escolar está bien, pero lo hecho en casa sabe mejor.\"")
add("day1_lunch", "day1_lunch_sea_34", text="\"Parece mucho para una persona.\"")
add("day1_lunch", "day1_lunch_sea_36", text="*Sea se detiene un momento, luego sonríe.*")
add("day1_lunch", "day1_lunch_sea_37", name="Han Sea", text="\"Tiendo a hacer bastante. Me alegra tener a alguien que se lo come todo.\"")
add("day1_lunch", "day1_lunch_sea_38", text="\"Estuvo genial. De verdad, gracias.\"")
add("day1_lunch", "day1_lunch_sea_39", text="*Sea recoge la fiambrera vacía y pregunta de forma casual:*")
add("day1_lunch", "day1_lunch_sea_40", name="Han Sea", text="\"...Me alegra mucho que lo hayas disfrutado. ¿Te traigo otra mañana?\"")
add("day1_lunch", "day1_lunch_sea_41", text="\"¿Todos los días? ¿No es demasiado trabajo?\"")
add("day1_lunch", "day1_lunch_sea_42", name="Han Sea", text="\"Para nada. Hacerlo tiene mucho más sentido cuando hay alguien que se lo come.\"")
add("day1_lunch", "day1_lunch_sea_43", text="*Sea sonríe con amplitud. Una fiambrera desde el primer día. Definitivamente es buena persona.*")
add("day1_lunch", "day1_lunch_sea_44", text="*...Pero todo lo que hay en esta caja es exactamente lo que yo elegiría. Tortilla, salchichas, bolas de arroz. ¿Coincidencia?*")
add("day1_lunch", "day1_lunch_sea_45", text="*Bueno, son alimentos bastante comunes. A cualquiera le gustarían.*")
add("day1_lunch", "day1_lunch_yuna_11", name="Choi Yuna", text="\"Lo siento mucho. Lo borro ahora mismo...!\"")
add("day1_lunch", "day1_lunch_yuna_12", text="\"No, está bien. Solo me sorprendí. Entonces estás en el club de fotografía.\"")
add("day1_lunch", "day1_lunch_yuna_13", name="Choi Yuna", text="\"¡Sí...! Soy Choi Yuna, de primero. Eres la nueva transferida, ¿verdad?\"")
add("day1_lunch", "day1_lunch_yuna_14", text="\"Sí. Soy {name}. Encantada.\"")
add("day1_lunch", "day1_lunch_yuna_15", name="Choi Yuna", text="\"Ah... sí. Encantada, senpai.\"")
add("day1_lunch", "day1_lunch_yuna_16", text="*Yuna abraza la cámara contra su pecho y baja la cabeza. Tiene la cara roja. Parece una chica tímida.*")
add("day1_lunch", "day1_lunch_yuna_17", text="\"¿Sacas muchas fotos? Al estar en el club de fotografía.\"")
add("day1_lunch", "day1_lunch_yuna_18", name="Choi Yuna", text="\"¡Sí! Todo el tiempo. Paisajes del colegio, gatos... ah, hay un gato en el patio trasero.\"")
add("day1_lunch", "day1_lunch_yuna_19", text="\"¿Un gato?\"")
add("day1_lunch", "day1_lunch_yuna_20", name="Choi Yuna", text="\"Sí... un callejero que viene al patio. Le llamo Queso...\"")
add("day1_lunch", "day1_lunch_yuna_21", text="*Sus ojos se iluminan en cuanto menciona el gato. Como si la versión tímida que acabo de conocer nunca hubiera existido.*")
add("day1_lunch", "day1_lunch_yuna_22", name="Choi Yuna", text="\"...Senpai. ¿Vienes seguido a la biblioteca? Yo estoy aquí todos los días.\"")
add("day1_lunch", "day1_lunch_yuna_23", text="\"Sí, me gusta que sea tranquila. Es el lugar perfecto para descansar durante el almuerzo.\"")
add("day1_lunch", "day1_lunch_yuna_24", name="Choi Yuna", text="\"¿A que sí?! Este es el rincón más tranquilo de toda la escuela. Tampoco viene mucha gente.\"")
add("day1_lunch", "day1_lunch_yuna_25", text="*Yuna abraza la cámara y sonríe. Tímida, pero cálida.*")
add("day1_lunch", "day1_lunch_yuna_26", name="Choi Yuna", text="\"Si senpai viene seguido... no me sentiré tan sola.\"")
add("day1_lunch", "day1_lunch_yuna_27", text="*Murmura en voz baja. Parece una chica dulce.*")
add("day1_lunch", "day1_lunch_yuna_28", text="\"Entonces muéstrame esas fotos del gato algún día.\"")
add("day1_lunch", "day1_lunch_yuna_29", name="Choi Yuna", text="\"Ah... ¿de verdad? Entonces... volverás a la biblioteca, ¿verdad...?\"")
add("day1_lunch", "day1_lunch_yuna_30", text="*Yuna sonríe radiante. Es adorable.*")
add("day1_lunch", "day1_lunch_riin_8", name="Kang Riin", text="\"Sin fiebre. ¿Me abres la boca? ... Bien, estás bien.\"")
add("day1_lunch", "day1_lunch_riin_9", text="\"Creo que es solo los nervios.\"")
add("day1_lunch", "day1_lunch_riin_10", name="Kang Riin", text="\"Tiene sentido el primer día. Dolor de cabeza por tensión. No es nada grave.\"")
add("day1_lunch", "day1_lunch_riin_11", text="*La enfermera Riin saca un medicamento del cajón y sonríe. Una sonrisa relajada.*")
add("day1_lunch", "day1_lunch_riin_12", name="Kang Riin", text="\"Toma. Tómate uno después de comer.\"")
add("day1_lunch", "day1_lunch_riin_13", text="\"Gracias.\"")
add("day1_lunch", "day1_lunch_riin_14", name="Kang Riin", text="\"¿Has comido? No tomes medicamentos con el estómago vacío.\"")
add("day1_lunch", "day1_lunch_riin_15", text="\"Ah... todavía no. Los nervios, supongo.\"")
add("day1_lunch", "day1_lunch_riin_16", name="Kang Riin", text="\"Vaya. Un momento.\"")
add("day1_lunch", "day1_lunch_riin_17", text="*La enfermera Riin saca una barrita energética del cajón y me la da.*")
add("day1_lunch", "day1_lunch_riin_18", name="Kang Riin", text="\"Come esto primero. Tomar medicamentos con el estómago vacío es duro para el cuerpo.\"")
add("day1_lunch", "day1_lunch_riin_19", text="\"Incluso esto... muchas gracias.\"")
add("day1_lunch", "day1_lunch_riin_20", name="Kang Riin", text="\"Cuidar a los alumnos es parte del trabajo.\"")
add("day1_lunch", "day1_lunch_riin_21", text="*La enfermera Riin también me sirve agua. Es una persona agradable. Me da sensación de hermana mayor.*")
add("day1_lunch", "day1_lunch_riin_22", name="Kang Riin", text="\"Si tienes sueño, puedes descansar en la cama. Está justo allí.\"")
add("day1_lunch", "day1_lunch_riin_23", text="\"Estoy bien. Creo que mejoraré en cuanto tome el medicamento.\"")
add("day1_lunch", "day1_lunch_riin_24", name="Kang Riin", text="\"Claro. Pero ¿tienes dolores de cabeza así con frecuencia?\"")
add("day1_lunch", "day1_lunch_riin_25", text="\"A veces. Cuando no duermo bien.\"")
add("day1_lunch", "day1_lunch_riin_26", name="Kang Riin", text="\"Entendido. Ven cuando no te encuentres bien. La enfermería siempre está abierta.\"")
add("day1_lunch", "day1_lunch_riin_27", text="*Es cálida. La enfermería es tan acogedora que me vería viniendo seguido.*")
add("day1_lunch", "day1_lunch_alone_1", text="*Subo las escaleras y empujo la puerta de la azotea. Una ráfaga de viento me golpea.*")
add("day1_lunch", "day1_lunch_alone_4", text="*Como una bola de arroz que compré en la tienda y miro el patio desde arriba.*")
add("day1_lunch", "day1_lunch_alone_5", text="*Los estudiantes están dispersos en pequeños grupos. Algunos jugando al fútbol, otros charlando en los bancos. Una escena de almuerzo tranquila.*")
add("day1_lunch", "day1_lunch_alone_6", text="*El viento es agradable. La cabeza se me despeja.*")
add("day1_lunch", "day1_lunch_alone_7", text="*Me apoyo en la barandilla y miro el cielo. Las nubes se mueven despacio.*")
add("day1_lunch", "day1_lunch_alone_8", text="*...Espera. ¿Hay alguien en el rincón del patio apuntando una cámara hacia mí?*")
add("day1_lunch", "day1_lunch_alone_9", text="*No, la distancia es demasiado grande — probablemente me lo imagino. Quizás es el club de fotografía.*")
add("day1_lunch", "day1_lunch_alone_10", text="*...Hay algo como un rasguño en la barandilla de abajo. ¿Letras grabadas? ...En realidad no, no parecen letras. Solo una marca vieja.*")
add("day1_lunch", "day1_lunch_alone_11", text="*Una ráfaga de viento. Más allá de la puerta de la azotea... algo blanco pasó fugazmente.*")
add("day1_lunch", "day1_lunch_alone_12", text="*Al girarme, no había nadie. ...Quizás el viento arrastró algo.*")
add("day1_lunch", "day1_lunch_alone_13", text="*Termino la bola de arroz y me estiro. A esforzarnos esta tarde.*")

# ============================================================
# day1_afterschool.json
# ============================================================

# ============================================================
# day1_night.json
# ============================================================

# ============================================================
# day2_morning.json
# ============================================================

# ============================================================
# day2_lunch.json
# ============================================================

# ============================================================
# day2_afterschool.json
# ============================================================

# ============================================================
# day2_night.json (already has some ES, but phone_1-12, msg_1-7, sleep_1-2, dream_7-12, wake_1-5)
# ============================================================

def process_file(filename):
    """Process one JSON file: replace Korean entries with English-based Spanish translations."""
    en_path = os.path.join(EN_DIR, filename)
    es_path = os.path.join(ES_DIR, filename)

    en_data = load_json(en_path)
    es_data = load_json(es_path)

    file_key = filename.replace('.json', '')
    overrides = OVERRIDES.get(file_key, {})

    changed = 0
    for key, es_entry in es_data.items():
        override = overrides.get(key, {})
        en_entry = en_data.get(key, {})

        # Handle name field
        if 'name' in override:
            if es_entry.get('name') != override['name']:
                es_entry['name'] = override['name']
                changed += 1
        elif has_korean(es_entry.get('name', '')):
            en_name = en_entry.get('name', '')
            es_entry['name'] = translate_name(en_name)
            changed += 1

        # Handle text field
        if 'text' in override:
            if es_entry.get('text') != override['text']:
                es_entry['text'] = override['text']
                changed += 1
        elif has_korean(es_entry.get('text', '')):
            # Use EN text if available, translating names
            en_text = en_entry.get('text', '')
            if en_text:
                # Apply name replacements for narration
                es_text = en_text.replace('*Me', '*Yo').replace('*I ', '*Yo ').replace('*I\'', '*Yo\'')
                # Note: we keep EN text as-is and mark for manual review
                # Actually set the EN text as placeholder
                es_entry['text'] = en_text
                changed += 1

        # Handle choices field
        if 'choices' in override:
            es_entry['choices'] = override['choices']
            changed += 1
        elif 'choices' in es_entry:
            choices = es_entry['choices']
            if isinstance(choices, list) and any(has_korean(c) for c in choices):
                en_choices = en_entry.get('choices', [])
                es_entry['choices'] = en_choices if en_choices else choices
                changed += 1

    save_json(es_path, es_data)
    print(f"  {filename}: {changed} entries updated")
    return changed

# Process files
files = [
    "day1_morning.json",
    "day1_lunch.json",
    "day1_afterschool.json",
    "day1_night.json",
    "day2_morning.json",
    "day2_lunch.json",
    "day2_afterschool.json",
    "day2_night.json",
    "day3_morning.json",
    "day3_lunch.json",
    "day3_afterschool.json",
    "day3_night.json",
    "day4_morning.json",
    "day4_lunch.json",
    "day4_afterschool.json",
    "day4_night.json",
    "day5_morning.json",
    "day5_lunch.json",
    "day5_afterschool.json",
    "day5_night.json",
]

total = 0
for f in files:
    total += process_file(f)
print(f"\nTotal entries updated: {total}")
