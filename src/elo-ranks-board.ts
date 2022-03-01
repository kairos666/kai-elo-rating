import { monoMatchCalculator } from "./elo-engine";
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
    abstract createMatch(match:{ playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome }):Match
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

    /* PRIVATE METHODS */
    // same as public version but return object is not a clone (enables mutations for updates)
    private _getPlayer(playerId:number) {
        const foundPlayer:Player|undefined = this._players.find(player => (player.id === playerId));

        return (foundPlayer)
            ? foundPlayer
            : null;
    }

    /* PUBLIC METHODS */
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

        // register player in players roster and return created player (clone)
        this._players.push(newPlayer);

        return { ...newPlayer };
    }

    public deletePlayer(playerId:number) {
        this._players = this._players.filter(player => (player.id !== playerId));
    }

    public getPlayer(playerId:number) { 
        const foundPlayer:Player|undefined = this._players.find(player => (player.id === playerId));

        return (foundPlayer)
            ? { ...foundPlayer, matches: [...foundPlayer.matches] }
            : null;
    }

    public getAllPlayers() { return this._players.map(player => ({...player})); } // return new array of clones to protect players roster

    public getAllMatches() { }
    public getPlayerMatches(playerId:number) { }
    public getMatch(matchId:number) { }

    public createMatch(match:{ playerAId:number, playerBId:number, kFactor:number, matchOutcome:MatchOutcome }) {
        const now = Date.now();
        // generate ID for new match
        const newMatchId:number = this._matches.length;

        // get players
        if(match.playerAId === match.playerBId) throw new Error(`EloRankingBoard/createMatch - same player for both sides of the match: playerA #${ match.playerAId } = playerB #${ match.playerBId }`);
        const playerA = this._getPlayer(match.playerAId);
        const playerB = this._getPlayer(match.playerBId);
        if(!playerA || !playerB) throw new Error(`EloRankingBoard/createMatch - one or both players in a match can't be found: playerA #${ match.playerAId } & playerB #${ match.playerBId }`);

        // merge new player infos
        const newMatch = Object.assign({}, match, {
            id: newMatchId,
            creationDate: now,
            resolutionDate: now,
            playerARank: playerA?.currentRank,
            playerBRank: playerB?.currentRank
        });

        // register match in matches history
        this._matches.push(newMatch);

        // update players ranks based on match outcome
        const calculatedMatchOutcome = monoMatchCalculator({ 
            playerRank: playerA?.currentRank, 
            opponentRank: playerB?.currentRank, 
            kFactor: match.kFactor, 
            matchOutcome: match.matchOutcome
        });
        playerA.currentRank = calculatedMatchOutcome.newRanks.playerRank;
        playerA.matches.push(newMatch.id);
        playerB.currentRank = calculatedMatchOutcome.newRanks.opponentRank;
        playerB.matches.push(newMatch.id);
        playerA.lastPlayed = playerB.lastPlayed = newMatch.resolutionDate;

        return { ...newMatch };
    }

    public getMatchExpectancy(playerAId:number, playerBId:number) { }
}