import { expectedScore, scoreDifferential, monoMatchCalculator, multiMatchCalculator } from '../src/elo-engine';

// utils
function twoDecimalsRounding(value:number):number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

describe("elo-engine", () => {
    describe("expectedScore", () => {
        it(`should return the correct expected match result probability`, () => {
            expect(expectedScore({ playerRank: 1613, opponentRank: 1613 })).toBe(0.5);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 1613, opponentRank: 1609 }))).toBe(0.51);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 1613, opponentRank: 1477 }))).toBe(0.69);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 1613, opponentRank: 1388 }))).toBe(0.79);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 1613, opponentRank: 1586 }))).toBe(0.54);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 1613, opponentRank: 1720 }))).toBe(0.35);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 2600, opponentRank: 2300 }))).toBe(0.85);
            expect(twoDecimalsRounding(expectedScore({ playerRank: 2300, opponentRank: 2600 }))).toBe(0.15);
        });
    });

    describe("scoreDifferential", () => {
        it(`should return the correct ELO score differential based on match outcome, k factor and expected result against opponent`, () => {
            expect(scoreDifferential({
                actualScore: 0, // 1 loss
                expectedScore: 0.849, // expected score with 2600 pts against 2300 opponent
                kFactor: 16
            })).toBe(-13.584);
            expect(scoreDifferential({
                actualScore: 1, // 1 win
                expectedScore: 0.151, // expected score with 2300 pts against 2600 opponent
                kFactor: 16
            })).toBe(13.584);
        });
        it(`should return the correct ELO score differential based on several matches outcome, k factor and expected result against opponents`, () => {
            expect(scoreDifferential({
                actualScore: 2.5, // 0 + 0.5 + 1 + 1 + 0 (2 wins, 2 losses, 1 draw)
                expectedScore: 2.88, // 0.51 + 0.69 + 0.79 + 0.54 + 0.35 (expected scores with 1613 pts against opponents with: 1609, 1477, 1388, 1586, 1720)
                kFactor: 32
            })).toBe(-12.159999999999997);
        });
    });
    
    describe("monoMatchCalculator", () => {
        it(`should return the correct rank changes based on match outcome`, () => {
            expect(monoMatchCalculator({ playerRank: 2600, opponentRank: 2300, kFactor:16, matchOutcome: 1 })).toEqual({
                initialRanks: { playerRank: 2600, opponentRank: 2300 }, 
                newRanks: { playerRank: 2602, opponentRank: 2298 }, 
                rankDiff: 2
            });
            expect(monoMatchCalculator({ playerRank: 2600, opponentRank: 2300, kFactor:16, matchOutcome: 0 })).toEqual({
                initialRanks: { playerRank: 2600, opponentRank: 2300 }, 
                newRanks: { playerRank: 2586, opponentRank: 2314 }, 
                rankDiff: 14
            });
            expect(monoMatchCalculator({ playerRank: 2600, opponentRank: 2300, kFactor:16, matchOutcome: 0.5 })).toEqual({
                initialRanks: { playerRank: 2600, opponentRank: 2300 }, 
                newRanks: { playerRank: 2594, opponentRank: 2306 }, 
                rankDiff: 6
            });
            expect(monoMatchCalculator({ playerRank: 2000, opponentRank: 2000, kFactor:32, matchOutcome: 0.5 })).toEqual({
                initialRanks: { playerRank: 2000, opponentRank: 2000 }, 
                newRanks: { playerRank: 2000, opponentRank: 2000 }, 
                rankDiff: 0
            });
        });
    });
    
    describe("multiMatchCalculator", () => {
        it(`should return the correct rank change based on multiple matches (order is not relevant)`, () => {
            expect(multiMatchCalculator({ 
                playerRank: 1613, 
                kFactor:32,
                matchesSetup: [
                    { opponentRank: 1613, matchOutcome:0.5 }
                ]
            })).toEqual({
                initialPlayerRank: 1613,
                newPlayerRank: 1613,
                scoreDiff: 0
            });
            expect(multiMatchCalculator({ 
                playerRank: 2600, 
                kFactor:16,
                matchesSetup: [
                    { opponentRank: 2300, matchOutcome:0 }
                ]
            })).toEqual({
                initialPlayerRank: 2600,
                newPlayerRank: 2586,
                scoreDiff: -14
            });
            expect(multiMatchCalculator({ 
                playerRank: 1613, 
                kFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:0 },
                    { opponentRank: 1477, matchOutcome:0.5 },
                    { opponentRank: 1388, matchOutcome:1 },
                    { opponentRank: 1586, matchOutcome:1 },
                    { opponentRank: 1720, matchOutcome:0 }
                ]
            })).toEqual({
                initialPlayerRank: 1613,
                newPlayerRank: 1601,
                scoreDiff: -12
            });
            expect(multiMatchCalculator({ 
                playerRank: 1613, 
                kFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:1 },
                    { opponentRank: 1477, matchOutcome:1 },
                    { opponentRank: 1388, matchOutcome:0 },
                    { opponentRank: 1586, matchOutcome:0.5 },
                    { opponentRank: 1720, matchOutcome:0.5 }
                ]
            })).toEqual({
                initialPlayerRank: 1613,
                newPlayerRank: 1617,
                scoreDiff: 4
            });
        });

        it('should throw an error if empty "matchesSetup" is provided', () => {
            expect(() => { multiMatchCalculator({ 
                playerRank: 1613, 
                kFactor:32,
                matchesSetup: []
            })}).toThrow();
        })

        it('should have different but close outcome depending on successive monomatches or multi match evaluation', () => {
            const multiMatchesDescriptor = { 
                playerRank: 1613, 
                kFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:1 },
                    { opponentRank: 1477, matchOutcome:1 },
                    { opponentRank: 1388, matchOutcome:0 },
                    { opponentRank: 1586, matchOutcome:0.5 },
                    { opponentRank: 1720, matchOutcome:0.5 }
                ]
            };

            const sequenceOfMonoMatchesFinalRank = multiMatchesDescriptor.matchesSetup.reduce((acc, curr) => {
                const monoMatchResult = monoMatchCalculator({ 
                    playerRank: acc.newPlayerRank, 
                    opponentRank: curr.opponentRank, 
                    kFactor:multiMatchesDescriptor.kFactor, 
                    matchOutcome: (curr.matchOutcome as 0|0.5|1)
                });

                // update partial new rank and diff for next match evaluation or final result
                return Object.assign({}, acc, { newPlayerRank: monoMatchResult.newRanks.playerRank, scoreDiff: monoMatchResult.newRanks.playerRank - multiMatchesDescriptor.playerRank })
            }, {
                initialPlayerRank: multiMatchesDescriptor.playerRank,
                newPlayerRank: multiMatchesDescriptor.playerRank,
                scoreDiff: 0
            });

            const multResult = multiMatchCalculator((multiMatchesDescriptor as any));

            expect(multResult.newPlayerRank).not.toBe(sequenceOfMonoMatchesFinalRank.newPlayerRank);
            expect(Math.abs(multResult.newPlayerRank - sequenceOfMonoMatchesFinalRank.newPlayerRank)).toBeLessThan(5);
        })
    });
});