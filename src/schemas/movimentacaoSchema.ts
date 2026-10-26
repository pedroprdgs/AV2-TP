export const movimentacaoParamsSchema = {
    type: "object",
    required: ["equipamentoId"],
    properties: {
        equipamentoId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const criarMovimentacaoSchema = {
    type: "object",
    required: ["estadoNovo", "versaoEsperada"],
    additionalProperties: false,
    properties: {
        estadoNovo: {
            type: "string",
            enum: [
                "RECEBIDO",
                "EM_TRIAGEM",
                "TRIADO",
                "EM_DESMONTAGEM",
                "DESMONTADO",
            ],
        },
        versaoEsperada: {
            type: "integer",
            minimum: 1,
        },
        justificativa: {
            type: ["string", "null"],
        },
        observacao: {
            type: ["string", "null"],
        },
    },
} as const;

export const movimentacaoResponseSchema = {
    type: "object",
    required: [
        "id",
        "estadoAnterior",
        "estadoNovo",
        "justificativa",
        "observacao",
        "dataHora",
        "versao",
        "equipamentoId",
    ],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
        estadoAnterior: {
            type: ["string", "null"],
            enum: [
                "RECEBIDO",
                "EM_TRIAGEM",
                "TRIADO",
                "EM_DESMONTAGEM",
                "DESMONTADO",
                null,
            ],
        },
        estadoNovo: {
            type: "string",
            enum: [
                "RECEBIDO",
                "EM_TRIAGEM",
                "TRIADO",
                "EM_DESMONTAGEM",
                "DESMONTADO",
            ],
        },
        justificativa: {
            type: ["string", "null"],
        },
        observacao: {
            type: ["string", "null"],
        },
        dataHora: {
            type: "string",
            format: "date-time",
        },
        versao: {
            type: "integer",
        },
        equipamentoId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const listarMovimentacoesResponseSchema = {
    type: "array",
    items: movimentacaoResponseSchema,
} as const;