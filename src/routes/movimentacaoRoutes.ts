import type { FastifyInstance } from "fastify";
import MovimentacaoController from "../controllers/movimentacaoController.js";
import type { EstadoEquipamento } from "../models/Equipamento.js";

interface CorpoCriacaoMovimentacao {
    estadoNovo: EstadoEquipamento;
    versaoEsperada: number;
    justificativa?: string | null;
    observacao?: string | null;
}

export async function movimentacaoRoutes(app: FastifyInstance) {
    const controller = new MovimentacaoController();

    app.get<{ Params: { equipamentoId: string } }>("/:equipamentoId/movimentacoes", (request, reply) =>
        controller.listarPorEquipamento(request, reply)
    );

    app.post<{  Params: { equipamentoId: string }, Body: CorpoCriacaoMovimentacao }>("/:equipamentoId/movimentacoes", (request, reply) =>
        controller.criar(request, reply)
    );
}