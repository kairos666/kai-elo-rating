/* TYPES */
type EloSystemSettings = {
    kFactor: number
}

type PlayersEloRatings = {
    playerScore: number,
    opponentScore: number
}

/* EXPORTS */
/**
 * A player's expected score is their probability of winning plus half their probability of drawing. Thus, an expected score of 0.75 could represent a 75% chance of winning, 25% chance of losing, and 0% chance of drawing. On the other extreme it could represent a 50% chance of winning, 0% chance of losing, and 50% chance of drawing.
 * @param playerRatings 
 * @returns expected score (0 - 1)
 */
export function expectedScores(playerRatings:PlayersEloRatings):number {
    const exponent:number = (playerRatings.opponentScore - playerRatings.playerScore) / 400;

    return 1 / (1 + Math.pow(10, exponent));
}