import { mock, MockProxy } from "jest-mock-extended";

class ValidationComposite implements IValidator {
    constructor(private readonly validators: IValidator[]) {}

    validate(): Error | undefined {
        for (const validator of this.validators) {
            const error = validator.validate();

            if (error !== undefined) return error;
        }
    }
}

interface IValidator {
    validate: () => Error | undefined;
}

describe("ValidationComposite", () => {
    let sut: ValidationComposite;
    let validator1: MockProxy<IValidator>;
    let validator2: MockProxy<IValidator>;
    let validators: IValidator[];

    beforeAll(() => {
        validator1 = mock<IValidator>();
        validator1.validate.mockReturnValue(undefined);
        validator2 = mock<IValidator>();
        validator2.validate.mockReturnValue(undefined);
        validators = [validator1, validator2];
    });

    beforeEach(() => {
        sut = new ValidationComposite(validators);
    });

    it("should return undefined if all Validators return undefined", () => {
        const error = sut.validate();

        expect(error).toBeUndefined();
    });

    it("should return the first error", () => {
        validator1.validate.mockReturnValue(new Error("error_1"));
        validator2.validate.mockReturnValue(new Error("error_2"));

        const error = sut.validate();

        expect(error).toEqual(new Error("error_1"));
    });
});
