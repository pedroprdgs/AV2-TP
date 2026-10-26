
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../prisma-generated/client.js";
import { AppError } from "../errors/AppError.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import type { Equipamento, DadosCriacaoEquipamento, DadosAtualizacaoEquipamento } from "../models/Equipamento.js";

export default class EquipamentoRepository {
    async criar(dados: DadosCriacaoEquipamento): Promise<Equipamento> {
        try {
            return await prisma.equipamento.create({ data: dados });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async listar(): Promise<Equipamento[]> {
        return prisma.equipamento.findMany({ orderBy: { criadoEm: "desc" } });
    }

    async buscarPorId(id: string): Promise<Equipamento | null> {
        return prisma.equipamento.findUnique({ where: { id } });
    }

    async buscarPorCodigoBarras(codigoBarrasInterno: string): Promise<Equipamento | null> {
        return prisma.equipamento.findUnique({ where: { codigoBarrasInterno } });
    }

    async listarPorLote(loteId: string): Promise<Equipamento[]> {
        return prisma.equipamento.findMany({ where: { loteId }, orderBy: { criadoEm: "desc" } });
    }

    async atualizar(id: string, dados: Omit<DadosAtualizacaoEquipamento, "versaoEsperada">, versaoEsperada: number): Promise<Equipamento> {
        try {
            return await prisma.equipamento.update({
                where: {
                    id ,
                    versao: versaoEsperada
                },
                data: {
                    ...dados,
                    versao: { increment: 1 },
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte o equipamento novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }

    async excluir(id: string, versaoEsperada: number): Promise<void> {
        try {
            await prisma.equipamento.delete({ where: { id, versao: versaoEsperada } });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte o equipamento novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }
}
