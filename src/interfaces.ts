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
    getAllMatches: () => void
    getPlayerMatches: (playerId:number) => void
    getMatch: (matchId:number) => void
    createMatch: (match:{ playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome }) => Match
    getMatchExpectancy: (playerAId:number, playerBId:number) => void
}