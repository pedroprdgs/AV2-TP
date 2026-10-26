
import organizacaoRepository from "../repositories/organizacaoRepository.js";
import { AppError } from "../errors/AppError.js";
import { validarCnpj } from "../utils/validarCnpj.js";
import { validarString } from "../utils/validarString.js";
import { validarUuid } from "../utils/validarUuid.js";
import { validarVersao } from "../utils/validarVersao.js";
import type { DadosCriacaoOrganizacao, DadosAtualizacaoOrganizacao } from "../models/Organizacao.js";

export default class OrganizacaoService {
    private repository = new organizacaoRepository();

    async criar(dados: DadosCriacaoOrganizacao) {
        const razaoSocial = validarString(dados.razaoSocial, "razaoSocial");
        const cnpj = validarCnpj(dados.cnpj);

        const existente = await this.repository.buscarPorCnpj(cnpj);

        if (existente) {
            throw new AppError("Já existe uma organização cadastrada com esse CNPJ.", 409);
        }

        const dadosValidados: DadosCriacaoOrganizacao = { razaoSocial, cnpj };

        if (dados.nomeFantasia !== undefined) {
            dadosValidados.nomeFantasia = validarString(dados.nomeFantasia, "nomeFantasia");
        }

        if (dados.email !== undefined) {
            dadosValidados.email = validarString(dados.email, "email");
        }

        if (dados.telefone !== undefined) {
            dadosValidados.telefone = validarString(dados.telefone, "telefone");
        }

        return this.repository.criar(dadosValidados);
    }

    async listar() {
        return this.repository.listar();
    }

    async buscarPorId(id: string) {
        const idValido = validarUuid(id);

        const organizacao = await this.repository.buscarPorId(idValido);

        if (!organizacao) {
            throw new AppError("Organização não encontrada.", 404);
        }

        return organizacao;
    }

    async atualizar(id: string, dados: DadosAtualizacaoOrganizacao) {
        const idValido = validarUuid(id);
        const versaoEsperada = validarVersao(dados.versaoEsperada);

        const existente = await this.repository.buscarPorId(idValido);

        if (!existente) {
            throw new AppError("Organização não encontrada.", 404);
        }

        if (existente.versao !== versaoEsperada) {
            throw new AppError("A organização foi alterada por outra operação. Consulte os dados novamente.", 409);
        }

        const dadosValidados: Omit<DadosAtualizacaoOrganizacao, "versaoEsperada"> = {};

        if (dados.razaoSocial !== undefined) {
            dadosValidados.razaoSocial = validarString(dados.razaoSocial, "razaoSocial");
        }

        if (dados.nomeFantasia !== undefined) {
            dadosValidados.nomeFantasia = dados.nomeFantasia === null ? null : validarString(dados.nomeFantasia, "nomeFantasia");
        }

        if (dados.cnpj !== undefined) {
            const cnpj = validarCnpj(dados.cnpj);

            if (cnpj !== existente.cnpj) {
                const organizacaoComCnpj = await this.repository.buscarPorCnpj(cnpj);

                if (organizacaoComCnpj) {
                    throw new AppError("Já existe uma organização cadastrada com esse CNPJ.", 409);
                }
            }

            dadosValidados.cnpj = cnpj;
        }

        if (dados.email !== undefined) {
            dadosValidados.email = dados.email === null ? null : validarString(dados.email, "email");
        }

        if (dados.telefone !== undefined) {
            dadosValidados.telefone = dados.telefone === null ? null : validarString(dados.telefone, "telefone");
        }

        if (Object.keys(dadosValidados).length === 0) {
            throw new AppError("Informe pelo menos um campo para atualizar.", 400);
        }

        return this.repository.atualizar(idValido, dadosValidados, versaoEsperada);
    }

    async excluir(id: string, versaoEsperada: number): Promise<void> {
        const idValido = validarUuid(id);
        const versaoValida = validarVersao(versaoEsperada)

        const organizacao = await this.repository.buscarPorId(idValido);

        if (!organizacao) {
            throw new AppError("Organização não encontrada.", 404);
        }

        await this.repository.excluir(idValido, versaoValida);
    }
}
