/**
 * Converts a decimal USD amount to integer cents.
 * e.g. 10.50 -> 1050
 * Handles floating point precision issues.
 */
export const toCents = (amount: number | undefined): number => {
    if (!amount) return 0;
    // Round to avoid floating point errors like 1.005 * 100
    return Math.round(amount * 100);
};

/**
 * Safe addition to avoid simple floating issues before rounding
 */
export const sumCents = (...amounts: (number | undefined)[]): number => {
    return amounts
        .filter((n): n is number => n !== undefined)
        .reduce((acc, curr) => acc + curr, 0);
};

/**
 * Random ID generator for transactions if not provided
 */
export const generateId = (prefix: string = 'TX'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
