import { IFacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import {
    badRequest,
    HttpResponse,
    ok,
    serverError,
    unauthorized,
} from "@/application/helpers";
import { RequiredFieldError } from "@/application/errors";

export class FacebookLoginController {
    constructor(
        private readonly facebookAuthentication: IFacebookAuthentication
    ) {}

    async handle(httpRequest: any): Promise<HttpResponse> {
        try {
            if (!httpRequest.token) {
                return badRequest(new RequiredFieldError("token"));
            }

            const accessToken = await this.facebookAuthentication.perform({
                token: httpRequest.token,
            });

            if (accessToken instanceof AccessToken) {
                return ok({ accessToken: accessToken.value });
            }

            return unauthorized();
        } catch (error: any) {
            return serverError(error);
        }
    }
}
