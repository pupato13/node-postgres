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

export interface ISaveFacebookAccountRepository {
    saveWithFacebook: (
        params: ISaveFacebookAccountRepository.Params,
    ) => Promise<void>;
}

namespace ISaveFacebookAccountRepository {
    export type Params = {
        id?: string;
        name: string;
        email: string;
        facebookId: string;
    };
}
