import { api } from "./api";

export async function buscarTransacoes() {
    const resposta = await api.get("/transacoes");
    return resposta.data;
}

export async function criarTransacao(transacao) {
    const resposta = await api.post("/transacoes", transacao);
    return resposta.data;
}

export async function excluirTransacao(id) {
    const resposta = await api.delete(`/transacoes/${id}`);
    return resposta.data;
}

export async function buscarDashboard(usuarioId) {
    const resposta = await api.get(`/dashboard/${usuarioId}`);
    return resposta.data;
}