import type { FastifyReply, FastifyRequest } from "fastify";
import MovimentacaoService from "../services/movimentacaoService.js";
import type { EstadoEquipamento } from "../models/Equipamento.js";

interface ParametrosEquipamento { equipamentoId: string }

interface CorpoCriacaoMovimentacao {
    estadoNovo: EstadoEquipamento;
    versaoEsperada: number;
    justificativa?: string | null;
    observacao?: string | null;
}

export default class MovimentacaoController {
    private service = new MovimentacaoService();

    async listarPorEquipamento(request: FastifyRequest<{ Params: ParametrosEquipamento }>, reply: FastifyReply) {
        const movimentacoes = await this.service.listarPorEquipamento(request.params.equipamentoId);

        return reply.status(200).send(movimentacoes);
    }

    async criar(request: FastifyRequest<{ Params: ParametrosEquipamento, Body: CorpoCriacaoMovimentacao }>, reply: FastifyReply) {
        const movimentacao = await this.service.criar(request.params.equipamentoId, request.body);

        return reply.status(201).send(movimentacao);
    }
}