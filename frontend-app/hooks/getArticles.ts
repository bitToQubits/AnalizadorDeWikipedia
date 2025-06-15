import axios from "axios";
import { ArticleItem } from "@/lib/types";

export async function getArticles(offset: number = 0) {
    try{
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `articles/list?offset=` + offset);
        return {
            articles: response.data.articles_list as ArticleItem[],
            count: response.data.count as number
        };
    }catch (error) {
        return { articles: [], count: 0 };
    }
}