
describe("Detalhes dos livros", () => {
    beforeEach(() => {
        cy.visit("/auth");

        cy.get("#email")
            .should("be.visible")
            .type("ana.souza@biblioteca.com");

        cy.get("#password")
            .should("be.visible")
            .type("Ana@2026");

        cy.get('button[type="submit"]')
            .should("be.visible")
            .click();

        cy.url().should("include", "/home");
    });

    // =========================================
    // ACESSAR DETALHES
    // =========================================

    it("Deve apresentar erro ao acessar uma edição com ID inválido", () => {
        cy.visit("/detalhes-livro/abc");

        cy.contains("ID de edição inválido.")
            .should("be.visible");

        cy.contains("VOLTAR PARA HOME")
            .should("be.visible");
    });

    it("Deve abrir os detalhes de um livro ao clicar em seu card", () => {
        cy.visit("/home");

        cy.contains("Pedagogia do Oprimido", { timeout: 10000 })
            .should("be.visible")
            .click();

        cy.url().should("match", /\/detalhes-livro\/\d+$/);

        cy.get("h1")
            .should("contain.text", "Pedagogia do Oprimido");

        cy.get('img[alt="Capa de Pedagogia do Oprimido"]')
            .should("be.visible");
    });

    // =========================================
    // ADICIONAR AO CARRINHO
    // =========================================

    it("Deve adicionar um livro disponível ao carrinho", () => {
    cy.intercept("GET", "**/api/carrinho/").as("carregarCarrinho");

    cy.visit("/home");

    cy.contains("Pedagogia do Oprimido", { timeout: 10000 })
        .should("be.visible")
        .click();

    cy.wait("@carregarCarrinho");

    // Se já estiver no carrinho, remove primeiro.
    cy.get("button").then(($botoes) => {
        const texto = $botoes.text();

        if (texto.includes("REMOVER DO CARRINHO")) {
            cy.contains("button", "REMOVER DO CARRINHO")
                .should("be.visible")
                .click();

            cy.contains("Livro removido do carrinho.", {
                timeout: 10000
            }).should("be.visible");
        }
    });

    // Adiciona o livro.
    cy.contains("button", "ADICIONAR AO CARRINHO", {
        timeout: 10000
    })
        .should("be.visible")
        .and("not.be.disabled")
        .click();

    cy.contains("Livro adicionado ao carrinho.", {
        timeout: 10000
    }).should("be.visible");

    cy.contains("button", "REMOVER DO CARRINHO")
        .should("be.visible");
});

    // =========================================
    // REMOVER DO CARRINHO
    // =========================================

    it("Deve remover um livro que já está no carrinho", () => {
        cy.visit("/home");

        cy.contains("Pedagogia do Oprimido", { timeout: 10000 })
            .should("be.visible")
            .click();

        cy.contains("button", "CARREGANDO CARRINHO...", {
            timeout: 15000
        }).should("not.exist");

        // Se ainda não estiver no carrinho, adiciona primeiro.
        cy.get("button").then(($botoes) => {
            const texto = $botoes.text();

            if (texto.includes("ADICIONAR AO CARRINHO")) {
                cy.contains("button", "ADICIONAR AO CARRINHO")
                    .should("not.be.disabled")
                    .click();

                cy.contains("Livro adicionado ao carrinho.", {
                    timeout: 10000
                }).should("be.visible");
            }
        });

        cy.contains("button", "REMOVER DO CARRINHO", {
            timeout: 10000
        })
            .should("be.visible")
            .and("not.be.disabled")
            .click();

        cy.contains("Livro removido do carrinho.", {
            timeout: 10000
        }).should("be.visible");

        cy.contains("button", "ADICIONAR AO CARRINHO")
            .should("be.visible");
    });

    // =========================================
    // LIMITE DE DOIS LIVROS
    // =========================================

    it("Deve impedir adicionar A República ao atingir o limite de dois livros", () => {

    // Função auxiliar para garantir que um livro esteja no carrinho.
    function garantirLivroNoCarrinho(titulo: string, alias: string) {
        cy.intercept("GET", "**/api/carrinho/").as(alias);

        cy.visit("/home");

        cy.contains(titulo, { timeout: 10000 })
            .should("be.visible")
            .click();

        // Espera a API terminar de carregar o carrinho.
        cy.wait(`@${alias}`);

        cy.get("button")
            .filter((_, elemento) =>
                /ADICIONAR AO CARRINHO|REMOVER DO CARRINHO|LIMITE DE 2 LIVROS ATINGIDO/.test(
                    elemento.innerText
                )
            )
            .should("have.length", 1)
            .then(($botao) => {
                const texto = $botao.text();

                if (texto.includes("ADICIONAR AO CARRINHO")) {
                    cy.wrap($botao).click();

                    cy.contains("Livro adicionado ao carrinho.", {
                        timeout: 10000
                    }).should("be.visible");

                } else if (texto.includes("REMOVER DO CARRINHO")) {
                    // O livro já está no carrinho.
                    return;

                } else {
                    throw new Error(
                        `Não foi possível adicionar "${titulo}". O carrinho já atingiu o limite ou o livro está indisponível.`
                    );
                }
            });
    }

    // Garantir os dois livros no carrinho.
    garantirLivroNoCarrinho(
        "Pedagogia do Oprimido",
        "carrinhoPedagogia"
    );

    garantirLivroNoCarrinho(
        "Brasil: Nunca Mais",
        "carrinhoBrasil"
    );

    // Abrir A República.
    cy.intercept("GET", "**/api/carrinho/").as("carrinhoRepublica");

    cy.visit("/home");

    cy.contains("A República", { timeout: 10000 })
        .should("be.visible")
        .click();

    cy.get("h1").should("contain.text", "A República");

    // Esperar o carregamento real do carrinho.
    cy.wait("@carrinhoRepublica");

    // Verificar se o limite foi aplicado.
    cy.contains("button", "LIMITE DE 2 LIVROS ATINGIDO", {
        timeout: 10000
    })
        .should("be.visible")
        .and("be.disabled");
  }); 
});
