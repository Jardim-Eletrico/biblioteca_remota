
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("system");

    const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    );

    const resolvedTheme = theme === "system" ? systemTheme : theme;

    function toggleTheme() {
        setTheme(prev => {
            const temaAtual = prev === "system" ? systemTheme : prev;
            return temaAtual === "light" ? "dark" : "light";
        });
    }

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const atualizarTema = (event: MediaQueryListEvent) => {
            setSystemTheme(event.matches ? "dark" : "light");
        };

        media.addEventListener("change", atualizarTema);

        return () => media.removeEventListener("change", atualizarTema);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }, [resolvedTheme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme deve ser utilizado dentro de ThemeProvider");
    }

    return context;
}
