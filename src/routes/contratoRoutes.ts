import type { FastifyInstance } from "fastify";
import ContratoController from "../controllers/contratoController.js";
import type { DadosCriacaoContrato, DadosAtualizacaoContrato } from "../models/Contrato.js";
import { contratoIdParamsSchema, criarContratoSchema, atualizarContratoSchema, excluirContratoSchema, contratoResponseSchema, listarContratosResponseSchema } from "../schemas/contratoSchema.js";

import { permissoes } from "../middlewares/permissoes.js";

export async function contratoRoutes(app: FastifyInstance) {
    const controller = new ContratoController();

    app.post<{ Body: DadosCriacaoContrato }>("/", {
        preHandler: permissoes.contratos.escrita,
        schema: {
            tags: ["Contratos"],
            summary: "Cadastrar contrato",
            security: [{ bearerAuth: [] }],
            body: criarContratoSchema,
            response: {
                201: contratoResponseSchema
            }
        }
    }, (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", {
        preHandler: permissoes.contratos.leitura,
        schema: {
            tags: ["Contratos"],
            summary: "Listar contratos",
            security: [{ bearerAuth: [] }],
            response: {
                200: listarContratosResponseSchema
            }
        }
        
    }, (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: { id: string } }>("/:id", {
        preHandler: permissoes.contratos.leitura,
        schema: {
            tags: ["Contratos"],
            summary: "Selecionar contrato",
            security: [{ bearerAuth: [] }],
            params: contratoIdParamsSchema,
            response: {
                200: contratoResponseSchema
            }
        }
    }, (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: { id: string }, Body: DadosAtualizacaoContrato }>("/:id", {
        preHandler: permissoes.contratos.escrita,
        schema: {
            tags: ["Contratos"],
            summary: "Atualizar contrato",
            security: [{ bearerAuth: [] }],
            params: contratoIdParamsSchema,
            body: atualizarContratoSchema,
            response: {
                200: contratoResponseSchema
            }
        }
    }, (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.delete<{ Params: { id: string }, Body: { versaoEsperada: number } }>("/:id", {
        preHandler: permissoes.contratos.escrita,
        schema: {
            tags: ["Contratos"],
            summary: "Excluir contrato",
            security: [{ bearerAuth: [] }],
            params: contratoIdParamsSchema,
            body: excluirContratoSchema
        }
    }, (request, reply) =>
        controller.excluir(request, reply),
    );
}