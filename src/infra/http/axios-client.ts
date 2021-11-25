import axios from "axios";

import { IHttpGetClient } from "@/infra/http";

export class AxiosHttpClient implements IHttpGetClient {
    async get({ url, params }: IHttpGetClient.Params): Promise<any> {
        const result = await axios.get(url, { params });

        return result.data;
    }
}
