"use client";
import {Article} from "@/components/Article";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { extractTermFromUrl } from "@/utils/dataConversions";
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
import { NOT_AVAILABLE } from "@/utils/constants";

type tupleDictionary = [string, number];

export const SavedArticle = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const articleId = searchParams.get('id');
    const [wikipediaArticle, setWikipediaArticle] = 
    useState({
        article_summary: NOT_AVAILABLE,
        dictionary_of_words: {},
        entities: [],
        type_of_words: [],
        article_name: NOT_AVAILABLE
    });
    const [note, setNotes] = useState("");
    const [dictionary, setDictionary] = useState<tupleDictionary[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    const wikipediaTerm = extractTermFromUrl(wikipediaArticle.article_name);

    const saveNotes = () => {
        axios
        .patch(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId, {note})
        .then((response) => {
            toast.success(response.data.message);
        })
        .catch((error) => {
            if(error?.response?.data?.message){
                return toast.error(error.response.data.message);
            }
            toast.error(error.message);
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
            if(error?.response?.data?.message){
                return toast.error(error.response.data.message);
            }
            toast.error(error.message);
        });
    }

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if(!isHydrated) return;

        const petitionToFetchArticle = axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId)
        .then((response) => {
            setWikipediaArticle(response.data);
            setNotes(response.data.note ?? "");
        })
        .catch((error) => {
            if(error?.response?.data?.message){
                return toast.error(error.response.data.message);
            }
            toast.error(error.message);
        });

        toast.promise(petitionToFetchArticle, {
          loading: 'Cargando...'
        });
    }, [isHydrated]);

    useEffect(() => {
        const dictionarySorted =
        Object.entries(wikipediaArticle["dictionary_of_words"])
            .map(([word, count]) => [word, Number(count)] as tupleDictionary)
            .sort(([, a], [, b]) => b - a);
        setDictionary(dictionarySorted);
    }, [wikipediaArticle]);

    if(!isHydrated) return null;

    return (
        <main className="lg:max-w-8/10 lg:pr-0 lg:pl-0 pt-15 m-auto pr-5 pl-5">
            <section>
                    <div className="mb-3">
                        <h1 className="text-3xl font-bold mb-5 lg:inline bg-zinc-100 text-gray-950 p-1 rounded">{wikipediaArticle.article_name}</h1>
                        <Button asChild className="mb-2 mr-3 lg:mr-0 lg:inline lg:float-right">
                            <Link href="/">Volver al buscador</Link>
                        </Button>
                        <Button asChild className="mb-2 mr-2 lg:inline lg:float-right cursor-pointer bg-transparent hover:bg-zinc-200 text-dark">
                            <Link href="/my-articles">Mis artículos</Link>
                        </Button>
                    </div>
                </section>
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
        </main>
    )
}

export default SavedArticle;