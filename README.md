
# AnalizaWikipedia

Proyecto que es capaz de realizar peticiones a la API de Wikipedia, curar y procesar los resultados para finalmente hacer CRUD sobre estos. Consta de un frontend escrito en NextJS (Typescript) y un backend en FastAPI (python).

Cumple con todos los requerimientos **obligatorios** y **opcionales** especificados.

## Instalación

Requisitos preliminares: 

- Debes tener NodeJS 21.1.0 o superior
- Debes tener Python 3.10 o superior
- Debes tener PostgreSQL 16 o superior

Clona o descarga el repositorio en tu directorio de referencia

Abre el proyecto en VSCode, y abre una terminal.

#### Configuración del backend

Ejecuta este comando para moverte al backend

```
cd backend-api
```

Prepara un ambiente virtual de python. Ejecuta este comando

```
python -m venv venv
```

Ahora vamos a activar este ambiente virtual (Usuarios Windows)

```
venv\Scripts\activate
```

Alternativamente, si estas en MacOS o Linux, ejecuta este comando

```
source venv/bin/activate
```

Ahora vamos a instalar los paquetes del backend

```
pip install -r requirements.txt
```

Nota: A veces puede dar un error relacionado al paquete de es_core_news_md. Si te ocurre, haz lo siguiente.

- Elimina la linea de ``es_core_news_md`` de requirements.txt
- Ejecuta `` pip install -r requirements.txt ``
- Posteriormente, instalalo manualmente con ``python -m spacy download es_core_news_md``

Instalados los paquetes, ahora solo nos falta configurar nuestras variables ambientales.

Crea en el root de backend-api, donde esta ``main.py`` un archivo con el nombre ``.env``, editalo y coloca estos datos.

```
POSTGRES_USER=[username]
POSTGRES_PASSWORD=[password]
POSTGRES_SERVER=[hostname / address]
POSTGRES_PORT=[port]
POSTGRES_DB=[db_name]
```
Los rellenas con tus datos de PostgreSQL. Crea un DB para el proyecto y el nombre lo asignas en ``[db_name]``, el backend se creara de crear lo demas

Ya casi terminamos con el backend! Ejecuta este comando para inicializarlo.

```
fastapi dev main.py --port [port]
```

Donde ``[port]`` es un puerto de tu preferencia. Te recomiendo utilizar el ``7777``.

Backend listo ✅

#### Configuración del frontend

Abre una nueva terminal en VSCode

Muevete a frontend-app con este comando

```
cd frontend-app
```

Instala los paquetes para el frontend

```
npm install
```

Configura las variables ambientales creando un archivo ``.env`` en el directorio root, donde esta el ``package.json``. Coloca estos datos.

```
NEXT_PUBLIC_SERVER_URL=http://localhost:[port]/api/v1/
```

Donde [port] es el mismo que ya habias puesto antes para inicializar el backend.

Solo debes ejecutar el frontend con `` npm run dev `` y ya estas ready! ✅
## Decisiones de diseño y arquitectura

#### API

Decidí utilizar una arquitectura limpia basada en capas dado que identifiqué que habrian multiples entidades que el sistema manejaria, y lo mejor era separar las responsabilidades de manera inteligente para que cuando el sistema se vuelva más complejo sea más facil agregar nuevos módulos.

- Controladores: Capa que maneja la sanitización de la data y el manejo de excepciones dentro de la API 
- Servicios: La lógica de negocio está presente aquí. La información se procesa en esta capa.
- Modelos: La capa que hace interacciones con la BD. Esta se encarga de almacenar los modelos de la data, y realizar operaciones con la BD.
- Tambien tenemos un middleware que maneja los routers de la API.
- Para NLP se usa el modelo ``es_core_news_md `` dado su rendimiento sin perder significativa precisión. En entornos de producción, usaria probablemente `` es_core_news_lg `` o el modelo transformer para mejorar la precisión 
especialmente con la detección de entidades.
- El proyecto tambien posee pruebas unitarias para operaciones comunes en la API. Si deseas ejecutarlas, solo debes ejecutar en el directorio de ``backend-api/tests/unit`` este comando.

```
    pytest articles_unit_tests.py
```

### Modelo de datos

**Modelo de los artículos**

Modelo que representa un artículo.

| Campo        | Descripción  |
|--------------|--------------|
| `id` | PRIMARY KEY (integer) |
| `article_name` | character varying |
| `article_summary` | character varying |
| `note` | character varying |
| `creation_date` | character varying |

**Modelo de diccionario**

Modelo que representa el diccionario de palabras de un artículo. Máximo seran 100 entradas por artículo 
(las más repetidas en el artículo)

| Campo      | Descripción |
|------------|-------------|
| `id` | PRIMARY KEY (integer) |
| `id_article` | integer |
| `name` | character varying |
| `counter` | integer |

**Modelo de entidades**

Modelo que representa las entidades detectadas en un artículo. 
Calculadas a partir de las 100 entradas del diccionario.

| Campo      | Descripción |
|------------|-------------|
| `id` | PRIMARY KEY (integer) |
| `id_article` | integer |
| `word` | character varying |
| `entity` | character varying |

