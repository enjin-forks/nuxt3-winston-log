import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";

function judgeIfStatus(params: any): boolean {
  if (!params) {
    return false;
  }
  if (params === "null") {
    return false;
  }
  if (params === "undefined") {
    return false;
  }
  if (typeof params === "string") {
    if (params.replace(/(^s*)|(s*$)/g, "").length === 0) {
      return false;
    }
  }
  return true;
}

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt3WinstonLog",
    configKey: "nuxt3WinstonLog",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options: any, nuxt: any) {
    const defaultOptions = {
      maxSize: "1024m",
      maxFiles: "14d",
      debugLogPath: `./logs`,
      debugLogName: `%DATE%-${process.env.NODE_ENV}-debug.log`,
      infoLogPath: `./logs`,
      infoLogName: `%DATE%-${process.env.NODE_ENV}-info.log`,
      warnLogPath: `./logs`,
      warnLogName: `%DATE%-${process.env.NODE_ENV}-warn.log`,
      errorLogPath: `./logs`,
      errorLogName: `%DATE%-${process.env.NODE_ENV}-error.log`,
      skipRequestMiddlewareHandler: false,
      singleLogPath: null,
      singleLogName: null,
      datePattern: "YYYY-MM-DD",
      level: 'info',
    };
    const mergeOptions = {
      maxSize: judgeIfStatus(options?.maxSize)
        ? options.maxSize
        : defaultOptions.maxSize,
      maxFiles: judgeIfStatus(options?.maxFiles)
        ? options.maxFiles
        : defaultOptions.maxFiles,
      debugLogPath: judgeIfStatus(options?.debugLogPath)
        ? options.debugLogPath
        : defaultOptions.debugLogPath,
      debugLogName: judgeIfStatus(options?.debugLogName)
        ? options.debugLogName
        : defaultOptions.debugLogName,
      infoLogPath: judgeIfStatus(options?.infoLogPath)
        ? options.infoLogPath
        : defaultOptions.infoLogPath,
      infoLogName: judgeIfStatus(options?.infoLogName)
        ? options.infoLogName
        : defaultOptions.infoLogName,
      warnLogPath: judgeIfStatus(options?.warnLogPath)
        ? options.warnLogPath
        : defaultOptions.warnLogPath,
      warnLogName: judgeIfStatus(options?.warnLogName)
        ? options.warnLogName
        : defaultOptions.warnLogName,
      errorLogPath: judgeIfStatus(options?.errorLogPath)
        ? options.errorLogPath
        : defaultOptions.errorLogPath,
      errorLogName: judgeIfStatus(options?.errorLogName)
        ? options.errorLogName
        : defaultOptions.errorLogName,
      skipRequestMiddlewareHandler: judgeIfStatus(
        options?.skipRequestMiddlewareHandler
      )
        ? options.skipRequestMiddlewareHandler
        : defaultOptions.skipRequestMiddlewareHandler,
      singleLogPath: judgeIfStatus(options?.singleLogPath)
        ? options.singleLogPath
        : defaultOptions.singleLogPath,
      singleLogName: judgeIfStatus(options?.singleLogName)
        ? options.singleLogName
        : defaultOptions.singleLogName,
      datePattern: judgeIfStatus(options?.datePattern)
        ? options.datePattern
        : defaultOptions.datePattern,
      level: judgeIfStatus(options?.level)
        ? options.level
        : defaultOptions.level,
    };
    nuxt.options.runtimeConfig.public.nuxt3WinstonLog = mergeOptions;
    const resolver = createResolver(import.meta.url);
    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin.server"));
    if (mergeOptions.skipRequestMiddlewareHandler !== true) {
      nuxt.options.nitro.plugins = nuxt.options.nitro.plugins || [];
      nuxt.options.nitro.plugins.push(
        resolver.resolve("./runtime/consoleRoute.server")
      );
    }
  },
});
