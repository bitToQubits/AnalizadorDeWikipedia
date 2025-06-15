"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { startTransition, useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { extractTermFromUrl } from "@/lib/dataConversions";
import { errorHandler } from "@/hooks/errorHandler";

export const Search = () => {
    const [searchTerm, writeSearchTerm] = React.useState("");
    const [wikipediaArticles, setWikipediaArticles] = React.useState([]);
    const router = useRouter();
    const [articleIsLoading, startTransition] = useTransition();

    const redirectUserToAnalyzePage = (wikipediaUrl: string) => {
        if(articleIsLoading) return;
        startTransition(() => {
            const wikipediaTerm = extractTermFromUrl(wikipediaUrl)
            router.push(`/analyze?w=${wikipediaTerm}`)
        });
    }
    
    const listWikipediaArticles = wikipediaArticles.map((wikipedia) => (
        <TableRow 
            key={wikipedia[1]}
            className="cursor-pointer" 
            onClick={() => redirectUserToAnalyzePage(wikipedia[1])}>
            <TableCell className="font-medium pt-3 pb-3">{wikipedia[0]}</TableCell>
        </TableRow>
    ));

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
                toast.error(errorHandler(error));
            });
        }, 500);

        return () => clearTimeout(debouncer);
    }, [searchTerm]);

    React.useEffect(() => {
        if(articleIsLoading){
            toast.loading("Cargando artículo..");
        }
    }, [articleIsLoading]);

    React.useEffect(() => {
        return () => {
            toast.dismiss();
        }
    }, []);

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