import { config, S3 } from "aws-sdk";
import { mocked } from "ts-jest/utils";
import { AWSS3FileStorage } from "@/infra/gateways";

jest.mock("aws-sdk");

describe("AWSS3FileStorage", () => {
    let sut: AWSS3FileStorage;
    let accessKey: string;
    let secret: string;
    let bucket: string;
    let fileName: string;

    beforeAll(() => {
        accessKey = "any_access_key";
        secret = "any_secret";
        bucket = "any_bucket";
        fileName = "any_file_name";
    });

    beforeEach(() => {
        sut = new AWSS3FileStorage(accessKey, secret, bucket);
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

    describe("upload()", () => {
        let file: Buffer;
        let putObjectPromiseSpy: jest.Mock;
        let putObjectSpy: jest.Mock;

        beforeAll(() => {
            file = Buffer.from("any_buffer");

            putObjectPromiseSpy = jest.fn();
            putObjectSpy = jest
                .fn()
                .mockImplementation(() => ({ promise: putObjectPromiseSpy }));
            mocked(S3).mockImplementation(
                jest.fn().mockImplementation(() => ({
                    putObject: putObjectSpy,
                }))
            );
        });

        it("should call putObject with correct input", async () => {
            await sut.upload({ fileName, file });

            expect(putObjectSpy).toHaveBeenCalledWith({
                Bucket: bucket,
                Key: fileName,
                Body: file,
                ACL: "public-read",
            });
            expect(putObjectSpy).toHaveBeenCalledTimes(1);
            expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
        });

        it("should return imageUrl", async () => {
            const imageUrl = await sut.upload({ fileName, file });

            expect(imageUrl).toBe(
                `https://${bucket}.s3.amazonaws.com/${fileName}`
            );
        });

        it("should return encoded imageUrl", async () => {
            const imageUrl = await sut.upload({
                fileName: "any file name",
                file,
            });

            expect(imageUrl).toBe(
                `https://${bucket}.s3.amazonaws.com/any%20file%20name`
            );
        });

        it("should rethrow if putObject promise throws", async () => {
            const error = new Error("upload_error");
            putObjectPromiseSpy.mockRejectedValueOnce(error);

            const promise = sut.upload({ fileName, file });

            await expect(promise).rejects.toThrow(error);
        });
    });

    describe("delete()", () => {
        let deleteObjectPromiseSpy: jest.Mock;
        let deleteObjectSpy: jest.Mock;

        beforeAll(() => {
            deleteObjectPromiseSpy = jest.fn();
            deleteObjectSpy = jest.fn().mockImplementation(() => ({
                promise: deleteObjectPromiseSpy,
            }));
            mocked(S3).mockImplementation(
                jest.fn().mockImplementation(() => ({
                    deleteObject: deleteObjectSpy,
                }))
            );
        });

        it("should call deleteObject with correct input", async () => {
            await sut.delete({ fileName });

            expect(deleteObjectSpy).toHaveBeenCalledWith({
                Bucket: bucket,
                Key: fileName,
            });
            expect(deleteObjectSpy).toHaveBeenCalledTimes(1);
            expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1);
        });

        it("should rethrow if deleteObject promise throws", async () => {
            const error = new Error("delete_error");
            deleteObjectPromiseSpy.mockRejectedValueOnce(error);

            const promise = sut.delete({ fileName });

            await expect(promise).rejects.toThrow(error);
        });
    });
});
