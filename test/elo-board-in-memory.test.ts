import { EloRankingBoardInMemory } from "../src/main";

describe("elo-board (in memory)", () => {
    // /!\ shared board instance, the order of tests is important
    const eloBoard = new EloRankingBoardInMemory(1000, () => 32);

    describe("createPlayer", () => {
        it(`should return newly created player (from scratch)`, () => {
            const newScratchPlayerA = eloBoard.createPlayer();
            const newScratchPlayerB = eloBoard.createPlayer();

            expect(newScratchPlayerA).toHaveProperty('id');
            expect(newScratchPlayerA).toHaveProperty('matches');
            expect(newScratchPlayerA.id).not.toBe(newScratchPlayerB.id);
            expect(newScratchPlayerA.matches).toBeInstanceOf(Array);
            expect(newScratchPlayerA.matches.length).toBe(0);
            expect(newScratchPlayerA.initialRank).toBe(eloBoard.initialRank);
            expect(newScratchPlayerA.currentRank).toBe(eloBoard.initialRank);
        });

        it(`should return newly created player (from parameters)`, () => {
            const fullPlayer = { creationDate: 375663602, lastPlayed: 943657202, initialRank: 666, currentRank: 111, matches: [0, 1, 2, 3, 4] };
            const partialPlayer = { currentRank: 222, matches: [5, 6] };
            const newFullPlayer = eloBoard.createPlayer(fullPlayer);
            const newPartialPlayer = eloBoard.createPlayer(partialPlayer);

            expect(newFullPlayer).toHaveProperty('id');
            expect(newPartialPlayer).toHaveProperty('id');
            expect(newFullPlayer.creationDate).toBe(fullPlayer.creationDate);
            expect(newFullPlayer.lastPlayed).toBe(fullPlayer.lastPlayed);
            expect(newFullPlayer.initialRank).toBe(fullPlayer.initialRank);
            expect(newFullPlayer.currentRank).toBe(fullPlayer.currentRank);
            expect(newFullPlayer.matches).toBe(fullPlayer.matches);
            expect(newPartialPlayer.initialRank).toBe(eloBoard.initialRank);
            expect(newPartialPlayer.currentRank).toBe(partialPlayer.currentRank);
        });

        it(`should overwrite given id with system provided id`, () => {
            const fullPlayerWithId = { id: 1492, creationDate: 375663602, lastPlayed: 943657202, initialRank: 666, currentRank: 111, matches: [0, 1, 2, 3, 4] };
            const newFullPlayerWithId = eloBoard.createPlayer(fullPlayerWithId);

            expect(newFullPlayerWithId.id).not.toBe(fullPlayerWithId.id);
        });
    });
    describe("getPlayer", () => {});
    describe("getAllPlayers", () => {});
    describe("deletePlayer", () => {});
});