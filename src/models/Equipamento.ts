import type { EstadoEquipamento } from "../prisma-generated/enums.js";

export { EstadoEquipamento } from "../prisma-generated/enums.js";

export interface Equipamento {
    id: string;
    codigoBarrasInterno: string;
    tipo: string;
    descricao: string | null;
    estado: EstadoEquipamento;
    triagemCompleta: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
    versao: number;
    loteId: string;
}

export interface DadosCriacaoEquipamento {
    codigoBarrasInterno: string;
    tipo: string;
    descricao?: string | null;
    loteId: string;
}

export interface DadosAtualizacaoEquipamento {
    codigoBarrasInterno?: string;
    tipo?: string;
    descricao?: string | null;
    triagemCompleta?: boolean;
    versaoEsperada: number;
}