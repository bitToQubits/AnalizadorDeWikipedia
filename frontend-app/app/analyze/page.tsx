import { AnalyzedArticleContainer } from "@/components/AnalyzedArticleContainer";
import axios from "axios";
import { Error } from "@/components/Error";
import { errorHandler } from "@/hooks/errorHandler";
interface AnalyzedArticlePageProp {
    searchParams: { w: string }
}

export const Analyze = async ({ searchParams }: AnalyzedArticlePageProp) => {
    let {w:wikipediaTerm} = await searchParams;
    let theTermIsAnArticle:boolean = false;
    let errorMessage:string = "";
    let petitionToFetchArticle: any;

    const decodeWikipediaTerm = (wikipediaTerm: string) => {
        let wikipediaName = decodeURIComponent(wikipediaTerm);
        wikipediaName = wikipediaName.replaceAll("_"," ");
        return wikipediaName;
    }

    const wikipediaName = 
    typeof wikipediaTerm == "string" ? 
    decodeWikipediaTerm(wikipediaTerm) : "";
    
    try {
        petitionToFetchArticle = 
        await axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/analyze/${wikipediaName}`);

        theTermIsAnArticle = true;
        petitionToFetchArticle.data.article_name = wikipediaName;
    } catch(error:any) {
        theTermIsAnArticle = false;
        errorMessage = errorHandler(error);
    }

    if(!theTermIsAnArticle){
        return (
           <Error message={errorMessage}/>
        )
    }

    return (
        <AnalyzedArticleContainer wikipediaTerm={wikipediaTerm} wikipediaName={wikipediaName} wikipediaArticle={petitionToFetchArticle.data}/>
    )
}

export default Analyze;