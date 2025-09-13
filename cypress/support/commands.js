// 1. Define a origem do Keycloak a partir das variáveis de ambiente
const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK');

// 2. Comando customizado para login bem-sucedido via Keycloak
Cypress.Commands.add('loginKeycloak', (usuario, senha) => {
  // Garante que está na aplicação antes de trocar de domínio
  cy.visit('/');
  // Executa o fluxo de login no domínio do Keycloak
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').clear().type(usuario);
      cy.get('#password').clear().type(senha, { log: false });
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
      cy.get('#username').clear().type(usuario);
      cy.get('#password').clear().type(senha, { log: false });
      cy.get('form').submit();
      // Valida que a mensagem de erro aparece
      cy.contains('Usuário ou senha inválidos').should('be.visible')
  });
});

// 4. Comando customizado para acessar o menu Prospect na aplicação
Cypress.Commands.add('menu', (modulo, area, entidade) => {
  cy.contains(modulo).click()
  cy.contains(area).click()
  cy.contains('Home').trigger('mouseover')
  cy.contains(entidade).click()
});

// 5. Criar prospect
Cypress.Commands.add('criarProspect', (cnpj, tipoProspect) => {
  cy.contains('Novo Prospect').click()
  cy.get('.MuiTextField-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').type(cnpj) //#campo cnpj criação da POC
  cy.realPress('Tab')
  cy.wait(500)
  cy.get('#mui-component-select-tipoProspect').click()//#campo tipo prospect criação da POC
  cy.get('[role="option"]').contains(tipoProspect) .click();
  cy.get('.prospeccao-MuiInputBase-root').type('Gerente Automa')//#campo gerente Criação da POC
  cy.get('[role="option"]').contains('GERENTE AUTOMAÇÃO').click();
  cy.realPress('Tab')
  cy.contains('Salvar').click()
});

Cypress.Commands.add('adicionarProdutosPleito', (produto, limite, prazo, taxa, concetracao) => {
  cy.get('.prospeccao-MuiGrid-root > :nth-child(2)').click()//# adicionar produto pleito
  cy.contains(produto).click()
  cy.wait(200)
  cy.contains('span', produto).click()
  cy.wait(1000)
  cy.get('.css-1c6kgto > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(limite)//#adição de grupo de produto limite
  cy.wait(200)
  cy.get(':nth-child(3) > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(prazo)//#adição de grupo de produto prazo
  cy.wait(200)
  cy.get('.css-1yp82fk > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(taxa)//#adição de grupo de produto taxa
  cy.wait(200)
  cy.get('.css-2cy7sg > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(concetracao)//#adição de grupo de produto concetracao
  cy.wait(200)
  cy.get('.css-1bvc4cc > .MuiButton-root').click()
})

Cypress.Commands.add('preencherPleitoLimiteGlobal', (limite) => {
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div > button')//#Mais infos da POC ex: pleito ...
    .trigger('mouseover')
  cy.get('[title="Pleito/Produto"]').click()
  cy.get('[name="limiteGlobal"]').clear().type(limite)
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > form > div:nth-of-type(1) > div:nth-of-type(2) > button')//#Salvar Pleito ...
    .click()
})

Cypress.Commands.add('acessarProspectNaTela', (acao) => {
  cy.get('.prospeccao-MuiIconButton-label > .prospeccao-MuiSvgIcon-root').click()//#Ações da POC no monitor
  cy.contains(acao).click()
})

Cypress.Commands.add('buscarProspectMonitor', (cnpj, tela, acao = null) => {  
  cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
  cy.contains(tela).click()
  cy.get('[name="cnpj"]').type(cnpj)
  cy.contains('Buscar').click()
  if (acao !== null && acao !== undefined) {
    cy.acessarProspectNaTela(acao)
  }
})

Cypress.Commands.add('avancarEsteira', (parecer) => {
  cy.get('[title="Parecer"]').click()
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()//#Botão adicionar parecer
  cy.get('[name="parecer"]').type(parecer)
  cy.contains('Salvar').click()
  cy.contains('Confirmar').click()
  cy.contains('Avançar').click()
  cy.contains('Confirmar').click()
})

Cypress.Commands.add('aprovarProspect', (aprovador) => {
  cy.wait(2000)
  cy.acessarProspectNaTela('Analisar Prospect')
  cy.avancarEsteira('TESTE AUTOMACAO - APROVAR PROSPECT '+ aprovador)
})