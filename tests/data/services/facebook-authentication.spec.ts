import { mock, MockProxy } from "jest-mock-extended";
import { ILoadFacebookUserApi } from "@/data/contracts/apis";
import {
    ICreateFacebookAccountRepository,
    ILoadUserAccountRepository,
    IUpdateFacebookAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";

describe("FacebookAuthenticationService", () => {
    let facebookApi: MockProxy<ILoadFacebookUserApi>;
    let userAccountRepo: MockProxy<
        ILoadUserAccountRepository &
            ICreateFacebookAccountRepository &
            IUpdateFacebookAccountRepository
    >;
    let sut: FacebookAuthenticationService;
    const token = "any_token";

    beforeEach(() => {
        facebookApi = mock<ILoadFacebookUserApi>();

        facebookApi.loadUser.mockResolvedValue({
            name: "any_fb_name",
            email: "any_fb_email",
            facebookId: "any_fb_id",
        });

        userAccountRepo = mock();

        sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
    });

    it("should call LoadFacebookUserApi with correct params", async () => {
        await sut.perform({ token });

        expect(facebookApi.loadUser).toHaveBeenCalledWith({
            token,
        });
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
    });

    it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
        facebookApi.loadUser.mockResolvedValueOnce(undefined);

        const authResult = await sut.perform({ token });

        expect(authResult).toEqual(new AuthenticationError());
    });

    it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
        await sut.perform({ token });

        expect(userAccountRepo.load).toHaveBeenCalledWith({
            email: "any_fb_email",
        });
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
    });

    it("should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined", async () => {
        userAccountRepo.load.mockResolvedValueOnce(undefined);

        await sut.perform({ token });

        expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
            name: "any_fb_name",
            email: "any_fb_email",
            facebookId: "any_fb_id",
        });
        expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
    });

    it("should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data", async () => {
        userAccountRepo.load.mockResolvedValueOnce({
            id: "any_id",
            name: "any_name",
        });

        await sut.perform({ token });

        expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
            id: "any_id",
            name: "any_name",
            facebookId: "any_fb_id",
        });
        expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
    });
});
