/**
 * Convert matchOutcome parameters to corresponding number representation in elo rating system
 * @param matchOutcome 
 * @returns 1|0|0.5
 */
function matchOutcomeCoeff(matchOutcome:'win'|'loss'|'draw'):1|0|0.5 {
    switch(matchOutcome) {
        case 'win': return 1;
        case 'loss': return 0;
        case 'draw': return 0.5;

        default:
            throw new Error(`matchOutcome can only accept "win", "loss", "draw", values. Received ${ matchOutcome } instead`);
    }
}

/**
 * Calculate ELO rating score change amount to be applied on a specifc match
 * @param firstPlayerEloScore 
 * @param secondPlayerEloScore 
 * @param matchOutcome 
 * @param kFactor 
 * @returns ELO score points change to be applied as outcome of this match
 */
export function matchScoreDiffResolution(firstPlayerEloScore:number, secondPlayerEloScore:number, matchOutcome:'win'|'loss'|'draw', kFactor: number = 32):number {
    return (firstPlayerEloScore - secondPlayerEloScore) * matchOutcomeCoeff(matchOutcome) * kFactor;
}

/**
 * Calculate first player new ELO rating score based on match outcome
 * @param firstPlayerEloScore 
 * @param secondPlayerEloScore 
 * @param matchOutcome 
 * @param kFactor 
 * @returns new ELO score for first player based on match outcome
 */
export function matchScoreResolution(firstPlayerEloScore:number, secondPlayerEloScore:number, matchOutcome:'win'|'loss'|'draw', kFactor: number = 32):number {
    return firstPlayerEloScore + matchScoreDiffResolution(firstPlayerEloScore, secondPlayerEloScore, matchOutcome, kFactor);
}