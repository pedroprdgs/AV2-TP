export interface Lote {
    id: string;
    notaFiscal: string;
    transportadora: string;
    dataEntrada: Date;
    criadoEm: Date;
    atualizadoEm: Date;
    versao: number;
    organizacaoId: string;
}

export interface DadosCriacaoLote {
    notaFiscal: string;
    transportadora: string;
    dataEntrada: Date;
    organizacaoId: string;
}

export interface DadosAtualizacaoLote {
    notaFiscal?: string;
    transportadora?: string;
    dataEntrada?: Date;
}