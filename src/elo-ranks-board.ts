import { expectedScore, monoMatchCalculator } from "./elo-engine";
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
    abstract getAllMatches():Match[]
    abstract getPlayerMatches(playerId:number):Match[]
    abstract getMatch(matchId:number):Match|null
    abstract createMatch(match:{ playerAId:number, playerBId:number, matchOutcome:MatchOutcome }):Match
    abstract getMatchExpectancy(playerAId:number, playerBId:number):number

    /* GETTERS SETTERS */
    get initialRank():number { return this._initialRank; }
    set initialRank(newInitialRank: number) { this.initialRank = newInitialRank; }
    get kFactorRule():KFactorRule { return this._kFactorRule; }
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

    public getAllMatches() { return this._matches.map(match => ({...match})); } // return new array of clones to protect match history

    public getPlayerMatches(playerId:number) {
        // first get player
        const targetedPlayer = this.getPlayer(playerId);
        if(!targetedPlayer) throw new Error(`EloRankingBoard/getPlayerMatches - can't find matches for player #${ playerId }, player do not exist`);

        // find all related matches from history (send clones)
        return this._matches
            .filter(match => targetedPlayer?.matches.includes(match.id))
            .map(match => ({ ...match }));     
    }

    public getMatch(matchId:number) {
        const foundMatch:Match|undefined = this._matches.find(match => (match.id === matchId));

        return (foundMatch)
            ? { ...foundMatch }
            : null;
    }

    public createMatch(match:{ playerAId:number, playerBId:number, matchOutcome:MatchOutcome }) {
        const now = Date.now();
        // generate ID for new match
        const newMatchId:number = this._matches.length;

        // get players
        if(match.playerAId === match.playerBId) throw new Error(`EloRankingBoard/createMatch - same player for both sides of the match: playerA #${ match.playerAId } = playerB #${ match.playerBId }`);
        const playerA = this._getPlayer(match.playerAId);
        const playerB = this._getPlayer(match.playerBId);
        if(!playerA || !playerB) throw new Error(`EloRankingBoard/createMatch - one or both players in a match can't be found: playerA #${ match.playerAId } & playerB #${ match.playerBId }`);

        // evaluate players K factor
        const playerAKFactor:number = this.kFactorRule(playerA);
        const playerBKFactor:number = this.kFactorRule(playerB);

        // merge new player infos
        const newMatch = Object.assign({}, match, {
            id: newMatchId,
            creationDate: now,
            resolutionDate: now,
            playerARank: playerA?.currentRank,
            playerBRank: playerB?.currentRank,
            playerAKFactor,
            playerBKFactor
        });

        // register match in matches history
        this._matches.push(newMatch);

        // update players ranks based on match outcome
        const calculatedMatchOutcome = monoMatchCalculator({ 
            playerRank: playerA?.currentRank,
            playerKFactor: playerAKFactor,
            opponentRank: playerB?.currentRank, 
            opponentKFactor: playerBKFactor, 
            matchOutcome: match.matchOutcome
        });
        playerA.currentRank = calculatedMatchOutcome.player.newRank;
        playerA.matches.push(newMatch.id);
        playerB.currentRank = calculatedMatchOutcome.opponent.newRank;
        playerB.matches.push(newMatch.id);
        playerA.lastPlayed = playerB.lastPlayed = newMatch.resolutionDate;

        return { ...newMatch };
    }

    public getMatchExpectancy(playerAId:number, playerBId:number) {
        // get players
        if(playerAId === playerBId) throw new Error(`EloRankingBoard/getMatchExpectancy - same player for both sides of the match: playerA #${ playerAId } = playerB #${ playerBId }`);
        const playerA = this.getPlayer(playerAId);
        const playerB = this.getPlayer(playerBId);
        if(!playerA || !playerB) throw new Error(`EloRankingBoard/getMatchExpectancy - one or both players in a match can't be found: playerA #${ playerAId } & playerB #${ playerBId }`);

        // expected score of A against opponent B
        return expectedScore({ playerRank: playerA.currentRank, opponentRank: playerB.currentRank });
    }
}