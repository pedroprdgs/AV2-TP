import { AppError } from "../errors/AppError.js";

const PADRAO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validarUuid(valor: unknown, campo = "id"): string {
    if (typeof valor !== "string" || !PADRAO_UUID.test(valor)) {
        throw new AppError(`${campo} inválido: informe um UUID válido.`, 400);
    }

    return valor;
}