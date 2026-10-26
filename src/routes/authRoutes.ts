import type { FastifyInstance } from "fastify";
import AuthController from "../controllers/authController.js";

import type { DadosLogin } from "../models/Usuario.js";

import { permissoes } from "../middlewares/permissoes.js";

export default async function authRoutes(app: FastifyInstance) {
    const controller = new AuthController();

    app.post<{ Body: DadosLogin }>("/login",
        {
            schema: {
                tags: ["Autenticação"],
                summary: "Efetuar login",
                description: "Autentica um usuário e retorna um token JWT.",
                body: {
                    type: "object",
                    required: ["usuario", "senha"],
                    additionalProperties: false,
                    properties: {
                        usuario: {
                            type: "string",
                            minLength: 1,
                        },
                        senha: {
                            type: "string",
                            minLength: 1,
                            format: "password",
                        },
                    },
                },
                response: {
                    200: {
                        description: "Autenticação realizada com sucesso.",
                        type: "object",
                        required: ["token", "tipo", "usuario"],
                        properties: {
                            token: { type: "string" },
                            tipo: {
                                type: "string",
                                enum: ["Bearer"],
                            },
                            usuario: {
                                type: "object",
                                required: ["id", "nome", "usuario", "papel"],
                                properties: {
                                    id: { type: "string", format: "uuid" },
                                    nome: { type: "string" },
                                    usuario: { type: "string" },
                                    papel: {
                                        type: "string",
                                        enum: [
                                            "ADMINISTRADOR",
                                            "OPERADOR_CADASTRO",
                                            "GESTOR_ALMOXARIFADO",
                                            "AUDITOR",
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
        return controller.login(request, reply, app);
    });

    app.post("/logout",
        {
            preHandler: permissoes.sistema.autenticado,
            schema: {
                tags: ["Autenticação"],
                summary: "Efetuar logout",
                description: "Revoga os tokens JWT do usuário autenticado.",
                security: [{ bearerAuth: [] }],
                response: {
                    204: {
                        description: "Logout realizado com sucesso. Nenhum conteúdo retornado.",
                        type: "null",
                    },
                },
            },
        }, async (request, reply) => {
        return controller.logout(request, reply);
    });
}