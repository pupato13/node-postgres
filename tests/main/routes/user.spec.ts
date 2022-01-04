import request from "supertest";
import { IBackup } from "pg-mem";
import { getConnection } from "typeorm";

import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";
import { app } from "@/main/config/app";
import { PgUser } from "@/infra/repos/postgres/entities";

describe("User Routes", () => {
    describe("DELETE /users/picture", () => {
        let backup: IBackup;

        beforeEach(() => {
            // Restore the empty DB backup before each test
            backup.restore();
        });

        beforeAll(async () => {
            const db = await makeFakeDb([PgUser]);
            // Creates a backup with empty DB to restore it before each test
            backup = db.backup();
        });

        afterAll(async () => {
            await getConnection().close();
        });

        it("should return 403 if no authorization header is present", async () => {
            const { status } = await request(app).delete("/api/users/picture");

            expect(status).toBe(403);
        });
    });
});
