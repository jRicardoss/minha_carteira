const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());


// ROTA PRINCIPAL
// GET /

app.get("/", (req, res) => {
    res.json({
        mensagem: "API Minha Carteira funcionando!"
    });
});

// LISTAR TRANSAÇÕES
// GET /api/transacoes


app.get("/api/transacoes", (req, res) => {
    try {
        const transacoes = db.prepare(`
            SELECT *
            FROM transacoes
            ORDER BY date DESC, id DESC
        `).all();

        res.json(transacoes);

    } catch (error) {
        console.error("ERRO AO BUSCAR TRANSAÇÕES:", error);

        res.status(500).json({
            erro: "Erro ao buscar transações",
            detalhes: error.message
        });
    }
});

// CRIAR TRANSAÇÃO
// POST /api/transacoes

app.post("/api/transacoes", (req, res) => {
    try {
        const {
            usuario_id,
            description,
            amount,
            type,
            frequency,
            date
        } = req.body;

        console.log("DADOS RECEBIDOS:", req.body);

        // Usuário padrão temporário
        const usuarioId = usuario_id || 1;

        // Verifica campos obrigatórios
        if (
            !description ||
            amount === undefined ||
            !type ||
            !frequency ||
            !date
        ) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios",
                dadosRecebidos: req.body
            });
        }

        // Verifica tipo
        if (!["entrada", "saida"].includes(type)) {
            return res.status(400).json({
                erro: "O tipo deve ser 'entrada' ou 'saida'"
            });
        }

        // Verifica frequência
        if (!["recorrente", "eventual"].includes(frequency)) {
            return res.status(400).json({
                erro: "A frequência deve ser 'recorrente' ou 'eventual'"
            });
        }

        // Cria a transação
        const resultado = db.prepare(`
            INSERT INTO transacoes (
                usuario_id,
                description,
                amount,
                type,
                frequency,
                date
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            usuarioId,
            description,
            Number(amount),
            type,
            frequency,
            date
        );

        // Busca a transação criada
        const transacao = db.prepare(`
            SELECT *
            FROM transacoes
            WHERE id = ?
        `).get(resultado.lastInsertRowid);

        console.log("TRANSAÇÃO CRIADA:", transacao);

        res.status(201).json(transacao);

    } catch (error) {
        console.error("ERRO AO CRIAR TRANSAÇÃO:", error);

        res.status(500).json({
            erro: "Erro ao criar transação",
            detalhes: error.message
        });
    }
});

app.put("/api/transacoes/:id", (req, res) => {
    try {
        const { id } = req.params;

        const {
            description,
            amount,
            type,
            frequency,
            date
        } = req.body;

        console.log(
            "DADOS PARA ATUALIZAR:",
            id,
            req.body
        );

        // Verifica campos obrigatórios
        if (
            !description ||
            amount === undefined ||
            !type ||
            !frequency ||
            !date
        ) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios",
                dadosRecebidos: req.body
            });
        }

        // Verifica tipo
        if (!["entrada", "saida"].includes(type)) {
            return res.status(400).json({
                erro: "O tipo deve ser 'entrada' ou 'saida'"
            });
        }

        // Verifica frequência
        if (!["recorrente", "eventual"].includes(frequency)) {
            return res.status(400).json({
                erro: "A frequência deve ser 'recorrente' ou 'eventual'"
            });
        }

        // Atualiza a transação
        const resultado = db.prepare(`
            UPDATE transacoes
            SET
                description = ?,
                amount = ?,
                type = ?,
                frequency = ?,
                date = ?
            WHERE id = ?
        `).run(
            description,
            Number(amount),
            type,
            frequency,
            date,
            id
        );

        // Verifica se encontrou a transação
        if (resultado.changes === 0) {
            return res.status(404).json({
                erro: "Transação não encontrada"
            });
        }

        // Busca a transação atualizada
        const transacaoAtualizada = db.prepare(`
            SELECT *
            FROM transacoes
            WHERE id = ?
        `).get(id);

        console.log(
            "TRANSAÇÃO ATUALIZADA:",
            transacaoAtualizada
        );

        res.json(transacaoAtualizada);

    } catch (error) {
        console.error(
            "ERRO AO ATUALIZAR TRANSAÇÃO:",
            error
        );

        res.status(500).json({
            erro: "Erro ao atualizar transação",
            detalhes: error.message
        });
    }
});


app.delete("/api/transacoes/:id", (req, res) => {
    try {
        const { id } = req.params;

        const resultado = db.prepare(`
            DELETE FROM transacoes
            WHERE id = ?
        `).run(id);

        if (resultado.changes === 0) {
            return res.status(404).json({
                erro: "Transação não encontrada"
            });
        }

        res.json({
            mensagem: "Transação excluída com sucesso"
        });

    } catch (error) {
        console.error("ERRO AO EXCLUIR TRANSAÇÃO:", error);

        res.status(500).json({
            erro: "Erro ao excluir transação",
            detalhes: error.message
        });
    }
});

app.get("/api/dashboard/:usuario_id", (req, res) => {
    try {
        const { usuario_id } = req.params;

        const resultado = db.prepare(`
            SELECT
                COALESCE(
                    SUM(
                        CASE
                            WHEN type = 'entrada' THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS entradas,

                COALESCE(
                    SUM(
                        CASE
                            WHEN type = 'saida' THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS saidas

            FROM transacoes
            WHERE usuario_id = ?
        `).get(usuario_id);

        const saldo =
            resultado.entradas - resultado.saidas;

        res.json({
            entradas: resultado.entradas,
            saidas: resultado.saidas,
            saldo
        });

    } catch (error) {
        console.error("ERRO AO CARREGAR DASHBOARD:", error);

        res.status(500).json({
            erro: "Erro ao carregar dashboard",
            detalhes: error.message
        });
    }
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});