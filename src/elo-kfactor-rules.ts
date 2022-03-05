import { KFactorRule } from "./types";

// UTILS
export function rangeDescriptorParser(range:string):[{ lowerBoundValue:number, isIncluded:boolean }, { upperBoundValue:number, isIncluded:boolean }] {
    // check string format validity
    const validFormat:RegExp = /^(\(|\[)(\d+|\d+.?\d+),(\d+|\d+.?\d+)(\)|\])$/g;
    const rangeMatches = validFormat.exec(range);
    if(rangeMatches === null) throw new Error(`range description invalid: ${ range }`);

    const lowerBoundValue:number = parseFloat(rangeMatches[2]);
    const upperBoundValue:number = parseFloat(rangeMatches[3]);
    if(lowerBoundValue > upperBoundValue) throw new Error(`range description invalid, lower bound is superior to upper bound: ${ range }`);

    return [
        { 
            lowerBoundValue, 
            isIncluded: (rangeMatches[1] === '(') 
        },
        { 
            upperBoundValue, 
            isIncluded: (rangeMatches[4] === ')')
        }
    ];
}

/**
 * K FACTOR RULE
 * STRATEGIES CATALOGUE
 * 
 * you can always provide your own custom strategy by providing a custom KFactorRule function
 */

/**
 * always return the same K factor value
 * @param kFactorValue 
 * @returns 
 */
export function fixedKFactorRuleBuilder(kFactorValue:number):KFactorRule {
    return () => kFactorValue; 
}

/**
 * return k factor value based on player rank
 * range examples
 * range = (0,2100), between 0 and 2100
 * range = [2100,2400), between 2100 (excluded) and 2400 (included)
 * range = [2400,2600], between 2400 (excluded) and 2600 (excluded)
 * @param kFactorStages 
 */
export function adaptToPlayerRankKFactorRuleBuilder(kFactorStages:{ kFactorValue:number, range:string }[]):KFactorRule {
    return () => 12; // TODO
}