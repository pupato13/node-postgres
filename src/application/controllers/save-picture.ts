import { Controller } from "@/application/controllers";
import { HttpResponse, ok } from "@/application/helpers";
import { ChangeProfilePicture } from "@/domain/use-cases";
import {
    AllowedMimeTypes,
    IValidator,
    MaxFileSize,
    Required,
    RequiredBuffer,
} from "@/application/validation";

type HttpRequest = {
    file: { buffer: Buffer; mimeType: string };
    userId: string;
};
type Model = Error | { initials?: string; pictureUrl?: string };

export class SavePictureController extends Controller {
    constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
        super();
    }

    override async perform({
        file,
        userId,
    }: HttpRequest): Promise<HttpResponse<Model>> {
        const result = await this.changeProfilePicture({
            id: userId,
            file: file.buffer,
        });

        return ok(result);
    }

    override buildValidators({ file }: HttpRequest): IValidator[] {
        return [
            new Required(file, "file"),
            new RequiredBuffer(file.buffer, "file"),
            new AllowedMimeTypes(["png", "jpg"], file.mimeType),
            new MaxFileSize(5, file.buffer),
        ];
    }
}
