import { sign, verify } from "jsonwebtoken";

import { ITokenGenerator, ITokenValidator } from "@/domain/contracts/crypto";

export class JwtTokenHandler implements ITokenGenerator {
    constructor(private readonly secret: string) {}

    async generateToken({
        key,
        expirationInMs,
    }: ITokenGenerator.Params): Promise<ITokenGenerator.Result> {
        const expirationInSeconds = expirationInMs / 1000;

        return sign({ key }, this.secret, {
            expiresIn: expirationInSeconds,
        });
    }

    async validateToken({ token }: ITokenValidator.Params): Promise<void> {
        verify(token, this.secret);
    }
}
