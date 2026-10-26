import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";
import { EstadoEquipamento, PapelUsuario } from "../src/prisma-generated/enums.js";

async function main() {
    const usuario = process.env.SEED_ADMIN_USUARIO?.trim();
    const senha = process.env.SEED_ADMIN_SENHA;
    const nome = process.env.SEED_ADMIN_NOME?.trim();

    if (!usuario || !senha || !nome) {
        throw new Error("Defina SEED_ADMIN_USUARIO, SEED_ADMIN_SENHA e SEED_ADMIN_NOME no .env.");
    }

    if (senha.length < 8) {
        throw new Error("A senha do administrador deve ter pelo menos 8 caracteres.");
    }

    // Administrador inicial
    const existente = await prisma.usuario.findUnique({ where: { usuario } });

    if (!existente) {
        const senhaHash = await bcrypt.hash(senha, 12);

        await prisma.usuario.create({
            data: {
                nome,
                usuario,
                senhaHash,
                papel: PapelUsuario.ADMINISTRADOR
            }
        });

        console.log("Administrador inicial criado com sucesso.");
    } else {
        console.log("Administrador inicial já existe.");
    }

    // Organizações
    const organizacao1 = await prisma.organizacao.upsert({
        where: { cnpj: "11222333000181" },
        update: {},
        create: {
            razaoSocial: "EcoTech Soluções Ambientais Ltda.",
            nomeFantasia: "EcoTech",
            cnpj: "11222333000181",
            email: "contato@ecotech.example.com",
            telefone: "11999990001"
        }
    });

    const organizacao2 = await prisma.organizacao.upsert({
        where: { cnpj: "22333444000192" },
        update: {},
        create: {
            razaoSocial: "Recicla Brasil Tecnologia Ltda.",
            nomeFantasia: "Recicla Brasil",
            cnpj: "22333444000192",
            email: "contato@reciclabrasil.example.com",
            telefone: "11999990002"
        }
    });

    console.log("Organizações verificadas.");

    // Contratos
    await prisma.contrato.upsert({
        where: { numero: "CONT-2026-001" },
        update: {},
        create: {
            numero: "CONT-2026-001",
            dataInicio: new Date("2026-01-01T12:00:00Z"),
            dataFim: new Date("2026-12-31T12:00:00Z"),
            valor: "50000.00",
            clausulas: {
                objeto: "Coleta e destinação de resíduos eletrônicos",
                prazoPagamentoDias: 30
            },
            organizacaoId: organizacao1.id
        }
    });

    await prisma.contrato.upsert({
        where: { numero: "CONT-2026-002" },
        update: {},
        create: {
            numero: "CONT-2026-002",
            dataInicio: new Date("2026-03-01T12:00:00Z"),
            valor: "75000.00",
            clausulas: {
                objeto: "Triagem e desmontagem de equipamentos eletrônicos",
                prazoPagamentoDias: 45
            },
            organizacaoId: organizacao2.id
        }
    });

    console.log("Contratos verificados.");

    // Lotes
    // Lote não possui campo único de negócio.
    // Identificadores fixos permitem executar o seed novamente.
    const lote1 = await prisma.lote.upsert({
        where: { id: "10000000-0000-4000-8000-000000000001" },
        update: {},
        create: {
            id: "10000000-0000-4000-8000-000000000001",
            notaFiscal: "NF-2026-1001",
            transportadora: "Transportes Verde Ltda.",
            dataEntrada: new Date("2026-09-01T12:00:00Z"),
            organizacaoId: organizacao1.id
        }
    });

    const lote2 = await prisma.lote.upsert({
        where: { id: "10000000-0000-4000-8000-000000000002" },
        update: {},
        create: {
            id: "10000000-0000-4000-8000-000000000002",
            notaFiscal: "NF-2026-1002",
            transportadora: "Logística Sustentável Ltda.",
            dataEntrada: new Date("2026-09-10T12:00:00Z"),
            organizacaoId: organizacao2.id
        }
    });

    console.log("Lotes verificados.");

    // Equipamentos
    const equipamentos = [
        {
            codigoBarrasInterno: "GC-EQP-001",
            tipo: "Notebook",
            descricao: "Notebook corporativo para reciclagem",
            loteId: lote1.id
        },
        {
            codigoBarrasInterno: "GC-EQP-002",
            tipo: "Monitor",
            descricao: "Monitor LCD de 24 polegadas",
            loteId: lote1.id
        },
        {
            codigoBarrasInterno: "GC-EQP-003",
            tipo: "Desktop",
            descricao: "Computador de mesa",
            loteId: lote1.id
        },
        {
            codigoBarrasInterno: "GC-EQP-004",
            tipo: "Impressora",
            descricao: "Impressora multifuncional",
            loteId: lote2.id
        },
        {
            codigoBarrasInterno: "GC-EQP-005",
            tipo: "Servidor",
            descricao: "Servidor de rack",
            loteId: lote2.id
        }
    ];

    for (const equipamento of equipamentos) {
        await prisma.equipamento.upsert({
            where: {
                codigoBarrasInterno: equipamento.codigoBarrasInterno
            },
            update: {},
            create: equipamento
        });
    }

    console.log("Equipamentos verificados.");

    // Movimentações e estados
    // Cada equipamento recebe um histórico consistente.
    const historicos = [
        {
            codigo: "GC-EQP-001",
            estados: [
                EstadoEquipamento.EM_TRIAGEM,
                EstadoEquipamento.TRIADO
            ]
        },
        {
            codigo: "GC-EQP-002",
            estados: [
                EstadoEquipamento.EM_TRIAGEM
            ]
        },
        {
            codigo: "GC-EQP-003",
            estados: [
                EstadoEquipamento.EM_TRIAGEM,
                EstadoEquipamento.TRIADO,
                EstadoEquipamento.EM_DESMONTAGEM
            ]
        },
        {
            codigo: "GC-EQP-004",
            estados: []
        },
        {
            codigo: "GC-EQP-005",
            estados: [
                EstadoEquipamento.EM_TRIAGEM,
                EstadoEquipamento.TRIADO,
                EstadoEquipamento.EM_DESMONTAGEM,
                EstadoEquipamento.DESMONTADO
            ]
        }
    ];

    for (const historico of historicos) {
        const equipamento = await prisma.equipamento.findUniqueOrThrow({
            where: {
                codigoBarrasInterno: historico.codigo
            }
        });

        // Não sobrescrever equipamentos que já foram movimentados.
        const quantidadeMovimentacoes = await prisma.movimentacao.count({
            where: { equipamentoId: equipamento.id }
        });

        if (quantidadeMovimentacoes > 0) {
            continue;
        }

        // Só inicializar o histórico se o equipamento ainda estiver no estado inicial.
        if (equipamento.estado !== EstadoEquipamento.RECEBIDO || equipamento.versao !== 1) {
            continue;
        }

        await prisma.$transaction(async (tx) => {
            let estadoAnterior: EstadoEquipamento = EstadoEquipamento.RECEBIDO;
            let versao = 1;

            for (const estadoNovo of historico.estados) {
                await tx.movimentacao.create({
                    data: {
                        estadoAnterior,
                        estadoNovo,
                        justificativa: "Movimentação inicial do seed",
                        observacao: "Dados fictícios para demonstração",
                        equipamentoId: equipamento.id
                    }
                });

                versao++;

                await tx.equipamento.update({
                    where: { id: equipamento.id },
                    data: {
                        estado: estadoNovo,
                        triagemCompleta: estadoNovo === EstadoEquipamento.TRIADO || estadoNovo === EstadoEquipamento.EM_DESMONTAGEM || estadoNovo === EstadoEquipamento.DESMONTADO,
                        versao
                    }
                });

                estadoAnterior = estadoNovo;
            }
        });
    }

    console.log("Movimentações verificadas.");
    console.log("Seed GreenCode finalizado com sucesso.");
}

main().catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
}).finally(async () => {
    await prisma.$disconnect();
});