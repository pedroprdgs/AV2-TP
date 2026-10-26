import type { PapelUsuario } from "../prisma-generated/enums.js";

export { PapelUsuario } from "../prisma-generated/enums.js";

export interface Usuario {
    id: string;
    nome: string;
    usuario: string;
    senhaHash: string;
    papel: PapelUsuario;
    ativo: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
    versao: number;
}

// Informações públicas -> Tudo menos a senha
export type UsuarioPublico = Omit<Usuario, 'senhaHash'>;

export interface DadosCriacaoUsuario {
    nome: string;
    usuario: string;
    senha: string;
    papel: PapelUsuario;
}

export interface DadosLogin {
    usuario: string;
    senha: string;
}

export interface DadosAtualizacaoUsuario {
    nome?: string;
    usuario?: string;
    senha?: string;
    papel?: PapelUsuario;
    versaoEsperada: number;
}

export interface DadosAlteracaoStatusUsuario {
    versaoEsperada: number;
}