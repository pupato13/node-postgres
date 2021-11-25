import { ILoadFacebookUserApi } from "@/domain/contracts/apis";
import {
    ISaveFacebookAccountRepository,
    ILoadUserAccountRepository,
} from "@/domain/contracts/repos";
import { ITokenGenerator } from "@/domain/contracts/crypto";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";

type Setup = (
    facebookApi: ILoadFacebookUserApi,
    userAccountRepo: ILoadUserAccountRepository &
        ISaveFacebookAccountRepository,
    crypto: ITokenGenerator
) => FacebookAuthentication;

export type FacebookAuthentication = (params: {
    token: string;
}) => Promise<AccessToken | AuthenticationError>;

export const setupFacebookAuthentication: Setup =
    (facebookApi, userAccountRepo, crypto) => async (params) => {
        const fbData = await facebookApi.loadUser(params);

        if (fbData !== undefined) {
            const accountData = await userAccountRepo.load({
                email: fbData.email,
            });

            const fbAccount = new FacebookAccount(fbData, accountData);

            const { id } = await userAccountRepo.saveWithFacebook(fbAccount);

            const token = await crypto.generateToken({
                key: id,
                expirationInMs: AccessToken.expirationInMs,
            });

            return new AccessToken(token);
        }

        return new AuthenticationError();
    };
