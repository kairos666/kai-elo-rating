import { rangeDescriptorParser } from '../src/elo-kfactor-rules';

describe("elo-kfactor-rule", () => {
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
});