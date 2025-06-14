"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "sonner";

type ArticleItem = {
    id: number,
    article_name: string,
    article_summary: string, 
    creation_date: string
}

export const MyArticles = () => {
    const router = useRouter();

    const [myArticles, setMyArticles] = useState<ArticleItem[]>([]);
    const [totalNumberArticles, setTotalNumberArticles] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    const regenerateArticles = (offset: number) => {
        setLoading(true);

        axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/list?offset=`+offset)
        .then((response) => {
            setLoading(false);
            setMyArticles(response.data.articles_list);
            setTotalNumberArticles(response.data.count);
        })
        .catch((error) => {
            setLoading(false);
            if(error?.response?.data?.message){
                return toast.error(error.response.data.message);
            }
            toast.error(error.message);
        });
    }

    const makeDescriptionAShortOne = (articleSummary: string) => {
        return articleSummary.split(".").at(0);
    }

    const makeDateMoreReadable = (articleDate: string) => {
        let dateTemporal = new Date(articleDate);
        return dateTemporal.toLocaleDateString("es-MX");
    }

    const articlesHTMLElements = myArticles.map(article => 
        <li 
            key={crypto.randomUUID()} 
            className="bg-zinc-100 text-gray-950 my-3 p-2 rounded cursor-pointer" 
            onClick={() => { router.push("/article?id="+article.id) }}>
            <div>
                <h4 className="inline font-medium">{article.article_name}</h4>
                <small className="inline float-right">{makeDateMoreReadable(article.creation_date)}</small>
            </div>
            <p>{makeDescriptionAShortOne(article.article_summary)}</p>
        </li>
    )

    const goBackPagination = () => {
        if(loading) return;

        const newOffset = (offset - 6) < 0 ? 0 : offset - 6;
        setOffset(newOffset);
        regenerateArticles(newOffset);
    }

    const goAheadPagination = () => {
        if((offset + 6) >= totalNumberArticles || loading) return;
        
        const newOffset = offset + 6;
        setOffset(newOffset);
        regenerateArticles(newOffset);
    }

    const goFirstPagination = () => {
        if(loading) return;
        setOffset(0);
        regenerateArticles(0);
    }

    const goLastPagination = () => {
        if(loading) return;
        const newOffset = totalNumberArticles > 6 ? totalNumberArticles - 6 : 0;
        setOffset(newOffset);
        regenerateArticles(newOffset);
    }

    const calculateActualPage = (offset:number, totalNumberArticles:number) => {
        const total_number_of_pages = Math.ceil(totalNumberArticles / 6);
        let how_much_pages_ahead = (totalNumberArticles - offset) / 6;
        if(how_much_pages_ahead < 0)
            return total_number_of_pages;
        how_much_pages_ahead = Math.ceil(how_much_pages_ahead);
        return total_number_of_pages - how_much_pages_ahead + 1;
    }

    useEffect(() => {
        regenerateArticles(0);
    }, []);

    return (
        <main className="lg:max-w-6/10 lg:p-0 ml-auto mr-auto mt-20 p-6">
            <section className="m-auto">
                <div className="mb-7">
                    <h1 className="text-5xl lg:inline font-semibold lg:text-center">
                        Mis artículos
                    </h1>
                    <Button asChild className="mb-2 mt-5 lg:mt-0 lg:inline lg:float-right">
                        <Link href="/">Volver al buscador</Link>
                    </Button>
                </div>
            </section>
            <section>
                <ul className="mb-2">
                    {
                        articlesHTMLElements
                    }
                </ul>
                <div>
                    <p className="inline"><b>{totalNumberArticles}</b> resultados</p>
                    <div className="lg:float-right">
                        <p className="lg:inline mr-3 mb-3 lg:mb-0">
                            Página {calculateActualPage(offset, totalNumberArticles)} de {Math.ceil(totalNumberArticles / 6)}
                        </p>
                        <Button 
                            onClick={goFirstPagination} 
                            className="cursor-pointer inline mr-2">Principio</Button>
                        <Button 
                            onClick={goBackPagination} 
                            className="cursor-pointer inline mr-2">Atrás</Button>
                        <Button 
                            onClick={goAheadPagination} 
                            className="cursor-pointer inline mr-2">Siguiente</Button>
                        <Button 
                            onClick={goLastPagination} 
                            className="cursor-pointer inline">Final</Button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default MyArticles;