import { env } from "@/main/config/env";
import { AWSS3FileStorage } from "@/infra/gateways";

export const makeAWSS3FileStorage = (): AWSS3FileStorage => {
    return new AWSS3FileStorage(env.s3.accessKey, env.s3.secret, env.s3.bucket);
};
