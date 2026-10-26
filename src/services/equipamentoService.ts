import EquipamentoRepository from "../repositories/equipamentoRepository.js";
import LoteRepository from "../repositories/loteRepository.js";
import { AppError } from "../errors/AppError.js";
import { validarUuid } from "../utils/validarUuid.js";
import { validarString } from "../utils/validarString.js";
import type { DadosCriacaoEquipamento, DadosAtualizacaoEquipamento } from "../models/Equipamento.js";
import { validarVersao } from "../utils/validarVersao.js";

export default class EquipamentoService {
    private equipamentoRepository = new EquipamentoRepository();
    private loteRepository = new LoteRepository();

    async criar(dados: DadosCriacaoEquipamento) {
        const codigoBarrasInterno = validarString(dados.codigoBarrasInterno, "codigoBarrasInterno");

        const tipo = validarString(dados.tipo, "tipo");
        const loteId = validarUuid(dados.loteId);

        const lote = await this.loteRepository.buscarPorId(loteId);

        if (!lote) {
            throw new AppError("Lote não encontrado.", 404);
        }

        const equipamentoExistente =
            await this.equipamentoRepository.buscarPorCodigoBarras(codigoBarrasInterno);

        if (equipamentoExistente) {
            throw new AppError("Já existe um equipamento com este código de barras.", 409);
        }

        const dadosValidados: DadosCriacaoEquipamento = {
            codigoBarrasInterno,
            tipo,
            loteId,
        };

        if (dados.descricao !== undefined) {
            dadosValidados.descricao = dados.descricao === null ? null : validarString(dados.descricao, "descricao");
        }

        return this.equipamentoRepository.criar(dadosValidados);
    }

    async listar() {
        return this.equipamentoRepository.listar();
    }

    async buscarPorId(id: string) {
        const idValido = validarUuid(id);
        const equipamento = await this.equipamentoRepository.buscarPorId(idValido);

        if (!equipamento) {
            throw new AppError("Equipamento não encontrado.", 404);
        }

        return equipamento;
    }

    async listarPorLote(loteId: string) {
        const idValido = validarUuid(loteId);
        const lote = await this.loteRepository.buscarPorId(idValido);

        if (!lote) {
            throw new AppError("Lote não encontrado.", 404);
        }

        return this.equipamentoRepository.listarPorLote(idValido);
    }

    async atualizar(id: string, dados: DadosAtualizacaoEquipamento) {
        const idValido = validarUuid(id);
        const versaoEsperada = validarVersao(dados.versaoEsperada);

        const equipamento = await this.equipamentoRepository.buscarPorId(idValido);

        if (!equipamento) {
            throw new AppError("Equipamento não encontrado.", 404);
        }

        if (equipamento.versao !== versaoEsperada) {
            throw new AppError("O equipamento foi alterado por outra operação. Consulte os dados novamente.", 409);
        }

        const dadosValidados: Omit<DadosAtualizacaoEquipamento, "versaoEsperada"> = {};

        if (dados.codigoBarrasInterno !== undefined) {
            const codigoBarrasInterno = validarString(dados.codigoBarrasInterno, "codigoBarrasInterno");

            const outroEquipamento = await this.equipamentoRepository.buscarPorCodigoBarras(codigoBarrasInterno);

            if (outroEquipamento && outroEquipamento.id !== id) {
                throw new AppError("Já existe um equipamento com este código de barras.", 409);
            }

            dadosValidados.codigoBarrasInterno = codigoBarrasInterno;
        }

        if (dados.tipo !== undefined) {
            dadosValidados.tipo = validarString(dados.tipo, "tipo");
        }

        if (dados.descricao !== undefined) {
            dadosValidados.descricao = dados.descricao === null ? null : validarString(dados.descricao, "descricao");
        }

        if (dados.triagemCompleta !== undefined) {
            if (typeof dados.triagemCompleta !== "boolean") {
                throw new AppError("triagemCompleta deve ser um valor booleano.", 400);
            }

            dadosValidados.triagemCompleta = dados.triagemCompleta;
        }

        if (Object.keys(dadosValidados).length === 0) {
            throw new AppError("Informe pelo menos um campo para atualizar.", 400);
        }

        return this.equipamentoRepository.atualizar(id, dadosValidados, versaoEsperada);
    }

    async excluir(id: string, versaoEsperada: number): Promise<void> {
        const idValido = validarUuid(id);
        const versaoValida =validarVersao(versaoEsperada)

        const equipamento = await this.equipamentoRepository.buscarPorId(idValido);

        if (!equipamento) {
            throw new AppError("Equipamento não encontrado.", 404);
        }

        if (equipamento.versao !== versaoValida) {
            throw new AppError("O equipamento foi alterado por outra operação. Consulte os dados novamente.", 409);
        }

        await this.equipamentoRepository.excluir(id, versaoValida);
    }
}