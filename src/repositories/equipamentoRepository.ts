
import { prisma } from "../lib/prisma.js";
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

    async atualizar(id: string, dados: DadosAtualizacaoEquipamento): Promise<Equipamento> {
        try {
            return await prisma.equipamento.update({
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
            await prisma.equipamento.delete({ where: { id } });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }
}
