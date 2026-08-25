const Database = require("better-sqlite3");

const db = new Database("minha_carteira.db");

// Ativa as chaves estrangeiras do SQLite
db.pragma("foreign_keys = ON");

// Tabela de usuários
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);

// Tabela de transações
db.exec(`
    CREATE TABLE IF NOT EXISTS transacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
        frequency TEXT NOT NULL CHECK (frequency IN ('recorrente', 'eventual')),
        date TEXT NOT NULL,
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (usuario_id)
            REFERENCES usuarios(id)
            ON DELETE CASCADE
    );
`);

// Índices
db.exec(`
    CREATE INDEX IF NOT EXISTS idx_transacoes_date
    ON transacoes(date);

    CREATE INDEX IF NOT EXISTS idx_transacoes_type
    ON transacoes(type);

    CREATE INDEX IF NOT EXISTS idx_transacoes_usuario
    ON transacoes(usuario_id);
`);

console.log("Banco de dados conectado!");

module.exports = db;