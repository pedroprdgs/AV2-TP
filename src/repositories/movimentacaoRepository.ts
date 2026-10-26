import { prisma } from "../lib/prisma.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import type { DadosCriacaoMovimentacao, Movimentacao } from "../models/Movimentacao.js";

export default class MovimentacaoRepository {
    async listarPorEquipamento(equipamentoId: string): Promise<Movimentacao[]> {
        return prisma.movimentacao.findMany({ where: { equipamentoId }, orderBy: { dataHora: "desc" } });
    }

    async criar(dados: DadosCriacaoMovimentacao): Promise<Movimentacao> {
        try {
            return await prisma.movimentacao.create({ data: dados });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }
}