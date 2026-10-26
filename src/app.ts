import Fastify from "fastify";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { prisma } from "./lib/prisma.js";
import { registrarErrorHandler } from "./errors/errorHandler.js";

import { organizacaoRoutes } from "./routes/organizacaoRoutes.js";
import { contratoRoutes } from "./routes/contratoRoutes.js";
import { loteRoutes } from "./routes/loteRoutes.js";
import { equipamentoRoutes } from "./routes/equipamentoRoutes.js";
import { movimentacaoRoutes } from "./routes/movimentacaoRoutes.js";

export function criarApp() {
    const app = Fastify({
        logger: true
    }).withTypeProvider<JsonSchemaToTsProvider>();

    registrarErrorHandler(app);

    app.register(organizacaoRoutes, { prefix: "/organizacoes" });
    app.register(contratoRoutes, { prefix: "/contratos" });
    app.register(loteRoutes, { prefix: "/lotes" });
    app.register(equipamentoRoutes, { prefix: "/equipamentos" });
    app.register(movimentacaoRoutes, { prefix: "/equipamentos" });

    app.get("/health", async () => {
        return {
            status: "ok",
            message: "API GreenCode funcionando"
        };
    });

    app.get("/health/db", async (_request, reply) => {
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