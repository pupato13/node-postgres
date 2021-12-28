import { getRepository } from "typeorm";

import { ISaveUserPicture } from "@/domain/contracts/repos";
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
}
