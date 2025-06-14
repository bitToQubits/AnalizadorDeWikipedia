import { Search } from "@/components/Search";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Home = () => {
  return (
    <main className="lg:max-w-6/10 lg:p-0 ml-auto mr-auto mt-20 p-5">
      <section className="m-auto">
          <div className="mb-7">
            <h1 className="text-5xl lg:inline font-semibold text-center">
              AnalizarWikipedia
            </h1>
            <Button asChild className="lg:inline lg:float-right lg:mt-0 mt-5">
              <Link href="/my-articles">Articulos Guardados</Link>
            </Button>
          </div>
          <Search/>
      </section>
    </main>
  );
}

export default Home;