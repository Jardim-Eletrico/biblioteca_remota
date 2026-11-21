describe('Login', () => {
  it('Deve efetuar o login com credenciais válidas', () => {
    cy.visit('/auth');

    cy.get('#email').type('ana.souza@biblioteca.com');

    cy.get('#password').type('Ana@2026');

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/home")
  })
})