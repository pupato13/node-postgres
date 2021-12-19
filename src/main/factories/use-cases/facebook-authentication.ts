import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepo } from "@/main/factories/repos";
import { makeJwtTokenHandler } from "@/main/factories/crypto";
import {
    setupFacebookAuthentication,
    FacebookAuthentication,
} from "@/domain/use-cases";

export const makeFacebookAuthentication = (): FacebookAuthentication => {
    return setupFacebookAuthentication(
        makeFacebookApi(),
        makePgUserAccountRepo(),
        makeJwtTokenHandler()
    );
};
