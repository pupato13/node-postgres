export interface ILoadUserAccountRepository {
    load: (
        params: ILoadUserAccountRepository.Params,
    ) => Promise<ILoadUserAccountRepository.Result>;
}

namespace ILoadUserAccountRepository {
    export type Params = {
        email: string;
    };

    export type Result =
        | undefined
        | {
              id: string;
              name?: string;
          };
}

export interface ICreateFacebookAccountRepository {
    createFromFacebook: (
        params: ICreateFacebookAccountRepository.Params,
    ) => Promise<void>;
}

namespace ICreateFacebookAccountRepository {
    export type Params = {
        name: string;
        email: string;
        facebookId: string;
    };
}

export interface IUpdateFacebookAccountRepository {
    updateWithFacebook: (
        params: IUpdateFacebookAccountRepository.Params,
    ) => Promise<void>;
}

namespace IUpdateFacebookAccountRepository {
    export type Params = {
        id: string;
        name: string;
        facebookId: string;
    };
}
