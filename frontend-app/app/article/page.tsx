import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { SavedArticleContainer } from "@/components/SavedArticleContainer";
import { Error } from "@/components/Error";
import { errorHandler } from "@/hooks/errorHandler";

interface SavedArticlePageProp {
    searchParams: { id: string }
}

export const SavedArticle = async ({ searchParams }: SavedArticlePageProp) => {
    let {id} = await searchParams;
    const articleId = Number(id);
    let petitionToFetchArticle: any;
    let errorMessage = "";

    try {
        petitionToFetchArticle = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/`+articleId);
    } catch(error: any) {
        errorMessage = errorHandler(error);
    }

    if(errorMessage != ""){
        return (
            <Error message={errorMessage}/>
        )
    }

    return (
        <main className="lg:max-w-8/10 lg:pr-0 lg:pl-0 pt-15 m-auto pr-5 pl-5">
            <section>
                    <div className="mb-3">
                        <h1 className="text-3xl font-bold mb-5 lg:inline bg-zinc-100 text-gray-950 p-1 rounded">{petitionToFetchArticle.data.article_name}</h1>
                        <Button asChild className="mb-2 mr-3 lg:mr-0 lg:inline lg:float-right">
                            <Link href="/">Volver al buscador</Link>
                        </Button>
                        <Button asChild className="mb-2 mr-2 lg:inline lg:float-right cursor-pointer bg-transparent hover:bg-zinc-200 text-dark">
                            <Link href="/my-articles">Mis artículos</Link>
                        </Button>
                    </div>
                </section>
                <SavedArticleContainer articleId={articleId} wikipediaArticle={petitionToFetchArticle.data} comment={petitionToFetchArticle.data.note ?? ""} />
        </main>
    )
}

export default SavedArticle;