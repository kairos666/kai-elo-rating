import { IEloRankingBoard } from "./interfaces";
import { KFactorRule, Match, MatchOutcome, Player } from "./types";

/* ABSTRACT - ELO RANKING BOARD  */
abstract class AEloRankingBoard implements IEloRankingBoard {
    private _initialRank: number;
    private _kFactorRule: KFactorRule;

    constructor(initialRank: number, kFactorRule: KFactorRule) {
        this._initialRank = initialRank;
        this._kFactorRule = kFactorRule;
    }

    abstract createPlayer(player:any, initialRank:number):void
    abstract deletePlayer(playerId:number):void
    abstract getAllMatches():void
    abstract getPlayerMatches(playerId:number):void
    abstract getMatch(matchId:number):void
    abstract setMatch(playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome):void
    abstract getMatchExpectancy(playerAId:number, playerBId:number):void

    /* GETTERS SETTERS */
    get initialRank():number { return this._initialRank; }
    set initialRank(newInitialRank: number) { this.initialRank = newInitialRank; }
    set kFactorRule(newkFactorRule: KFactorRule) { this._kFactorRule = newkFactorRule; }
}

/* IN-MEMORY - ELO RANKING BOARD (no data persistence) */
export class EloRankingBoard_InMemory extends AEloRankingBoard {
    private _players:Player[] = [];
    private _matches:Match[] = [];
    constructor(initialRank: number, kFactorRule: KFactorRule) {
        super(initialRank, kFactorRule);
    }

    public createPlayer(player:any, initialRank:number) { }
    public deletePlayer(playerId:number) { }
    public getAllMatches() { }
    public getPlayerMatches(playerId:number) { }
    public getMatch(matchId:number) { }
    public setMatch(playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome) { }
    public getMatchExpectancy(playerAId:number, playerBId:number) { }
}