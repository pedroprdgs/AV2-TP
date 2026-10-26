import { AppError } from "../errors/AppError.js";

export function validarData(valor: unknown, campo = "data"): Date {
    if (typeof valor !== "string" || valor.trim() === "") {
        throw new AppError(`${campo} inválida: informe uma data.`, 400);
    }

    const dataTexto = valor.trim();

    const formatoData = /^\d{4}-\d{2}-\d{2}$/;
    const formatoDataHora = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

    if (!formatoData.test(dataTexto) && ! formatoDataHora.test(dataTexto)) {
        throw new AppError(`${campo} inválida: use AAAA-MM-DD ou um timestamp ISO 8601.`, 400);
    }

    const [ano = 0, mes = 0, dia = 0] = dataTexto.slice(0, 10).split("-").map(Number);

    const dataCalendario = new Date(Date.UTC(ano, mes - 1, dia));

    if (dataCalendario.getUTCFullYear() !== ano || dataCalendario.getUTCMonth() !== mes - 1 || dataCalendario.getUTCDate() !== dia) {
        throw new AppError(`${campo} inválida: a data informada não existe.`);
    }

    const data = new Date(dataTexto);

    if (Number.isNaN(data.getTime())) {
        throw new AppError(`${campo} inválida.`, 400);
    }

    return data;
}