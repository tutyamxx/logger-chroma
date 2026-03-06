import { ChalkInstance } from 'chalk';

/**
 * Configuration for a single log level.
 */
export interface LevelConfig {
    /**
     * Function to colorize the log text. Usually a Chalk instance.
     */
    color?: ((text: string) => string) | ChalkInstance;

    /**
     * Label displayed in square brackets in the log prefix.
     */
    label: string;
}

/**
 * Configuration options for LoggerChroma.
 */
export interface LoggerConfig {
    /**
     * Show timestamps in the log output.
     * @default true
     */
    timestampEnabled?: boolean;

    /**
     * Custom color and label configuration per log level.
     * Key is the log level name (`info`, `warn`, `error`, `debug`).
     */
    levelColors?: Record<string, LevelConfig>;
}

/**
 * Type definition for a single logging function.
 *
 * Accepts any number of arguments of any type: strings, numbers, objects, arrays, or emojis.
 */
export type LogFunction = (...args: any[]) => void;

/**
 * The LoggerChroma interface.
 */
export interface LoggerChroma {
    /**
     * Logs an info-level message.
     */
    info: LogFunction;

    /**
     * Logs a warning-level message.
     */
    warn: LogFunction;

    /**
     * Logs an error-level message.
     */
    error: LogFunction;

    /**
     * Logs a debug-level message.
     */
    debug: LogFunction;

    /**
     * Creates a grouped log section.
     * Inner log lines are automatically prefixed with `│ ` and indented.
     */
    group: (title: string, callback?: () => void) => void;

    /**
     * Current logger configuration.
     */
    config: LoggerConfig;
}

declare const loggerChroma: LoggerChroma;
export default loggerChroma;
