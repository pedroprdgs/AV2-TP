import { autenticar, autorizar } from "./authMiddleware.js";
import { PapelUsuario } from "../models/Usuario.js";

const {
    ADMINISTRADOR,
    OPERADOR_CADASTRO,
    GESTOR_ALMOXARIFADO,
    AUDITOR,
} = PapelUsuario;

export const permissoes = {
    usuarios: {
        gerenciar: [
            autenticar,
            autorizar(ADMINISTRADOR),
        ],
    },

    organizacoes: {
        leitura: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                OPERADOR_CADASTRO,
                AUDITOR,
            ),
        ],
        escrita: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                OPERADOR_CADASTRO,
            ),
        ],
    },

    contratos: {
        leitura: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                OPERADOR_CADASTRO,
                AUDITOR,
            ),
        ],
        escrita: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                OPERADOR_CADASTRO,
            ),
        ],
    },

    lotes: {
        leitura: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                GESTOR_ALMOXARIFADO,
                AUDITOR,
            ),
        ],
        escrita: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                GESTOR_ALMOXARIFADO,
            ),
        ],
    },

    equipamentos: {
        leitura: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                GESTOR_ALMOXARIFADO,
                AUDITOR,
            ),
        ],
        escrita: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                GESTOR_ALMOXARIFADO,
            ),
        ],
    },

    movimentacoes: {
        leitura: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                GESTOR_ALMOXARIFADO,
                AUDITOR,
            ),
        ],
        escrita: [
            autenticar,
            autorizar(
                ADMINISTRADOR,
                GESTOR_ALMOXARIFADO,
            ),
        ],
    },

    sistema: {
        autenticado: [autenticar],
        administrador: [
            autenticar,
            autorizar(ADMINISTRADOR),
        ],
    },
};