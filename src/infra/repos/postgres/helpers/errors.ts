export class ConnectionNotFoundError extends Error {
    constructor() {
        super("DB Connection was not found");
        this.name = "ConnectionNotFoundError";
    }
}
