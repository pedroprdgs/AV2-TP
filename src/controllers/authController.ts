import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import AuthService from "../services/authService.js";
import type { DadosLogin } from "../models/Usuario.js";

export default class AuthController {
    private authService = new AuthService();

    async login(request: FastifyRequest<{ Body: DadosLogin }>, reply: FastifyReply, app: FastifyInstance) {
        const resultado = await this.authService.login(request.body, app);

        return reply.status(200).send(resultado);
    }

    async logout(request: FastifyRequest, reply: FastifyReply) {
        await this.authService.logout(request.user.id);

        return reply.status(204).send();
    }
}