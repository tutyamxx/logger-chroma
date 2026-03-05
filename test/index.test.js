import loggerChroma from '../index.js';
import { jest } from '@jest/globals';

const stripAnsi = (str) => str.replace(/\u001b\[[0-9;]*m/g, '');

describe('Logger Chroma Unit Tests', () => {
    let logSpy;

    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const infoFn = loggerChroma.info;
        if (infoFn) {
            Object.getPrototypeOf(infoFn).constructor.currentDepth = 0;
        }
    });

    afterEach(() => logSpy.mockRestore());

    describe('Basic Logging', () => {
        test('Should log a simple info message with the correct label', () => {
            loggerChroma.info('Hello World');
            const output = stripAnsi(logSpy.mock.calls[0][0]);

            expect(output).toContain('[INFO ]');
            expect(output).toContain('Hello World');
        });

        test('Should include custom emojis and maintain alignment', () => {
            loggerChroma.info('Message A', '🚀');
            loggerChroma.info('Message B', '🔥');

            const outA = stripAnsi(logSpy.mock.calls[0][0]);
            const outB = stripAnsi(logSpy.mock.calls[1][0]);

            expect(outA.indexOf('[INFO ]')).toBe(outB.indexOf('[INFO ]'));
        });
    });

    describe('Grouping & Hierarchy', () => {
        test('Should render group brackets and nested pipes correctly', () => {
            loggerChroma.group('My Group', () => {
                loggerChroma.info('Inside Log');
            });

            const header = stripAnsi(logSpy.mock.calls[0][0]);
            const body = stripAnsi(logSpy.mock.calls[1][0]);
            const footer = stripAnsi(logSpy.mock.calls[2][0]);

            expect(header).toContain('┌─ My Group');
            expect(body).toContain('│');
            expect(body).toContain('Inside Log');
            expect(footer).toContain('└─ End My Group');

            expect(header.indexOf('┌')).toBe(body.indexOf('│'));
        });

        test('Should support deep nesting with multiple pipes', () => {
            loggerChroma.group('L1', () => {
                loggerChroma.group('L2', () => {
                    loggerChroma.info('Deep');
                });
            });

            const deepLog = stripAnsi(logSpy.mock.calls[2][0]);
            const pipeCount = (deepLog.match(/│/g) || []).length;

            expect(pipeCount).toBe(2);
            expect(deepLog).toContain('Deep');
        });
    });

    describe('Data Formatting', () => {
        test('Should pretty print objects using util.inspect', () => {
            const data = { id: 123, status: 'ok' };
            loggerChroma.info('Data:', null, data);

            const output = stripAnsi(logSpy.mock.calls[0][0]);
            expect(output).toContain('id: 123');
            expect(output).toContain("status: 'ok'");
        });

        test('Should handle multi-line strings by adding pipes to every line', () => {
            loggerChroma.group('MultiLine', () => {
                loggerChroma.info('Line 1\nLine 2');
            });

            const output = stripAnsi(logSpy.mock.calls[1][0]);
            const lines = output.split('\n');

            expect(lines[0]).toContain('│');
            expect(lines[0]).toContain('Line 1');
            expect(lines[1]).toContain('│');
            expect(lines[1]).toContain('Line 2');
        });
    });

    describe('Edge Cases', () => {
        test('Should not throw if groupCallback is not a function', () => {
            expect(() => loggerChroma.group('Empty Group', null)).not.toThrow();
            expect(logSpy).toHaveBeenCalledTimes(2);
        });

        test('Should respect timestampEnabled being disabled', () => {
            const original = loggerChroma.config.timestampEnabled;
            loggerChroma.config.timestampEnabled = false;

            loggerChroma.info('No timestamp');
            const output = stripAnsi(logSpy.mock.calls[0][0]);

            expect(output).not.toMatch(/^\[\d{4}-\d{2}-\d{2}/);
            loggerChroma.config.timestampEnabled = original;
        });
    });

    describe('Emoji & Argument Detection', () => {
        test('Should detect emoji as the first argument', () => {
            loggerChroma.info('🚀', 'Server started');
            const output = stripAnsi(logSpy.mock.calls[0][0]);

            expect(output).toContain('🚀 [INFO ] Server started');
        });

        test('Should detect emoji as the second argument', () => {
            loggerChroma.info('Connected to DB', '✅');
            const output = stripAnsi(logSpy.mock.calls[0][0]);

            expect(output).toContain('✅ [INFO ] Connected to DB');
        });

        test('Should NOT treat a number as an emoji when passed as second argument', () => {
            loggerChroma.info('Port number:', 3000);
            const output = stripAnsi(logSpy.mock.calls[0][0]);

            expect(output).toContain('[INFO ] Port number: 3000');
            expect(output).toMatch(/\]\s{4}\[INFO \]/);
        });

        test('Should handle multiple arguments correctly with an emoji', () => {
            loggerChroma.info('User', '👤', { id: 1 }, 'logged in');
            const output = stripAnsi(logSpy.mock.calls[0][0]);

            expect(output).toContain('👤 [INFO ] User { id: 1 } logged in');
        });
    });
});
