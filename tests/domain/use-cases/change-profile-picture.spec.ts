import { mock, MockProxy } from "jest-mock-extended";
import { mocked } from "ts-jest/utils";
import {
    IUploadFile,
    IUUIDGenerator,
    IDeleteFile,
} from "@/domain/contracts/gateways";
import { ILoadUserProfile, ISaveUserPicture } from "@/domain/contracts/repos";
import {
    setupChangeProfilePicture,
    ChangeProfilePicture,
} from "@/domain/use-cases";
import { UserProfile } from "@/domain/entities";

jest.mock("@/domain/entities/user-profile");

describe("ChangeProfilePicture", () => {
    let uuid: string;
    let buffer: Buffer;
    let mimeType: string;
    let file: { buffer: Buffer; mimeType: string };
    let fileStorage: MockProxy<IUploadFile & IDeleteFile>;
    let crypto: MockProxy<IUUIDGenerator>;
    let userProfileRepo: MockProxy<ISaveUserPicture & ILoadUserProfile>;
    let sut: ChangeProfilePicture;

    beforeEach(() => {
        uuid = "any_unique_id";
        buffer = Buffer.from("any_buffer");
        mimeType = "image/png";
        file = { buffer, mimeType };
        fileStorage = mock();
        fileStorage.upload.mockResolvedValue("any_url");
        crypto = mock();
        crypto.uuid.mockReturnValueOnce(uuid);
        userProfileRepo = mock();
        userProfileRepo.load.mockResolvedValue({
            name: "Diego de Oliveira Pupato",
        });
    });

    beforeEach(() => {
        sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo);
    });

    it("should call UploadFile with correct input (png)", async () => {
        await sut({ id: "any_id", file: { buffer, mimeType: "image/png" } });

        expect(fileStorage.upload).toHaveBeenCalledWith({
            file: buffer,
            fileName: `${uuid}.png`,
        });
        expect(fileStorage.upload).toHaveBeenCalledTimes(1);
    });

    it("should call UploadFile with correct input (jpg)", async () => {
        await sut({ id: "any_id", file: { buffer, mimeType: "image/jpg" } });

        expect(fileStorage.upload).toHaveBeenCalledWith({
            file: buffer,
            fileName: `${uuid}.jpg`,
        });
        expect(fileStorage.upload).toHaveBeenCalledTimes(1);
    });

    it("should call UploadFile with correct input (jpeg)", async () => {
        await sut({ id: "any_id", file: { buffer, mimeType: "image/jpeg" } });

        expect(fileStorage.upload).toHaveBeenCalledWith({
            file: buffer,
            fileName: `${uuid}.jpeg`,
        });
        expect(fileStorage.upload).toHaveBeenCalledTimes(1);
    });

    it("should not call UploadFile when file is undefined", async () => {
        await sut({ id: "any_id", file: undefined });

        expect(fileStorage.upload).not.toHaveBeenCalled();
    });

    it("should call SaveUserPicture with correct input", async () => {
        await sut({ id: "any_id", file });

        expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
            mocked(UserProfile).mock.instances[0]
        );
        expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
    });

    it("should call SaveUserPicture with correct input", async () => {
        await sut({ id: "any_id", file });

        expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
            mocked(UserProfile).mock.instances[0]
        );
        expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
    });

    it("should call LoadUserProfile with correct input", async () => {
        userProfileRepo.load.mockResolvedValueOnce(undefined);
        await sut({ id: "any_id", file: undefined });

        expect(userProfileRepo.load).toHaveBeenCalledWith({
            id: "any_id",
        });
        expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
    });

    it("should not call LoadUserProfile if file exists", async () => {
        await sut({ id: "any_id", file });

        expect(userProfileRepo.load).not.toHaveBeenCalled();
    });

    it("should return correct data on success", async () => {
        mocked(UserProfile).mockImplementationOnce((id) => ({
            setPicture: jest.fn(),
            id: "any_id",
            pictureUrl: "any_url",
            initials: "any_initials",
        }));

        const result = await sut({ id: "any_id", file });

        expect(result).toMatchObject({
            pictureUrl: "any_url",
            initials: "any_initials",
        });
    });

    it("should call DeleteFile when file exists and SaveUserPicture throws", async () => {
        userProfileRepo.savePicture.mockRejectedValueOnce(new Error());

        const promise = sut({ id: "any_id", file });

        promise.catch(() => {
            expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid });
            expect(fileStorage.delete).toHaveBeenCalledTimes(1);
        });
    });

    it("should not call DeleteFile when file does not exists and SaveUserPicture throws", async () => {
        userProfileRepo.savePicture.mockRejectedValueOnce(new Error());

        const promise = sut({ id: "any_id", file: undefined });

        promise.catch(() => {
            expect(fileStorage.delete).not.toHaveBeenCalled();
        });
    });

    it("should rethrow if SaveUserPicture throws", async () => {
        const error = new Error("save_error");
        userProfileRepo.savePicture.mockRejectedValueOnce(error);

        const promise = sut({ id: "any_id", file });

        await expect(promise).rejects.toThrow(error);
    });
});
