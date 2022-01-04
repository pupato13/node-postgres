import { DeletePictureController } from "@/application/controllers";
import { makeChangeProfilePicture } from "@/main/factories/use-cases";

export const makeDeletePictureController = (): DeletePictureController => {
    return new DeletePictureController(makeChangeProfilePicture());
};
