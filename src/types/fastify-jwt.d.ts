import "@fastify/jwt";
import type { PapelUsuario } from "../prisma-generated/enums.ts";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            id: string;
            papel: PapelUsuario;
            versaoToken: number;
        };
        user: {
            id: string;
            papel: PapelUsuario;
            versaoToken: number;
        };
    }
}