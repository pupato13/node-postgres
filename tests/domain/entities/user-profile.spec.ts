import { UserProfile } from "@/domain/entities";

describe("UserProfile", () => {
    let sut: UserProfile;

    beforeEach(() => {
        sut = new UserProfile("any_id");
    });

    it("should create with empty initials when pictureUrl is provided", () => {
        sut.setPicture({ pictureUrl: "any_url", name: "any_name" });

        expect(sut).toEqual({
            id: "any_id",
            pictureUrl: "any_url",
            initials: undefined,
        });
    });

    it("should create with empty initials when pictureUrl is provided 2", () => {
        sut.setPicture({ pictureUrl: "any_url" });

        expect(sut).toEqual({
            id: "any_id",
            pictureUrl: "any_url",
            initials: undefined,
        });
    });

    it("should create initials with first letter of first and last names", () => {
        sut.setPicture({ name: "diego de oliveira pupato" });

        expect(sut).toEqual({
            id: "any_id",
            pictureUrl: undefined,
            initials: "DP",
        });
    });

    it("should create initials with first two letters of first name", () => {
        sut.setPicture({ name: "diego" });

        expect(sut).toEqual({
            id: "any_id",
            pictureUrl: undefined,
            initials: "DI",
        });
    });

    it("should create initials with first letter", () => {
        sut.setPicture({ name: "d" });

        expect(sut).toEqual({
            id: "any_id",
            pictureUrl: undefined,
            initials: "D",
        });
    });

    it("should create with empty initials when name and pictureUrl are not provided", () => {
        sut.setPicture({});

        expect(sut).toEqual({
            id: "any_id",
            pictureUrl: undefined,
            initials: undefined,
        });
    });
});
