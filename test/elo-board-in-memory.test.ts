import { EloRankingBoardInMemory } from "../src/main";

describe("elo-board (in memory)", () => {
    // /!\ shared board instance, the order of tests is important
    const eloBoard = new EloRankingBoardInMemory(1000, () => 32);
    const createPlayerSpy = jest.spyOn(eloBoard, 'createPlayer');

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

    describe("getPlayer", () => {
        it(`should return the correct player from the list`, () => {
            const newlyCreatedPlayer = eloBoard.createPlayer();
            const foundCreatedPlayer = eloBoard.getPlayer(newlyCreatedPlayer.id);

            expect(foundCreatedPlayer).toEqual(newlyCreatedPlayer); // is clone
            expect(foundCreatedPlayer).not.toBe(newlyCreatedPlayer); // is not identity object (prevent player data tempering)
            expect(foundCreatedPlayer).not.toBeNull();
        });

        it(`should return null if player id do not exist`, () => {
            const nonExistentPlayer = eloBoard.getPlayer(1492);

            expect(nonExistentPlayer).toBeNull();
        });
    });

    describe("getAllPlayers", () => {
        it(`should return the full list of players registered`, () => {
            const playersRoster = eloBoard.getAllPlayers();

            expect(playersRoster).toBeInstanceOf(Array);
            expect(playersRoster.length).toBeGreaterThan(0);
            expect(playersRoster.length).toBe(createPlayerSpy.mock.calls.length); // players roster size should match how many times createPlayer has been called
        });
    });

    describe("deletePlayer", () => {
        it(`should remove player from player roster`, () => {
            const targetedPlayer = eloBoard.getPlayer(3);
            const playersRoster = eloBoard.getAllPlayers();
            eloBoard.deletePlayer(3);

            expect(targetedPlayer).not.toBeNull();
            expect(eloBoard.getPlayer(3)).toBeNull();
            expect(eloBoard.getAllPlayers().length).toBe(playersRoster.length - 1);
        });
    });
});