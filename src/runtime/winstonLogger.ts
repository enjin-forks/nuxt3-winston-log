import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { createLogger, format } = winston;
import path from "path";

interface LoggerOptions {
  maxSize: string | number;
  maxFiles: string | number;
  infoLogPath: string | null;
  infoLogName: string | null;
  warnLogPath: string | null;
  warnLogName: string | null;
  debugLogPath: string | null;
  debugLogName: string | null;
  errorLogPath: string | null;
  errorLogName: string | null;
  skipRequestMiddlewareHandler: boolean;
  singleLogPath: string | null;
  singleLogName: string | null;
  datePattern: string | null;
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
  const fullInfoPath = path.join(options.infoLogPath ?? '', options.infoLogName ?? 'info');
  const fullWarnPath = path.join(options.warnLogPath ?? '', options.warnLogName ?? 'warn');
  const fullDebugPath = path.join(options.debugLogPath ?? '', options.debugLogName ?? 'debug');
  const fullErrorPath = path.join(options.errorLogPath ?? '', options.errorLogName ?? 'error');
  const fullSingleFilePath = path.join(options.singleLogPath ?? '', options.singleLogName ?? 'nuxt');

  const defaultOptions = {
    format: customFormat,
    datePattern: datePattern,
    zippedArchive: true,
    maxSize,
    maxFiles,
  };

  const transports =
    (options.singleLogPath && options.singleLogName) ? [
      new winston.transports.File({
        filename: fullSingleFilePath,
        level: "info",
        maxFiles: 1,
        zippedArchive: true,
      }),
      new winston.transports.File({
        filename: fullSingleFilePath,
        level: "warn",
        maxFiles: 1,
        zippedArchive: true,
      }),
      new winston.transports.File({
        filename: fullSingleFilePath,
        level: "debug",
        maxFiles: 1,
        zippedArchive: true,
      }),
      new winston.transports.File({
        filename: fullSingleFilePath,
        level: "error",
        maxFiles: 1,
        zippedArchive: true,
      }),
    ] : [
      new DailyRotateFile({
        filename: fullInfoPath,
        level: "info",
        ...defaultOptions,
      }),
      new DailyRotateFile({
        filename: fullWarnPath,
        level: "warn",
        ...defaultOptions,
      }),
      new DailyRotateFile({
        filename: fullDebugPath,
        level: "debug",
        ...defaultOptions,
      }),
      new DailyRotateFile({
        filename: fullErrorPath,
        level: "error",
        ...defaultOptions,
      }),
    ]
  ;

  const globalLogger: winston.Logger = createLogger({
    format: customFormat,
    transports: transports,
  });

  return globalLogger;
};
