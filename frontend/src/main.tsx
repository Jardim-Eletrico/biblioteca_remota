import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
//Aviso: Módulos de CSS foram usados em partes que o estilo se repete, mas não necessáriamente há uma necessidade para criar um componente próprio.

//Fonts
import '@fontsource-variable/space-grotesk';
import '@fontsource/ubuntu';
import '@fontsource-variable/roboto';
import '@fontsource/source-serif-pro';
import '@fontsource-variable/roboto';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
