
import bcrypt from "bcryptjs";
import UsuarioRepository from "../repositories/usuarioRepository.js";
import { AppError } from "../errors/AppError.js";
import { validarUuid } from "../utils/validarUuid.js";
import { validarString } from "../utils/validarString.js";
import { validarVersao } from "../utils/validarVersao.js";
import { PapelUsuario } from "../models/Usuario.js";

import type { UsuarioPublico, DadosCriacaoUsuario, DadosAtualizacaoUsuario } from "../models/Usuario.js";

interface UsuarioAutenticado {
    id: string;
    papel: PapelUsuario;
}

export default class UsuarioService {
    private usuarioRepository = new UsuarioRepository();

    private exigirAdministrador(usuario: UsuarioAutenticado): void {
        if (usuario.papel !== PapelUsuario.ADMINISTRADOR) {
            throw new AppError("Você não tem permissão para gerenciar usuários.", 403);
        }
    }

    private validarPapel(papel: PapelUsuario): PapelUsuario {
        if (!Object.values(PapelUsuario).includes(papel)) {
            throw new AppError("Papel de usuário inválido.", 400);
        }

        return papel;
    }

    private validarSenha(senha: string): string {
        if (typeof senha !== "string" || senha.length < 8) {
            throw new AppError("A senha deve possuir pelo menos 8 caracteres.", 400);
        }

        return senha;
    }

    private dadosPublicos(usuario: UsuarioPublico) {
        return {
            id: usuario.id,
            nome: usuario.nome,
            usuario: usuario.usuario,
            papel: usuario.papel,
            ativo: usuario.ativo,
            criadoEm: usuario.criadoEm,
            atualizadoEm: usuario.atualizadoEm,
            versao: usuario.versao,
        };
    }

    async criar(dados: DadosCriacaoUsuario, solicitante: UsuarioAutenticado) {
        this.exigirAdministrador(solicitante);

        const nome = validarString(dados.nome, "nome");
        const usuario = validarString(dados.usuario, "usuario");
        const senha = this.validarSenha(dados.senha);
        const papel = this.validarPapel(dados.papel);

        const existente = await this.usuarioRepository.buscarPorUsuario(usuario);

        if (existente) {
            throw new AppError("Já existe um usuário com esse identificador.", 409);
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const criado = await this.usuarioRepository.criar({ nome, usuario, senhaHash, papel });

        return this.dadosPublicos(criado);
    }

    async listar(solicitante: UsuarioAutenticado) {
        this.exigirAdministrador(solicitante);

        return this.usuarioRepository.listar();
    }

    async buscarPorId(id: string, solicitante: UsuarioAutenticado) {
        this.exigirAdministrador(solicitante);

        const idValido = validarUuid(id);

        const usuario = await this.usuarioRepository.buscarPorId(idValido);

        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        return this.dadosPublicos(usuario);
    }

    async atualizar(id: string, dados: DadosAtualizacaoUsuario, solicitante: UsuarioAutenticado) {
        this.exigirAdministrador(solicitante);

        const idValido = validarUuid(id);

        const versaoEsperada = validarVersao(dados.versaoEsperada);

        const usuario = await this.usuarioRepository.buscarPorId(idValido);

        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        const alteracoes: {
            nome?: string;
            usuario?: string;
            senhaHash?: string;
            papel?: PapelUsuario;
        } = {};

        if (dados.nome !== undefined) {
            alteracoes.nome = validarString(dados.nome, "nome");
        }

        if (dados.usuario !== undefined) {
            const novoUsuario = validarString(dados.usuario, "usuario");

            const existente = await this.usuarioRepository.buscarPorUsuario(novoUsuario);

            if (existente && existente.id !== idValido) {
                throw new AppError("Já existe um usuário com esse identificador.", 409);
            }

            alteracoes.usuario = novoUsuario;
        }

        if (dados.senha !== undefined) {
            const senha = this.validarSenha(dados.senha);

            alteracoes.senhaHash = await bcrypt.hash(senha, 12);
        }

        if (dados.papel !== undefined) {
            const novoPapel = this.validarPapel(dados.papel);

            if (idValido === solicitante.id && novoPapel !== PapelUsuario.ADMINISTRADOR) {
                throw new AppError("Você não pode remover seu próprio papel de administrador.", 403);
            }

            alteracoes.papel = novoPapel;
        }

        if (Object.keys(alteracoes).length === 0) {
            throw new AppError("Nenhum campo válido foi informado para atualização.", 400);
        }

        const atualizado = await this.usuarioRepository.atualizar(id, alteracoes, versaoEsperada);

        return this.dadosPublicos(atualizado);
    }

    async bloquear(id: string, solicitante: UsuarioAutenticado, versaoRecebida: number) {
        this.exigirAdministrador(solicitante);

        const idValido = validarUuid(id);

        const versaoEsperada = validarVersao(versaoRecebida);

        if (idValido === solicitante.id) {
            throw new AppError("Você não pode bloquear sua própria conta.", 403);
        }

        const usuario = await this.usuarioRepository.buscarPorId(idValido);

        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        if (usuario.versao !== versaoEsperada) {
            throw new AppError("Conflito de versão. Consulte o usuário novamente.", 409);
        }

        if (!usuario.ativo) {
            throw new AppError("O usuário já está bloqueado.", 409);
        }

        const bloqueado = await this.usuarioRepository.bloquear(idValido, versaoEsperada);

        return this.dadosPublicos(bloqueado);
    }

    async desbloquear(id: string, solicitante: UsuarioAutenticado, versaoRecebida: number) {
        this.exigirAdministrador(solicitante);

        const idValido = validarUuid(id);

        const versaoEsperada = validarVersao(versaoRecebida);

        const usuario = await this.usuarioRepository.buscarPorId(idValido);

        if (!usuario) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        if (usuario.versao !== versaoEsperada) {
            throw new AppError("Conflito de versão. Consulte o usuário novamente.", 409);
        }

        if (usuario.ativo) {
            throw new AppError("O usuário já está ativo.", 409);
        }

        const desbloqueado = await this.usuarioRepository.desbloquear(idValido, versaoEsperada);

        return this.dadosPublicos(desbloqueado);
    }
}
