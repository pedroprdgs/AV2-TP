import { AppError } from "../errors/AppError.js";

interface OpcoesValidarString {
    minimo?: number;
    maximo?: number;
}

export function validarString(valor: unknown, campo = "campo", opcoes: OpcoesValidarString = {}): string {
    const { minimo = 1, maximo = 255 } = opcoes;

    if (typeof valor !== "string") {
        throw new AppError(`${campo} inválido: informe um texto.`, 400);
    }

    const texto = valor.trim();

    if (texto.length < minimo) {
        throw new AppError(`${campo} deve ter pelo menos ${minimo} caractere(s).`, 400);
    }

    if (texto.length > maximo) {
        throw new AppError(`${campo} deve ter no máximo ${maximo} caractere(s).`, 400);
    }

    return texto;
}