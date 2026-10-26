import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";

import UsuarioRepository from "../repositories/usuarioRepository.js";
import { AppError } from "../errors/AppError.js";

import type { DadosLogin } from "../models/Usuario.js";

export default class AuthService {
    private usuarioRepository = new UsuarioRepository();

    async login(dados: DadosLogin, app: FastifyInstance) {
        if (typeof dados?.usuario !== "string" || typeof dados?.senha !== "string" || !dados.usuario.trim() || !dados.senha) {
            throw new AppError("Usuário e senha são obrigatórios.", 400);
        }

        const usuario = await this.usuarioRepository.buscarPorUsuario(dados.usuario.trim());

        if (!usuario) {
            throw new AppError("Usuário ou senha inválidos.", 401);
        }

        const senhaValida = await bcrypt.compare(dados.senha, usuario.senhaHash);

        if (!senhaValida) {
            throw new AppError("Usuário ou senha inválidos.", 401);
        }

        if (!usuario.ativo) {
            throw new AppError("Esta conta está bloqueada.", 403);
        }

        const token = app.jwt.sign({ id: usuario.id, papel: usuario.papel, versaoToken: usuario.versaoToken });

        return {
            token,
            tipo: "Bearer",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                usuario: usuario.usuario,
                papel: usuario.papel,
            },
        };
    }

    async logout(id: string): Promise<void> {
        const usuario = await this.usuarioRepository.buscarPorId(id);

        if (!usuario || !usuario.ativo) {
            throw new AppError("Usuário inválido ou bloquado.", 401);
        }

        await this.usuarioRepository.revogarTokens(id);
    }
}