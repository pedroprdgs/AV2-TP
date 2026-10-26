import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
import { validarUuid } from "../utils/validarUuid.js";
import { validarString } from "../utils/validarString.js";
import { validarVersao } from "../utils/validarVersao.js";
import { EstadoEquipamento } from "../models/Equipamento.js";
import type { Movimentacao } from "../models/Movimentacao.js";
import MovimentacaoRepository from "../repositories/movimentacaoRepository.js";

interface DadosCriacaoMovimentacao {
    estadoNovo: EstadoEquipamento;
    versaoEsperada: number;
    justificativa?: string | null;
    observacao?: string | null;
}

export default class MovimentacaoService {
    private movimentacaoRepository = new MovimentacaoRepository();

    async listarPorEquipamento(equipamentoIdRecebido: string): Promise<Movimentacao[]> {
        const equipamentoId = validarUuid(equipamentoIdRecebido);

        const equipamento = await prisma.equipamento.findUnique({ where: { id: equipamentoId } });

        if (!equipamento) {
            throw new AppError("Equipamento não encontrado.", 404);
        }

        return this.movimentacaoRepository.listarPorEquipamento(equipamentoId);
    }

    async criar(equipamentoIdRecebido: string, dados: DadosCriacaoMovimentacao): Promise<Movimentacao> {
        const equipamentoId = validarUuid(equipamentoIdRecebido);
        const versaoValida = validarVersao(dados.versaoEsperada);

        if (!Object.values(EstadoEquipamento).includes(dados.estadoNovo)) {
            throw new AppError("Estado de equipamento inválido.", 400);
        }

        const justificativa = dados.justificativa == null ? null : validarString(dados.justificativa, "justificativa");

        const observacao = dados.observacao == null ? null : validarString(dados.observacao, "observacao");

        return prisma.$transaction(async (tx) => {
            const equipamento = await tx.equipamento.findUnique({ where: { id: equipamentoId } });

            if (!equipamento) {
                throw new AppError("Equipamento não encontrado.", 404);
            }

            if (equipamento.versao !== versaoValida) {
                throw new AppError("O equipamento foi alterado por outra operação. Consulte os dados atualizados e tente novamente.", 409);
            }

            const transicoesValidas: Record<EstadoEquipamento, EstadoEquipamento[]> = {
                [EstadoEquipamento.RECEBIDO]: [EstadoEquipamento.EM_TRIAGEM],

                [EstadoEquipamento.EM_TRIAGEM]: [EstadoEquipamento.TRIADO],

                [EstadoEquipamento.TRIADO]: [EstadoEquipamento.EM_DESMONTAGEM],

                [EstadoEquipamento.EM_DESMONTAGEM]: [EstadoEquipamento.DESMONTADO],

                [EstadoEquipamento.DESMONTADO]: [],
            };

            const estadoAnterior = equipamento.estado;

            if (!transicoesValidas[estadoAnterior].includes(dados.estadoNovo)) {
                throw new AppError(`Transição inválida de ${estadoAnterior} para ${dados.estadoNovo}.`, 422);
            }

            if (dados.estadoNovo === EstadoEquipamento.TRIADO && !equipamento.triagemCompleta) {
                throw new AppError("A triagem precisa estar completa antes de avançar para TRIADO.", 422);
            }

            const resultado = await tx.equipamento.updateMany({
                where: {
                    id: equipamentoId,
                    versao: versaoValida,
                },
                data: {
                    estado: dados.estadoNovo,
                    versao: { increment: 1 },
                },
            });

            if (resultado.count === 0) {
                throw new AppError("O equipamento foi alterado por outra operação. Consulte os dados atualizados e tente novamente.", 409);
            }

            return this.movimentacaoRepository.criar(
                {
                    equipamentoId,
                    estadoAnterior,
                    estadoNovo: dados.estadoNovo,
                    justificativa,
                    observacao,
                }, tx
            );
        });
    }
}