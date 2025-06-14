"use client";
import {Article} from "@/components/Article";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractTermFromUrl } from "@/utils/dataConversions";
import { Textarea } from "@/components/ui/textarea"

type tupleDictionary = [string, number];

export const SavedArticle = () => {

    const router = useRouter();
    const searchParams = useSearchParams()
    const articleId = searchParams.get('id');
    const [wikipediaArticle, setWikipediaArticle] = 
    useState({
        article_summary: "No determinado.",
        dictionary_of_words: {},
        entities: [],
        type_of_words: [],
        article_name: "No determinado"
    });
    const [note, setNotes] = useState("");
    const [dictionary, setDictionary] = useState<tupleDictionary[]>([]);

    const encodedWikipediaTerm = extractTermFromUrl(wikipediaArticle.article_name);

    useEffect(() => {
        axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId)
        .then((response) => {
            setWikipediaArticle(response.data);
            setNotes(response.data.note);
        })
        .catch((error) => {
            toast(error.message);
        });
    }, [articleId]);

    useEffect(() => {
        const dictionarySorted =
        Object.entries(wikipediaArticle["dictionary_of_words"])
            .map(([word, count]) => [word, Number(count)] as tupleDictionary)
            .sort(([, a], [, b]) => b - a);
        setDictionary(dictionarySorted);
    }, [wikipediaArticle]);

    const saveNotes = () => {
        axios
        .patch(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId, {note})
        .then((response) => {
            toast(response.data.message);
        })
        .catch((error) => {
            toast(error.message);
        });
    }

    return (
        <main className="max-w-8/10 pt-15 m-auto">
            <section>
                    <div className="mb-3">
                        <h1 className="text-3xl font-bold mb-3 inline">{wikipediaArticle.article_name}</h1>
                        <Button asChild className="mb-2 inline float-right">
                            <Link href="/">Volver al buscador</Link>
                        </Button>
                    </div>
                </section>
                <Article encodedWikipediaTerm={encodedWikipediaTerm} wikipediaArticle={wikipediaArticle} dictionary={dictionary} />
                <section className="mt-8">
                    <h4 className="mb-4">Notas</h4>
                    <Textarea 
                        value={note} 
                        onChange={e => setNotes(e.target.value)} />
                    <div className="mt-5 mb-5">
                        <Button onClick={saveNotes} className="mr-5 hover:cursor-pointer hover:bg-green-500 bg-green-500">Guardar nota</Button>
                        <Button className="hover:cursor-pointer hover:bg-red-800 bg-red-800">Eliminar este artículo</Button>
                    </div>
                </section>
        </main>
    )
}

export default SavedArticle;