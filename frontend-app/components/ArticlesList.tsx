"use client";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { NUMERICAL_LIMIT_PER_PAGE_ARTICLES } from "@/lib/constants";
import { ArticleItem } from "@/lib/types";
import { getArticles } from "@/hooks/getArticles";
import { Button } from "./ui/button";

interface ArticleProps {
  articles: ArticleItem[]
  totalArticles: number
}

export const ArticleList = ({articles, totalArticles}: ArticleProps) => {
    const router = useRouter();

    const [myArticles, setMyArticles] = useState<ArticleItem[]>(articles);
    const [totalNumberArticles, setTotalNumberArticles] = useState<number>(totalArticles);
    
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    const goBackPagination = () => {
        if(loading) return;
        setLoading(true);

        const newOffset = (offset - NUMERICAL_LIMIT_PER_PAGE_ARTICLES) < 0 ? 0 : offset - 6;
        setOffset(newOffset);
        getArticles(newOffset)
        .then((response) => {
            setMyArticles(response.articles);
            setTotalNumberArticles(response.count);
        });
    }

    const goAheadPagination = () => {
        if((offset + NUMERICAL_LIMIT_PER_PAGE_ARTICLES) >= totalNumberArticles || loading) return;
        setLoading(true);
        
        const newOffset = offset + NUMERICAL_LIMIT_PER_PAGE_ARTICLES;
        setOffset(newOffset);
        getArticles(newOffset)
        .then((response) => {
            setMyArticles(response.articles);
            setTotalNumberArticles(response.count);
        });
    }

    const goFirstPagination = () => {
        if(loading) return;
        setLoading(true);

        setOffset(0);
        getArticles(0)
        .then((response) => {
            setMyArticles(response.articles);
            setTotalNumberArticles(response.count);
        });
    }

    const goLastPagination = () => {
        if(loading) return;
        setLoading(true);

        const newOffset = 
        totalNumberArticles > NUMERICAL_LIMIT_PER_PAGE_ARTICLES ? 
        totalNumberArticles - NUMERICAL_LIMIT_PER_PAGE_ARTICLES : 0;
        setOffset(newOffset);
        getArticles(newOffset)
        .then((response) => {
            setMyArticles(response.articles);
            setTotalNumberArticles(response.count);
        });
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
    
    return (
        <>
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
        </>
    )
}