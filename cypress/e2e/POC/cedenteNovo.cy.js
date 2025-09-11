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

    it('Criar uma poc para um cedente novo na casa', () => {
        cy.criaPoc(empresa.cnpj)
    })

    it('Valido a não possibili', () => {
        cy.criaPoc(empresa.cnpj)
        cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible')
    })
})