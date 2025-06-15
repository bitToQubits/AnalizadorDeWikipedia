"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { NUMERICAL_LIMIT_PER_PAGE_ARTICLES } from "@/utils/constants";

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
    const [isHydrated, setIsHydrated] = useState(false);

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
            key={article.id} 
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

        const newOffset = (offset - NUMERICAL_LIMIT_PER_PAGE_ARTICLES) < 0 ? 0 : offset - 6;
        setOffset(newOffset);
        regenerateArticles(newOffset);
    }

    const goAheadPagination = () => {
        if((offset + NUMERICAL_LIMIT_PER_PAGE_ARTICLES) >= totalNumberArticles || loading) return;
        
        const newOffset = offset + NUMERICAL_LIMIT_PER_PAGE_ARTICLES;
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
        const newOffset = 
        totalNumberArticles > NUMERICAL_LIMIT_PER_PAGE_ARTICLES ? 
        totalNumberArticles - NUMERICAL_LIMIT_PER_PAGE_ARTICLES : 0;
        setOffset(newOffset);
        regenerateArticles(newOffset);
    }

    const calculateActualPage = (offset:number, totalNumberArticles:number) => {
        if(totalNumberArticles == 0){
            return 0;
        }
        const totalNumberOfPages = Math.ceil(totalNumberArticles / NUMERICAL_LIMIT_PER_PAGE_ARTICLES);
        let howMuchPagesAhead = (totalNumberArticles - offset) / NUMERICAL_LIMIT_PER_PAGE_ARTICLES;
        if(howMuchPagesAhead < 0)
            return totalNumberOfPages;
        howMuchPagesAhead = Math.ceil(howMuchPagesAhead);
        return totalNumberOfPages - howMuchPagesAhead + 1;
    }

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if(!isHydrated) return;
        regenerateArticles(0);
    }, [isHydrated]);

    if(!isHydrated) return null;

    return (
        <main className="lg:max-w-6/10 lg:p-0 ml-auto mr-auto mt-13 p-6 ">
            <section className="m-auto">
                <div className="mb-7">
                    <h1 className="text-5xl lg:inline font-semibold lg:text-center">
                        Mis artículos
                    </h1>
                    <Button asChild className="mb-2 mt-5 lg:mt-0 lg:inline lg:float-right">
                        <Link href="/">Volver al buscador</Link>
                    </Button>
                </div>
                {myArticles.length == 0 && (<p>No tienes artículos guardados</p>)}
            </section>
            <section>
                <ul className="mb-2">
                    {
                        articlesHTMLElements
                    }
                </ul>
                <div className="mb-10">
                    <p className="inline"><b>{totalNumberArticles}</b> resultado(s)</p>
                    <div className="lg:float-right">
                        <p className="lg:inline mr-3 mb-3 lg:mb-0">
                            Página {calculateActualPage(offset, totalNumberArticles)} de {Math.ceil(totalNumberArticles / NUMERICAL_LIMIT_PER_PAGE_ARTICLES)}
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