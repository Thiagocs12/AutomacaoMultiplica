// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './consultasSql'
import "cypress-real-events";

// Ignora esse erro específico para o teste não falhar
Cypress.on('uncaught:exception', (err) => {
  if (
    /Cannot read properties of undefined \(reading 'content'\)/.test(err.message)
  ) {
    return false; // evita falha do teste
  }
  // para outros erros, deixa falhar normalmente
});

// Opcional: ignorar especificamente 502 para não derrubar o teste
Cypress.on('uncaught:exception', (err) => {
  if (/Request failed with status code 502/.test(err.message)) {
    return false; // não falha o teste por este erro
  }
});

Cypress.on('uncaught:exception', (err) => {
  if (/Request failed with status code 500/.test(err.message)) {
    return false; // não falha o teste por este erro
  }
});
Cypress.on('uncaught:exception', (err) => {
  if (/Network Error/.test(err.message)) {
    return false; // não falha o teste por este erro
  }
});
