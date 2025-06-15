import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getArticles } from "@/hooks/getArticles";
import { ArticleList } from "@/components/ArticlesList";

export const MyArticles = async () => {
    const initialArticles = await getArticles(0);

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
                {initialArticles.count == 0 && (<p>No tienes artículos guardados</p>)}
            </section>
            <section>
                <ArticleList articles={initialArticles.articles} totalArticles={initialArticles.count}/>
            </section>
        </main>
    )
}

export default MyArticles;