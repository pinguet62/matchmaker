import {calculateAge, formatJob} from "./tinder.service";

describe("tinder.service", () => {
    afterEach(() => jest.restoreAllMocks());

    test(calculateAge.name, () => {
        expect(formatJob({title: {name: "X"}})).toEqual("X");
        expect(formatJob({company: {name: "Y"}})).toEqual("Y");
        expect(formatJob({title: {name: "X"}, company: {name: "Y"}})).toEqual("X chez Y");
        expect(() => formatJob({})).toThrowError();
    });

    test(calculateAge.name, () => {
        const now = new Date(2018, 2, 1, 18, 8).getTime();
        jest.spyOn(Date, "now").mockImplementation(() => now);

        expect(calculateAge("1989-06-14T14:27:47.983Z")).toEqual(28);
    });
});
