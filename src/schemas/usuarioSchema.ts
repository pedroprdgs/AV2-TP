const papeisUsuario = [
    "ADMINISTRADOR",
    "OPERADOR_CADASTRO",
    "GESTOR_ALMOXARIFADO",
    "AUDITOR",
] as const;

export const usuarioIdParamsSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
} as const;

export const criarUsuarioSchema = {
    type: "object",
    required: ["nome", "usuario", "senha", "papel"],
    additionalProperties: false,
    properties: {
        nome: {
            type: "string",
            minLength: 1,
        },
        usuario: {
            type: "string",
            minLength: 1,
        },
        senha: {
            type: "string",
            minLength: 1,
        },
        papel: {
            type: "string",
            enum: papeisUsuario,
        },
    },
} as const;

export const atualizarUsuarioSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        nome: {
            type: "string",
            minLength: 1,
        },
        usuario: {
            type: "string",
            minLength: 1,
        },
        senha: {
            type: "string",
            minLength: 1,
        },
        papel: {
            type: "string",
            enum: papeisUsuario,
        },
        versaoEsperada: {
            type: "integer",
            minimum: 1,
        },
    },
} as const;

export const alterarStatusUsuarioSchema = {
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

export const usuarioResponseSchema = {
    type: "object",
    required: [
        "id",
        "nome",
        "usuario",
        "papel",
        "ativo",
        "criadoEm",
        "atualizadoEm",
        "versao",
    ],
    additionalProperties: false,
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
        nome: {
            type: "string",
        },
        usuario: {
            type: "string",
        },
        papel: {
            type: "string",
            enum: papeisUsuario,
        },
        ativo: {
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
    },
} as const;

export const listarUsuariosResponseSchema = {
    type: "array",
    items: usuarioResponseSchema,
} as const;