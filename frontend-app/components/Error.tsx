import Link from "next/link"
import { Button } from "./ui/button"

interface ErrorProps{
    message: string
}

export const Error = ({message}: ErrorProps) => {
    return (
        <section className="m-10">
            <div>
                <Button asChild>
                    <Link href="/">Volver al buscador</Link>
                </Button>
            </div>
            <div className="bg-zinc-100 text-gray-950 my-3 p-2 rounded">
                <h2 className="text-2xl">Error</h2>
                <p>{message}</p>
            </div>
        </section>
    )
}