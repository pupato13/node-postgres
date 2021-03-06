import axios from "axios";

import { IHttpGetClient } from "@/infra/gateways";

export class AxiosHttpClient implements IHttpGetClient {
    async get({ url, params }: IHttpGetClient.Input): Promise<any> {
        const result = await axios.get(url, { params });

        return result.data;
    }
}
