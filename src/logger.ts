import fs from 'fs';
import path from 'path';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private logDir: string;
  private logFile: string;
  private logLevel: LogLevel;

  constructor(logDir: string = './logs') {
    this.logDir = logDir;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFile = path.join(logDir, `mcp-${timestamp}.log`);
    
    // 从环境变量读取日志级别，默认为 INFO
    const levelStr = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
    this.logLevel = this.parseLogLevel(levelStr);
    
    // 确保日志目录存在
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // 记录初始日志级别
    this.write(this.formatMessage('INFO', `日志系统初始化，日志级别: ${levelStr}`));
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        console.error(`未知的日志级别: ${level}，使用默认级别 INFO`);
        return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data !== undefined) {
      if (typeof data === 'object') {
        logMessage += '\n' + JSON.stringify(data, null, 2);
      } else {
        logMessage += ' ' + data;
      }
    }
    
    return logMessage;
  }

  private write(message: string) {
    // 写入文件
    fs.appendFileSync(this.logFile, message + '\n');
    // 同时输出到 stderr（不影响 MCP 通信）
    console.error(message);
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  info(message: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.write(this.formatMessage('INFO', message, data));
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.write(this.formatMessage('ERROR', message, data));
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.write(this.formatMessage('DEBUG', message, data));
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.write(this.formatMessage('WARN', message, data));
    }
  }
}