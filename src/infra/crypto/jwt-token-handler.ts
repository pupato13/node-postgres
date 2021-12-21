import { JwtPayload, sign, verify } from "jsonwebtoken";

import { ITokenGenerator, ITokenValidator } from "@/domain/contracts/crypto";

export class JwtTokenHandler implements ITokenGenerator, ITokenValidator {
    constructor(private readonly secret: string) {}

    async generateToken({
        key,
        expirationInMs,
    }: ITokenGenerator.Input): Promise<ITokenGenerator.Output> {
        const expirationInSeconds = expirationInMs / 1000;

        return sign({ key }, this.secret, {
            expiresIn: expirationInSeconds,
        });
    }

    async validateToken({
        token,
    }: ITokenValidator.Input): Promise<ITokenGenerator.Output> {
        const payload = verify(token, this.secret) as JwtPayload;

        return payload.key;
    }
}
