import { v4 } from "uuid";
import { IUUIDGenerator } from "@/domain/contracts/gateways";

jest.mock("uuid");

export class UUIDHandler {
    uuid({ key }: IUUIDGenerator.Input): void {
        v4();
    }
}

describe("UUIDHandler", () => {
    it("should call uuid.v4", () => {
        const sut = new UUIDHandler();

        sut.uuid({ key: "any_key " });

        expect(v4).toHaveBeenCalledTimes(1);
    });
});
