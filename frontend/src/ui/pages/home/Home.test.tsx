import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";


import Home from "./home";

import { listarLivros } from "@/src/services/livrosService";
import { buscarPerfil } from "@/src/services/perfilService";
import { tokenExpirado } from "@/src/utils/token";


const mocks = vi.hoisted(() => ({
    listarLivros: vi.fn(),
    buscarPerfil: vi.fn(),
    tokenExpirado: vi.fn,
})
);

vi.mock("@/src/services/livrosService", () => ({
    listarLivros: mocks.listarLivros,
}));

vi.mock("@/src/services/perfilService", () => ({
    buscarPerfil: mocks.buscarPerfil,
}));

vi.mock("@/src/utils/token", () => ({
    tokenExpirado: mocks.tokenExpirado,
}));

vi.mock("react-infinite-scroll-component", () => ({
    default: ({ children }: {children: ReactNode}) => (
        <div>{children}</div>
    )
})
)

describe ("Home", () {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear()
    })
})