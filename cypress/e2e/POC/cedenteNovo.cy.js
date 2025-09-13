const user = {
  usuario: Cypress.env('APP_USER'),
  senha: Cypress.env('APP_PASS')
}
const empresa = {
  cnpj: '14144375000130',
  kyc: ['Clube de Futebol', 'Mútuo Petro', 'Participação Estrangeira', 'Mútuo SUS'],
  produtos: {
    ['CCB/NC']: { limite: '50000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['ANCORA']: { limite: '50000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['BOLETO']: { limite: '50000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['CLEAN']: { limite: '50000000', prazo: '365', taxa: '2.00', concentracao: '100' }
  }
}

describe('Criação de uma POC para um cedente novo na casa', () => {
    before(() => {
        cy.cleanupPessoa(empresa.cnpj)
    })

    beforeEach(() => {
        cy.loginKeycloak(user.usuario, user.senha)
    })
    //skip
    //it.only('encontrar coisas na tela', () => {
    //    cy.viewport(1920, 1080)
    //    cy.visit('/')
    //})

    it('Criar uma poc para um cedente novo na casa', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
        cy.criarProspect(empresa.cnpj, 'PROSPECT')
        cy.contains('Dados do Prospect').should('be.visible')
        cy.atualizarNomeFantasia(empresa.cnpj)
    })
    
    it('Validar que não posso criar uma poc para um cnpj que já está na esteira', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
        cy.criarProspect(empresa.cnpj, 'PROSPECT')
        cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible')
    })

    it('Preencho os dados necessários para prosseguir com a poc', () => {
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
        cy.wait(200)
        cy.preencherPleitoLimiteGlobal('50000000')
        for (const produto in empresa.produtos) {
            const { limite, prazo, taxa, concentracao } = empresa.produtos[produto]
            cy.adicionarProdutosPleito(produto, limite, prazo, taxa, concentracao)
        }
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DADOS COMPLEMENTARES')
        })

    it('Avançar a POC para KYC', () => {
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA KYC')
    })

    it('Avançar a POC para Aprovação Prospect', () => {
        cy.buscarProspectMonitor(empresa.cnpj, 'KYC', 'Responder KYC')
        for (const kyc of empresa.kyc) {
            cy.contains(kyc).click()
        }
        cy.contains('Salvar').click()
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA APROVAÇÃO PROSPECT')
    })

    it('Aprovar o Prospect', () => {
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor')
        cy.aprovarProspect('PLATAFORMA')
        cy.aprovarProspect('SUPERINTENDENCIA')
        cy.aprovarProspect('DIRETORIA COMERCIAL')
    })
})