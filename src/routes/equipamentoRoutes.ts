
import type { FastifyInstance } from "fastify";
import EquipamentoController from "../controllers/equipamentoController.js";
import type { DadosCriacaoEquipamento, DadosAtualizacaoEquipamento } from "../models/Equipamento.js";
import { equipamentoIdParamsSchema, equipamentoResponseSchema, excluirEquipamentoSchema, criarEquipamentoSchema, atualizarEquipamentoSchema, listarEquipamentosResponseSchema, equipamentoLoteIdParamsSchema } from "../schemas/equipamentoSchema.js";

import { permissoes } from "../middlewares/permissoes.js";

export async function equipamentoRoutes(app: FastifyInstance) {
    const controller = new EquipamentoController();

    app.post<{ Body: DadosCriacaoEquipamento }>("/", {
        preHandler: permissoes.equipamentos.escrita,
        schema: {
            tags: ["Equipamentos"],
            summary: "Criar equipamento",
            security: [{ bearerAuth: [] }],
            body: criarEquipamentoSchema,
            response: {
                201: equipamentoResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", {
        preHandler: permissoes.equipamentos.leitura,
        schema: {
            tags: ["Equipamentos"],
            summary: "Listar equipamentos",
            security: [{ bearerAuth: [] }],
            response: {
                200: listarEquipamentosResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: { loteId: string } }>("/lote/:loteId", {
        preHandler: permissoes.equipamentos.leitura,
        schema: {
            tags: ["Equipamentos"],
            summary: "Selecionar equipamento por lote",
            security: [{ bearerAuth: [] }],
            params: equipamentoLoteIdParamsSchema,
            response: {
                200: equipamentoResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.listarPorLote(request, reply)
    );

    app.get<{ Params: { id: string } }>("/:id", {
        preHandler: permissoes.equipamentos.leitura,
        schema: {
            tags: ["Equipamentos"],
            summary: "Selecionar equipamento por ID",
            security: [{ bearerAuth: [] }],
            params: equipamentoIdParamsSchema,
            response: {
                200: equipamentoResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: { id: string }, Body: DadosAtualizacaoEquipamento }>("/:id", {
        preHandler: permissoes.equipamentos.escrita,
        schema: {
            tags: ["Equipamentos"],
            summary: "Selecionar equipamento por lote",
            security: [{ bearerAuth: [] }],
            body: atualizarEquipamentoSchema,
            response: {
                200: equipamentoResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.delete<{ Params: { id: string }, Body: { versaoEsperada: number } }>("/:id", {
        preHandler: permissoes.equipamentos.escrita,
        schema: {
            tags: ["Equipamentos"],
            summary: "Selecionar equipamento por lote",
            security: [{ bearerAuth: [] }],
            body: excluirEquipamentoSchema,
            params: equipamentoIdParamsSchema
        }
    }, (request, reply) =>
        controller.excluir(request, reply)
    );
}
