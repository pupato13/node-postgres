import { v4 } from "uuid";
import { IUUIDGenerator } from "@/domain/contracts/gateways";

export class UUIDHandler {
    uuid({ key }: IUUIDGenerator.Input): IUUIDGenerator.Output {
        return `${key}_${v4()}`;
    }
}
