import { mock, MockProxy } from "jest-mock-extended";

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
    let db: MockProxy<IDbTransaction>;
    let sut: DbTransactionController;

    beforeAll(() => {
        db = mock<IDbTransaction>();
    });

    beforeEach(() => {
        sut = new DbTransactionController(db);
    });

    it("should open transaction", async () => {
        await sut.perform({ any: "any" });

        expect(db.openTransaction).toHaveBeenCalledWith();
        expect(db.openTransaction).toHaveBeenCalledTimes(1);
    });
});
