import { makeAWSS3FileStorage, makeUniqueId } from "@/main/factories/gateways";
import { makePgUserProfileRepo } from "@/main/factories/repos";
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
