import { prisma } from "../lib/prisma.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import type { Lote, DadosCriacaoLote, DadosAtualizacaoLote } from "../models/Lote.js";

export default class LoteRepository {
    async criar(dados: DadosCriacaoLote): Promise<Lote> {
        try {
            return await prisma.lote.create({ data: dados });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async listar(): Promise<Lote[]> {
        return prisma.lote.findMany({ orderBy: { dataEntrada: "desc" } });
    }

    async buscarPorId(id: string): Promise<Lote | null> {
        return prisma.lote.findUnique({ where: { id } });
    }

    async buscarPorNotaFiscal(notaFiscal: string): Promise<Lote[]> {
        return prisma.lote.findMany({ where: { notaFiscal } });
    }

    async listarPorOrganizacao(organizacaoId: string): Promise<Lote[]> {
        return prisma.lote.findMany({ where: { organizacaoId }, orderBy: { dataEntrada: "desc" } });
    }

    async atualizar(id: string, dados: DadosAtualizacaoLote): Promise<Lote> {
        try {
            return await prisma.lote.update({
                where: { id },
                data: {
                    ...dados,
                    versao: { increment: 1 },
                },
            });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async excluir(id: string): Promise<void> {
        try {
            await prisma.lote.delete({ where: { id } });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }
}