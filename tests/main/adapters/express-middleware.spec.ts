import { HttpResponse } from "@/application/helpers";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { mock, MockProxy } from "jest-mock-extended";

type Adapter = (middleware: IMiddleware) => RequestHandler;

const adaptExpressMiddleware: Adapter =
    (middleware) => async (req, res, next) => {
        const { statusCode, data } = await middleware.handle({
            ...req.headers,
        });

        res.status(statusCode).json(data);
    };

interface IMiddleware {
    handle: (httpRequest: any) => Promise<HttpResponse>;
}

describe("ExpressMiddleware", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let middleware: MockProxy<IMiddleware>;
    let sut: RequestHandler;

    beforeAll(() => {
        req = getMockReq({ headers: { any: "any" } });
        res = getMockRes().res;
        next = getMockRes().next;
        middleware = mock<IMiddleware>();
        middleware.handle.mockResolvedValue({
            statusCode: 500,
            data: { error: "any_error" },
        });
    });

    beforeEach(() => {
        sut = adaptExpressMiddleware(middleware);
    });

    it("should call handle with correct request", async () => {
        await sut(req, res, next);

        expect(middleware.handle).toHaveBeenCalledWith({ any: "any" });
        expect(middleware.handle).toHaveBeenCalledTimes(1);
    });

    it("should call handle with empty request", async () => {
        req = getMockReq();

        await sut(req, res, next);

        expect(middleware.handle).toHaveBeenCalledWith({});
        expect(middleware.handle).toHaveBeenCalledTimes(1);
    });

    it("should respond with correct error and statusCode", async () => {
        await sut(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
        expect(res.json).toHaveBeenCalledTimes(1);
    });
});
