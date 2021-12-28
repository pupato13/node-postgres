import { config } from "aws-sdk";

jest.mock("aws-sdk");

class AWSS3FileStorage {
    constructor(
        private readonly accessKey: string,
        private readonly secret: string,
    ) {
        config.update({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secret,
            },
        });
    }
}

describe("AWSS3FileStorage", () => {
    it("should configure AWS credentials on creation", () => {
        const accessKey = "any_access_key";
        const secret = "any_secret";

        const sut = new AWSS3FileStorage(accessKey, secret);

        expect(sut).toBeDefined();
        expect(config.update).toHaveBeenCalledWith({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secret,
            },
        });
        expect(config.update).toHaveBeenCalledTimes(1);
    });
});
