import { mock, MockProxy } from "jest-mock-extended";

class ValidationComposite {
    constructor(private readonly validators: IValidator[]) {}

    validate(): undefined {
        return undefined;
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
});
