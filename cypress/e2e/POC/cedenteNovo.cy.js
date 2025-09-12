const user = {
  usuario: Cypress.env('APP_USER'),
  senha: Cypress.env('APP_PASS')
}
const empresa = {
  cnpj: '14144375000130',
  senha: Cypress.env('APP_PASS')
}

describe('Criação de uma POC para um cedente novo na casa', () => {
    //before(() => {
    //    cy.cleanupPessoa(empresa.cnpj)
    //})

    beforeEach(() => {
        cy.visit('/')
        cy.loginKeycloak(user.usuario, user.senha)
    })

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

    it.only('Preecho os dados necessários para prosseguir com a poc', () => {
        cy.menuProspect()
        cy.contains('Monitor').should('be.visible').click()
        cy.get('[name="cnpj"]').type(empresa.cnpj)
        cy.contains('Buscar').should('be.visible').click()
        cy.get('.prospeccao-MuiIconButton-label > .prospeccao-MuiSvgIcon-root').click()
        cy.contains('Cadastrar Prospect').should('be.visible').click()
    })
})