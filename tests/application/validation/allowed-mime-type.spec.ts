import { InvalidMimeTypeError } from "@/application/errors";

type Extension = "png" | "jpg";

export class AllowedMimeTypes {
    constructor(
        private readonly allowed: Extension[],
        private readonly mimeType: string
    ) {}

    validate(): Error | undefined {
        if (this.allowed.includes("png") && this.mimeType !== "image/png") {
            return new InvalidMimeTypeError(this.allowed);
        }
    }
}

describe("AllowedMimeTypes", () => {
    it("Should return InvalidMimeTypeError if value is invalid", () => {
        const sut = new AllowedMimeTypes(["png"], "image/jpg");

        const error = sut.validate();

        expect(error).toEqual(new InvalidMimeTypeError(["png"]));
    });

    it("Should return undefined if value is valid", () => {
        const sut = new AllowedMimeTypes(["png"], "image/png");

        const error = sut.validate();

        expect(error).toEqual(undefined);
    });
});
