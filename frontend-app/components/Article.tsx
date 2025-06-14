"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link";

type ArticleProps = {
    encodedWikipediaTerm: string | null,
    wikipediaArticle: {
        article_summary: string,
        dictionary_of_words: { [key: string]: number },
        entities: [string, string][],
        type_of_words: [string, string][],
        article_name: string
    },
    dictionary: [string, number][]
}

export const Article = ({encodedWikipediaTerm, wikipediaArticle, dictionary}: ArticleProps) => {
    return (
        <>
            <section>
                <a 
                    className="text-xl underline decoration-indigo-500 text-indigo-500" 
                    href={"https://es.wikipedia.org/wiki/"+encodedWikipediaTerm}>
                    https://es.wikipedia.org/wiki/{encodedWikipediaTerm}
                </a>
                <div className="mt-5 mb-5">
                    <p>{wikipediaArticle["article_summary"]}</p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <article>
                        <h3 className="text-base mb-4 font-semibold">
                            50 palabras más usadas. Excluyendo stop words.
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
                                        dictionary.map(dictionaryElement => 
                                            <TableRow key={crypto.randomUUID()}>
                                                <TableCell>{dictionaryElement[0]}</TableCell>
                                                <TableCell>{dictionaryElement[1]}</TableCell>
                                            </TableRow>
                                        )
                                }
                                </TableBody>
                            </Table>
                        </div>
                    </article>
                    <article>
                        <h3 className="text-lg mb-3 font-semibold">
                            50 entidades del artículo
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
                                        wikipediaArticle["entities"].map(entity => 
                                            <TableRow key={crypto.randomUUID()}>
                                                <TableCell>{entity[0]}</TableCell>
                                                <TableCell>{entity[1]}</TableCell>
                                            </TableRow>
                                        )
                                }
                                </TableBody>
                            </Table>
                        </div>
                    </article>
                    <article>
                        <h3 className="text-lg mb-3 font-semibold">
                            50 tipo de palabras
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
                                        wikipediaArticle["type_of_words"].map(type_word => 
                                            <TableRow key={crypto.randomUUID()}>
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