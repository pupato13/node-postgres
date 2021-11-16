export interface ILoadUserAccountRepository {
    load: (params: ILoadUserAccountRepository.Params) => Promise<void>;
}

namespace ILoadUserAccountRepository {
    export type Params = {
        email: string;
    };
}
