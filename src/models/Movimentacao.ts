import type { EstadoEquipamento } from "../prisma-generated/enums.js";

export interface Movimentacao {
    id: string;
    estadoAnterior: EstadoEquipamento | null;
    estadoNovo: EstadoEquipamento;
    justificativa: string | null;
    observacao: string | null;
    dataHora: Date;
    versao: number;
    equipamentoId: string;
}

export interface DadosCriacaoMovimentacao {
    estadoAnterior: EstadoEquipamento | null;
    estadoNovo: EstadoEquipamento;
    justificativa?: string | null;
    observacao?: string | null;
    equipamentoId: string;
}