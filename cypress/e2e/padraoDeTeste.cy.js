const user = {
  usuario: Cypress.env('APP_USER'),
  senha: Cypress.env('APP_PASS')
}

describe('Validação de Login', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Deve fazer login com sucesso com usuário e senha válidos', () => {
        console.log('USER:', user)
        cy.loginKeycloak(user.usuario, user.senha)
        cy.get('[data-testid="SearchIcon"]').should('be.visible')
    })

    it('Deve exibir erro para usuário inválido', () => {
        cy.loginKeycloakError('usuarioInvalido', user.senha)
    })

    it('Deve exibir erro para senha inválida', () => {
        cy.loginKeycloakError(user.usuario, 'senhaInvalida')
    })
})