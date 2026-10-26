import LoteRepository from "../repositories/loteRepository.js";
import OrganizacaoRepository from "../repositories/organizacaoRepository.js";
import { AppError } from "../errors/AppError.js";
import { validarUuid } from "../utils/validarUuid.js";
import { validarString } from "../utils/validarString.js";
import { validarData } from "../utils/validarData.js";
import type { DadosCriacaoLote, DadosAtualizacaoLote } from "../models/Lote.js";

export default class LoteService {
    private loteRepository = new LoteRepository();
    private organizacaoRepository = new OrganizacaoRepository();

    async criar(dados: DadosCriacaoLote) {
        const notaFiscal = validarString(dados.notaFiscal, "notaFiscal");
        const transportadora = validarString(dados.transportadora, "transportadora");
        const dataEntrada = validarData(dados.dataEntrada, "dataEntrada");
        const organizacaoId = validarUuid(dados.organizacaoId);

        const organizacao = await this.organizacaoRepository.buscarPorId(organizacaoId);

        if (!organizacao) {
            throw new AppError("Organização não encontrada.", 404);
        }

        return this.loteRepository.criar({
            notaFiscal,
            transportadora,
            dataEntrada,
            organizacaoId,
        });
    }

    async listar() {
        return this.loteRepository.listar();
    }

    async buscarPorId(id: string) {
        const idValido = validarUuid(id);
        const lote = await this.loteRepository.buscarPorId(idValido);

        if (!lote) {
            throw new AppError("Lote não encontrado.", 404);
        }

        return lote;
    }

    async listarPorOrganizacao(idOrganizacao: string) {
        const idValido = validarUuid(idOrganizacao);

        const organizacao = await this.organizacaoRepository.buscarPorId(idValido);

        if (!organizacao) {
            throw new AppError("Organização não encontrada.", 404);
        }

        return this.loteRepository.listarPorOrganizacao(idValido);
    }

    async atualizar(id: string, dados: DadosAtualizacaoLote) {
        const idValido = validarUuid(id);
        const lote = await this.loteRepository.buscarPorId(idValido);

        if (!lote) {
            throw new AppError("Lote não encontrado.", 404);
        }

        const dadosValidados: {
            notaFiscal?: string;
            transportadora?: string;
            dataEntrada?: Date;
        } = {};

        if (dados.notaFiscal !== undefined) {
            dadosValidados.notaFiscal = validarString(dados.notaFiscal, "notaFiscal");
        }

        if (dados.transportadora !== undefined) {
            dadosValidados.transportadora = validarString(dados.transportadora, "transportadora");
        }

        if (dados.dataEntrada !== undefined) {
            dadosValidados.dataEntrada = validarData(dados.dataEntrada, "dataEntrada");
        }

        if (Object.keys(dadosValidados).length === 0) {
            throw new AppError("Informe pelo menos um campo para atualizar.", 400);
        }

        return this.loteRepository.atualizar(id, dadosValidados);
    }

    async excluir(idRecebido: string): Promise<void> {
        const id = validarUuid(idRecebido);
        const lote = await this.loteRepository.buscarPorId(id);

        if (!lote) {
            throw new AppError("Lote não encontrado.", 404);
        }

        await this.loteRepository.excluir(id);
    }
}