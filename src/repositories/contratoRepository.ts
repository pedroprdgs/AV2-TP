import { Prisma } from "../prisma-generated/client.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import { AppError } from "../errors/AppError.js";
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

    async atualizar(id: string, dados: Omit<DadosAtualizacaoContrato, "versaoEsperada">, versaoEsperada: number): Promise<Contrato> {
        try {
            const { clausulas, ...outrosDados } = dados;

            return await prisma.contrato.update({
                where: {
                    id,
                    versao: versaoEsperada
                },
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
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte o contrato novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }

    async excluir(id: string, versaoEsperada: number): Promise<void> {
        try {
            await prisma.contrato.delete({ where: { id, versao: versaoEsperada } });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte o contrato novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }
}