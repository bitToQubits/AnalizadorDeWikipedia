"use client";
import React, { useEffect, useState } from "react";
import { Article } from "@/components/Article";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { tupleDictionary } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WikipediaArticle as WikipediaArticleType} from "@/lib/types";
import { errorHandler } from "@/hooks/errorHandler";

interface AnalyzedArticleProps {
    wikipediaName: string
    wikipediaTerm: string
    wikipediaArticle: WikipediaArticleType
}

export const AnalyzedArticleContainer = ({wikipediaName, wikipediaArticle, wikipediaTerm}: AnalyzedArticleProps) => {
    const router = useRouter();

    const [dictionary, setDictionary] = useState<tupleDictionary[]>([]);

    const saveArticle = () => {
        axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`, wikipediaArticle)
        .then((response) => {
            const articleId = response.data.article_id;
            router.push(`/article?id=${articleId}`);
            toast.success(response.data.message);
        })
        .catch((error) => {
            toast.error(errorHandler(error));
        });
    }

    useEffect(() => {
        const dictionarySorted =
        Object.entries(wikipediaArticle["dictionary_of_words"])
            .map(([word, count]) => [word, Number(count)] as tupleDictionary)
            .sort(([, a], [, b]) => b - a);
        setDictionary(dictionarySorted);
    }, [wikipediaArticle]);

    return (
        <main className="lg:max-w-8/10 lg:pr-0 lg:pl-0 pt-15 m-auto pr-5 pl-5 pb-10">
            <section>
                <div className="mb-3">
                    <h1 className="text-3xl font-bold mb-5 lg:inline bg-zinc-100 text-gray-950 p-1 rounded">{wikipediaName}</h1>
                    <Button asChild className="mb-2 mr-3 lg:mr-0 lg:inline lg:float-right">
                        <Link href="/">Volver al buscador</Link>
                    </Button>
                    <Button onClick={saveArticle} className="outline mb-2 mr-2 lg:inline lg:float-right cursor-pointer bg-green-500 hover:bg-green-500 text-primary-foreground">
                        Guardar
                    </Button>
                </div>
            </section>
            <Article wikipediaTerm={wikipediaTerm} wikipediaArticle={wikipediaArticle} dictionary={dictionary} />
        </main>
    )
}