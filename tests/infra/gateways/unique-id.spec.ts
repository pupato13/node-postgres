import { set, reset } from "mockdate";

import { UniqueId } from "@/infra/gateways";

describe("UniqueId", () => {
    let sut: UniqueId;

    beforeAll(() => {
        set(new Date(2021, 9, 3, 10, 10, 10));
        sut = new UniqueId();
    });

    afterAll(() => {
        reset();
    });

    it("should return correct id", () => {
        const uuid = sut.uuid({ key: "any_key" });

        expect(uuid).toBe("any_key_20211003101010");
    });
});