---

**Modelo de tipo de palabras**

Modelo que representa el tipo gramatical de palabras dentro de un artículo. 
Calculadas a partir de las 100 entradas del diccionario.

| Campo      | Descripción |
|------------|-------------|
| `id` | PRIMARY KEY (integer) |
| `id_article` | integer |
| `word` | character varying |
| `type_word` | character varying |

El modelo de los artículos tiene una relación de una a muchos con los demas modelos. Tiene un índice y clave foranea en id_article con los demás modelos, lo que permite
integridad de los datos y consultas rápidas.

#### NextJS

Utilice el patrón por defecto que usa NextJS basado en páginas y componentes. Implementé logica de manejo de estado (carga, error, exito) en cada una de las peticiones. Tambien aproveché el SSR que ofrece NextJS para acelarar los tiempos de carga iniciales. Modularizé y abstraí funciones y módulos para aplicar los principios DRY.
## Endpoints de la API

Nota: los (...) indican que puede haber más de un elemento en esa colección

### Buscar articulos en Wikipedia

``GET`` /articles/search_wikipedia/{search_term}

Te permite buscar un termino en Wikipedia

Cuerpo de petición

```
search_term (requerido) -> string [término de busqueda]
```

Cuerpo de respuesta

```
[
    [
        "string [termino que hizo match]",
        "string [url del termino]"
    ]
    ...
]
```

### Procesar y obtener un artículo de wikipedia

``GET`` /articles/analyze/{wikipedia_identificator}

Realiza una peticion a la API de wikipedia, realiza NLP sobre el contenido y devuelve una respuesta procesada.

`` JSON `` Cuerpo de petición

```
wikipedia_identificator (requerido) -> string [nombre del artículo al cual realizar el analisis]
```

`` JSON `` Cuerpo de respuesta

```
{
    "article_summary": "string",
    "dictionary_of_words": {
        "string [palabra]": "number [cuantas instancias de esa palabra hay en el articulo]"
        ...
    }
    "entities": [
        [
            "string [palabra]",
            "string [entidad identificada]"
        ]
        ...
    ]
    "type_of_words":[
        [
            "string [palabra]",
            "string [tipo de palabra]"
        ]
        ...
    ],

}
```

### Guardar un artículo en la BD.

`` POST `` /articles/

Guarda un artículo.

`` JSON `` Cuerpo de la petición

```
{
    "article_name": "string"
    "article_summary": "string",
    "dictionary_of_words": {
        "string [palabra]": "number [cuantas instancias de esa palabra hay en el articulo]"
        ...
    }
    "entities": [
        [
            "string [palabra]",
            "string [entidad identificada]"
        ]
        ...
    ]
    "type_of_words":[
        [
            "string [palabra]",
            "string [tipo de palabra]"
        ]
        ...
    ]
}
```

`` JSON `` Cuerpo de la respuesta

```
{
    "message": "string"
}
```

### Eliminar un artículo de la BD

``DELETE`` /articles/{article_id}

Elimina un artículo

`` JSON `` Cuerpo de la petición

```
article_id (requerido) -> number [id del artículo el cual eliminar]
```

`` JSON `` Cuerpo de la respuesta

```
{
    "message": "string"
}
```

### Obtener una lista de artículos de la BD

`` GET `` /articles/list?offset={offset}

Obtén una lista de acuerdo a una posición de inicio (offset)

`` JSON `` Cuerpo de la petición

```
offset (requerido) -> number [a partir de que elemento listar resultados]
```

`` JSON `` Cuerpo de respuesta

```
{
    "count": "number",
    "articles_list": [
        {
            "id": "number",
            "article_name": "string",
            "article_summary": "string",
            "creation_date": "string"
        }
        ...
    ]
}
```

### Obtener un artículo de la BD

`` GET `` /articles/{article_id}

Obtén un artículo por id

`` JSON `` Cuerpo de la petición

```
article_id (requerido) -> number [el id del artículo a obtener]
```

`` JSON `` Cuerpo de la respuesta

```
{
    "id": "number",
    "article_name": "string",
    "article_summary": "string",
    "creation_date": "string",
    "note": "string",
    "entities": [
        [
            "string [palabra]",
            "string [entidad identificada]"
        ]
        ...
    ],
    "type_of_words":[
        [
            "string [palabra]",
            "string [tipo de palabra]"
        ]
        ...
    ],
    "dictionary_of_words": {
        "string [palabra]": "number [cuantas instancias de esa palabra hay en el articulo]"
        ...
    }
}
```

### Actualizar un artículo de la BD

`` patch `` /articles/{article_id}

Actualiza el artículo. Solo la nota del artículo puede ser actualizada según requerimientos del proyecto.

`` JSON `` Cuerpo de la petición

```
article_id (requerido) -> number [el id del artículo a actualizar]
```

```
{
    "note": "string"
}
```

`` JSON `` Cuerpo de la respuesta

```
{
    "message": "string"
}
```

## Por Jorge Luis Báez