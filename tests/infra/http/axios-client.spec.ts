import axios from "axios";

import { IHttpGetClient } from "@/infra/http";

// Mocking axios to not do real requests on it
jest.mock("axios");

class AxiosHttpClient {
    async get(args: IHttpGetClient.Params): Promise<void> {
        await axios.get(args.url, { params: args.params });
    }
}

describe("AxiosHttpClient", () => {
    describe("get", () => {
        it("should call get with correct params", async () => {
            const fakeAxios = axios as jest.Mocked<typeof axios>;
            const sut = new AxiosHttpClient();

            await sut.get({
                url: "any_url",
                params: {
                    any: "any",
                },
            });

            expect(fakeAxios.get).toHaveBeenCalledWith("any_url", {
                params: { any: "any" },
            });

            expect(fakeAxios.get).toHaveBeenCalledTimes(1);
        });
    });
});
