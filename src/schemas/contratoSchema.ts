export const contratoIdParamsSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const criarContratoSchema = {
    type: "object",
    required: ["numero", "dataInicio", "organizacaoId"],
    additionalProperties: false,
    properties: {
        numero: {
            type: "string",
            minLength: 1,
        },
        dataInicio: {
            type: "string",
            format: "date-time",
        },
        dataFim: {
            type: ["string", "null"],
            format: "date-time",
        },
        valor: {
            type: ["number", "null"],
            minimum: 0,
        },
        clausulas: {},
        organizacaoId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const atualizarContratoSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        numero: {
            type: "string",
            minLength: 1,
        },
        dataInicio: {
            type: "string",
            format: "date-time",
        },
        dataFim: {
            type: ["string", "null"],
            format: "date-time",
        },
        valor: {
            type: ["number", "null"],
            minimum: 0,
        },
        clausulas: {},
        versaoEsperada: {
            type: "integer",
            minimum: 1,
        },
    },
} as const;

export const excluirContratoSchema = {
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

export const contratoResponseSchema = {
    type: "object",
    required: [
        "id",
        "numero",
        "dataInicio",
        "criadoEm",
        "atualizadoEm",
        "versao",
        "organizacaoId",
    ],
    properties: {
        id: { type: "string", format: "uuid" },
        numero: { type: "string" },
        dataInicio: { type: "string", format: "date-time" },
        dataFim: { type: ["string", "null"] },
        valor: { type: ["string", "number", "null"] },
        clausulas: {},
        criadoEm: { type: "string", format: "date-time" },
        atualizadoEm: { type: "string", format: "date-time" },
        versao: { type: "integer" },
        organizacaoId: { type: "string", format: "uuid" },
    },
} as const;

export const listarContratosResponseSchema = {
    type: "array",
    items: contratoResponseSchema,
} as const;