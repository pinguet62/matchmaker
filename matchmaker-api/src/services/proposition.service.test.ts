import * as repositories from "../database/repositories";
import {NotFoundException} from "../exceptions";
import {decrementProposition, deleteProposition, incrementProposition} from "./proposition.service";

function mockRepository(repositoryFactoryName: string, mocks: { [repositoryMethodName: string]: (...args: any[]) => any }) {
    const fake = jest.fn().mockImplementation(() => mocks);
    (repositories as any)[repositoryFactoryName] = fake.bind(repositories);
}

describe("services/proposition.service", () => {
    afterEach(() => jest.restoreAllMocks());

    describe(`${incrementProposition}`, () => {
        test("Throw 'NotFoundException' if unknown 'Proposition.id'", async () => {
            mockRepository("propositionRepositoryFactory", {findOneById: (id) => Promise.resolve(null)});

            await expect(incrementProposition("any", "unknown", "any")).rejects.toThrow(NotFoundException);
        });

        test("New voter, should increment 'up' and save voter", async () => {
            const voter = "voter";

            mockRepository("propositionRepositoryFactory", {
                findOneById: (id) => Promise.resolve({
                    down: 0,
                    downVoters: [],
                    up: 0,
                    upVoters: [],
                }),
                save: (entity) => {
                    // no action
                },
            });

            const proposition = await incrementProposition("any", "any", voter);

            expect(proposition.up).toBe(1); // +1
            expect(proposition.upVoters).toEqual([voter]); // push(x)
            expect(proposition.down).toBe(0);
            expect(proposition.downVoters).toEqual([]);
        });

        test("When already voted, should reset 'up' and remove voter", async () => {
            const voter = "voter";

            mockRepository("propositionRepositoryFactory", {
                findOneById: (id) => Promise.resolve({
                    down: 0,
                    downVoters: [],
                    up: 1,
                    upVoters: [voter],
                }),
                save: (entity) => {
                    // no action
                },
            });

            const proposition = await incrementProposition("any", "any", voter);

            expect(proposition.up).toBe(0); // -1
            expect(proposition.upVoters).toEqual([]); // splice(i,1)
            expect(proposition.down).toBe(0);
            expect(proposition.downVoters).toEqual([]);
        });

        test("When previously voted '-1', should change voteto '+1'", async () => {
            const voter = "voter";

            mockRepository("propositionRepositoryFactory", {
                findOneById: (id) => Promise.resolve({
                    down: 1,
                    downVoters: [voter],
                    up: 0,
                    upVoters: [],
                }),
                save: (entity) => {
                    // no action
                },
            });

            const proposition = await incrementProposition("any", "any", voter);

            expect(proposition.up).toBe(1); // +1
            expect(proposition.upVoters).toEqual([voter]); // push(x)
            expect(proposition.down).toBe(0); // -1
            expect(proposition.downVoters).toEqual([]); // splice(i,1)
        });
    });

    describe(`${decrementProposition}`, () => {
        test("Throw 'NotFoundException' if unknown 'Proposition.id'", async () => {
            mockRepository("propositionRepositoryFactory", {findOneById: (id) => Promise.resolve(null)});
            await expect(decrementProposition("any", "unknown", "any")).rejects.toThrow(NotFoundException);
        });

        test("New voter, should decrement 'up' and save voter", async () => {
            const voter = "voter";

            mockRepository("propositionRepositoryFactory", {
                findOneById: (id) => Promise.resolve({
                    down: 0,
                    downVoters: [],
                    up: 0,
                    upVoters: [],
                }),
                save: (entity) => {
                    // no action
                },
            });

            const proposition = await decrementProposition("any", "any", voter);

            expect(proposition.up).toBe(0);
            expect(proposition.upVoters).toEqual([]);
            expect(proposition.down).toBe(1); // +1
            expect(proposition.downVoters).toEqual([voter]); // push(x)
        });

        test("When already voted, should reset 'up' and remove voter", async () => {
            const voter = "voter";

            mockRepository("propositionRepositoryFactory", {
                findOneById: (id) => Promise.resolve({
                    down: 1,
                    downVoters: [voter],
                    up: 0,
                    upVoters: [],
                }),
                save: (entity) => {
                    // no action
                },
            });

            const proposition = await decrementProposition("any", "any", voter);

            expect(proposition.up).toBe(0);
            expect(proposition.upVoters).toEqual([]);
            expect(proposition.down).toBe(0); // -1
            expect(proposition.downVoters).toEqual([]); // splice(i,1)
        });

        test("When previously voted '-1', should change voteto '+1'", async () => {
            const voter = "voter";

            mockRepository("propositionRepositoryFactory", {
                findOneById: (id) => Promise.resolve({
                    down: 0,
                    downVoters: [],
                    up: 1,
                    upVoters: [voter],
                }),
                save: (entity) => {
                    // no action
                },
            });

            const proposition = await decrementProposition("any", "any", voter);

            expect(proposition.up).toBe(0); // -1
            expect(proposition.upVoters).toEqual([]); // splice(i,1)
            expect(proposition.down).toBe(1); // +1
            expect(proposition.downVoters).toEqual([voter]); // push(x)
        });
    });

    describe(`${deleteProposition}`, () => {
        test("Throw 'NotFoundException' if unknown 'Proposition.id'", async () => {
            mockRepository("propositionRepositoryFactory", {findOneById: (id) => Promise.resolve(null)});

            await expect(deleteProposition("any", "unknown")).rejects.toThrow(NotFoundException);
        });
    });
});
