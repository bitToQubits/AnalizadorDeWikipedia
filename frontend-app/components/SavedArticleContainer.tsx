"use client";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { extractTermFromUrl } from "@/lib/dataConversions";
import { Article } from "@/components/Article";
import { Button } from "./ui/button";
import { tupleDictionary } from "@/lib/types";
import { WikipediaArticle as WikipediaArticleType} from "@/lib/types";
import { errorHandler } from "@/hooks/errorHandler";

interface SavedArticleProps {
    articleId: number
    wikipediaArticle: WikipediaArticleType
    comment: string
}

export const SavedArticleContainer = ({articleId, wikipediaArticle, comment}: SavedArticleProps) => {
    const router = useRouter();
    const [note, setNotes] = useState(comment);
    const [dictionary, setDictionary] = useState<tupleDictionary[]>([]);
    
    const wikipediaTerm = extractTermFromUrl(wikipediaArticle.article_name);

    useEffect(() => {
        const dictionarySorted =
        Object.entries(wikipediaArticle["dictionary_of_words"])
            .map(([word, count]) => [word, Number(count)] as tupleDictionary)
            .sort(([, a], [, b]) => b - a);
        setDictionary(dictionarySorted);
    }, []);

    const saveNotes = () => {
        axios
        .patch(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId, {note})
        .then((response) => {
            toast.success(response.data.message);
        })
        .catch((error) => {
            toast.error(errorHandler(error));
        });
    }

    const handleChangeNote = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value);
    }, []);

    const removeArticle = () => {
        axios
        .delete(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId)
        .then((response) => {
            toast.success(response.data.message);
            router.push("/my-articles");
        })
        .catch((error) => {
            toast.error(errorHandler(error));
        });
    }

    return (
        <>
            <Article wikipediaTerm={wikipediaTerm} wikipediaArticle={wikipediaArticle} dictionary={dictionary} />
            <section className="mt-8">
                <h4 className="text-xl font-medium mb-4 bg-zinc-100 text-gray-950 p-1 rounded">Notas</h4>
                <Textarea 
                    value={note} 
                    onChange={handleChangeNote} />
                <div className="mt-5 mb-5">
                    <Button onClick={saveNotes} className="mr-5 cursor-pointer bg-green-500">Guardar nota</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="cursor-pointer bg-red-800">Eliminar este artículo</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción es irreversible. El artículo guardado no se podrá recuperar.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                                <AlertDialogAction className="cursor-pointer" onClick={removeArticle}>Continuar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </section>
        </>
    )
}