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
)