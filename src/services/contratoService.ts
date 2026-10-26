
import ContratoRepository from "../repositories/contratoRepository.js";
import OrganizacaoRepository from "../repositories/organizacaoRepository.js";
import { AppError } from "../errors/AppError.js";
import { validarUuid } from "../utils/validarUuid.js";
import { validarString } from "../utils/validarString.js";
import { validarData } from "../utils/validarData.js";
import type { DadosCriacaoContrato, DadosAtualizacaoContrato } from "../models/Contrato.js";

export default class ContratoService {
    private contratoRepository = new ContratoRepository();
    private organizacaoRepository = new OrganizacaoRepository();

    async criar(dados: DadosCriacaoContrato) {
        const numero = validarString(dados.numero, "numero");
        const organizacaoId = validarUuid(dados.organizacaoId);

        const dataInicio = validarData(dados.dataInicio, "dataInicio");

        const organizacao = await this.organizacaoRepository.buscarPorId(organizacaoId);

        if (!organizacao) {
            throw new AppError("Organização não encontrada.", 404);
        }

        const contratoExistente = await this.contratoRepository.buscarPorOrganizacao(organizacaoId);

        if (contratoExistente) {
            throw new AppError("Esta organização já possui um contrato.", 409);
        }

        const numeroExistente = await this.contratoRepository.buscarPorNumero(numero);

        if (numeroExistente) {
            throw new AppError("Já existe um contrato com este número.", 409);
        }

        const dadosValidados: DadosCriacaoContrato = {
            numero,
            dataInicio,
            organizacaoId,
        };

        if (dados.dataFim !== undefined) {
            dadosValidados.dataFim =
                dados.dataFim === null
                    ? null
                    : validarData(dados.dataFim, "dataFim");
        }

        if (dados.valor !== undefined) {
            if (dados.valor !== null && (!Number.isFinite(dados.valor) || dados.valor < 0)) {
                throw new AppError("O valor deve ser um número válido e não negativo.", 400);
            }

            dadosValidados.valor = dados.valor;
        }

        if (dados.clausulas !== undefined) {
            dadosValidados.clausulas = dados.clausulas;
        }

        if (dadosValidados.dataFim instanceof Date && dadosValidados.dataFim < dataInicio) {
            throw new AppError("A data de fim não pode ser anterior à data de início.", 400);
        }

        return this.contratoRepository.criar(dadosValidados);
    }

    async listar() {
        return this.contratoRepository.listar();
    }

    async buscarPorId(idRecebido: string) {
        const id = validarUuid(idRecebido);
        const contrato = await this.contratoRepository.buscarPorId(id);

        if (!contrato) {
            throw new AppError("Contrato não encontrado.", 404);
        }

        return contrato;
    }

    async atualizar(idRecebido: string, dados: DadosAtualizacaoContrato) {
        const id = validarUuid(idRecebido);
        const contrato = await this.contratoRepository.buscarPorId(id);

        if (!contrato) {
            throw new AppError("Contrato não encontrado.", 404);
        }

        const dadosValidados: DadosAtualizacaoContrato = {};

        if (dados.numero !== undefined) {
            const numero = validarString(dados.numero, "numero");
            const outroContrato =
                await this.contratoRepository.buscarPorNumero(numero);

            if (outroContrato && outroContrato.id !== id) {
                throw new AppError("Já existe um contrato com este número.", 409);
            }

            dadosValidados.numero = numero;
        }

        if (dados.dataInicio !== undefined) {
            dadosValidados.dataInicio = validarData(dados.dataInicio, "dataInicio");
        }

        if (dados.dataFim !== undefined) {
            dadosValidados.dataFim =
                dados.dataFim === null
                    ? null
                    : validarData(dados.dataFim, "dataFim");
        }

        if (dados.valor !== undefined) {
            if (dados.valor !== null && (!Number.isFinite(dados.valor) || dados.valor < 0)) {
                throw new AppError("O valor deve ser um número válido e não negativo.", 400);
            }

            dadosValidados.valor = dados.valor;
        }

        if (dados.clausulas !== undefined) {
            dadosValidados.clausulas = dados.clausulas;
        }

        const dataInicioFinal = dadosValidados.dataInicio ?? contrato.dataInicio;
        const dataFimFinal = dadosValidados.dataFim === undefined ? contrato.dataFim : dadosValidados.dataFim;

        if (dataFimFinal && dataFimFinal < dataInicioFinal) {
            throw new AppError("A data de fim não pode ser anterior à data de início.", 400);
        }

        if (Object.keys(dadosValidados).length === 0) {
            throw new AppError("Informe pelo menos um campo para atualizar.", 400);
        }

        return this.contratoRepository.atualizar(id, dadosValidados);
    }

    async excluir(idRecebido: string): Promise<void> {
        const id = validarUuid(idRecebido);
        const contrato = await this.contratoRepository.buscarPorId(id);

        if (!contrato) {
            throw new AppError("Contrato não encontrado.", 404);
        }

        await this.contratoRepository.excluir(id);
    }
}
