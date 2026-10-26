export interface Organizacao {
    id: string;
    razaoSocial: string;
    nomeFantasia: string | null;
    cnpj: string;
    email: string | null;
    telefone: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
    versao: number;
}

export interface DadosCriacaoOrganizacao {
    razaoSocial: string;
    nomeFantasia?: string;
    cnpj: string;
    email?: string;
    telefone?: string;
}

export interface DadosAtualizacaoOrganizacao {
    razaoSocial?: string;
    nomeFantasia?: string | null;
    cnpj?: string;
    email?: string | null;
    telefone?: string | null;
}