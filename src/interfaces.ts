import { Match, MatchOutcome, Player } from "./types";

export interface IEloRankingBoard extends IPlayerManager, IMatchManager {
    initialRank: number
    kFactorRule: (playerAId:number, playerBId:number) => number
}

export interface IPlayerManager {
    createPlayer: (player?:any) => Player
    deletePlayer: (playerId:number) => void
    getPlayer: (playerId:number) => Player|null
    getAllPlayers: () => Player[]
}

export interface IMatchManager {
    getAllMatches: () => Match[]
    getPlayerMatches: (playerId:number) => Match[]
    getMatch: (matchId:number) => Match|null
    createMatch: (match:{ playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome }) => Match
    getMatchExpectancy: (playerAId:number, playerBId:number) => void
}