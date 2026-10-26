import { Prisma } from "../prisma-generated/client.js";
import { AppError } from "./AppError.js";

export function tratarErroPrisma(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002":
                throw new AppError("Já existe um registro com esses dados.", 409);

            case "P2003":
                throw new AppError("Não foi possível concluir a operação por causa de um registro relacionado.", 409);

            case "P2014":
                throw new AppError("A operação viola um relacionamento obrigatório.", 409);

            case "P2025":
                throw new AppError("O registro solicitado não foi encontrado.", 404);

            default:
                throw error;
        }
    }

    throw error;
}