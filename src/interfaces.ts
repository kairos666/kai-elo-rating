import { MatchOutcome } from "./types";

export interface IEloRankingBoard extends IPlayerManager, IMatchManager {
    initialRank: number
    kFactorRule: (playerAId:number, playerBId:number) => number
}

export interface IPlayerManager {
    createPlayer: (player:any, initialRank:number) => void
    deletePlayer: (playerId:number) => void
}

export interface IMatchManager {
    getAllMatches: () => void
    getPlayerMatches: (playerId:number) => void
    getMatch: (matchId:number) => void
    setMatch: (playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome) => void
    getMatchExpectancy: (playerAId:number, playerBId:number) => void
}