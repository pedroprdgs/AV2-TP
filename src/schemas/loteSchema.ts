export const loteIdParamsSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const loteOrganizacaoIdParamsSchema = {
    type: "object",
    required: ["organizacaoId"],
    properties: {
        organizacaoId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const criarLoteSchema = {
    type: "object",
    required: [
        "notaFiscal",
        "transportadora",
        "dataEntrada",
        "organizacaoId",
    ],
    additionalProperties: false,
    properties: {
        notaFiscal: {
            type: "string",
            minLength: 1,
        },
        transportadora: {
            type: "string",
            minLength: 1,
        },
        dataEntrada: {
            type: "string",
            format: "date-time",
        },
        organizacaoId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const atualizarLoteSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        notaFiscal: {
            type: "string",
            minLength: 1,
        },
        transportadora: {
            type: "string",
            minLength: 1,
        },
        dataEntrada: {
            type: "string",
            format: "date-time",
        },
        versaoEsperada: {
            type: "integer",
            minimum: 1,
        },
    },
} as const;

export const excluirLoteSchema = {
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

export const loteResponseSchema = {
    type: "object",
    required: [
        "id",
        "notaFiscal",
        "transportadora",
        "dataEntrada",
        "criadoEm",
        "atualizadoEm",
        "versao",
        "organizacaoId",
    ],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
        notaFiscal: {
            type: "string",
        },
        transportadora: {
            type: "string",
        },
        dataEntrada: {
            type: "string",
            format: "date-time",
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
        organizacaoId: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const listarLotesResponseSchema = {
    type: "array",
    items: loteResponseSchema,
} as const;