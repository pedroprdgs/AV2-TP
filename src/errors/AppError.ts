export class AppError extends Error {
    constructor(message: string, public readonly statusCode: number = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }

    /** 400 — a requisição tem dados inválidos ou incompletos. */
    static requisicaoInvalida(mensagem: string): AppError {
        return new AppError(mensagem, 400);
    }

    /** 401 — o cliente não está autenticado (token ausente, inválido ou expirado; login incorreto). */
    static naoAutenticado(mensagem: string): AppError {
        return new AppError(mensagem, 401);
    }

    /** 403 — o cliente está autenticado, mas o perfil dele não permite a ação. */
    static acessoNegado(mensagem: string): AppError {
        return new AppError(mensagem, 403);
    }

    /** 404 — o recurso pedido não existe. */
    static naoEncontrado(mensagem: string): AppError {
        return new AppError(mensagem, 404);
    }

    /** 409 — a ação conflita com o estado atual dos dados (valor duplicado, vínculo existente...). */
    static conflito(mensagem: string): AppError {
        return new AppError(mensagem, 409);
    }
}