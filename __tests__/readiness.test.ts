import { calculateReadiness } from "../utils/readiness";

describe("calculateReadiness", () => {
    it("returns high score for strong recovery", () => {
        const score = calculateReadiness({
            sleep: 8,
            intensity: 3,
            soreness: 2,
        });

        expect(score).toBeGreaterThanOrEqual(70);
    });

    it("returns low score for overtraining", () => {
        const score = calculateReadiness({
            sleep: 4,
            intensity: 9,
            soreness: 8,
        });

        expect(score).toBeLessThan(40);
    });

    it("never goes below 0", () => {
        const score = calculateReadiness({
            sleep: 0,
            intensity: 10,
            soreness: 10,
        });

        expect(score).toBeGreaterThanOrEqual(0);
    });

    it("never exceeds 100", () => {
        const score = calculateReadiness({
            sleep: 12,
            intensity: 0,
            soreness: 0,
        });

        expect(score).toBeLessThanOrEqual(100);
    });
});
