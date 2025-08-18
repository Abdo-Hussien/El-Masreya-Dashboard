export class Logger {
    static info(message: string, meta: Record<string, any> = {}) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
    }

    static warn(message: string, meta: Record<string, any> = {}) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
    }

    static error(message: string, meta: Record<string, any> = {}) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
    }

    static traceError(err: Error) {
        console.error(`[TRACE] ${new Date().toISOString()} - ${err.name}: ${err.message}`);
        if (err.stack) {
            console.error(err.stack);
        }
    }
}
