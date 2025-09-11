const cypress = require("cypress");
const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK');


// Command para login via Keycloak (cross-origin)
Cypress.Commands.add('loginKeycloak', (usuario, senha) => {
  // Garante que estamos no app antes de trocar de domínio
  cy.visit('/');
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').should('be.visible').clear().type(usuario);
      cy.get('#password').should('be.visible').clear().type(senha, { log: false });
      cy.get('form').submit();
    }
  );
  // Verifica se voltou pro app
  cy.location('origin', { timeout: 60000 }).should('eq', Cypress.config('baseUrl'));
});

Cypress.Commands.add('loginKeycloakError', (usuario, senha) => {
  // Garante que estamos no app antes de trocar de domínio
  cy.visit('/');
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').should('be.visible').clear().type(usuario);
      cy.get('#password').should('be.visible').clear().type(senha, { log: false });
      cy.get('form').submit();
      cy.contains('Usuário ou senha inválidos').should('be.visible')
    }
  );

cypress.Commands.add('criaPoc', (cnpjCpf) => {
    cy.get('[data-testid="SearchIcon"]').should('be.visible')
    cy.contains('Beyond BackOffice').should('be.visible').click()
    cy.contains('Comercial').should('be.visible').click()
    cy.contains('Home').should('be.visible').trigger('mouseover')
    cy.contains('Prospect').should('be.visible').click()
    cy.contains('Novo Prospect').should('be.visible').click()
    cy.get('.MuiTextField-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').type(cnpjCpf)
    cy.realPress('Tab')
    cy.wait(500)
    cy.get('#mui-component-select-tipoProspect').click()
    cy.get('[role="option"]').contains('PROSPECT') .click();
    cy.get('.prospeccao-MuiInputBase-root').type('Gerente Automa')
    cy.get('[role="option"]').contains('GERENTE AUTOMAÇÃO').click();
    cy.realPress('Tab')
    cy.contains('Salvar').should('be.visible').click()
    cy.contains('Dados do Prospect').should('be.visible')
  })
});
