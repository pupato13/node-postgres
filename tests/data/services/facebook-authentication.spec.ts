import { IFacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationService {
    constructor(private readonly loadFacebookUserApi: ILoadFacebookUserApi) {}

    async perform(params: IFacebookAuthentication.Params): Promise<void> {
        await this.loadFacebookUserApi.loadUser(params);
    }
}

interface ILoadFacebookUserApi {
    loadUser: (params: ILoadFacebookUserApi.Params) => Promise<void>;
}

namespace ILoadFacebookUserApi {
    export type Params = {
        token: string;
    };
}

class LoadFacebookUserApiSpy implements ILoadFacebookUserApi {
    token?: string;

    async loadUser(params: ILoadFacebookUserApi.Params): Promise<void> {
        this.token = params.token;
    }
}

describe("FacebookAuthenticationService", () => {
    it("should call LoadFacebookUserApi with correct params", async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy();
        const sut = new FacebookAuthenticationService(loadFacebookUserApi);

        await sut.perform({ token: "any_token" });

        expect(loadFacebookUserApi.token).toBe("any_token");
    });
});
