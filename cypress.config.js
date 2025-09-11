// Importa a função que ajuda a definir as configs do Cypress
const { defineConfig } = require('cypress');
require('dotenv').config(); // carrega o .env

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      APP_PASS: process.env.APP_PASS,
      APP_USER: process.env.APP_USER,
      BASE_URL_KEYCLOAK: process.env.BASE_URL_KEYCLOAK,
    },

    setupNodeEvents(on, config) {
      // --- DB (MSSQL) ---------------------------------------------
      const sql = require('mssql');
      let pool; // conexão única reaproveitável

      const toBool = (v, def = false) => {
        if (v == null) return def;
        const s = String(v).toLowerCase();
        return s === '1' || s === 'true' || s === 'yes';
      };

      async function getPool() {
        if (pool) return pool;
        try {
          pool = await new sql.ConnectionPool({
            server: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT || 1433),
            options: {
              encrypt: toBool(process.env.DB_ENCRYPT, true),
              trustServerCertificate: toBool(process.env.DB_TRUST_SERVER_CERT, false),
            },
          }).connect();
          return pool;
        } catch (e) {
          // Deixa o erro claro no runner
          throw new Error(`Falha ao conectar no MSSQL: ${e.message}`);
        }
      }

      async function runQuery(sqlText, params = {}) {
        const p = await getPool();
        const req = p.request();
        // params: { id: 123, nome: 'abc' } -> usa @id, @nome na query
        for (const [name, value] of Object.entries(params)) {
          req.input(name, value);
        }
        const result = await req.query(sqlText);
        // Retorna algo serializável
        return {
          rowsAffected: result.rowsAffected,
          recordset: result.recordset || [],
          recordsets: result.recordsets || [],
        };
      }

      on('task', {
        // Mantém compatibilidade com o que você já usava:
        async queryDb(query) {
          const { recordset } = await runQuery(query);
          return recordset; // mantém o retorno antigo (apenas recordset)
        },

        // Novo alias esperado pelos testes (aceita SQL + params)
        async 'db:exec'({ sql: sqlText, params } = {}) {
          if (!sqlText) throw new Error("db:exec requer objeto { sql, params? }");
          return runQuery(sqlText, params || {});
        },
      });

      return config;
      // -------------------------------------------------------------
    },

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    testIsolation: true,
    chromeWebSecurity: false,
  },

  video: false,
  screenshotOnRunFailure: false,
});