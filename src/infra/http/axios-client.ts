import axios from "axios";

import { IHttpGetClient } from "@/infra/http";

export class AxiosHttpClient {
    async get(args: IHttpGetClient.Params): Promise<any> {
        const result = await axios.get(args.url, { params: args.params });

        return result.data;
    }
}
