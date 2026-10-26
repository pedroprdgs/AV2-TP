import { Prisma } from "../prisma-generated/client.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import { prisma } from "../lib/prisma.js";
import type { Contrato, DadosCriacaoContrato, DadosAtualizacaoContrato } from "../models/Contrato.js";

export default class ContratoRepository {
    async criar(dados: DadosCriacaoContrato): Promise<Contrato> {
        try {
            const { clausulas, ...outrosDados } = dados;

            return await prisma.contrato.create({
                data: {
                    ...outrosDados,
                    ...(clausulas !== undefined && {
                        clausulas:
                            clausulas === null
                                ? Prisma.DbNull
                                : clausulas,
                    }),
                },
            });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async listar(): Promise<Contrato[]> {
        return prisma.contrato.findMany({ orderBy: { numero: "asc" } });
    }

    async buscarPorId(id: string): Promise<Contrato | null> {
        return prisma.contrato.findUnique({ where: { id } });
    }

    async buscarPorNumero(numero: string): Promise<Contrato | null> {
        return prisma.contrato.findUnique({ where: { numero } });
    }

    async buscarPorOrganizacao(organizacaoId: string): Promise<Contrato | null> {
        return prisma.contrato.findUnique({ where: { organizacaoId } });
    }

    async atualizar(id: string, dados: DadosAtualizacaoContrato): Promise<Contrato> {
        try {
            const { clausulas, ...outrosDados } = dados;

            return await prisma.contrato.update({
                where: { id },
                data: {
                    ...outrosDados,
                    ...(clausulas !== undefined && {
                        clausulas:
                            clausulas === null
                                ? Prisma.DbNull
                                : clausulas,
                    }),
                    versao: { increment: 1 },
                },
            });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async excluir(id: string): Promise<void> {
        try {
            await prisma.contrato.delete({ where: { id } });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }
}