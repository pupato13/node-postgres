import { mock } from "jest-mock-extended";

import { ILoadFacebookUserApi } from "@/data/contracts/apis";

class FacebookApi {
    private readonly baseUrl = "https://graph.facebook.com";

    constructor(private readonly httpClient: IHttpGetClient) {}

    async loadUser(params: ILoadFacebookUserApi.Params): Promise<void> {
        await this.httpClient.get({
            url: `${this.baseUrl}/oauth/access_token`,
        });
    }
}

interface IHttpGetClient {
    get: (params: IHttpGetClient.Params) => Promise<void>;
}

namespace IHttpGetClient {
    export type Params = {
        url: string;
    };
}

describe("FacebookApi", () => {
    it("should get app token", async () => {
        const httpClient = mock<IHttpGetClient>();
        const sut = new FacebookApi(httpClient);

        await sut.loadUser({ token: "any_client_token" });

        expect(httpClient.get).toHaveBeenCalledWith({
            url: "https://graph.facebook.com/oauth/access_token",
        });
    });
});
