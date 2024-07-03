import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { createLogger, format } = winston;
import path from "path";

interface LoggerOptions {
  maxSize?: string;
  maxFiles?: string;
  debugLogPath?: string;
  debugLogName?: string;
  infoLogPath?: string;
  infoLogName?: string;
  warnLogPath?: string;
  warnLogName?: string;
  errorLogPath?: string;
  errorLogName?: string;
  skipRequestMiddlewareHandler?: boolean;
  singleLogPath?: string;
  singleLogName?: string;
  datePattern?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
}


function checkLevel(level: string, levelToCheck: string = 'info'): boolean {
  console.log('level: ' + level)
  console.log('levelToCheck: ' + levelToCheck)
  if (!['debug', 'info', 'warn', 'error'].includes(level)) {
    return true;
  }

  if (level === 'debug' && !['info', 'warn', 'error'].includes(levelToCheck) ) {
    return true;
  }

  if (level === 'info' && !['warn', 'error'].includes(levelToCheck) ) {
    return true;
  }

  if (level === 'warn' && !['error'].includes(levelToCheck) ) {
    return true;
  }

  return false;
}
export const getLogger = (options: LoggerOptions) => {
  const customFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
  );
  const maxSize = options.maxSize;
  const maxFiles = options.maxFiles;
  const datePattern = options.datePattern ?? 'YYYY-MM-DD';
  const fullDebugPath = path.join(options.debugLogPath ?? '', options.debugLogName ?? '');
  const fullInfoPath = path.join(options.infoLogPath ?? '', options.infoLogName ?? '');
  const fullWarnPath = path.join(options.warnLogPath ?? '', options.warnLogName ?? '');
  const fullErrorPath = path.join(options.errorLogPath ?? '', options.errorLogName ?? '');
  const fullSingleFilePath = path.join(options.singleLogPath ?? '', options.singleLogName ?? '');

  const defaultOptions = {
    format: customFormat,
    datePattern: datePattern,
    zippedArchive: true,
    maxSize,
    maxFiles,
  };

  const transports = [];

  if (options.singleLogPath && options.singleLogName) {
    transports.push(new winston.transports.File({
      filename: fullSingleFilePath,
      level: options.level,
      maxFiles: 1,
    }));
  } else {
    console.log('optionsLevel: ' + options.level)
    if (options.debugLogPath && options.debugLogName && checkLevel('debug', options.level)) {
      transports.push(new DailyRotateFile({
        filename: fullDebugPath,
        level: "debug",
        ...defaultOptions,
      }))
    }
    if (options.infoLogPath && options.infoLogName && checkLevel('info', options.level)) {
      transports.push(new DailyRotateFile({
        filename: fullInfoPath,
        level: "info",
        ...defaultOptions,
      }))
    }
    if (options.warnLogPath && options.warnLogName && checkLevel('warn', options.level)) {
      transports.push(new DailyRotateFile({
        filename: fullWarnPath,
        level: "warn",
        ...defaultOptions,
      }))
    }
    if (options.errorLogPath && options.errorLogName) {
      transports.push(new DailyRotateFile({
        filename: fullErrorPath,
        level: "error",
        ...defaultOptions,
      }))
    }
  }

  const globalLogger: winston.Logger = createLogger({
    format: customFormat,
    transports: transports,
  });

  return globalLogger;
};
