describe('Proteção de rotas', () => {
  it('Não deve permitir acesso à home sem o usuário estar autenticado', () => {

    cy.visit('/home')

    cy.url().should("include", "/auth");
  })

  it('Não deve permitir que um leitor acesse uma página de um bibliotecário', () => {
    cy.visit("/auth");

        cy.get("#email")
            .type("ana.souza@biblioteca.com");

        cy.get("#password")
            .type("Ana@2026");

        cy.get('button[type="submit"]')
            .click();

        // Aguarda o login
        cy.url().should("include", "/home");

        // Tenta acessar uma página exclusiva do bibliotecário
        cy.visit("/gestao-emprestimos");

        // Espera ser redirecionado para a Home
        cy.url().should("include", "/home");
  })
})