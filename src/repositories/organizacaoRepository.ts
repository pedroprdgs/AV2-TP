import { Prisma } from "../prisma-generated/client.js";
import { AppError } from "../errors/AppError.js";

import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import { prisma } from "../lib/prisma.js";
import type { DadosCriacaoOrganizacao, DadosAtualizacaoOrganizacao, Organizacao } from "../models/Organizacao.js";

export default class organizacaoRepository{
    async criar(data: DadosCriacaoOrganizacao): Promise<Organizacao> {
        try {
            const criada = await prisma.organizacao.create({ data });

            return criada;
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async listar(): Promise<Organizacao[]> {
        return prisma.organizacao.findMany({ orderBy: { razaoSocial: "asc" } });
    }

    async buscarPorId(id: string): Promise<Organizacao | null> {
        return prisma.organizacao.findUnique({ where: { id } });
    }

    async buscarPorCnpj(cnpj: string): Promise<Organizacao | null> {
        return prisma.organizacao.findUnique({ where: { cnpj } });
    }

    async atualizar(id: string, dados: Omit<DadosAtualizacaoOrganizacao, "versaoEsperada">, versaoEsperada: number): Promise<Organizacao> {
        try {
            const atualizada = await prisma.organizacao.update({
                where: {
                    id,
                    versao: versaoEsperada
                },
                data: {
                    ...dados,
                    versao: { increment: 1 }
                }
            });

            return atualizada;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte a organização novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }

    async excluir(id: string, versaoEsperada: number): Promise<void> {
        try {
            await prisma.organizacao.delete({ where: { id, versao: versaoEsperada } });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw new AppError("Conflito de versão. Consulte a organização novamente.", 409);
            }

            tratarErroPrisma(error);
        }
    }
}