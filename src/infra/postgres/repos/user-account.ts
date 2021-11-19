import { getRepository } from "typeorm";

import {
    ILoadUserAccountRepository,
    ISaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepository implements ILoadUserAccountRepository {
    private readonly pgUserRepo = getRepository(PgUser);

    async load(
        params: ILoadUserAccountRepository.Params,
    ): Promise<ILoadUserAccountRepository.Result> {
        const pgUser = await this.pgUserRepo.findOne({ email: params.email });

        if (pgUser !== undefined) {
            return {
                id: pgUser.id.toString(),
                name: pgUser.name ?? undefined,
            };
        }
    }

    async saveWithFacebook(
        params: ISaveFacebookAccountRepository.Params,
    ): Promise<ISaveFacebookAccountRepository.Result> {
        let id: string;

        if (params.id === undefined) {
            const pgUser = await this.pgUserRepo.save({
                name: params.name,
                email: params.email,
                facebookId: params.facebookId,
            });

            id = pgUser.id.toString();
        } else {
            id = params.id;

            await this.pgUserRepo.update(
                {
                    id: parseInt(params.id),
                },
                {
                    name: params.name,
                    facebookId: params.facebookId,
                },
            );
        }

        return { id };
    }
}
