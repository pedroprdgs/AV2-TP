
import type { FastifyReply, FastifyRequest } from "fastify";
import LoteService from "../services/loteService.js";
import type { DadosCriacaoLote, DadosAtualizacaoLote } from "../models/Lote.js";

export default class LoteController {
    private service = new LoteService();

    async criar(request: FastifyRequest<{ Body: DadosCriacaoLote }>, reply: FastifyReply) {
        const lote = await this.service.criar(request.body);

        return reply.status(201).send(lote);
    }

    async listar(_request: FastifyRequest, reply: FastifyReply) {
        const lotes = await this.service.listar();

        return reply.status(200).send(lotes);
    }

    async buscarPorId(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const lote = await this.service.buscarPorId(request.params.id);

        return reply.status(200).send(lote);
    }

    async listarPorOrganizacao(request: FastifyRequest<{ Params: { organizacaoId: string } }>, reply: FastifyReply) {
        const lotes = await this.service.listarPorOrganizacao(request.params.organizacaoId);

        return reply.status(200).send(lotes);
    }

    async atualizar(request: FastifyRequest<{ Params: { id: string }, Body: DadosAtualizacaoLote }>, reply: FastifyReply) {
        const lote = await this.service.atualizar(request.params.id, request.body);

        return reply.status(200).send(lote);
    }

    async excluir(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        await this.service.excluir(request.params.id);

        return reply.status(204).send();
    }
}