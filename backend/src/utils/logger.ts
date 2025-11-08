import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../../logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

class Logger {
  private logToFile(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta })
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    const logFile = path.join(LOG_DIR, `${new Date().toISOString().split('T')[0]}.log`);

    fs.appendFileSync(logFile, logLine);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${timestamp}] ${level}: ${message}`, meta || '');
    }
  }

  error(message: string, meta?: any) {
    this.logToFile(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any) {
    this.logToFile(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any) {
    this.logToFile(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any) {
    if (process.env.LOG_LEVEL === 'debug') {
      this.logToFile(LogLevel.DEBUG, message, meta);
    }
  }
}

export const logger = new Logger();
