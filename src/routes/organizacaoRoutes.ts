import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import OrganizacaoController from "../controllers/organizacaoController.js";
import { atualizarOrganizacaoSchema, criarOrganizacaoSchema, excluirOrganizacaoSchema, organizacaoIdParamsSchema } from "../schemas/organizacaoSchema.js";

import { permissoes } from "../middlewares/permissoes.js";

export const organizacaoRoutes: FastifyPluginAsyncJsonSchemaToTs = async (app) => {
    const controller = new OrganizacaoController();

    app.post("/",
        {
            preHandler: permissoes.organizacoes.escrita,
            schema: {
                tags: ["Organizações"],
                summary: "Criar uma organização",
                security: [{ bearerAuth: [] }],
                body: criarOrganizacaoSchema
            }
        },
        (request, reply) => controller.criar(request.body, reply),
    );

    app.get("/",
        {
            preHandler: permissoes.organizacoes.leitura,
            schema: {
                tags: ["Organizações"],
                summary: "Selecionar todas organizações",
                security: [{ bearerAuth: [] }],
            }
        }, (_request, reply) =>
        controller.listar(reply),
    );

    app.get("/:id",
        {
            preHandler: permissoes.organizacoes.leitura,
            schema: {
                tags: ["Organizações"],
                summary: "Selecionar uma organização pelo ID",
                security: [{ bearerAuth: [] }],
                params: organizacaoIdParamsSchema
            }
        },
        (request, reply) => controller.buscarPorId(request.params.id, reply),
    );

    app.patch("/:id",
        {
            preHandler: permissoes.organizacoes.escrita,
            schema: {
                tags: ["Organizações"],
                summary: "Atualizar uma organização",
                security: [{ bearerAuth: [] }],
                params: organizacaoIdParamsSchema,
                body: atualizarOrganizacaoSchema
            }
        },
        (request, reply) => controller.atualizar(request.params.id, request.body, reply),
    );

    app.delete("/:id",
        {
            preHandler: permissoes.organizacoes.escrita,
            schema: {
                tags: ["Organizações"],
                summary: "Deletar uma organização",
                security: [{ bearerAuth: [] }],
                params: organizacaoIdParamsSchema,
                body: excluirOrganizacaoSchema
            }
        },
        (request, reply) => controller.excluir(request.params.id, request.body.versaoEsperada, reply),
    );
};
