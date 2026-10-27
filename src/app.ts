import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { prisma } from "./lib/prisma.js";
import { registrarErrorHandler } from "./errors/errorHandler.js";
import { registrarSwagger } from "./plugins/swagger.js";

import { organizacaoRoutes } from "./routes/organizacaoRoutes.js";
import { contratoRoutes } from "./routes/contratoRoutes.js";
import { loteRoutes } from "./routes/loteRoutes.js";
import { equipamentoRoutes } from "./routes/equipamentoRoutes.js";
import { movimentacaoRoutes } from "./routes/movimentacaoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

import { permissoes } from "./middlewares/permissoes.js";

export async function criarApp() {
    const app = Fastify({
        logger: true
    }).withTypeProvider<JsonSchemaToTsProvider>();

    registrarErrorHandler(app);

    await registrarSwagger(app);

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || jwtSecret.length < 32) {
        throw new Error("JWT_SECRET deve conter pelo menos 32 caracteres.");
    }

    app.register(fastifyJwt, {
        secret: jwtSecret,
        sign: {
            expiresIn: "8h"
        }
    });

    app.register(authRoutes, { prefix: "/auth" });

    app.register(organizacaoRoutes, { prefix: "/organizacoes" });
    app.register(contratoRoutes, { prefix: "/contratos" });
    app.register(loteRoutes, { prefix: "/lotes" });
    app.register(equipamentoRoutes, { prefix: "/equipamentos" });
    app.register(movimentacaoRoutes, { prefix: "/equipamentos" });
    app.register(usuarioRoutes, { prefix: "/usuarios" });

    app.get("/easteregg", {
        schema: {
            hide: true
        }
    }, async () => {
        return {
            message: "Nova conquista desbloqueada",
            description: "Parabéns! Você chegou onde apenas as pessoas mais curiosas chegam.",
            rarity: "UNICA",
        };
    });

    app.get("/health", {
        schema: {
            tags: ["Sistema"],
            summary: "Verificar saúde da API",
            description: "Verifica se o servidor HTTP está funcionando.",
            response: {
                200: {
                    description: "API funcionando normalmente.",
                    type: "object",
                    required: ["status", "message"],
                    properties: {
                        status: {
                            type: "string",
                            string: ["ok"],
                        },
                        message: {
                            type: "string",
                            example: "API GreenCode funcionando",
                        },
                    },
                },
            }
        }
    }, async () => {
        return {
            status: "ok",
            message: "API GreenCode funcionando"
        };
    });

    app.get("/health/db", {
        preHandler: permissoes.sistema.administrador,
        schema: {
            tags: ["Sistema"],
            summary: "Verificar conexão com o banco de dados",
            description: "Verifica a conexão com o PostgreSQL. Acesso exclusivo para administradores.",
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: "Conexão com o banco funcionando.",
                    type: "object",
                    required: ["status", "database"],
                    properties: {
                        status: {
                            type: "string",
                            string: ["ok"],
                        },
                        database: {
                            type: "string",
                            string: ["connected"],
                        },
                    },
                },
                503: {
                    description: "Banco de dados indisponível.",
                    type: "object",
                    required: ["status", "database"],
                    properties: {
                        status: {
                            type: "string",
                            string: ["error"],
                        },
                        database: {
                            type: "string",
                            string: ["disconnected"],
                        },
                    },
                },
            },
        },
    }, async (_request, reply) => {
        try {
            await prisma.$queryRaw`SELECT 1`;

            return {
                status: "ok",
                database: "connected"
            };
        } catch (error) {
            app.log.error(error);

            return reply.status(503).send({
                status: "error",
                database: "disconnected"
            });
        }
    });

    app.addHook("onClose", async () => {
        await prisma.$disconnect();
    });

    return app;
}