import { criarApp } from "./app.js";

const app = await criarApp();

const port = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
    try {
        await app.listen({
            port,
            host: "0.0.0.0"
        });
    } catch (error) {
        app.log.error(error);
        
        await app.close();
        process.exitCode = 1;
    }
}

void start();