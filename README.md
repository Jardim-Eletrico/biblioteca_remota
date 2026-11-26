# 📚 Biblioteca Digital | Libris
### Projeto de TCC — SENAI | Desenvolvimento de Sistemas

O **Libris** é um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) da disciplina de Desenvolvimento de Sistemas do SENAI.

A plataforma foi idealizada com o propósito de solucionar dificuldades relacionadas à gestão e à consulta dos acervos das bibliotecas das unidades SENAI, oferecendo uma solução digital para facilitar o acesso às informações e o gerenciamento de seus exemplares.

---

## 📖 Sobre o projeto

O Libris foi desenvolvido utilizando tecnologias e ferramentas estudadas ao longo do curso, com destaque para as linguagens **Python** e **TypeScript**, além de seus respectivos frameworks e bibliotecas.

Sua construção envolveu diversas horas de planejamento, desenvolvimento, testes e aprimoramentos, realizados tanto presencialmente quanto fora do ambiente escolar.

O resultado é uma aplicação web que busca tornar a administração dos acervos bibliográficos mais prática e proporcionar uma experiência de navegação acessível aos usuários.

## 🛠️ Tecnologias utilizadas

### 🐍 Python — Backend

Responsável pela estrutura lógica e pelo processamento dos dados da aplicação, o backend foi desenvolvido utilizando **Python**, em conjunto com o **Django** e o **Django REST Framework**.

Essas tecnologias permitem estruturar a aplicação, gerenciar as informações armazenadas no banco de dados e disponibilizar os dados ao frontend por meio de uma API REST.

### ⚛️ TypeScript — Frontend

A interface da aplicação foi desenvolvida com **TypeScript** e **React**, utilizando também o **Tailwind CSS** para a estilização dos componentes.

Essa combinação possibilitou a construção de uma interface dinâmica, organizada e responsiva, adaptável a diferentes tamanhos de tela.

Embora a aplicação também ofereça suporte a computadores e tablets, o desenvolvimento teve como principal foco os dispositivos móveis, priorizando a experiência de navegação em smartphones.

### 🗄️ SQLite — Banco de dados

Para o armazenamento das informações referentes ao acervo bibliográfico, usuários e bibliotecários, foi utilizado o **SQLite**.

Sua integração com o Django e sua estrutura baseada em um único arquivo tornam o gerenciamento dos dados simples e leve, dispensando a necessidade de configurar um servidor de banco de dados independente durante o desenvolvimento.

### 📦 Bibliotecas adicionais

Além das tecnologias principais, foram utilizadas diversas bibliotecas complementares para auxiliar no desenvolvimento da interface, na manipulação dos dados e na implementação de funcionalidades específicas.

Essas ferramentas contribuíram para simplificar o desenvolvimento e aprimorar o funcionamento geral da aplicação.

---

## ⚙️ Instalação das dependências

Antes de executar o projeto, é necessário instalar as dependências do backend e do frontend.

### Backend

Na pasta raiz do projeto, execute:

```bash
pip install -r requirements.txt
```

**Requisito:** Python 3.14.6 ou superior.

Caso ainda não tenha o Python instalado, acesse a [página oficial de downloads](https://www.python.org/downloads/).

### Frontend

Acesse a pasta do frontend:

```bash
cd ./frontend/
```

Em seguida, instale as dependências:

```bash
npm install
```

---

## 🚀 Executando o projeto

Após instalar todas as dependências, é possível iniciar o backend e o frontend separadamente.

### Backend

Na pasta raiz do projeto, execute:

```bash
python manage.py runserver
```

Por padrão, o servidor de desenvolvimento do Django será iniciado em:

`http://127.0.0.1:8000/`

### Frontend

Em outro terminal, acesse a pasta `frontend` e execute:

```bash
npm run dev
```

O Vite disponibilizará o endereço local para acessar a interface da aplicação, geralmente:

`http://localhost:5173/` --> Abra este link no seu navegador padrão.


---

## 📌 Considerações finais

O Libris representa a aplicação prática dos conhecimentos adquiridos ao longo do curso de Desenvolvimento de Sistemas, reunindo diferentes tecnologias em uma única solução.

Mais do que um projeto acadêmico, seu desenvolvimento proporcionou experiência com integração entre frontend e backend, gerenciamento de banco de dados, desenvolvimento de APIs e construção de interfaces responsivas.
