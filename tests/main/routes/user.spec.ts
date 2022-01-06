import request from "supertest";
import { IBackup } from "pg-mem";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";

import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";
import { app } from "@/main/config/app";
import { env } from "@/main/config/env";
import { PgUser } from "@/infra/repos/postgres/entities";
import { PgConnection } from "@/infra/repos/postgres/helpers";

describe("User Routes", () => {
    let backup: IBackup;
    let connection: PgConnection;
    let pgUserRepo: Repository<PgUser>;

    beforeAll(async () => {
        connection = PgConnection.getInstance();
        const db = await makeFakeDb([PgUser]);
        // Creates a backup with empty DB to restore it before each test
        backup = db.backup();
        pgUserRepo = connection.getRepository(PgUser);
    });

    afterAll(async () => {
        await connection.disconnect();
    });

    beforeEach(() => {
        // Restore the empty DB backup before each test
        backup.restore();
    });

    describe("DELETE /users/picture", () => {
        it("should return 403 if no authorization header is present", async () => {
            const { status } = await request(app).delete("/api/users/picture");

            expect(status).toBe(403);
        });

        it("should return 200 with valid data", async () => {
            const { id } = await pgUserRepo.save({
                email: "any_email",
                name: "Diego pupato",
            });
            const authorization = sign({ key: id }, env.jwtSecret);

            const { status, body } = await request(app)
                .delete("/api/users/picture")
                .set({ authorization });

            expect(status).toBe(200);
            expect(body).toEqual({ pictureUrl: undefined, initials: "DP" });
        });
    });

    describe("PUT /users/picture", () => {
        const uploadSpy = jest.fn();

        // Mocked to avoid use internet and AWS S3
        jest.mock("@/infra/gateways/aws-s3-file-storage", () => ({
            // Mock the constructor "AWSS3FileStorage" that has an object "upload"
            AWSS3FileStorage: jest.fn().mockReturnValue({
                upload: uploadSpy,
            }),
        }));

        it("should return 403 if no authorization header is present", async () => {
            const { status } = await request(app).put("/api/users/picture");

            expect(status).toBe(403);
        });

        it("should return 200 with valid data", async () => {
            uploadSpy.mockResolvedValueOnce("any_url");
            const { id } = await pgUserRepo.save({
                email: "any_email",
                name: "Diego pupato",
            });
            const authorization = sign({ key: id }, env.jwtSecret);

            const { status, body } = await request(app)
                .put("/api/users/picture")
                .set({ authorization })
                .attach("picture", Buffer.from("any_buffer"), {
                    filename: "any_name",
                    contentType: "image/png",
                });

            expect(status).toBe(200);
            expect(body).toEqual({
                pictureUrl: "any_url",
                initials: undefined,
            });
        });
    });
});
