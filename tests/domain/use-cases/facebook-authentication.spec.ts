import { mock, MockProxy } from "jest-mock-extended";
import { mocked } from "ts-jest/utils";

import {
    ILoadFacebookUser,
    ITokenGenerator,
} from "@/domain/contracts/gateways";
import {
    ISaveFacebookAccount,
    ILoadUserAccount,
} from "@/domain/contracts/repos";
import {
    setupFacebookAuthentication,
    FacebookAuthentication,
} from "@/domain/use-cases";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";

jest.mock("@/domain/entities/facebook-account");

describe("FacebookAuthentication", () => {
    let facebookApi: MockProxy<ILoadFacebookUser>;
    let crypto: MockProxy<ITokenGenerator>;
    let userAccountRepo: MockProxy<ILoadUserAccount & ISaveFacebookAccount>;
    let sut: FacebookAuthentication;
    let token: string;

    beforeAll(() => {
        token = "any_token";

        facebookApi = mock<ILoadFacebookUser>();

        facebookApi.loadUser.mockResolvedValue({
            name: "any_fb_name",
            email: "any_fb_email",
            facebookId: "any_fb_id",
        });

        userAccountRepo = mock();
        userAccountRepo.load.mockResolvedValue(undefined);
        userAccountRepo.saveWithFacebook.mockResolvedValue({
            id: "any_account_id",
        });

        crypto = mock();
        crypto.generate.mockResolvedValue("any_generated_token");
    });

    beforeEach(() => {
        sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);
    });

    it("should call LoadFacebookUserApi with correct input", async () => {
        await sut({ token });

        expect(facebookApi.loadUser).toHaveBeenCalledWith({
            token,
        });
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
    });

    it("should throws AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
        facebookApi.loadUser.mockResolvedValueOnce(undefined);

        const promise = sut({ token });

        await expect(promise).rejects.toThrow(new AuthenticationError());
    });

    it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
        await sut({ token });

        expect(userAccountRepo.load).toHaveBeenCalledWith({
            email: "any_fb_email",
        });
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
    });

    it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
        await sut({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(
            mocked(FacebookAccount).mock.instances[0]
        );
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
    });

    it("should call TokenGenerator with correct input", async () => {
        await sut({ token });

        expect(crypto.generate).toHaveBeenCalledWith({
            key: "any_account_id",
            expirationInMs: AccessToken.expirationInMs,
        });
        expect(crypto.generate).toHaveBeenCalledTimes(1);
    });

    it("should return an AccessToken on success", async () => {
        const authResult = await sut({ token });

        expect(authResult).toEqual({ accessToken: "any_generated_token" });
    });

    it("should rethrows if LoadFacebookApi throws", async () => {
        facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));

        const promise = sut({ token });

        await expect(promise).rejects.toThrow(new Error("fb_error"));
    });

    it("should rethrows if LoadUserAccountRepository throws", async () => {
        userAccountRepo.load.mockRejectedValueOnce(new Error("load_error"));

        const promise = sut({ token });

        await expect(promise).rejects.toThrow(new Error("load_error"));
    });

    it("should rethrows if SaveFacebookAccountRepository throws", async () => {
        userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
            new Error("save_error")
        );

        const promise = sut({ token });

        await expect(promise).rejects.toThrow(new Error("save_error"));
    });

    it("should rethrows if TokenGenerator throws", async () => {
        crypto.generate.mockRejectedValueOnce(new Error("token_error"));

        const promise = sut({ token });

        await expect(promise).rejects.toThrow(new Error("token_error"));
    });
});
