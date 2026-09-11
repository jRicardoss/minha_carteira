const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

// ============================================================
// CONFIGURAÇÃO JWT
// ============================================================

// Depois podemos colocar isso em um arquivo .env
const JWT_SECRET = "minha_chave_secreta_super_segura";

// ============================================================
// CONFIGURAÇÃO GOOGLE OAUTH
// ============================================================

const GOOGLE_CLIENT_ID =
    "90347430730-i25t4i5vmus5rnk4cd0b57oprnk86dvi.apps.googleusercontent.com";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ============================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================================

function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não informado"
        });
    }

    const partes = authHeader.split(" ");

    if (
        partes.length !== 2 ||
        partes[0] !== "Bearer"
    ) {
        return res.status(401).json({
            erro: "Token inválido"
        });
    }

    const token = partes[1];

    try {
        const usuario = jwt.verify(
            token,
            JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            erro: "Token inválido ou expirado"
        });
    }
}

// ============================================================
// ROTA PRINCIPAL
// ============================================================

app.get("/", (req, res) => {
    res.json({
        mensagem: "API Minha Carteira funcionando!"
    });
});

// ============================================================
// CADASTRO
// POST /api/auth/cadastro
// ============================================================

app.post("/api/auth/cadastro", async (req, res) => {
    try {
        const {
            nome,
            email,
            senha
        } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios"
            });
        }

        const usuarioExistente = db.prepare(`
            SELECT id
            FROM usuarios
            WHERE email = ?
        `).get(email);

        if (usuarioExistente) {
            return res.status(409).json({
                erro: "Este email já está cadastrado"
            });
        }

        const senhaHash = await bcrypt.hash(
            senha,
            10
        );

        const resultado = db.prepare(`
            INSERT INTO usuarios (
                nome,
                email,
                senha_hash
            )
            VALUES (?, ?, ?)
        `).run(
            nome,
            email,
            senhaHash
        );

        const usuario = db.prepare(`
            SELECT
                id,
                nome,
                email,
                criado_em
            FROM usuarios
            WHERE id = ?
        `).get(resultado.lastInsertRowid);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso",
            usuario
        });

    } catch (error) {
        console.error(
            "ERRO AO CADASTRAR USUÁRIO:",
            error
        );

        res.status(500).json({
            erro: "Erro ao cadastrar usuário"
        });
    }
});

// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

app.post("/api/auth/login", async (req, res) => {
    try {
        const {
            email,
            senha
        } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        const usuario = db.prepare(`
            SELECT *
            FROM usuarios
            WHERE email = ?
        `).get(email);

        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha incorretos"
            });
        }

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "Email ou senha incorretos"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            mensagem: "Login realizado com sucesso",

            token,

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error(
            "ERRO AO REALIZAR LOGIN:",
            error
        );

        res.status(500).json({
            erro: "Erro ao realizar login"
        });
    }
});

// ============================================================
// LOGIN COM GOOGLE
// POST /api/auth/google
// ============================================================

