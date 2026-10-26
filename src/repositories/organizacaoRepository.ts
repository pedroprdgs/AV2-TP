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

    async atualizar(id: string, dados: DadosAtualizacaoOrganizacao): Promise<Organizacao> {
        try {
            const atualizada = await prisma.organizacao.update({
                where: {
                    id
                },
                data: {
                    ...dados,
                    versao: {
                        increment: 1
                    }
                }
            });

            return atualizada;
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async excluir(id: string): Promise<void> {
        try {
            await prisma.organizacao.delete({ where: { id } });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }
}