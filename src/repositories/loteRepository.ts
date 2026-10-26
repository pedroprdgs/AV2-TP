import { Prisma } from "../prisma-generated/client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
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

    async atualizar(id: string, dados: Omit<DadosAtualizacaoLote, "versaoEsperada">, versaoEsperada: number): Promise<Lote> {
        try {
            return await prisma.lote.update({
                where: {
                    id,
                    versao: versaoEsperada,
                },
                data: {
                    ...dados,
                    versao: { increment: 1 },
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte o lote novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }

    async excluir(id: string, versaoEsperada: number): Promise<void> {
        try {
            await prisma.lote.delete({ where: { id, versao: versaoEsperada } });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte o lote novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }
}