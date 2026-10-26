import { AppError } from "../errors/AppError.js";

export function validarInteiroPositivo(valor: unknown, campo = "campo"): number {
    const numero =
        typeof valor === "number"
            ? valor
            : typeof valor === "string" && valor.trim() !== ""
                ? Number(valor)
                : NaN;
    if (!Number.isSafeInteger(numero) || numero <= 0) {
        throw new AppError(`${campo} inválido: informe um número inteiro positivo.`, 400);
    }

    return numero;
}