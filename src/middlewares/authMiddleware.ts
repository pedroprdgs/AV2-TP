import type { FastifyReply, FastifyRequest } from "fastify";

import UsuarioRepository from "../repositories/usuarioRepository.js";
import { AppError } from "../errors/AppError.js";
import { PapelUsuario } from "../models/Usuario.js";

const usuarioRepository = new UsuarioRepository();

export async function autenticar(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    try {
        await request.jwtVerify();
    } catch {
        throw new AppError("Token ausente, inválido ou expirado.", 401);
    }

    const usuario = await usuarioRepository.buscarPorId(request.user.id);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 401);
    }

    if (!usuario.ativo) {
        throw new AppError("Sua conta está bloqueada.", 403);
    }

    if (request.user.versaoToken !== usuario.versaoToken) {
        throw new AppError("Sessão encerrada. Faça login novamente.", 401);
    }

    // Utiliza o papel atual do banco, ao invés do antigo do JWT.
    request.user = {
        id: usuario.id,
        papel: usuario.papel,
        versaoToken: usuario.versaoToken
    };
}

export function autorizar(...papeisPermitidos: PapelUsuario[]) {
    return async function (request: FastifyRequest, _reply: FastifyReply): Promise<void> {
        if (!request.user || !papeisPermitidos.includes(request.user.papel)) {
            throw new AppError("Você não tem permissão para acessar este recurso.", 403);
        }
    };
}