from pathlib import Path
import unittest
import sys
import os
from unittest.mock import patch
sys.path.insert(0, os.path.dirname(os.path.abspath(Path(__file__).parent.parent)))
from layers.services.v1.articles_service import articles_service
from wikipedia.exceptions import PageError
import spacy
from utils.config import settings

class TestArticlesServices(unittest.TestCase):
    def setUp(self):
        self.settings = settings.model_for_recognizing_language = spacy.load("es_core_news_md")

    def test_search_term_wikipedia(self):
        result = articles_service.search_wikipedia("Republica Dominicana")
        result = result[0]
        self.assertEqual(result, ('República Dominicana', 'https://es.wikipedia.org/wiki/Rep%C3%BAblica_Dominicana'))

    def test_search_undefined_term_wikipedia(self):
        result = articles_service.search_wikipedia("ksmdfkmsdfkkl")
        self.assertEqual(len(result), 0)

    @patch("layers.services.v1.articles_service.settings", settings)
    def test_analyze_wikipedia_article(self):
        result = articles_service.analyze_wikipedia_article("Charles_Chaplin")
        result = result["article_summary"]
        self.assertIn("actor", result)

    def test_analyze_wikipedia_undefined_article(self):
        with self.assertRaises(PageError):
            articles_service.analyze_wikipedia_article("kasksksksksks")

    @patch("layers.services.v1.articles_service.settings", settings)
    def test_analyze_wikipedia_article_dictionary(self):
        result = articles_service.analyze_wikipedia_article("Arroz")
        result = result["dictionary_of_words"]
        self.assertIsInstance(result, dict)

if __name__ == '__main__':
    unittest.main()