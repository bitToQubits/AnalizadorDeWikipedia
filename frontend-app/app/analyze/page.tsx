"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from 'next/navigation';
import { Article } from "@/components/Article";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type tupleDictionary = [string, number];

export const Analyze = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const encodedWikipediaTerm = searchParams.get('w');
    const [wikipediaArticle, setWikipediaArticle] = 
    useState({
        article_summary: "No determinado.",
        dictionary_of_words: {},
        entities: [],
        type_of_words: [],
        article_name: "No determinado"
    });
    const [dictionary, setDictionary] = useState<tupleDictionary[]>([]);

    const decodeWikipediaTerm = (encodedWikipediaTerm: string) => {
        let wikipedia_name = decodeURIComponent(encodedWikipediaTerm);
        wikipedia_name = wikipedia_name.replaceAll("_"," ");
        return wikipedia_name;
    }

    const wikipedia_name = 
    typeof encodedWikipediaTerm == "string" ? 
    decodeWikipediaTerm(encodedWikipediaTerm) : "";

    const saveArticle = () => {
        axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`, wikipediaArticle)
        .then((response) => {
            const articleId = response.data.article_id;
            router.push(`/article?id=${articleId}`);
            toast.success(response.data.message);
        })
        .catch((error) => {
            if(error?.response?.data?.message){
                return toast.error(error.response.data.message);
            }
            toast.error(error.message);
        });
    }

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/analyze/${encodedWikipediaTerm}`)
        .then((response) => {
            setWikipediaArticle({
                ...response.data,
                article_name: wikipedia_name
            })
        })
        .catch((error) => {
            if(error?.response?.data?.message){
                return toast.error(error.response.data.message);
            }
            toast.error(error.message);
        });
    }, [encodedWikipediaTerm]);

    useEffect(() => {
        const dictionarySorted =
        Object.entries(wikipediaArticle["dictionary_of_words"])
            .map(([word, count]) => [word, Number(count)] as tupleDictionary)
            .sort(([, a], [, b]) => b - a);
        setDictionary(dictionarySorted);
    }, [wikipediaArticle])

    return (
        <main className="lg:max-w-8/10 lg:pr-0 lg:pl-0 pt-15 m-auto pr-5 pl-5">
            <section>
                <div className="mb-3">
                    <h1 className="text-3xl font-bold mb-5 lg:inline">{wikipedia_name}</h1>
                    <Button asChild className="mb-2 mr-3 lg:mr-0 lg:inline lg:float-right">
                        <Link href="/">Volver al buscador</Link>
                    </Button>
                    <Button onClick={saveArticle} className="mb-2 mr-2 lg:inline lg:float-right cursor-pointer bg-green-500 hover:bg-green-500 text-primary-foreground">
                        Guardar
                    </Button>
                </div>
            </section>
            <Article encodedWikipediaTerm={encodedWikipediaTerm} wikipediaArticle={wikipediaArticle} dictionary={dictionary} />
        </main>
    )
}

export default Analyze;