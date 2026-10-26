
import type { FastifyInstance } from "fastify";
import EquipamentoController from "../controllers/equipamentoController.js";
import type { DadosCriacaoEquipamento, DadosAtualizacaoEquipamento } from "../models/Equipamento.js";

export async function equipamentoRoutes(app: FastifyInstance) {
    const controller = new EquipamentoController();

    app.post<{ Body: DadosCriacaoEquipamento }>("/", (request, reply) =>
        controller.criar(request, reply)
    );

    app.get("/", (request, reply) =>
        controller.listar(request, reply)
    );

    app.get<{ Params: { loteId: string } }>("/lote/:loteId", (request, reply) =>
        controller.listarPorLote(request, reply)
    );

    app.get<{ Params: { id: string } }>("/:id", (request, reply) =>
        controller.buscarPorId(request, reply)
    );

    app.patch<{ Params: { id: string }, Body: DadosAtualizacaoEquipamento }>("/:id", (request, reply) =>
        controller.atualizar(request, reply)
    );

    app.delete<{ Params: { id: string } }>("/:id", (request, reply) =>
        controller.excluir(request, reply)
    );
}
