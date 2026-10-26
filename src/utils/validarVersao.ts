import { AppError } from "../errors/AppError.js";

export function validarVersao(versao: number): number {
    if (!Number.isInteger(versao) || versao < 1) {
        throw new AppError("A versão esperada deve ser um número inteiro positivo.", 400);
    }

    return versao;
}