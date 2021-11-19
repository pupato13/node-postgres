import { getRepository } from "typeorm";

import {
    ILoadUserAccountRepository,
    ISaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepository implements ILoadUserAccountRepository {
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

    async saveWithFacebook(
        params: ISaveFacebookAccountRepository.Params,
    ): Promise<void> {
        const pgUserRepo = getRepository(PgUser);

        await pgUserRepo.save({
            name: params.name,
            email: params.email,
            facebookId: params.facebookId,
        });
    }
}
