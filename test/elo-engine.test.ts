import { expectedScore, scoreDifferential, monoMatchCalculator, multiMatchCalculator } from '../src/elo-engine';

describe("elo-engine", () => {
    describe("expectedScore", () => {
        it(`should return the correct expected match result probability`, () => {
            expect(expectedScore({ playerRank: 1613, opponentRank: 1613 })).toBeCloseTo(0.5);
            expect(expectedScore({ playerRank: 1613, opponentRank: 1609 })).toBeCloseTo(0.51);
            expect(expectedScore({ playerRank: 1613, opponentRank: 1477 })).toBeCloseTo(0.69);
            expect(expectedScore({ playerRank: 1613, opponentRank: 1388 })).toBeCloseTo(0.79);
            expect(expectedScore({ playerRank: 1613, opponentRank: 1586 })).toBeCloseTo(0.54);
            expect(expectedScore({ playerRank: 1613, opponentRank: 1720 })).toBeCloseTo(0.35);
            expect(expectedScore({ playerRank: 2600, opponentRank: 2300 })).toBeCloseTo(0.85);
            expect(expectedScore({ playerRank: 2300, opponentRank: 2600 })).toBeCloseTo(0.15);
        });

        it(`should return 1 when summing expectedScore A vs B & B vs A`, () => {
            const AvsBScore = expectedScore({ playerRank: 1613, opponentRank: 1388 });
            const BvsAScore = expectedScore({ playerRank: 1388, opponentRank: 1613 });

            expect(AvsBScore + BvsAScore).toBeCloseTo(1);
        });
    });

    describe("scoreDifferential", () => {
        it(`should return the correct ELO score differential based on match outcome, k factor and expected result against opponent`, () => {
            expect(scoreDifferential({
                actualScore: 0, // 1 loss
                expectedScore: 0.849, // expected score with 2600 pts against 2300 opponent
                kFactor: 16
            })).toBeCloseTo(-13.584, 3);
            expect(scoreDifferential({
                actualScore: 1, // 1 win
                expectedScore: 0.151, // expected score with 2300 pts against 2600 opponent
                kFactor: 16
            })).toBeCloseTo(13.584, 3);
        });
        it(`should return the correct ELO score differential based on several matches outcome, k factor and expected result against opponents`, () => {
            expect(scoreDifferential({
                actualScore: 2.5, // 0 + 0.5 + 1 + 1 + 0 (2 wins, 2 losses, 1 draw)
                expectedScore: 2.88, // 0.51 + 0.69 + 0.79 + 0.54 + 0.35 (expected scores with 1613 pts against opponents with: 1609, 1477, 1388, 1586, 1720)
                kFactor: 32
            })).toBeCloseTo(-12.159999999999997, 10);
        });
    });
    
    describe("monoMatchCalculator", () => {
        it(`should return the correct rank changes based on match outcome (fixed k factor for both players)`, () => {
            expect(monoMatchCalculator({ playerRank: 2600, playerKFactor:16, opponentRank: 2300, opponentKFactor: 16, matchOutcome: 1 })).toEqual({
                player: {
                    initialRank: 2600,
                    newRank: 2602,
                    rankDiff: 2
                },
                opponent: {
                    initialRank: 2300,
                    newRank: 2298,
                    rankDiff: -2
                }
            });
            expect(monoMatchCalculator({ playerRank: 2600, playerKFactor:16, opponentRank: 2300, opponentKFactor: 16, matchOutcome: 0 })).toEqual({
                player: {
                    initialRank: 2600,
                    newRank: 2586,
                    rankDiff: -14
                },
                opponent: {
                    initialRank: 2300,
                    newRank: 2314,
                    rankDiff: 14
                }
            });
            expect(monoMatchCalculator({ playerRank: 2600, playerKFactor: 16, opponentRank: 2300, opponentKFactor: 16, matchOutcome: 0.5 })).toEqual({
                player: {
                    initialRank: 2600,
                    newRank: 2594,
                    rankDiff: -6
                },
                opponent: {
                    initialRank: 2300,
                    newRank: 2306,
                    rankDiff: 6
                }
            });
            expect(monoMatchCalculator({ playerRank: 2000, playerKFactor: 32, opponentRank: 2000, opponentKFactor: 32, matchOutcome: 0.5 })).toEqual({
                player: {
                    initialRank: 2000,
                    newRank: 2000,
                    rankDiff: 0
                },
                opponent: {
                    initialRank: 2000,
                    newRank: 2000,
                    rankDiff: 0
                }
            });
        });

        it(`should return the correct rank changes based on match outcome (different k factor for both players)`, () => {
            expect(monoMatchCalculator({ playerRank: 2000, playerKFactor: 32, opponentRank: 2000, opponentKFactor: 16, matchOutcome: 0.5 })).toEqual({
                player: {
                    initialRank: 2000,
                    newRank: 2000,
                    rankDiff: 0
                },
                opponent: {
                    initialRank: 2000,
                    newRank: 2000,
                    rankDiff: 0
                }
            });

            expect(monoMatchCalculator({ playerRank: 2600, playerKFactor: 32, opponentRank: 2300, opponentKFactor: 16, matchOutcome: 0.5 })).toEqual({
                player: {
                    initialRank: 2600,
                    newRank: 2589,
                    rankDiff: -11
                },
                opponent: {
                    initialRank: 2300,
                    newRank: 2306,
                    rankDiff: 6
                }
            });

            expect(monoMatchCalculator({ playerRank: 2600, playerKFactor:32, opponentRank: 2300, opponentKFactor: 16, matchOutcome: 1 })).toEqual({
                player: {
                    initialRank: 2600,
                    newRank: 2605,
                    rankDiff: 5
                },
                opponent: {
                    initialRank: 2300,
                    newRank: 2298,
                    rankDiff: -2
                }
            });

            expect(monoMatchCalculator({ playerRank: 2600, playerKFactor:16, opponentRank: 2300, opponentKFactor: 32, matchOutcome: 1 })).toEqual({
                player: {
                    initialRank: 2600,
                    newRank: 2602,
                    rankDiff: 2
                },
                opponent: {
                    initialRank: 2300,
                    newRank: 2295,
                    rankDiff: -5
                }
            });
        });
    });
    
    describe("multiMatchCalculator", () => {
        it(`should return the correct rank change based on multiple matches (order is not relevant)`, () => {
            expect(multiMatchCalculator({ 
                playerRank: 1613, 
                playerKFactor:32,
                matchesSetup: [
                    { opponentRank: 1613, matchOutcome:0.5 }
                ]
            })).toEqual({
                initialRank: 1613,
                newRank: 1613,
                rankDiff: 0
            });
            expect(multiMatchCalculator({ 
                playerRank: 2600, 
                playerKFactor:16,
                matchesSetup: [
                    { opponentRank: 2300, matchOutcome:0 }
                ]
            })).toEqual({
                initialRank: 2600,
                newRank: 2586,
                rankDiff: -14
            });
            expect(multiMatchCalculator({ 
                playerRank: 1613, 
                playerKFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:0 },
                    { opponentRank: 1477, matchOutcome:0.5 },
                    { opponentRank: 1388, matchOutcome:1 },
                    { opponentRank: 1586, matchOutcome:1 },
                    { opponentRank: 1720, matchOutcome:0 }
                ]
            })).toEqual({
                initialRank: 1613,
                newRank: 1601,
                rankDiff: -12
            });
            expect(multiMatchCalculator({ 
                playerRank: 1613, 
                playerKFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:1 },
                    { opponentRank: 1477, matchOutcome:1 },
                    { opponentRank: 1388, matchOutcome:0 },
                    { opponentRank: 1586, matchOutcome:0.5 },
                    { opponentRank: 1720, matchOutcome:0.5 }
                ]
            })).toEqual({
                initialRank: 1613,
                newRank: 1617,
                rankDiff: 4
            });
        });

        it('should throw an error if empty "matchesSetup" is provided', () => {
            expect(() => { multiMatchCalculator({ 
                playerRank: 1613, 
                playerKFactor:32,
                matchesSetup: []
            })}).toThrow();
        })

        it('should have same outcome between: parrelel monomatches initial rank applied and rank offest summed, and multi match evaluation (almost same due to cumulative rounding)', () => {
            const multiMatchesDescriptor = { 
                playerRank: 1613, 
                playerKFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:1 },
                    { opponentRank: 1477, matchOutcome:1 },
                    { opponentRank: 1388, matchOutcome:0 },
                    { opponentRank: 1586, matchOutcome:0.5 },
                    { opponentRank: 1720, matchOutcome:0.5 }
                ]
            };

            // play each match successively with rank same as initial for all matches
            const sequenceOfMonoMatchesSameRank = multiMatchesDescriptor.matchesSetup.map(match => {
                    return monoMatchCalculator({ 
                        playerRank: multiMatchesDescriptor.playerRank, 
                        playerKFactor: multiMatchesDescriptor.playerKFactor, 
                        opponentRank: match.opponentRank, 
                        opponentKFactor: multiMatchesDescriptor.playerKFactor, // not really useful, use fixed k factor for test purposes
                        matchOutcome: (match.matchOutcome as 0|0.5|1)
                    });
                }).reduce((acc, curr) => {
                    const monomatchScoreDiff = (curr as any).player.newRank - (acc as any).initialRank;
                    return {
                        initialRank: (acc as any).initialRank,
                        newRank: acc.newRank + monomatchScoreDiff,
                        rankDiff: monomatchScoreDiff
                    }
                }, {
                    initialRank: multiMatchesDescriptor.playerRank,
                    newRank: multiMatchesDescriptor.playerRank,
                    rankDiff: 0
                });

            const multResult = multiMatchCalculator((multiMatchesDescriptor as any));

            expect(Math.abs(multResult.newRank - sequenceOfMonoMatchesSameRank.newRank)).toBeLessThan(2);
        });

        it('should have same outcome between: successive monomatches, and multi match evaluation (almost same due to cumulative rounding)', () => {
            const multiMatchesDescriptor = { 
                playerRank: 1613, 
                playerKFactor:32,
                matchesSetup: [
                    { opponentRank: 1609, matchOutcome:1 },
                    { opponentRank: 1477, matchOutcome:1 },
                    { opponentRank: 1388, matchOutcome:0 },
                    { opponentRank: 1586, matchOutcome:0.5 },
                    { opponentRank: 1720, matchOutcome:0.5 }
                ]
            };

            // play each match successively with rank updated at each match
            const sequenceOfMonoMatchesFinalRank = multiMatchesDescriptor.matchesSetup.reduce((acc, curr) => {
                const monoMatchResult = monoMatchCalculator({ 
                    playerRank: acc.newRank, 
                    playerKFactor: multiMatchesDescriptor.playerKFactor,
                    opponentRank: curr.opponentRank, 
                    opponentKFactor: multiMatchesDescriptor.playerKFactor, // not really useful, use fixed k factor for test purposes
                    matchOutcome: (curr.matchOutcome as 0|0.5|1)
                });

                // update partial new rank and diff for next match evaluation or final result
                return Object.assign({}, acc, { newRank: monoMatchResult.player.newRank, rankDiff: monoMatchResult.player.newRank - multiMatchesDescriptor.playerRank })
            }, {
                initialRank: multiMatchesDescriptor.playerRank,
                newRank: multiMatchesDescriptor.playerRank,
                rankDiff: 0
            });

            const multResult = multiMatchCalculator((multiMatchesDescriptor as any));

            expect(Math.abs(multResult.newRank - sequenceOfMonoMatchesFinalRank.newRank)).toBeLessThan(2);
        })
    });
});