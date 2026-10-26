import { AppError } from "../errors/AppError.js";

function calcularDigito(base: string, pesos: number[]): number {
    const soma = [...base].reduce((total, digito, indice) => total + Number(digito) * (pesos[indice] ?? 0), 0);

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
}

export function validarCnpj(valor: unknown): string {
    if (typeof valor !== "string") {
        throw new AppError("CNPJ inválido: informe um texto.", 400);
    }

    const cnpj = valor.replace(/[.\-/\s]/g, "");

    if (!/^\d{14}$/.test(cnpj)) {
        throw new AppError("CNPJ inválido: informe 14 dígitos.", 400);
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
        throw new AppError("CNPJ inválido: sequência repetida não permitida.", 400);
    }

    const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const pesosSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const base = cnpj.slice(0, 12);
    const primeiroDigito = calcularDigito(base, pesosPrimeiroDigito);

    const baseComPrimeiroDigito = base + primeiroDigito;
    const segundoDigito = calcularDigito(baseComPrimeiroDigito, pesosSegundoDigito);

    const cnpjCalculado = baseComPrimeiroDigito + segundoDigito;

    if (cnpj !== cnpjCalculado) {
        throw new AppError("CNPJ inválido: dígitos verificadores incorretos.", 400);
    }

    return cnpj;
}