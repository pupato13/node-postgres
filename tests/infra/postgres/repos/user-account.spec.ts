import { IBackup, newDb } from "pg-mem";
import {
    Column,
    Entity,
    getConnection,
    getRepository,
    PrimaryGeneratedColumn,
    Repository,
} from "typeorm";

import { ILoadUserAccountRepository } from "@/data/contracts/repos";

class PgUserAccountRepository implements ILoadUserAccountRepository {
    async load(
        params: ILoadUserAccountRepository.Params,
    ): Promise<ILoadUserAccountRepository.Result> {
        const pgUserRepo = getRepository(PgUser);

        const pgUser = await pgUserRepo.findOne({ email: params.email });

        if (pgUser !== undefined) {
            return {
                id: pgUser.id.toString(),
                name: pgUser.name ?? undefined,
            };
        }
    }
}

@Entity({ name: "usuarios" })
export class PgUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "nome", nullable: true })
    name?: string;

    @Column()
    email!: string;

    @Column({ name: "id_facebook", nullable: true })
    facebookId?: string;
}

describe("Pg UserAccountRepository", () => {
    describe("load", () => {
        let sut: PgUserAccountRepository;
        let pgUserRepo: Repository<PgUser>;
        let backup: IBackup;

        beforeEach(() => {
            backup.restore();
            sut = new PgUserAccountRepository();
        });

        beforeAll(async () => {
            const db = newDb();
            const connection = await db.adapters.createTypeormConnection({
                type: "postgres",
                entities: [PgUser],
            });

            // create schema
            await connection.synchronize();
            backup = db.backup();
            pgUserRepo = getRepository(PgUser);
        });

        afterAll(async () => {
            await getConnection().close();
        });

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
