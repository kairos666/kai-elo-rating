import { expectedScore, monoMatchCalculator } from "./elo-engine";
import { IEloRankingBoard } from "./interfaces";
import { KFactorRule, Match, MatchOutcome, Player } from "./types";

/* ABSTRACT - ELO RANKING BOARD  */
export abstract class AEloRankingBoard implements IEloRankingBoard {
    private _initialRank: number;
    private _kFactorRule: KFactorRule;

    constructor(initialRank: number, kFactorRule: KFactorRule) {
        this._initialRank = initialRank;
        this._kFactorRule = kFactorRule;
    }

    abstract createPlayer(player?:any):Player
    abstract deletePlayer(playerId:number):void
    abstract getPlayer(playerId:number):Player|null
    abstract getAllPlayers():Player[]
    abstract getAllMatches():Match[]
    abstract getPlayerMatches(playerId:number):Match[]
    abstract getMatch(matchId:number):Match|null
    abstract createMatch(match:{ playerAId:number, playerBId:number, matchOutcome:MatchOutcome }):Match
    abstract getMatchExpectancy(playerAId:number, playerBId:number):number

    /* GETTERS SETTERS */
    get initialRank():number { return this._initialRank; }
    set initialRank(newInitialRank: number) { this._initialRank = newInitialRank; } // only applies to players created after the update
    get kFactorRule():KFactorRule { return this._kFactorRule; }
    set kFactorRule(newkFactorRule: KFactorRule) { this._kFactorRule = newkFactorRule; } // only applies to matches created after the update
}