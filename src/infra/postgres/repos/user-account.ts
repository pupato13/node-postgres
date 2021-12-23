import { getRepository } from "typeorm";

import {
    ILoadUserAccount,
    ISaveFacebookAccount,
} from "@/domain/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

type LoadInput = ILoadUserAccount.Input;
type LoadOutput = ILoadUserAccount.Output;
type SaveInput = ISaveFacebookAccount.Input;
type SaveOutput = ISaveFacebookAccount.Output;

export class PgUserAccountRepository
    implements ILoadUserAccount, ISaveFacebookAccount
{
    async load({ email }: LoadInput): Promise<LoadOutput> {
        const pgUserRepo = getRepository(PgUser);
        const pgUser = await pgUserRepo.findOne({ email });

        if (pgUser !== undefined) {
            return {
                id: pgUser.id.toString(),
                name: pgUser.name ?? undefined,
            };
        }
    }

    async saveWithFacebook({
        id,
        name,
        email,
        facebookId,
    }: SaveInput): Promise<SaveOutput> {
        let resultId: string;
        const pgUserRepo = getRepository(PgUser);

        if (id === undefined) {
            const pgUser = await pgUserRepo.save({
                name,
                email,
                facebookId,
            });

            resultId = pgUser.id.toString();
        } else {
            resultId = id;

            await pgUserRepo.update(
                {
                    id: parseInt(id),
                },
                {
                    name,
                    facebookId,
                }
            );
        }

        return { id: resultId };
    }
}
