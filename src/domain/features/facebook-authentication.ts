import { AccessToken } from "@/domain/entities";
import { AuthenticationError } from "@/domain/entities/errors";

export interface IFacebookAuthentication {
    perform: (
        params: IFacebookAuthentication.Params
    ) => Promise<IFacebookAuthentication.Result>;
}

export namespace IFacebookAuthentication {
    export type Params = {
        token: string;
    };

    export type Result = AccessToken | AuthenticationError;
}
