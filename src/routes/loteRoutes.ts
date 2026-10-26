import type { FastifyInstance } from "fastify";
import LoteController from "../controllers/loteController.js";
import type { DadosCriacaoLote, DadosAtualizacaoLote } from "../models/Lote.js";

export async function loteRoutes(app: FastifyInstance) {
    const controller = new LoteController();

    app.post<{ Body: DadosCriacaoLote }>("/", (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: { organizacaoId: string } }>("/organizacao/:organizacaoId", (request, reply) =>
        controller.listarPorOrganizacao(request, reply)
    );

    app.get<{ Params: { id: string } }>("/:id", (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: { id: string }, Body: DadosAtualizacaoLote }>("/:id", (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.delete<{ Params: { id: string } }>("/:id", (request, reply) =>
        controller.excluir(request, reply)
    );
}