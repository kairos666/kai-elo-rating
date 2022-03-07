import { expectedScore, monoMatchCalculator, multiMatchCalculator, scoreDifferential } from "./elo-engine";
import { fixedKFactorRuleBuilder, adaptToPlayerRankKFactorRuleBuilder } from "./elo-kfactor-rules";
import { EloRankingBoard as EloRankingBoard_InMemory } from "./elo-ranks-board-in-memory";

// elo engine (core elo system)
export const EloEngine = {
    expectedScore: expectedScore,
    scoreDifferential: scoreDifferential,
    monoMatchCalculator: monoMatchCalculator,
    multiMatchCalculator: multiMatchCalculator
}

// elo ranking board
export const EloRankingBoardInMemory = EloRankingBoard_InMemory;

// BUILT-IN K factor rule makers
export const fixedKFactorRuleMaker = fixedKFactorRuleBuilder;
export const adaptToPlayerRankKFactorRuleMaker = adaptToPlayerRankKFactorRuleBuilder;