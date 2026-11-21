describe('Login', () => {
  beforeEach(() => cy.visit('/auth'));
  
  it('Deve efetuar o login com credenciais válidas', () => {
    cy.visit('/auth');

    cy.get('#email').type('ana.souza@biblioteca.com');

    cy.get('#password').type('Ana@2026');

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/home")
  })

  it("Não deve permitir login com senha incorreta", () => {
        cy.visit("/auth");

        cy.get("#email").type("ana.souza@biblioteca.com");
        cy.get("#password").type("senhaerrada");

        cy.get('button[type="submit"]').click();

        // Deve continuar na tela de autenticação
        cy.url().should("include", "/auth");

        cy.contains("E-mail ou senha inválidos")
        .should("be.visible");
    });


  it("Deve impedir login com campos vazios", () => {
      cy.get("#email").should("have.value", "");

      cy.get("#password").should("have.value", "");

      cy.get('button[type="submit"]').click();

      // Verifica se continua na tela de login
      cy.url().should("include", "/auth");

      // Verifica se o navegador identifica o campo como obrigatório
      cy.get("#email").then(($input) => {
          expect(($input[0] as HTMLInputElement).validity.valid)
              .to.equal(false);
      });
  });

});