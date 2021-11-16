import { ILoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { IFacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationService {
    constructor(private readonly loadFacebookUserApi: ILoadFacebookUserApi) {}

    async perform(
        params: IFacebookAuthentication.Params
    ): Promise<AuthenticationError> {
        await this.loadFacebookUserApi.loadUser(params);

        return new AuthenticationError();
    }
}

class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
    token?: string;

    result = undefined;

    async loadUser(
        params: ILoadFacebookUserApi.Params
    ): Promise<ILoadFacebookUserApi.Result> {
        this.token = params.token;

        return await Promise.resolve(this.result);
    }
}

describe("FacebookAuthenticationService", () => {
    it("should call LoadFacebookUserApi with correct params", async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy();
        const sut = new FacebookAuthenticationService(loadFacebookUserApi);

        await sut.perform({ token: "any_token" });

        expect(loadFacebookUserApi.token).toBe("any_token");
    });

    it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy();
        loadFacebookUserApi.result = undefined;
        const sut = new FacebookAuthenticationService(loadFacebookUserApi);

        const authResult = await sut.perform({ token: "any_token" });

        expect(authResult).toEqual(new AuthenticationError());
    });
});
