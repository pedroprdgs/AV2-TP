import type { FastifyReply, FastifyRequest } from "fastify";
import EquipamentoService from "../services/equipamentoService.js";
import type { DadosCriacaoEquipamento, DadosAtualizacaoEquipamento } from "../models/Equipamento.js";

export default class EquipamentoController {
    private service = new EquipamentoService();

    async criar(request: FastifyRequest<{ Body: DadosCriacaoEquipamento }>, reply: FastifyReply) {
        const equipamento = await this.service.criar(request.body);

        return reply.status(201).send(equipamento);
    }

    async listar(_request: FastifyRequest, reply: FastifyReply) {
        const equipamentos = await this.service.listar();

        return reply.status(200).send(equipamentos);
    }

    async buscarPorId(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const equipamento = await this.service.buscarPorId(request.params.id);

        return reply.status(200).send(equipamento);
    }

    async listarPorLote(request: FastifyRequest<{ Params: { loteId: string } }>, reply: FastifyReply) {
        const equipamentos = await this.service.listarPorLote(request.params.loteId);

        return reply.status(200).send(equipamentos);
    }

    async atualizar(request: FastifyRequest<{ Params: { id: string }, Body: DadosAtualizacaoEquipamento }>, reply: FastifyReply) {
        const equipamento = await this.service.atualizar(request.params.id, request.body);

        return reply.status(200).send(equipamento);
    }

    async excluir(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        await this.service.excluir(request.params.id);
        
        return reply.status(204).send();
    }
}