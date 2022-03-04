import { MatchDescriptor, MatchResultDescriptor, MultiMatchDescriptor, MultiMatchResultDescriptor, PlayersEloRanks, ScoreDifferentialParams } from './types';

/**
 * A player's expected score is their probability of winning plus half their probability of drawing. Thus, an expected score of 0.75 could represent a 75% chance of winning, 25% chance of losing, and 0% chance of drawing. On the other extreme it could represent a 50% chance of winning, 0% chance of losing, and 50% chance of drawing.
 * @param playersEloRanks 
 * @returns expected score (0 - 1)
 */
export function expectedScore(playersEloRanks:PlayersEloRanks):number {
    const exponent:number = (playersEloRanks.opponentRank - playersEloRanks.playerRank) / 400;

    return 1 / (1 + Math.pow(10, exponent));
}

/**
 * 
 * @param params object parameters: actualScore = match(es) score outcome, expectedScore = theoritical match(es) score outcome, kFactor - maximum score adjustment per game
 * @returns score variations to be applied to player ranking
 */
export function scoreDifferential(params:ScoreDifferentialParams):number {
    const { actualScore, expectedScore, kFactor } = params;

    return kFactor * (actualScore - expectedScore);
}

/**
 * evaluate player and opponent ELO rank change after match is decided
 * @param matchDescriptor player and opponent match full descriptor
 * @returns player and opponent change in ranks post match
 */
export function monoMatchCalculator(matchDescriptor:MatchDescriptor):MatchResultDescriptor {
    const { playerRank, playerKFactor, opponentRank, opponentKFactor, matchOutcome } = matchDescriptor;

    const expectedPlayerMatchScore = expectedScore({ playerRank, opponentRank });
    const playerScoreDiff = Math.round(scoreDifferential({ actualScore: matchOutcome, expectedScore: expectedPlayerMatchScore, kFactor: playerKFactor }));

    const expectedOpponentMatchScore = expectedScore({ playerRank: opponentRank, opponentRank: playerRank });
    const opponentScoreDiff = Math.round(scoreDifferential({ actualScore: 1 - matchOutcome, expectedScore: expectedOpponentMatchScore, kFactor: opponentKFactor }));

    return {
        player: {
            initialRank: playerRank,
            newRank: playerRank + playerScoreDiff,
            rankDiff: playerScoreDiff
        },
        opponent: {
            initialRank: opponentRank,
            newRank: opponentRank + opponentScoreDiff,
            rankDiff: opponentScoreDiff
        }
    }
}

/**
 * Calculate ELO ranking changes for multi matches sequence (only considers players rank shift and act as average rank change for average performance)
 * @param matchDescriptors - all necessary info for multi match palyer ranking calculation
 * @returns rank change details
 */
export function multiMatchCalculator(matchDescriptors:MultiMatchDescriptor):MultiMatchResultDescriptor {
    const { playerRank, playerKFactor, matchesSetup } = matchDescriptors;

    // throw early if empty matches descriptors
    if(!Array.isArray(matchesSetup) || matchesSetup.length === 0) throw new Error('multiMatchCalculator - no valid matches provided in "matchesSetup" property');

    // sum up expected and actual scores for all considered matches
    const expectedScoresSum:number = matchesSetup
        .map(match => expectedScore({ playerRank, opponentRank: match.opponentRank }))
        .reduce((acc, curr) => acc + curr, 0);
    const actualScoresSum:number = matchesSetup.reduce((acc, curr) => acc + curr.matchOutcome, 0);

    // evaluate rank shift
    const rankDiff = Math.round(scoreDifferential({ actualScore: actualScoresSum, expectedScore: expectedScoresSum, kFactor: playerKFactor }));

    return {
        initialRank: playerRank,
        newRank: playerRank + rankDiff,
        rankDiff
    }
}