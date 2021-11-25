import { sign } from "jsonwebtoken";

import { ITokenGenerator } from "@/data/contracts/crypto";

type Params = ITokenGenerator.Params;
type Result = ITokenGenerator.Result;

export class JwtTokenGenerator implements ITokenGenerator {
    constructor(private readonly secret: string) {}

    async generateToken({ key, expirationInMs }: Params): Promise<Result> {
        const expirationInSeconds = expirationInMs / 1000;

        return sign({ key }, this.secret, {
            expiresIn: expirationInSeconds,
        });
    }
}
