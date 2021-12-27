import request from "supertest";
import { IBackup } from "pg-mem";
import { getConnection } from "typeorm";

import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";
import { app } from "@/main/config/app";
import { PgUser } from "@/infra/repos/postgres/entities";
import { UnauthorizedError } from "@/application/errors";

describe("Login Routes", () => {
    describe("POST /login/facebook", () => {
        let backup: IBackup;
        const loadUserSpy = jest.fn();

        jest.mock("@/infra/gateways/facebook-api", () => ({
            // Mock the constructor "FacebookApi" that has an object "loadUser"
            FacebookApi: jest.fn().mockReturnValue({
                loadUser: loadUserSpy,
            }),
        }));

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

        it("should return 200 with AccessToken", async () => {
            loadUserSpy.mockResolvedValueOnce({
                name: "any_name",
                email: "any_email",
                facebookId: "any_id",
            });

            const { status, body } = await request(app)
                .post("/api/login/facebook")
                .send({ token: "valid_token" });

            expect(status).toBe(200);
            expect(body.accessToken).toBeTruthy();
        });

        it("should return 401 with UnauthorizedError", async () => {
            const { status, body } = await request(app)
                .post("/api/login/facebook")
                .send({ token: "invalid_token" });

            expect(status).toBe(401);
            expect(body.error).toBe(new UnauthorizedError().message);
        });
    });
});
