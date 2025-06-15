export type ArticleItem = {
    id: number,
    article_name: string,
    article_summary: string, 
    creation_date: string
}

export type tupleDictionary = [string, number];

export type ArticleProps = {
    wikipediaTerm: string | null,
    wikipediaArticle: WikipediaArticle,
    dictionary: [string, number][]
}

export type WikipediaArticle = {
    article_summary: string,
    dictionary_of_words: { [key: string]: number },
    entities: [string, string][],
    type_of_words: [string, string][],
    article_name: string
}