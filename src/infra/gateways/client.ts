export interface IHttpGetClient {
    get: <T = any>(input: IHttpGetClient.Input) => Promise<T>;
}

export namespace IHttpGetClient {
    export type Input = {
        url: string;
        params: object;
    };
}
