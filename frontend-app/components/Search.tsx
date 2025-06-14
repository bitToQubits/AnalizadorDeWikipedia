"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { extractTermFromUrl } from "@/utils/dataConversions";

export const Search = () => {
    const [searchTerm, writeSearchTerm] = React.useState("");
    const [wikipediaArticles, setWikipediaArticles] = React.useState([]);
    const router = useRouter();

    const redirectUserToAnalyzePage = (wikipedia_url: string) => {
        const wikipedia_term = extractTermFromUrl(wikipedia_url)
        router.push(`/analyze?w=${wikipedia_term}`)
    }
    
    const listWikipediaArticles = wikipediaArticles.map(wikipedia =>
        <TableRow 
            key={crypto.randomUUID()}
            className="cursor-pointer" 
            onClick={() => redirectUserToAnalyzePage(wikipedia[1])}>
            <TableCell className="font-medium pt-3 pb-3">{wikipedia[0]}</TableCell>
        </TableRow>
    );

    React.useEffect(() => {
        const debouncer = setTimeout(() => {
            const searchTermCleaned = searchTerm.trim()

            if(searchTermCleaned == "") return;

            axios
            .get(process.env.NEXT_PUBLIC_SERVER_URL+`articles/search_wikipedia/${searchTermCleaned}`)
            .then((response) => {
                setWikipediaArticles(response.data)
            })
            .catch((error) => {
                if(error?.response?.data?.message){
                    return toast.error(error.response.data.message);
                }
                toast.error(error.message);
            });
        }, 500);

        return () => clearTimeout(debouncer);
    }, [searchTerm]);

  return (
    <section>
        <Input
            type="text"
            placeholder="Buscar..."
            className="w-full p-5 h-12"
            onChange={(event) => writeSearchTerm(event.target.value)}
        />
        <div className="max-h-85 overflow-y-auto mt-2">
            <Table>
                <TableBody>
                    {listWikipediaArticles}
                </TableBody>
            </Table>
        </div>
    </section>
  )
}