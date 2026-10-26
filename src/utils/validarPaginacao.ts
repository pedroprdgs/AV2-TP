import { AppError } from "../errors/AppError.js";
import { validarInteiroPositivo } from "./validarInteiroPositivo.js";

export interface ParametrosPaginacao {
    pagina: number;
    limite: number;
    deslocamento: number;
}

export function validarPaginacao(paginaRecebida: unknown = "1", limiteRecebido: unknown = "10"): ParametrosPaginacao {
    const pagina = validarInteiroPositivo(paginaRecebida, "pagina");

    const limite = validarInteiroPositivo(limiteRecebido, "limite");

    const limiteMaximo = 100;

    if (limite > limiteMaximo) {
        throw new AppError(`O limite máximo por página é ${limiteMaximo}.`, 400);
    }

    return {
        pagina, limite, deslocamento: (pagina - 1) * limite
    };
}