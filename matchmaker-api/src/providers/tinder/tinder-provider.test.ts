import {replace, reset, when} from "testdouble";
import {calculateAge, formatJob} from "./tinder-provider";

describe("providers/tinder/tinder-provider", () => {
    afterEach(() => reset());

    test(`${calculateAge}`, () => {
        expect(formatJob({title: {name: "X"}})).toEqual("X");
        expect(formatJob({company: {name: "Y"}})).toEqual("Y");
        expect(formatJob({title: {name: "X"}, company: {name: "Y"}})).toEqual("X chez Y");
        expect(() => formatJob({})).toThrowError();
    });

    test(`${calculateAge}`, () => {
        const now = replace(Date, "now");
        when(now()).thenReturn(new Date(2018, 2, 1, 18, 8).getTime());

        expect(calculateAge("1989-06-14T14:27:47.983Z")).toEqual(28);
    });
});
