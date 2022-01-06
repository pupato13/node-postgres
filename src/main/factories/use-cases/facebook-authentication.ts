import {
    makeFacebookApi,
    makeJwtTokenHandler,
} from "@/main/factories/gateways";
import { makePgUserAccountRepo } from "@/main/factories/repos/postgres";
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
