import { getRepository } from "typeorm";

import { ILoadUserProfile, ISaveUserPicture } from "@/domain/contracts/repos";
import { PgUser } from "@/infra/repos/postgres/entities";

export class PgUserProfileRepository implements ISaveUserPicture {
    async savePicture({
        id,
        pictureUrl,
        initials,
    }: ISaveUserPicture.Input): Promise<void> {
        const pgUserRepo = getRepository(PgUser);
        await pgUserRepo.update(
            { id: parseInt(id) },
            {
                pictureUrl,
                initials,
            },
        );
    }

    async load({
        id,
    }: ILoadUserProfile.Input): Promise<ILoadUserProfile.Output> {
        const pgUserRepo = getRepository(PgUser);
        const pgUser = await pgUserRepo.findOne({ id: parseInt(id) });

        if (!!pgUser) {
            return { name: pgUser.name };
        }
    }
}
