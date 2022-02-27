/* TYPES - ELO engine */
export type PlayersEloRanks = {
    playerRank: number,
    opponentRank: number
}

export type ScoreDifferentialParams = {
    actualScore: number,
    expectedScore: number,
    kFactor: number // maximum adjustment per game
}

export type MatchDescriptor = {
    playerRank: number,
    opponentRank: number,
    kFactor: number, // maximum adjustment per game
    matchOutcome: 0|1|0.5 // match result: 1 = win for player, 0 = loss for player, 0.5 = draw 
}

export type MatchResultDescriptor = {
    initialRanks: PlayersEloRanks,
    newRanks: PlayersEloRanks,
    rankDiff: number // absolute differential (could be added or substracted depending on opponent or player)
}

export type MultiMatchDescriptor = {
    playerRank: number,
    matchesSetup: Array<{
        opponentRank: number,
        matchOutcome: 0|1|0.5 // match result: 1 = win for player, 0 = loss for player, 0.5 = draw
    }>
    kFactor: number, // maximum adjustment per game 
}

export type MultiMatchResultDescriptor = {
    initialPlayerRank: number,
    newPlayerRank: number,
    scoreDiff: number
}