import { mock, MockProxy } from "jest-mock-extended";

import { IFacebookAuthentication } from "@/domain/features";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "@/domain/models";

type HttpResponse = {
    statusCode: number;
    data: any;
};

class FacebookLoginController {
    constructor(
        private readonly facebookAuthentication: IFacebookAuthentication,
    ) {}

    async handle(httpRequest: any): Promise<HttpResponse> {
        if (!httpRequest.token) {
            return {
                statusCode: 400,
                data: new Error("The field token is required"),
            };
        }

        const result = await this.facebookAuthentication.perform({
            token: httpRequest.token,
        });

        if (result instanceof AccessToken) {
            return {
                statusCode: 200,
                data: { accessToken: result.value },
            };
        }

        return {
            statusCode: 401,
            data: result,
        };
    }
}

describe("FacebookLoginController", () => {
    let sut: FacebookLoginController;
    let facebookAuth: MockProxy<IFacebookAuthentication>;

    beforeAll(() => {
        facebookAuth = mock();
        facebookAuth.perform.mockResolvedValue(new AccessToken("any_value"));
    });

    beforeEach(() => {
        sut = new FacebookLoginController(facebookAuth);
    });

    it("should return 400 if token is empty", async () => {
        const httpResponse = await sut.handle({ token: "" });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error("The field token is required"),
        });
    });

    it("should return 400 if token is null", async () => {
        const httpResponse = await sut.handle({ token: null });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error("The field token is required"),
        });
    });

    it("should return 400 if token is undefined", async () => {
        const httpResponse = await sut.handle({ token: undefined });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error("The field token is required"),
        });
    });

    it("should call FacebookAuthentication with correct params", async () => {
        await sut.handle({ token: "any_token" });

        expect(facebookAuth.perform).toHaveBeenCalledWith({
            token: "any_token",
        });
        expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
    });

    it("should return 401 if authentication fails", async () => {
        facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
        const httpResponse = await sut.handle({ token: "any_token" });

        expect(httpResponse).toEqual({
            statusCode: 401,
            data: new AuthenticationError(),
        });
    });

    it("should return 200 if authentication succeeds", async () => {
        const httpResponse = await sut.handle({ token: "any_token" });

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                accessToken: "any_value",
            },
        });
    });
});
