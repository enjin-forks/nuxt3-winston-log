import { defineNuxtPlugin } from "#app";
import { getLogger } from "./winstonLogger";

export default defineNuxtPlugin((nuxtApp) => {
  if (!(<any>global)._isRebuildConsole) {
    console.log(`winstonLogger rebuild console`);
    console.log(`nuxt3-winston-log v0.5`);

    const options = nuxtApp.$config.public.nuxt3WinstonLog;
    const globalLogger = getLogger(options);
    const originLog = console.log;
    const originWarn = console.warn;
    const originDebug = console.debug;
    const originError = console.error;

    console.log = function (...rest) {
      const str = rest.join(" ");
      globalLogger.info(str);
      originLog.apply(this, rest);
    };

    console.warn = function (...rest) {
      const str = rest.join(" ");
      globalLogger.warn(str);
      originWarn.apply(this, rest);
    };

    console.debug = function (...rest) {
      const str = rest.join(" ");
      globalLogger.debug(str);
      originDebug.apply(this, rest);
    };

    console.error = function (...rest) {
      const str = rest.join(" ");
      globalLogger.error(str);
      originError.apply(this, rest);
    };

    (<any>global)._isRebuildConsole = true;
  }
});
