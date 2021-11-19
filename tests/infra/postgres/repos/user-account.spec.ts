import { IBackup } from "pg-mem";
import { getConnection, getRepository, Repository } from "typeorm";

import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";

describe("Pg UserAccountRepository", () => {
    let sut: PgUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup;

    beforeEach(() => {
        // Restore the empty DB backup before each test
        backup.restore();
        sut = new PgUserAccountRepository();
    });

    beforeAll(async () => {
        const db = await makeFakeDb([PgUser]);
        // Creates a backup with empty DB to restore it before each test
        backup = db.backup();
        pgUserRepo = getRepository(PgUser);
    });

    afterAll(async () => {
        await getConnection().close();
    });

    describe("load", () => {
        it("should return an account if email exists", async () => {
            await pgUserRepo.save({ email: "any_email" });

            const account = await sut.load({ email: "any_email" });

            expect(account).toEqual({ id: "1" });
        });

        it("should return undefined if email does not exists", async () => {
            const account = await sut.load({ email: "any_email" });

            expect(account).toBeUndefined();
        });
    });
});
