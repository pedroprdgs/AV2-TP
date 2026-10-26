import type {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest
} from 'fastify';

import { AppError } from './AppError.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
    if (error instanceof AppError) {
        reply.status(error.statusCode).send({ mensagem: error.message });
        return;
    }

    if (error.validation) {
        reply.status(400).send({ mensagem: "Dados inválidos." });
        return;
    }

    request.log.error(error);

    reply.status(500).send({ mensagem: "Erro interno do servidor." });
}

export function registrarErrorHandler(app: FastifyInstance): void {
    app.setErrorHandler(errorHandler);
}