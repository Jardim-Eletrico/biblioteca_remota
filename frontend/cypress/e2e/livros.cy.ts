describe('Listagem de livros', () => {
  beforeEach(() => {
    cy.visit('/auth');

    cy.get('#email').type('ana.souza@biblioteca.com');

    cy.get("#password").type("Ana@2026");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/home");

    });


      it('Deve exibir os livros na página inicial', () => {
      cy.get('input[placeholder*="Harry Potter"]').should("be.visible")

      cy.get(".grid").should("exist");

      cy.get(".grid > div").should("have.length.greaterThan", 0);
    })

    it("Deve exibir mensagem quando nenhum livro for encontrado", () => {
        cy.get('input[placeholder*="Harry Potter"]')
            .type("LivroInexistenteXYZ123");

        cy.get('button[type="submit"]').click();

        cy.contains("Nenhum livro encontrado.", { timeout: 10000 })
            .should("be.visible");
    });

    it("Deve exibir o livro pesquisado", () => {
        cy.get('input[placeholder*="Harry Potter"]')
            .type("Pedagogia do Oprimido");

        cy.get('button[type="submit"]').click();

        cy.contains("Pedagogia do Oprimido", { timeout: 10000 })
            .should("be.visible");
    });
  })
