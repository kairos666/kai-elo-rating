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

    abstract createPlayer(player?:any):Player
    abstract deletePlayer(playerId:number):void
    abstract getPlayer(playerId:number):Player|null
    abstract getAllPlayers():Player[]
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

    public createPlayer(player?:any):Player {
        // generate ID for new player (overwrite eventual given id in parameters)
        const newPlayerId:number = this._players.length;

        // merge new player infos
        const newPlayer = Object.assign({
                creationDate: Date.now(),
                lastPlayed: null,
                initialRank: this.initialRank,
                currentRank: this.initialRank,
                matches: []
            }, 
            player, 
            { id: newPlayerId }
        );

        this._players.push(newPlayer);

        return newPlayer;
    }

    public deletePlayer(playerId:number) {
        this._players = this._players.filter(player => (player.id !== playerId));
    }

    public getPlayer(playerId:number) { 
        const foundPlayer:Player|undefined = this._players.find(player => (player.id === playerId));

        return (foundPlayer)
            ? { ...foundPlayer }
            : null;
    }

    public getAllPlayers() { return this._players.map(player => ({...player})) } // return new array of clones to protect players roster

    public getAllMatches() { }
    public getPlayerMatches(playerId:number) { }
    public getMatch(matchId:number) { }
    public setMatch(playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome) { }
    public getMatchExpectancy(playerAId:number, playerBId:number) { }
}