const user = {
  usuario: Cypress.env('APP_USER'),
  senha: Cypress.env('APP_PASS')
}
const empresa = {
  cnpj: '14144375000130',
  senha: Cypress.env('APP_PASS')
}

describe('Criação de uma POC para um cedente novo na casa', () => {
    before(() => {
        cy.cleanupPessoa(empresa.cnpj)
    })

    beforeEach(() => {
        cy.visit('/')
        cy.loginKeycloak(user.usuario, user.senha)
    })
    //skip
    //it('encontrar coisas na tela', () => {
    //    cy.viewport(1920, 1080)
    //    cy.visit('/')
    //})

    it('Criar uma poc para um cedente novo na casa', () => {
        cy.menuProspect()
        cy.criarProspect(empresa.cnpj, 'PROSPECT')
        cy.contains('Dados do Prospect').should('be.visible')
        cy.atualizarNomeFantasia(empresa.cnpj)
    })
    
    it('Validar que não posso criar uma poc para um cnpj que já está na esteira', () => {
        cy.get('[data-testid="SearchIcon"]').should('be.visible')
        cy.menuProspect()
        cy.criarProspect(empresa.cnpj, 'PROSPECT')
        cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible')
    })

    it('Preecho os dados necessários para prosseguir com a poc', () => {
        cy.menuProspect()
        cy.contains('Monitor').should('be.visible').click()
        cy.get('[name="cnpj"]').type(empresa.cnpj)
        cy.contains('Buscar').should('be.visible').click()
        cy.get('.prospeccao-MuiIconButton-label > .prospeccao-MuiSvgIcon-root').click()
        cy.contains('Cadastrar Prospect').should('be.visible').click()
        cy.wait(500)
        cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div > button').trigger('mouseover')
        cy.get('[title="Pleito/Produto"]').click()
        cy.get('[name="limiteGlobal"]').clear().type('50000000')
        cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > form > div:nth-of-type(1) > div:nth-of-type(2) > button').click()
        cy.adicionarProdutosPleito('CCB/NC', '50000000', '365', '2.00', '100')
        cy.adicionarProdutosPleito('ANCORA', '50000000', '365', '2.00', '100')
        cy.adicionarProdutosPleito('BOLETO', '50000000', '365', '2.00', '100')
        cy.adicionarProdutosPleito('CLEAN', '50000000', '365', '2.00', '100')
        })
})