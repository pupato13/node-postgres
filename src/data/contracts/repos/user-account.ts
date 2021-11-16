export interface ILoadUserAccountRepository {
    load: (
        params: ILoadUserAccountRepository.Params
    ) => Promise<ILoadUserAccountRepository.Result>;
}

namespace ILoadUserAccountRepository {
    export type Params = {
        email: string;
    };

    export type Result = undefined;
}

export interface ICreateFacebookAccountRepository {
    createFromFacebook: (
        params: ICreateFacebookAccountRepository.Params
    ) => Promise<void>;
}

namespace ICreateFacebookAccountRepository {
    export type Params = {
        name: string;
        email: string;
        facebookId: string;
    };
}
