// Importa a função que ajuda a definir as configs do Cypress
const { defineConfig } = require('cypress');
require('dotenv').config(); // carrega o .env

// Exporta o objeto de configuração
module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      APP_PASS: process.env.APP_PASS,
      APP_USER: process.env.APP_USER,
      BASE_URL_KEYCLOAK: process.env.BASE_URL_KEYCLOAK,
    },
    setupNodeEvents(on, config) {
      // Inicializa conexão MSSQL só quando precisar
      const sql = require('mssql');
      let pool; // conexão única reaproveitável

      // Task para rodar queries
      on('task', {
        async queryDb(query) {
          if (!pool) {
            pool = await new sql.ConnectionPool({
              server: process.env.DB_HOST,
              user: process.env.DB_USER,
              password: process.env.DB_PASS,
              database: process.env.DB_NAME,
              port: Number(process.env.DB_PORT || 1433),
              options: {
                encrypt: process.env.DB_ENCRYPT === 'true',
                trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
              }
            }).connect();
          }

          const result = await pool.request().query(query);
          return result.recordset;
        }
      });

      return config;
    },

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    testIsolation: true,
    chromeWebSecurity: false,
  },

  video: false,
  screenshotOnRunFailure: false,
});
