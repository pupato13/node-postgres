import { IBackup } from "pg-mem";
import { getConnection, getRepository, Repository } from "typeorm";

import { PgUser } from "@/infra/repos/postgres/entities";
import { PgUserProfileRepository } from "@/infra/repos/postgres";
import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";

describe("Pg UserProfileRepository", () => {
    let sut: PgUserProfileRepository;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup;

    beforeEach(() => {
        // Restore the empty DB backup before each test
        backup.restore();
        sut = new PgUserProfileRepository();
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

    describe("savePicture", () => {
        it("should update user profile", async () => {
            const { id } = await pgUserRepo.save({
                email: "any_email",
                initials: "any_initials",
            });

            await sut.savePicture({ id: id.toString(), pictureUrl: "any_url" });
            const pgUser = await pgUserRepo.findOne({ id });

            expect(pgUser).toMatchObject({
                id,
                pictureUrl: "any_url",
                initials: null,
            });
        });
    });

    describe("savePicture", () => {
        it("should load user profile", async () => {
            const { id } = await pgUserRepo.save({
                email: "any_email",
                name: "any_name",
            });

            const userProfile = await sut.load({ id: id.toString() });

            expect(userProfile?.name).toBe("any_name");
        });

        it("should return undefined", async () => {
            const userProfile = await sut.load({ id: "1" });

            expect(userProfile).toBe(undefined);
        });
    });
});