app.post("/api/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                erro: "Credencial do Google não informada"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let usuario = db.prepare(`
            SELECT
                id,
                nome,
                email
            FROM usuarios
            WHERE email = ?
        `).get(email);

        if (!usuario) {
            const senhaHashAleatoria = await bcrypt.hash(
                crypto.randomBytes(32).toString("hex"),
                10
            );

            const resultado = db.prepare(`
                INSERT INTO usuarios (
                    nome,
                    email,
                    senha_hash
                )
                VALUES (?, ?, ?)
            `).run(
                name,
                email,
                senhaHashAleatoria
            );

            usuario = {
                id: resultado.lastInsertRowid,
                nome: name,
                email
            };
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            mensagem: "Login com Google realizado com sucesso",
            token,
            usuario
        });

    } catch (error) {
        console.error(
            "ERRO AO REALIZAR LOGIN COM GOOGLE:",
            error
        );

        res.status(401).json({
            erro: "Token do Google inválido"
        });
    }
});

// ============================================================
// LISTAR TRANSAÇÕES
// GET /api/transacoes
// ============================================================

app.get(
    "/api/transacoes",
    autenticarToken,
    (req, res) => {
        try {
            const transacoes = db.prepare(`
                SELECT *
                FROM transacoes
                WHERE usuario_id = ?
                ORDER BY date DESC, id DESC
            `).all(req.usuario.id);

            res.json(transacoes);

        } catch (error) {
            console.error(
                "ERRO AO BUSCAR TRANSAÇÕES:",
                error
            );

            res.status(500).json({
                erro: "Erro ao buscar transações",
                detalhes: error.message
            });
        }
    }
);

// ============================================================
// CRIAR TRANSAÇÃO
// POST /api/transacoes
// ============================================================

app.post(
    "/api/transacoes",
    autenticarToken,
    (req, res) => {
        try {
            const {
                description,
                amount,
                type,
                frequency,
                date
            } = req.body;

            // ID vem do token, não do frontend
            const usuarioId = req.usuario.id;

            if (
                !description ||
                amount === undefined ||
                !type ||
                !frequency ||
                !date
            ) {
                return res.status(400).json({
                    erro: "Todos os campos são obrigatórios"
                });
            }

            if (!["entrada", "saida"].includes(type)) {
                return res.status(400).json({
                    erro: "O tipo deve ser 'entrada' ou 'saida'"
                });
            }

            if (
                !["recorrente", "eventual"]
                    .includes(frequency)
            ) {
                return res.status(400).json({
                    erro:
                        "A frequência deve ser 'recorrente' ou 'eventual'"
                });
            }

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

            const transacao = db.prepare(`
                SELECT *
                FROM transacoes
                WHERE id = ?
                AND usuario_id = ?
            `).get(
                resultado.lastInsertRowid,
                usuarioId
            );

            res.status(201).json(transacao);

        } catch (error) {
            console.error(
                "ERRO AO CRIAR TRANSAÇÃO:",
                error
            );

            res.status(500).json({
                erro: "Erro ao criar transação",
                detalhes: error.message
            });
        }
    }
);

// ============================================================
// EDITAR TRANSAÇÃO
// PUT /api/transacoes/:id
// ============================================================

app.put(
    "/api/transacoes/:id",
    autenticarToken,
    (req, res) => {
        try {
            const { id } = req.params;

            const {
                description,
                amount,
                type,
                frequency,
                date
            } = req.body;

            if (
                !description ||
                amount === undefined ||
                !type ||
                !frequency ||
                !date
            ) {
                return res.status(400).json({
                    erro:
                        "Todos os campos são obrigatórios"
                });
            }

            if (
                !["entrada", "saida"].includes(type)
            ) {
                return res.status(400).json({
                    erro:
                        "O tipo deve ser 'entrada' ou 'saida'"
                });
            }

            if (
                !["recorrente", "eventual"]
                    .includes(frequency)
            ) {
                return res.status(400).json({
                    erro:
                        "A frequência deve ser 'recorrente' ou 'eventual'"
                });
            }

            // Só atualiza se a transação
            // pertencer ao usuário logado
            const resultado = db.prepare(`
                UPDATE transacoes
                SET
                    description = ?,
                    amount = ?,
                    type = ?,
                    frequency = ?,
                    date = ?
                WHERE
                    id = ?
                    AND usuario_id = ?
            `).run(
                description,
                Number(amount),
                type,
                frequency,
                date,
                id,
                req.usuario.id
            );

            if (resultado.changes === 0) {
                return res.status(404).json({
                    erro:
                        "Transação não encontrada"
                });
            }

            const transacaoAtualizada = db.prepare(`
                SELECT *
                FROM transacoes
                WHERE
                    id = ?
                    AND usuario_id = ?
            `).get(
                id,
                req.usuario.id
            );

            res.json(transacaoAtualizada);

        } catch (error) {
            console.error(
                "ERRO AO ATUALIZAR TRANSAÇÃO:",
                error
            );

            res.status(500).json({
                erro:
                    "Erro ao atualizar transação",
                detalhes: error.message
            });
        }
    }
);

// ============================================================
// DELETAR TRANSAÇÃO
// DELETE /api/transacoes/:id
// ============================================================

app.delete(
    "/api/transacoes/:id",
    autenticarToken,
    (req, res) => {
        try {
            const { id } = req.params;

            // Só exclui se pertencer ao usuário
            const resultado = db.prepare(`
                DELETE FROM transacoes
                WHERE
                    id = ?
                    AND usuario_id = ?
            `).run(
                id,
                req.usuario.id
            );

            if (resultado.changes === 0) {
                return res.status(404).json({
                    erro:
                        "Transação não encontrada"
                });
            }

            res.json({
                mensagem:
                    "Transação excluída com sucesso"
            });

        } catch (error) {
            console.error(
                "ERRO AO EXCLUIR TRANSAÇÃO:",
                error
            );

            res.status(500).json({
                erro:
                    "Erro ao excluir transação",
                detalhes: error.message
            });
        }
    }
);

// ============================================================
// DASHBOARD
// GET /api/dashboard
// ============================================================

app.get(
    "/api/dashboard",
    autenticarToken,
    (req, res) => {
        try {
            const resultado = db.prepare(`
                SELECT
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'entrada'
                                THEN amount
                                ELSE 0
                            END
                        ),
                        0
                    ) AS entradas,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'saida'
                                THEN amount
                                ELSE 0
                            END
                        ),
                        0
                    ) AS saidas

                FROM transacoes
                WHERE usuario_id = ?
            `).get(req.usuario.id);

            const saldo =
                resultado.entradas -
                resultado.saidas;

            res.json({
                entradas: resultado.entradas,
                saidas: resultado.saidas,
                saldo
            });

        } catch (error) {
            console.error(
                "ERRO AO CARREGAR DASHBOARD:",
                error
            );

            res.status(500).json({
                erro:
                    "Erro ao carregar dashboard",
                detalhes: error.message
            });
        }
    }
);

// ============================================================
// EXCLUIR CONTA
// DELETE /api/usuarios/me
// ============================================================

app.delete(
    "/api/usuarios/me",
    autenticarToken,
    (req, res) => {
        try {
            const resultado = db.prepare(`
                DELETE FROM usuarios
                WHERE id = ?
            `).run(req.usuario.id);

            if (resultado.changes === 0) {
                return res.status(404).json({
                    erro: "Usuário não encontrado"
                });
            }

            res.json({
                mensagem: "Conta excluída com sucesso"
            });

        } catch (error) {
            console.error(
                "ERRO AO EXCLUIR CONTA:",
                error
            );

            res.status(500).json({
                erro: "Erro ao excluir conta"
            });
        }
    }
);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});