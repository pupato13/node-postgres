export class ConnectionNotFoundError extends Error {
    constructor() {
        super("DB Connection was not found");
        this.name = "ConnectionNotFoundError";
    }
}

export class TransactionNotFoundError extends Error {
    constructor() {
        super("DB Transaction was not found");
        this.name = "TransactionNotFoundError";
    }
}
