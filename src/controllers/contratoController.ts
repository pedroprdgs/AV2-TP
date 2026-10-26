import type { FastifyReply, FastifyRequest } from "fastify";
import ContratoService from "../services/contratoService.js";
import type { DadosCriacaoContrato, DadosAtualizacaoContrato } from "../models/Contrato.js";

export default class ContratoController {
    private service = new ContratoService();

    async criar(request: FastifyRequest<{ Body: DadosCriacaoContrato }>, reply: FastifyReply) {
        const contrato = await this.service.criar(request.body);

        return reply.status(201).send(contrato);
    }

    async listar(_request: FastifyRequest, reply: FastifyReply) {
        const contratos = await this.service.listar();

        return reply.status(200).send(contratos);
    }

    async buscarPorId(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const contrato = await this.service.buscarPorId(request.params.id);

        return reply.status(200).send(contrato);
    }

    async atualizar(request: FastifyRequest<{ Params: { id: string }, Body: DadosAtualizacaoContrato }>, reply: FastifyReply) {
        const contrato = await this.service.atualizar(request.params.id, request.body);

        return reply.status(200).send(contrato);
    }

    async excluir(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        await this.service.excluir(request.params.id);
        
        return reply.status(204).send();
    }
}