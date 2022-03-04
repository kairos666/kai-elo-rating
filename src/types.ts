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
    playerKFactor: number,
    opponentRank: number,
    opponentKFactor: number,
    matchOutcome: MatchOutcome
}

export type MatchResultDescriptor = {
    player: {
        initialRank: number,
        newRank: number,
        rankDiff: number
    },
    opponent: {
        initialRank: number,
        newRank: number,
        rankDiff: number
    }
}

export type MultiMatchDescriptor = {
    playerRank: number,
    playerKFactor: number, // maximum adjustment per game 
    matchesSetup: Array<{
        opponentRank: number,
        matchOutcome: MatchOutcome
    }>
}

export type MultiMatchResultDescriptor = {
    initialRank: number,
    newRank: number,
    rankDiff: number
}

/* TYPES - ELO board */
export type KFactorRule = (player:Player) => number;

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
    playerARank: number, // initial player rank (before rank update is applied)
    playerBRank: number, // initial player rank (before rank update is applied)
    playerAKFactor: number,
    playerBKFactor: number,
    matchOutcome: MatchOutcome
}