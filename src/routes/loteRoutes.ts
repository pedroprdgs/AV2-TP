import type { FastifyInstance } from "fastify";
import LoteController from "../controllers/loteController.js";
import type { DadosCriacaoLote, DadosAtualizacaoLote } from "../models/Lote.js";
import { loteIdParamsSchema, criarLoteSchema, atualizarLoteSchema, excluirLoteSchema, loteResponseSchema, listarLotesResponseSchema, loteOrganizacaoIdParamsSchema } from "../schemas/loteSchema.js";

import { permissoes } from "../middlewares/permissoes.js";

export async function loteRoutes(app: FastifyInstance) {
    const controller = new LoteController();

    app.post<{ Body: DadosCriacaoLote }>("/", {
        preHandler: permissoes.lotes.escrita,
        schema: {
            tags: ["Lotes"],
            summary: "Criar lote",
            security: [{ bearerAuth: [] }],
            body: criarLoteSchema,
            response: {
                201: loteResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", {
        preHandler: permissoes.lotes.leitura,
        schema: {
            tags: ["Lotes"],
            summary: "Listar lotes",
            security: [{ bearerAuth: [] }],
            response: {
                200: listarLotesResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: { organizacaoId: string } }>("/organizacao/:organizacaoId", {
        preHandler: permissoes.lotes.leitura,
        schema: {
            tags: ["Lotes"],
            summary: "Selecionar lote por organização",
            security: [{ bearerAuth: [] }],
            params: loteOrganizacaoIdParamsSchema,
            response: {
                200: loteResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.listarPorOrganizacao(request, reply)
    );

    app.get<{ Params: { id: string } }>("/:id", {
        preHandler: permissoes.lotes.leitura,
        schema: {
            tags: ["Lotes"],
            summary: "Selecionar lote por ID",
            security: [{ bearerAuth: [] }],
            params: loteIdParamsSchema,
            response: {
                200: loteResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: { id: string }, Body: DadosAtualizacaoLote }>("/:id", {
        preHandler: permissoes.lotes.escrita,
        schema: {
            tags: ["Lotes"],
            summary: "Atualizar lote",
            security: [{ bearerAuth: [] }],
            params: loteIdParamsSchema,
            body: atualizarLoteSchema,
            response: {
                200: loteResponseSchema,
            },
        }
    }, (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.delete<{ Params: { id: string }, Body: { versaoEsperada: number } }>("/:id", {
        preHandler: permissoes.lotes.escrita,
        schema: {
            tags: ["Lotes"],
            summary: "Atualizar lote",
            security: [{ bearerAuth: [] }],
            params: loteIdParamsSchema,
            body: excluirLoteSchema,
        }
    }, (request, reply) =>
        controller.excluir(request, reply)
    );
}