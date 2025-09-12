// 1. Define a origem do Keycloak a partir das variáveis de ambiente
const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK');

// 2. Comando customizado para login bem-sucedido via Keycloak
Cypress.Commands.add('loginKeycloak', (usuario, senha) => {
  // Garante que está na aplicação antes de trocar de domínio
  cy.visit('/');
  // Executa o fluxo de login no domínio do Keycloak
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').should('be.visible').clear().type(usuario);
      cy.get('#password').should('be.visible').clear().type(senha, { log: false });
      cy.get('form').submit();
    }
  );
  // Verifica se retornou para o domínio da aplicação
  cy.location('origin', { timeout: 60000 }).should('eq', Cypress.config('baseUrl'));
});

// 3. Comando customizado para login com erro via Keycloak
Cypress.Commands.add('loginKeycloakError', (usuario, senha) => {
  cy.visit('/');
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').should('be.visible').clear().type(usuario);
      cy.get('#password').should('be.visible').clear().type(senha, { log: false });
      cy.get('form').submit();
      // Valida que a mensagem de erro aparece
      cy.contains('Usuário ou senha inválidos').should('be.visible')
  });
});

// 4. Comando customizado para acessar o menu Prospect na aplicação
Cypress.Commands.add('menuProspect', () => {
  cy.contains('Beyond BackOffice').should('be.visible').click()
  cy.contains('Comercial').should('be.visible').click()
  cy.contains('Home').should('be.visible').trigger('mouseover')
  cy.contains('Prospect').should('be.visible').click()
});

// 5. Criar prospect
Cypress.Commands.add('criarProspect', (cnpj, tipoProspect) => {
  cy.contains('Novo Prospect').should('be.visible').click()
  cy.get('.MuiTextField-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').type(cnpj)
  cy.realPress('Tab')
  cy.wait(500)
  cy.get('#mui-component-select-tipoProspect').click()
  cy.get('[role="option"]').contains(tipoProspect) .click();
  cy.get('.prospeccao-MuiInputBase-root').type('Gerente Automa')
  cy.get('[role="option"]').contains('GERENTE AUTOMAÇÃO').click();
  cy.realPress('Tab')
  cy.contains('Salvar').should('be.visible').click()
});

Cypress.Commands.add('adicionarProdutosPleito', (produto, limite, prazo, taxa, concetracao) => {
  cy.get('.prospeccao-MuiGrid-root > :nth-child(2)').click()
  cy.contains(produto).should('be.visible').click()
  cy.wait(500)
  cy.contains('span', produto).should('be.visible').click()
  cy.wait(1000)
  cy.get('.css-1c6kgto > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(limite)
  cy.wait(500)
  cy.get(':nth-child(3) > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(prazo)
  cy.wait(500)
  cy.get('.css-1yp82fk > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(taxa)
  cy.wait(500)
  cy.get('.css-2cy7sg > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(concetracao)
  cy.wait(500)
  cy.get('.css-1bvc4cc > .MuiButton-root').click()
})