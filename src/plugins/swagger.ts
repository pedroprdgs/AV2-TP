import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registrarSwagger(app: FastifyInstance) {
    await app.register(swagger, {
        openapi: {
            openapi: "3.0.3",
            info: {
                title: "GreenCode API",
                description: "API REST para gerenciamento de logística reversa de equipamentos eletrônicos.",
                version: "1.0.0",
            },
            tags: [
                { name: "Autenticação", description: "Login e logout" },
                { name: "Usuários", description: "Gerenciamento de usuários" },
                { name: "Organizações", description: "Cadastro de organizações" },
                { name: "Contratos", description: "Gerenciamento de contratos" },
                { name: "Lotes", description: "Gerenciamento de lotes" },
                { name: "Equipamentos", description: "Cadastro e triagem de equipamentos" },
                { name: "Movimentações", description: "Histórico e transições de estado" },
                { name: "Sistema", description: "Verificações de saúde da API" },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
    });

    await app.register(swaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
        },
    });
}