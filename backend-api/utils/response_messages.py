class ResponseMessages():
    success: dict = {
        "ARTICLE_SAVED": "Artículo guardado exitosamente",
        "ARTICLE_REMOVED": "Artículo eliminado exitosamente",
        "ARTICLE_UPDATED": "Artículo actualizado correctamente",
    }

    error: dict = {
        "WIKIPEDIA_SERVERS": "Error en los servidores de Wikipedia. Favor reintentarlo más tarde",
        "MISSING_IDENTIFICATOR": "Debes proporcionar un identificador para el artículo de Wikipedia",
        "BAD_IDENTIFICATOR": "El identificador no lleva a ningún artículo",
        "WIKIPEDIA_DISAMBIGUATION": "El término que usaste lleva a una desambiguación, no a un artículo. Usa otro termino",
        "OFFSET":"Debes proporcionar un offset válido para esta consulta",
        "ARTICLE_NOT_FOUND": "Artículo no encontrado",
        "ARTICLE_TO_REMOVE_NOT_FOUND": "Artículo para eliminar no encontrado",
        "ARTICLE_TO_UPDATE_NOT_FOUND":"Artículo para actualizar no encontrado"
    }

responses = ResponseMessages()