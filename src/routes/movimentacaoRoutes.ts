import type { FastifyInstance } from "fastify";
import MovimentacaoController from "../controllers/movimentacaoController.js";
import type { EstadoEquipamento } from "../models/Equipamento.js";
import { movimentacaoParamsSchema, criarMovimentacaoSchema, movimentacaoResponseSchema, listarMovimentacoesResponseSchema } from "../schemas/movimentacaoSchema.js";

import { permissoes } from "../middlewares/permissoes.js";

interface CorpoCriacaoMovimentacao {
    estadoNovo: EstadoEquipamento;
    versaoEsperada: number;
    justificativa?: string | null;
    observacao?: string | null;
}

export async function movimentacaoRoutes(app: FastifyInstance) {
    const controller = new MovimentacaoController();

    app.get<{ Params: { equipamentoId: string } }>("/:equipamentoId/movimentacoes", {
        preHandler: permissoes.movimentacoes.leitura,
        schema: {
            tags: ["Movimentações"],
            summary: "Consultar histórico de movimentações do equipamento",
            security: [{ bearerAuth: [] }],
            params: movimentacaoParamsSchema,
            response: {
                200: listarMovimentacoesResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.listarPorEquipamento(request, reply)
    );

    app.post<{ Params: { equipamentoId: string }, Body: CorpoCriacaoMovimentacao }>("/:equipamentoId/movimentacoes", {
        preHandler: permissoes.movimentacoes.leitura,
        schema: {
        tags: ["Movimentações"],
        summary: "Registrar movimentação de equipamento",
        security: [{ bearerAuth: [] }],
        params: movimentacaoParamsSchema,
        body: criarMovimentacaoSchema,
        response: {
            201: movimentacaoResponseSchema,
        },
    }
    }, (request, reply) =>
        controller.criar(request, reply)
    );
}