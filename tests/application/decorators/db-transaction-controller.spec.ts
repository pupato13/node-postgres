import { mock } from "jest-mock-extended";

export class DbTransactionController {
    constructor(private readonly db: IDbTransaction) {}

    async perform(httpRequest: any): Promise<void> {
        await this.db.openTransaction();
    }
}

interface IDbTransaction {
    openTransaction: () => Promise<void>;
}

describe("DbTransactionController", () => {
    it("should open transaction", async () => {
        const db = mock<IDbTransaction>();
        const sut = new DbTransactionController(db);

        await sut.perform({ any: "any" });

        expect(db.openTransaction).toHaveBeenCalledWith();
        expect(db.openTransaction).toHaveBeenCalledTimes(1);
    });
});
