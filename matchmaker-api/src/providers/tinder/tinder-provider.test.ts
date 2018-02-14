import {createSandbox} from "sinon";
import {calculateAge, formatJob} from "./tinder-provider";

describe("providers/tinder/tinder-provider", () => {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    test(`${calculateAge}`, () => {
        expect(formatJob({title: {name: "X"}})).toEqual("X");
        expect(formatJob({company: {name: "Y"}})).toEqual("Y");
        expect(formatJob({title: {name: "X"}, company: {name: "Y"}})).toEqual("X chez Y");
        expect(() => formatJob({})).toThrowError();
    });

    test(`${calculateAge}`, () => {
        sinon.stub(Date, "now").returns(new Date(2018, 2, 1, 18, 8).getTime());

        expect(calculateAge("1989-06-14T14:27:47.983Z")).toEqual(28);
    });
});
