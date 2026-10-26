
import type { FastifyInstance } from "fastify";
import ContratoController from "../controllers/contratoController.js";
import type { DadosCriacaoContrato, DadosAtualizacaoContrato } from "../models/Contrato.js";

export async function contratoRoutes(app: FastifyInstance) {
    const controller = new ContratoController();

    app.post<{ Body: DadosCriacaoContrato }>("/", (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: { id: string } }>("/:id", (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: { id: string }, Body: DadosAtualizacaoContrato }>("/:id", (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.delete<{ Params: { id: string } }>("/:id", (request, reply) =>
        controller.excluir(request, reply),
    );
}
