export class ServerError extends Error {
    constructor(error?: Error) {
        super("Server failed. Please, try again soon!");
        this.name = "ServerError";
        this.stack = error?.stack;
    }
}
