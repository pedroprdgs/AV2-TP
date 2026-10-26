import type { FastifyInstance } from "fastify";

import UsuarioController from "../controllers/usuarioController.js";
import { autenticar, autorizar } from "../middlewares/authMiddleware.js";
import { PapelUsuario } from "../models/Usuario.js";

import { criarUsuarioSchema, usuarioIdParamsSchema, usuarioResponseSchema, listarUsuariosResponseSchema, atualizarUsuarioSchema, alterarStatusUsuarioSchema } from "../schemas/usuarioSchema.js";

import { permissoes } from "../middlewares/permissoes.js";

import type { DadosCriacaoUsuario, DadosAtualizacaoUsuario, DadosAlteracaoStatusUsuario } from "../models/Usuario.js";

interface ParametrosUsuario { id: string }

export default async function usuarioRoutes(app: FastifyInstance) {
    const controller = new UsuarioController();

    app.post<{ Body: DadosCriacaoUsuario }>("/", {
        preHandler: permissoes.usuarios.gerenciar,
        schema: {
            tags: ["Usuários"],
            summary: "Cadastrar usuário",
            description: "Cadastra um novo usuário no sistema.",
            security: [{ bearerAuth: [] }],
            body: criarUsuarioSchema,
            response: {
                201: usuarioResponseSchema
            }
        }
    }, (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", {
        preHandler: permissoes.usuarios.gerenciar,
        schema: {
            tags: ["Usuários"],
            summary: "Listar usuários",
            description: "Lista todos usuários do sistema.",
            security: [{ bearerAuth: [] }],
            response: {
                200: listarUsuariosResponseSchema
            }
        }
    }, (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: ParametrosUsuario }>("/:id", {
        preHandler: permissoes.usuarios.gerenciar,
        schema: {
            tags: ["Usuários"],
            summary: "Selecionar usuário",
            description: "Seleciona os dados de um usuário do sistema.",
            security: [{ bearerAuth: [] }],
            params: usuarioIdParamsSchema,
            response: {
                200: usuarioResponseSchema
            }
        }
    }, (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: ParametrosUsuario, Body: DadosAtualizacaoUsuario }>("/:id", {
        preHandler: permissoes.usuarios.gerenciar,
        schema: {
            tags: ["Usuários"],
            summary: "Atualizar usuário",
            description: "Atualiza as informações de um usuário do sistema.",
            security: [{ bearerAuth: [] }],
            body: atualizarUsuarioSchema,
            response: {
                200: usuarioResponseSchema
            }
        }
    }, (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.patch<{ Params: ParametrosUsuario, Body: DadosAlteracaoStatusUsuario }>("/:id/bloquear", {
        preHandler: permissoes.usuarios.gerenciar,
        schema: {
            tags: ["Usuários"],
            summary: "Bloquear usuário",
            description: "Bloqueia o acesso de um usuário ao sistema.",
            security: [{ bearerAuth: [] }],
            params: usuarioIdParamsSchema,
            body: alterarStatusUsuarioSchema,
            response: {
                200: usuarioResponseSchema
            }
        }
    }, (request, reply) =>
        controller.bloquear(request, reply)
    );

    app.patch<{ Params: ParametrosUsuario, Body: DadosAlteracaoStatusUsuario }>("/:id/desbloquear", {
        preHandler: permissoes.usuarios.gerenciar,
        schema: {
            tags: ["Usuários"],
            summary: "Desbloquear usuário",
            description: "Desbloqueia o acesso de um usuário ao sistema.",
            security: [{ bearerAuth: [] }],
            params: usuarioIdParamsSchema,
            body: alterarStatusUsuarioSchema,
            response: {
                200: usuarioResponseSchema
            }
        }
    }, (request, reply) =>
        controller.desbloquear(request, reply),
    );
}