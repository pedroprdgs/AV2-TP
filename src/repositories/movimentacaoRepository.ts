import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../prisma-generated/client.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import type { DadosCriacaoMovimentacao, Movimentacao } from "../models/Movimentacao.js";

export default class MovimentacaoRepository {
    async listarPorEquipamento(equipamentoId: string): Promise<Movimentacao[]> {
        return prisma.movimentacao.findMany({ where: { equipamentoId }, orderBy: { dataHora: "desc" } });
    }

    async criar(dados: DadosCriacaoMovimentacao, tx: Prisma.TransactionClient): Promise<Movimentacao> {
        try {
            return await tx.movimentacao.create({ data: dados });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }
}