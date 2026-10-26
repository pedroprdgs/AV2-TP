
import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import OrganizacaoController from "../controllers/organizacaoController.js";
import { atualizarOrganizacaoSchema, criarOrganizacaoSchema, organizacaoIdParamsSchema } from "../schemas/organizacaoSchema.js";

export const organizacaoRoutes: FastifyPluginAsyncJsonSchemaToTs = async (app) => {
    const controller = new OrganizacaoController();

    app.post("/",
        {
            schema: {
                body: criarOrganizacaoSchema
            }
        },
        (request, reply) => controller.criar(request.body, reply),
    );

    app.get("/", (_request, reply) =>
        controller.listar(reply),
    );

    app.get("/:id",
        {
            schema: {
                params: organizacaoIdParamsSchema
            }
        },
        (request, reply) => controller.buscarPorId(request.params.id, reply),
    );

    app.patch("/:id",
        {
            schema: {
                params: organizacaoIdParamsSchema,
                body: atualizarOrganizacaoSchema
            }
        },
        (request, reply) => controller.atualizar(request.params.id, request.body, reply),
    );

    app.delete("/:id",
        {
            schema: {
                params: organizacaoIdParamsSchema
            }
        },
        (request, reply) => controller.excluir(request.params.id, reply),
    );
};
