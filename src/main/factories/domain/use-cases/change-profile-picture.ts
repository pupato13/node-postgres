import {
    makeAWSS3FileStorage,
    makeUniqueId,
} from "@/main/factories/infra/gateways";
import { makePgUserProfileRepo } from "@/main/factories/infra/repos/postgres";
import {
    setupChangeProfilePicture,
    ChangeProfilePicture,
} from "@/domain/use-cases";

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
    return setupChangeProfilePicture(
        makeAWSS3FileStorage(),
        makeUniqueId(),
        makePgUserProfileRepo()
    );
};
