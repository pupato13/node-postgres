import { IValidator, RequiredStringValidator } from "@/application/validation";

class ValidationBuilder {
    private constructor(
        private readonly value: string,
        private readonly fieldName: string,
        private readonly validators: IValidator[] = []
    ) {}

    static of(params: { value: string; fieldName: string }): ValidationBuilder {
        return new ValidationBuilder(params.value, params.fieldName);
    }

    required(): ValidationBuilder {
        this.validators.push(
            new RequiredStringValidator(this.value, this.fieldName)
        );

        return this;
    }

    build(): IValidator[] {
        return this.validators;
    }
}

describe("ValidationBuilder", () => {
    it("should return a RequiredStringValidator", () => {
        const validators = ValidationBuilder.of({
            value: "any_value",
            fieldName: "any_field",
        })
            .required()
            .build();

        expect(validators).toEqual([
            new RequiredStringValidator("any_value", "any_field"),
        ]);
    });
});
