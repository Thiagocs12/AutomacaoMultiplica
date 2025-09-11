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
});
