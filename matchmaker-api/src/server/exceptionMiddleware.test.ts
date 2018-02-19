import {Router} from "express";
import * as request from "request-promise";
import {createSandbox} from "sinon";
import {NotFoundException, UnauthorizedException, ValidationError} from "../exceptions";
import {BASE_URL, startServerForEach} from "../testHelper";
import * as router from "./router";

describe("exceptions", () => {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    beforeEach(() => {
        const routerStub = Router();
        routerStub.get("/unauthorized", () => {
            throw new UnauthorizedException();
        });
        routerStub.get("/not_found", () => {
            throw new NotFoundException();
        });
        routerStub.get("/unprocessable_entity", () => {
            throw new ValidationError();
        });
        routerStub.get("/internal_server_error", () => {
            throw new Error();
        });
        sinon.stub(router, "default").value(routerStub);
    });

    startServerForEach();

    test(`Should return 401 if '${UnauthorizedException.name}' thrown`, async () => {
        let error;
        try {
            await request.get(`${BASE_URL}/unauthorized`);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.statusCode).toBe(401);
    });

    test(`Should return 404 if '${NotFoundException.name}' thrown`, async () => {
        let error;
        try {
            await request.get(`${BASE_URL}/not_found`);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
    });

    test(`Should return 422 if '${ValidationError.name}' thrown`, async () => {
        let error;
        try {
            await request.get(`${BASE_URL}/unprocessable_entity`);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.statusCode).toBe(422);
    });

    test(`Should return 500 if any unhandled '${Error.name}' thrown`, async () => {
        let error;
        try {
            await request.get(`${BASE_URL}/internal_server_error`);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.statusCode).toBe(500);
    });
});
