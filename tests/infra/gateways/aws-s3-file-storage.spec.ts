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
    let sut: AWSS3FileStorage;
    let accessKey: string;
    let secret: string;

    beforeAll(() => {
        accessKey = "any_access_key";
        secret = "any_secret";
    });

    beforeEach(() => {
        sut = new AWSS3FileStorage(accessKey, secret);
    });

    it("should configure AWS credentials on creation", () => {
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
