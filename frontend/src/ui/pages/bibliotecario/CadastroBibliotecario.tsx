
import CadastroBibliotecarioForm from "@/components/bibliotecario/cadastro/CadastroBibliotecarioForm";

export default function CadastroBibliotecario() {

    return (
        <main
            className="
                min-h-full
                bg-gray-background
                px-6 py-8
                dark:bg-navy-background
                md:px-10 md:py-10
            "
        >
            <section
                className="
                    mx-auto
                    w-full max-w-5xl
                    rounded-2xl
                    border border-gray-stroke
                    bg-white
                    p-6
                    shadow-md

                    dark:border-surface-mid
                    dark:bg-surface-dark

                    md:p-10
                "
            >

                <header className="mb-8">
                    <h1
                        className="
                            font-space-grotesk
                            text-2xl font-bold
                            text-black
                            dark:text-white
                            md:text-3xl
                        "
                    >
                        Cadastrar bibliotecário
                    </h1>

                    <p
                        className="
                            mt-3
                            font-ubuntu text-sm
                            text-text-muted
                            dark:text-text-light
                        "
                    >
                        Cadastre um novo profissional para integrar
                        a equipe da biblioteca.
                    </p>
                </header>

                <CadastroBibliotecarioForm />

            </section>
        </main>
    );
}
