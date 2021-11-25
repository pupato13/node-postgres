import { getRepository } from "typeorm";

import {
    ILoadUserAccountRepository,
    ISaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

type LoadParams = ILoadUserAccountRepository.Params;
type LoadResult = ILoadUserAccountRepository.Result;
type SaveParams = ISaveFacebookAccountRepository.Params;
type SaveResult = ISaveFacebookAccountRepository.Result;

export class PgUserAccountRepository
    implements ILoadUserAccountRepository, ISaveFacebookAccountRepository
{
    private readonly pgUserRepo = getRepository(PgUser);

    async load({ email }: LoadParams): Promise<LoadResult> {
        const pgUser = await this.pgUserRepo.findOne({ email });

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
    }: SaveParams): Promise<SaveResult> {
        let resultId: string;

        if (id === undefined) {
            const pgUser = await this.pgUserRepo.save({
                name,
                email,
                facebookId,
            });

            resultId = pgUser.id.toString();
        } else {
            resultId = id;

            await this.pgUserRepo.update(
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
