/* TYPES - ELO engine */
export type MatchOutcome = 0|1|0.5; // match result: 1 = win for player, 0 = loss for player, 0.5 = draw

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
    matchOutcome: MatchOutcome
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
        matchOutcome: MatchOutcome
    }>
    kFactor: number, // maximum adjustment per game 
}

export type MultiMatchResultDescriptor = {
    initialPlayerRank: number,
    newPlayerRank: number,
    scoreDiff: number
}

/* TYPES - ELO board */
export type KFactorRule = (playerAId:number, playerBId:number) => number;

export type Player = {
    id: number,
    creationDate: number, // timestamp
    lastPlayed: number, // timestamp
    initialRank: number,
    currentRank: number,
    matches: number[] // Match IDs
}

export type Match = {
    id: number,
    creationDate: number, // timestamp
    resolutionDate: number, // timestamp
    playerAId: number,
    playerBId: number,
    playerARank: number,
    playerBRank: number,
    kFactor: number,
    matchOutcome: MatchOutcome
}