import { config, S3 } from "aws-sdk";
import { IDeleteFile, IUploadFile } from "@/domain/contracts/gateways";

export class AWSS3FileStorage implements IUploadFile, IDeleteFile {
    constructor(
        accessKey: string,
        secret: string,
        private readonly bucket: string
    ) {
        config.update({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secret,
            },
        });
    }

    async upload({
        fileName,
        file,
    }: IUploadFile.Input): Promise<IUploadFile.Output> {
        await new S3()
            .putObject({
                Bucket: this.bucket,
                Key: fileName,
                Body: file,
                ACL: "public-read",
            })
            .promise();

        return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(
            fileName
        )}`;
    }

    async delete({ fileName }: IDeleteFile.Input): Promise<void> {
        await new S3()
            .deleteObject({
                Bucket: this.bucket,
                Key: fileName,
            })
            .promise();
    }
}
