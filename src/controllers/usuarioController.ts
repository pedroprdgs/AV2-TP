import type { FastifyReply, FastifyRequest } from "fastify";
import UsuarioService from "../services/usuarioService.js";

import type { DadosCriacaoUsuario, DadosAtualizacaoUsuario, DadosAlteracaoStatusUsuario } from "../models/Usuario.js";

interface ParametrosUsuario { id: string }

export default class UsuarioController {
    private usuarioService = new UsuarioService();

    async criar(request: FastifyRequest<{ Body: DadosCriacaoUsuario }>, reply: FastifyReply) {
        const usuario = await this.usuarioService.criar( request.body, request.user);

        return reply.status(201).send(usuario);
    }

    async listar(request: FastifyRequest, reply: FastifyReply) {
        const usuarios = await this.usuarioService.listar(request.user);

        return reply.status(200).send(usuarios);
    }

    async buscarPorId(request: FastifyRequest<{ Params: ParametrosUsuario }>, reply: FastifyReply) {
        const usuario = await this.usuarioService.buscarPorId(request.params.id, request.user);

        return reply.status(200).send(usuario);
    }

    async atualizar(request: FastifyRequest<{ Params: ParametrosUsuario, Body: DadosAtualizacaoUsuario }>, reply: FastifyReply) {
        const usuario = await this.usuarioService.atualizar(request.params.id, request.body, request.user);

        return reply.status(200).send(usuario);
    }

    async bloquear( request: FastifyRequest<{ Params: ParametrosUsuario, Body: DadosAlteracaoStatusUsuario }>, reply: FastifyReply) {
        const usuario = await this.usuarioService.bloquear(request.params.id, request.user, request.body.versaoEsperada);

        return reply.status(200).send(usuario);
    }

    async desbloquear(request: FastifyRequest<{ Params: ParametrosUsuario, Body: DadosAlteracaoStatusUsuario }>, reply: FastifyReply) {
        const usuario = await this.usuarioService.desbloquear(request.params.id, request.user, request.body.versaoEsperada);

        return reply.status(200).send(usuario);
    }
}