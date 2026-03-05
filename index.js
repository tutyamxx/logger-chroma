/**
 *  logger-chroma - 🦄 A colorful, developer-friendly Node.js logger with timestamps, emojis, pretty-printed objects, and grouped logs for clear, readable output.
 *  @version: v1.0.3
 *  @link: https://github.com/tutyamxx/logger-chroma
 *  @license: MIT
 **/


import util from 'util';
import chalk from 'chalk';

const logLevels = {
    info: { color: chalk.green, label: 'INFO ' },
    warn: { color: chalk.yellow, label: 'WARN ' },
    error: { color: chalk.red, label: 'ERROR' },
    debug: { color: chalk.blue, label: 'DEBUG' },
};

const defaultLoggerConfig = {
    timestampEnabled: true,
    groupIndentSize: 2,
    levelColors: logLevels,
};

const getFormattedTimestamp = () => new Date().toISOString().replace('T', ' ').split('.')[0];
const prettyPrintObject = (obj) => util.inspect(obj, { colors: true, depth: null });

const generateLogPrefix = (level, customEmoji, config, depth) => {
    const levelConfig = config.levelColors?.[level] ?? { color: (text) => text, label: level.toUpperCase() };
    const timestampPart = config.timestampEnabled ? `[${getFormattedTimestamp()}] ` : '';

    let indent = '';
    for (let i = 0; i < depth; i++) {
        indent += '│ ';
    }

    const emojiPart = customEmoji ? `${customEmoji} ` : '   ';

    return `${timestampPart}${indent}${emojiPart}${levelConfig.color(`[${levelConfig.label}]`)}`;
};

const createLoggerFunction = (level) => (...args) => {
    const config = createLoggerFunction?.config ?? defaultLoggerConfig;
    const depth = createLoggerFunction?.currentDepth ?? 0;

    let customEmoji = null;
    let messageArgs = args;

    if (typeof args?.[1] === 'string' && args?.[1]?.length <= 2) {
        customEmoji = args?.[1];
        messageArgs = [args?.[0], ...args?.slice(2)];
    }

    else if (typeof args?.[0] === 'string' && args?.[0]?.length <= 2) {
        customEmoji = args?.[0];
        messageArgs = args?.slice(1);
    }

    const prefix = generateLogPrefix(level, customEmoji, config, depth);

    const formattedMessage = messageArgs
        ?.map(arg => typeof arg === 'object' ? prettyPrintObject(arg) : arg)
        ?.join(' ')
        ?.split('\n')
        ?.map(line => `${prefix} ${line}`)
        ?.join('\n');

    if (formattedMessage) {
        console.log(formattedMessage);
    }
};

const createLogGroup = (groupTitle, groupCallback) => {
    const config = createLoggerFunction.config ?? defaultLoggerConfig;
    const depth = createLoggerFunction.currentDepth ?? 0;
    const timestamp = config.timestampEnabled ? `[${getFormattedTimestamp()}] ` : '';

    let parentPipes = '';
    for (let i = 0; i < depth; i++) {
        parentPipes += '│ ';
    }

    console.log(`${timestamp}${parentPipes}┌─ ${groupTitle}`);

    createLoggerFunction.currentDepth = depth + 1;

    if (typeof groupCallback === 'function') {
        groupCallback();
    }
    createLoggerFunction.currentDepth = depth;

    console.log(`${timestamp}${parentPipes}└─ End ${groupTitle}`);
};

const loggerChroma = {};
Object.keys(logLevels).forEach(level => loggerChroma[level] = createLoggerFunction(level));

loggerChroma.group = createLogGroup;
loggerChroma.config = defaultLoggerConfig;

export default loggerChroma;
