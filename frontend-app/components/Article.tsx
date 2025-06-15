"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArticleProps } from "@/lib/types";

export const Article = ({wikipediaTerm, wikipediaArticle, dictionary}: ArticleProps) => {
    return (
        <>
            <section className="bg-zinc-100 text-gray-950 my-3 p-2 rounded">
                <a 
                    className="text-xl underline decoration-indigo-500 text-indigo-500 break-all" 
                    href={"https://es.wikipedia.org/wiki/"+wikipediaTerm}>
                    https://es.wikipedia.org/wiki/{wikipediaTerm}
                </a>
                <div className="mt-5 mb-5">
                    <p>{wikipediaArticle["article_summary"]}</p>
                </div>
            </section>
            <section>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <article className="mt-7 lg:mt-0">
                        <h3 className="lg:text-xl text-xl mb-4 font-semibold bg-zinc-100 text-gray-950 p-1 rounded">
                            {dictionary.length} palabras más usadas
                        </h3>
                        <div className="max-h-75 overflow-y-auto mt-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Conteo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {
                                    dictionary.map((dictionaryElement, index) => 
                                        <TableRow key={index}>
                                            <TableCell>{dictionaryElement[0]}</TableCell>
                                            <TableCell>{dictionaryElement[1]}</TableCell>
                                        </TableRow>
                                    )
                                }
                                </TableBody>
                            </Table>
                        </div>
                        <small className="mt-2">Excluyendo stop words</small>
                    </article>
                    <article className="mt-7 lg:mt-0">
                        <h3 className="lg:text-lg text-xl mb-3 font-semibold bg-zinc-100 text-gray-950 p-1 rounded">
                            Entidades del artículo
                        </h3>
                        <div className="max-h-75 overflow-y-auto mt-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Palabra</TableHead>
                                        <TableHead>Entidad</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {
                                    wikipediaArticle["entities"].map((entity, index) => 
                                        <TableRow key={index}>
                                            <TableCell>{entity[0]}</TableCell>
                                            <TableCell>{entity[1]}</TableCell>
                                        </TableRow>
                                    )
                                }
                                </TableBody>
                            </Table>
                        </div>
                    </article>
                    <article className="mt-7 lg:mt-0">
                        <h3 className="lg:text-lg text-xl mb-3 font-semibold bg-zinc-100 text-gray-950 p-1 rounded">
                            Tipo de palabras
                        </h3>
                        <div className="max-h-75 overflow-y-auto mt-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Palabra</TableHead>
                                        <TableHead>Tipo de palabra</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {
                                    wikipediaArticle["type_of_words"].map((type_word, index) => 
                                        <TableRow key={index}>
                                            <TableCell>{type_word[0]}</TableCell>
                                            <TableCell>{type_word[1]}</TableCell>
                                        </TableRow>
                                    )
                                }
                                </TableBody>
                            </Table>
                        </div>
                    </article>
                </div>
            </section>
        </>
    )
}