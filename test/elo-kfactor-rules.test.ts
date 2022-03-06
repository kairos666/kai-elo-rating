import { adaptToPlayerRankKFactorRuleBuilder, fixedKFactorRuleBuilder, rangeDescriptorParser } from '../src/elo-kfactor-rules';
import { KFactorRule, Player } from '../src/types';

describe("elo-kfactor-rule", () => {
    const testPlayerTemplate:Player = { id: 111, creationDate: 375663602, lastPlayed: 943657202, initialRank: 666, currentRank: 111, matches: [0, 1, 2, 3, 4] };

    describe("rangeDescriptorParser", () => {
        it(`should throw on invalid range description`, () => {
            expect(() => {
                rangeDescriptorParser('2400,2600]');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('[2400,2600');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('[2400,2600$');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('[,2600]');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('[2600,]');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('0(0,2100)');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('[2400,2600]  ');
            }).toThrow();
            expect(() => {
                rangeDescriptorParser('(2400,2600]]');
            }).toThrow();
        });

        it(`should throw on ranges where lower bound and higher bound are reversed`, () => {
            expect(() => {
                rangeDescriptorParser('(2600,2400]');
            }).toThrow();
        });

        it(`should return the correct range parsing`, () => {
            expect(rangeDescriptorParser('(0,2100)')).toEqual([{ lowerBoundValue: 0, isIncluded: true }, { upperBoundValue: 2100, isIncluded: true }]);
            expect(rangeDescriptorParser('[2100,2400)')).toEqual([{ lowerBoundValue: 2100, isIncluded: false }, { upperBoundValue: 2400, isIncluded: true }]);
            expect(rangeDescriptorParser('[2400,2600]')).toEqual([{ lowerBoundValue: 2400, isIncluded: false }, { upperBoundValue: 2600, isIncluded: false }]);
            expect(rangeDescriptorParser('(2400,2600]')).toEqual([{ lowerBoundValue: 2400, isIncluded: true }, { upperBoundValue: 2600, isIncluded: false }]);
            expect(rangeDescriptorParser('[24.02,26.05]')).toEqual([{ lowerBoundValue: 24.02, isIncluded: false }, { upperBoundValue: 26.05, isIncluded: false }]);
            expect(rangeDescriptorParser('[24.03,2600]')).toEqual([{ lowerBoundValue: 24.03, isIncluded: false }, { upperBoundValue: 2600, isIncluded: false }]);
            expect(rangeDescriptorParser('[2400,2600.04]')).toEqual([{ lowerBoundValue: 2400, isIncluded: false }, { upperBoundValue: 2600.04, isIncluded: false }]);
        });
    });

    describe("fixedKFactorRuleBuilder", () => {
        it(`should return the same value with any player data passed as parameters`, () => {
            const fixeKFactorRule:KFactorRule = fixedKFactorRuleBuilder(666);

            expect(fixeKFactorRule(testPlayerTemplate)).toBeCloseTo(666);
            expect(fixeKFactorRule({ ...testPlayerTemplate, currentRank: 1000, matches: [] })).toBeCloseTo(666);
        });
    });
    
    describe("adaptToPlayerRankKFactorRuleBuilder", () => {
        it(`should return the correct K factor based on player rank provided and K factor stages provided`, () => {
            const builtKFactorRule:KFactorRule = adaptToPlayerRankKFactorRuleBuilder([
                { kFactorValue: 10, range: '(0,1000]' },
                { kFactorValue: 20, range: '(1000,2000]' },
                { kFactorValue: 30, range: '(2000,3000]' }
            ]);
            const testedNoob:Player = { ...testPlayerTemplate, currentRank: 750 };
            const testedJustCasual:Player = { ...testPlayerTemplate, currentRank: 1000 };
            const testedCasual:Player = { ...testPlayerTemplate, currentRank: 1500 };
            const testedJustPro:Player = { ...testPlayerTemplate, currentRank: 2000 };
            const testedPro:Player = { ...testPlayerTemplate, currentRank: 2500 };

            expect(builtKFactorRule(testedNoob)).toBeCloseTo(10);
            expect(builtKFactorRule(testedJustCasual)).toBeCloseTo(20);
            expect(builtKFactorRule(testedCasual)).toBeCloseTo(20);
            expect(builtKFactorRule(testedJustPro)).toBeCloseTo(30);
            expect(builtKFactorRule(testedPro)).toBeCloseTo(30);
        });

        it(`should throw when no K factor can be found for a specific rank`, () => {
            const builtKFactorRule:KFactorRule = adaptToPlayerRankKFactorRuleBuilder([
                { kFactorValue: 10, range: '(0,2500]' },
                { kFactorValue: 20, range: '[2500,3000)' }
            ]);
            const testedPlayer:Player = { ...testPlayerTemplate, currentRank: 2500 };

            expect(() => {
                builtKFactorRule(testedPlayer);
            }).toThrow();
        });

        it(`should throw when several K factors match for a specific rank`, () => {
            const builtKFactorRule:KFactorRule = adaptToPlayerRankKFactorRuleBuilder([
                { kFactorValue: 10, range: '(0,2500)' },
                { kFactorValue: 20, range: '(2500,3000)' }
            ]);
            const testedPlayer:Player = { ...testPlayerTemplate, currentRank: 2500 };

            expect(() => {
                builtKFactorRule(testedPlayer);
            }).toThrow();
        });
    });
});