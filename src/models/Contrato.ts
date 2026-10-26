import type { Prisma } from "../prisma-generated/client.js";

export interface Contrato {
    id: string;
    numero: string;
    dataInicio: Date;
    dataFim: Date | null;
    valor: Prisma.Decimal | null;
    clausulas: Prisma.JsonValue | null;
    criadoEm: Date;
    atualizadoEm: Date;
    versao: number;
    organizacaoId: string;
}

export interface DadosCriacaoContrato {
    numero: string;
    dataInicio: Date;
    dataFim?: Date | null;
    valor?: number | null;
    clausulas?: Prisma.InputJsonValue | null;
    organizacaoId: string;
}

export interface DadosAtualizacaoContrato {
    numero?: string;
    dataInicio?: Date;
    dataFim?: Date | null;
    valor?: number | null;
    clausulas?: Prisma.InputJsonValue | null;
    versaoEsperada: number;
}