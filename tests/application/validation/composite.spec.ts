import { mock } from "jest-mock-extended";

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
    it("should return undefined if all Validators return undefined", () => {
        const validator1 = mock<IValidator>();
        validator1.validate.mockReturnValue(undefined);
        const validator2 = mock<IValidator>();
        validator2.validate.mockReturnValue(undefined);
        const validators = [validator1, validator2];

        const sut = new ValidationComposite(validators);

        const error = sut.validate();

        expect(error).toBeUndefined();
    });
});
