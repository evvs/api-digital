import { Logger, LoggerConfiguration } from './definition.js';
import PinoLogger from './pino.logger.js';

class LoggerWrapper implements Logger {
  #underlyingLogger: Logger | null = null;

  #getInitializeLogger(): Logger {
    this.configureLogger({ prettyPrint: true }, false);
    return this.#underlyingLogger!;
  }

  configureLogger(configuration: Partial<LoggerConfiguration>, overrideIfExists = true): void {
    if (this.#underlyingLogger === null || overrideIfExists === true) {
      this.#underlyingLogger = new PinoLogger(configuration.level || 'info', configuration.prettyPrint || false);
    }
  }

  resetLogger() {
    this.#underlyingLogger = null;
  }

  debug(message: string): void {
    this.#getInitializeLogger().debug(message);
  }

  error(message: string): void {
    this.#getInitializeLogger().error(message);
  }

  info(message: string): void {
    this.#getInitializeLogger().info(message);
  }

  warning(message: string): void {
    this.#getInitializeLogger().warning(message);
  }
}

export const logger = new LoggerWrapper();
