
import type { FastifyReply } from "fastify";
import OrganizacaoService from "../services/organizacaoService.js";
import type { DadosCriacaoOrganizacao, DadosAtualizacaoOrganizacao } from "../models/Organizacao.js";

export default class OrganizacaoController {
    private service = new OrganizacaoService();

    async criar(dados: DadosCriacaoOrganizacao, reply: FastifyReply) {
        const organizacao = await this.service.criar(dados);

        return reply.status(201).send(organizacao);
    }

    async listar(reply: FastifyReply) {
        const organizacoes = await this.service.listar();

        return reply.status(200).send(organizacoes);
    }

    async buscarPorId(id: string, reply: FastifyReply) {
        const organizacao = await this.service.buscarPorId(id);

        return reply.status(200).send(organizacao);
    }

    async atualizar(id: string, dados: DadosAtualizacaoOrganizacao, reply: FastifyReply) {
        const organizacao = await this.service.atualizar(id, dados);

        return reply.status(200).send(organizacao);
    }

    async excluir(id: string, versaoEsperada: number, reply: FastifyReply) {
        await this.service.excluir(id, versaoEsperada);

        return reply.status(204).send();
    }
}