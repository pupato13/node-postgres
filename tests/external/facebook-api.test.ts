import { FacebookApi, AxiosHttpClient } from "@/infra/gateways";
import { env } from "@/main/config/env";

describe("Facebook API Integration Tests", () => {
    let axiosClient: AxiosHttpClient;
    let sut: FacebookApi;

    beforeEach(() => {
        axiosClient = new AxiosHttpClient();
        sut = new FacebookApi(
            axiosClient,
            env.facebookApi.clientId,
            env.facebookApi.clientSecret,
        );
    });

    it("should return a Facebook User if token is valid", async () => {
        // Token is available for 3 months, after it need to generate a new on on Facebook Developer API
        const fbUser = await sut.loadUser({
            token: "EAArU2CvsJfUBAHRRwgnKKt9MMPoBNUD7EB5gBRzZBG8MhyujFNN7ctLl1CUmeKYEGXeCLYf3M3gqTnCZC9ix2twgNtu8zaBN2MPorZAZAami3NbcHPmyRweU4TVo9hi9GGxplb6Hn12iowGuQMMbVjs3888gdm2IAjZBO3nf9afzmTN03zuJaV6BZAHul0KDfJkB7h0AvjrCAiPuhwcQ38",
        });

        expect(fbUser).toEqual({
            name: "Diego Test",
            email: "diego_rgmaqyj_test@tfbnw.net",
            facebookId: "105508265300632",
        });
    });

    it("should return undefined if token is invalid", async () => {
        // Token is available for 3 months, after it need to generate a new on on Facebook Developer API
        const fbUser = await sut.loadUser({
            token: "invalid",
        });

        expect(fbUser).toBeUndefined();
    });
});
