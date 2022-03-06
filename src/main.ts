import { fixedKFactorRuleBuilder, adaptToPlayerRankKFactorRuleBuilder } from "./elo-kfactor-rules";
import { EloRankingBoard_InMemory } from "./elo-ranks-board";

export const EloRankingBoardInMemory = EloRankingBoard_InMemory;

// BUILT-IN K factor rule makers
export const fixedKFactorRuleMaker = fixedKFactorRuleBuilder;
export const adaptToPlayerRankKFactorRuleMaker = adaptToPlayerRankKFactorRuleBuilder;