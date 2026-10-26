
import type { FromSchema } from "json-schema-to-ts";

export const criarOrganizacaoSchema = {
    type: "object",
    required: ["razaoSocial", "cnpj"],
    additionalProperties: false,
    properties: {
        razaoSocial: { type: "string", minLength: 1, maxLength: 255 },
        nomeFantasia: { type: "string", minLength: 1, maxLength: 255 },
        cnpj: { type: "string" },
        email: { type: "string", minLength: 1, maxLength: 255 },
        telefone: { type: "string", minLength: 1, maxLength: 30 },
    }
} as const;

export type CriarOrganizacaoBody = FromSchema<
    typeof criarOrganizacaoSchema
>;

export const atualizarOrganizacaoSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        razaoSocial: { type: "string", minLength: 1, maxLength: 255 },
        nomeFantasia: { type: ["string", "null"], minLength: 1, maxLength: 255 },
        cnpj: { type: "string" },
        email: { type: ["string", "null"], minLength: 1, maxLength: 255 },
        telefone: { type: ["string", "null"], minLength: 1, maxLength: 30 },

        versaoEsperada: { type: "integer", minimum: 1 },
    }
} as const;

export const excluirOrganizacaoSchema = {
    type: "object",
    required: ["versaoEsperada"],
    additionalProperties: false,
    properties: {
        versaoEsperada: { type: "integer", minimum: 1, },
    },
} as const;

export const organizacaoIdParamsSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: { type: "string" },
    },
    additionalProperties: false,
} as const;

export type AtualizarOrganizacaoBody = FromSchema<
    typeof atualizarOrganizacaoSchema
>;