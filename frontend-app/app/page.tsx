import { Search } from "@/components/Search";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="max-w-6/10 ml-auto mr-auto mt-20">
      <section className="m-auto">
          <div className="mb-7">
            <h1 className="text-5xl inline font-semibold text-center">
              AnalizarWikipedia
            </h1>
            <Button asChild className="inline float-right">
              <Link href="/my-articles">Articulos Guardados</Link>
            </Button>
          </div>
          <Search/>
      </section>
      <Toaster />
    </main>
  );
}
