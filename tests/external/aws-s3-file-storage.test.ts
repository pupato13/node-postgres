import axios from "axios";
import { AWSS3FileStorage } from "@/infra/gateways";
import { env } from "@/main/config/env";

describe("AWS S3 Integration Tests", () => {
    let sut: AWSS3FileStorage;

    beforeEach(() => {
        sut = new AWSS3FileStorage(
            env.s3.accessKey,
            env.s3.secret,
            env.s3.bucket
        );
    });

    it("should upload and delete image from aws s3", async () => {
        const onePixelImage =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII=";
        const file = Buffer.from(onePixelImage, "base64");
        const key = "any_file_name.png";

        const pictureUrl = await sut.upload({ fileName: key, file });

        expect((await axios.get(pictureUrl)).status).toBe(200);

        await sut.delete({ fileName: key });

        await expect(axios.get(pictureUrl)).rejects.toThrow();
    });
});
