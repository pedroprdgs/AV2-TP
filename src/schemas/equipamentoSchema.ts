export const equipamentoIdParamsSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const equipamentoLoteIdParamsSchema = {
    type: "object",
    required: ["loteId"],
    properties: {
        loteId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const criarEquipamentoSchema = {
    type: "object",
    required: ["codigoBarrasInterno", "tipo", "loteId"],
    additionalProperties: false,
    properties: {
        codigoBarrasInterno: {
            type: "string",
            minLength: 1,
        },
        tipo: {
            type: "string",
            minLength: 1,
        },
        descricao: {
            type: ["string", "null"],
        },
        loteId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const atualizarEquipamentoSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        codigoBarrasInterno: {
            type: "string",
            minLength: 1,
        },
        tipo: {
            type: "string",
            minLength: 1,
        },
        descricao: {
            type: ["string", "null"],
        },
        triagemCompleta: {
            type: "boolean",
        },
        versaoEsperada: {
            type: "integer",
            minimum: 1,
        },
    },
} as const;

export const excluirEquipamentoSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        versaoEsperada: {
            type: "integer",
            minimum: 1,
        },
    },
} as const;

export const equipamentoResponseSchema = {
    type: "object",
    required: [
        "id",
        "codigoBarrasInterno",
        "tipo",
        "descricao",
        "estado",
        "triagemCompleta",
        "criadoEm",
        "atualizadoEm",
        "versao",
        "loteId",
    ],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
        codigoBarrasInterno: {
            type: "string",
        },
        tipo: {
            type: "string",
        },
        descricao: {
            type: ["string", "null"],
        },
        estado: {
            type: "string",
            enum: [
                "RECEBIDO",
                "EM_TRIAGEM",
                "TRIADO",
                "EM_DESMONTAGEM",
                "DESMONTADO",
            ],
        },
        triagemCompleta: {
            type: "boolean",
        },
        criadoEm: {
            type: "string",
            format: "date-time",
        },
        atualizadoEm: {
            type: "string",
            format: "date-time",
        },
        versao: {
            type: "integer",
        },
        loteId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const listarEquipamentosResponseSchema = {
    type: "array",
    items: equipamentoResponseSchema,
} as const;