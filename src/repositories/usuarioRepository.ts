import { prisma } from "../lib/prisma.js";
import { tratarErroPrisma } from "../errors/tratarErroPrisma.js";
import { AppError } from "../errors/AppError.js";
import { Prisma } from "../prisma-generated/client.js";

export default class UsuarioRepository {
    async criar(dados: Prisma.UsuarioCreateInput) {
        try {
            return await prisma.usuario.create({ data: dados });
        } catch (error) {
            tratarErroPrisma(error);
        }
    }

    async listar() {
        return prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                usuario: true,
                papel: true,
                ativo: true,
                criadoEm: true,
                atualizadoEm: true,
                versao: true,
            },
            orderBy: {
                criadoEm: "desc",
            }
        });
    }

    async buscarPorId(id: string) {
        return prisma.usuario.findUnique({ where: { id } });
    }

    async buscarPorUsuario(usuario: string) {
        return prisma.usuario.findUnique({ where: { usuario } });
    }

    
    async atualizar(id: string, dados: Prisma.UsuarioUpdateInput, versaoEsperada: number) {
        try {
            return await prisma.usuario.update({
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
            this.tratarErroAtualizacao(error);
        }
    }

    async bloquear(id: string, versaoEsperada: number) {
        try {
            return await prisma.usuario.update({
                where: {
                    id,
                    versao: versaoEsperada,
                    ativo: true,
                },
                data: {
                    ativo: false,
                    versao: { increment: 1 },
                },
            });
        } catch (error) {
            this.tratarErroAtualizacao(error);
        }
    }

    async desbloquear(id: string, versaoEsperada: number) {
        try {
            return await prisma.usuario.update({
                where: {
                    id,
                    versao: versaoEsperada,
                    ativo: false,
                },
                data: {
                    ativo: true,
                    versao: { increment: 1 },
                },
            });
        } catch (error) {
            this.tratarErroAtualizacao(error);
        }
    }

    async revogarTokens(id: string) {
        return prisma.usuario.update({
            where: { id },
            data: {
                versaoToken: { increment: 1 }
            }
        });
    }

    private tratarErroAtualizacao(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Conflito de versão ou estado do usuário. Consulte os dados atualizados.", 409);
        }

        return tratarErroPrisma(error);
    }
}