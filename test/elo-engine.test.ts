import { expectedScores } from '../src/elo-engine';

// utils
function twoDecimalsRounding(value:number):number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

describe("elo-engine tests", () => {
    it(`should return the correct expected match result probability`, () => {
        expect(expectedScores({ playerScore: 1613, opponentScore: 1613 })).toBe(0.5);
        expect(twoDecimalsRounding(expectedScores({ playerScore: 1613, opponentScore: 1609 }))).toBe(0.51);
        expect(twoDecimalsRounding(expectedScores({ playerScore: 1613, opponentScore: 1477 }))).toBe(0.69);
        expect(twoDecimalsRounding(expectedScores({ playerScore: 1613, opponentScore: 1388 }))).toBe(0.79);
        expect(twoDecimalsRounding(expectedScores({ playerScore: 1613, opponentScore: 1586 }))).toBe(0.54);
        expect(twoDecimalsRounding(expectedScores({ playerScore: 1613, opponentScore: 1720 }))).toBe(0.35);
    });
});