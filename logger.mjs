import fs from 'fs';
import { Console } from 'console';
import Date from 'datwo';

class Logger extends Console {
  constructor(options = {}) {
    options.stdout = process.stdout;
    options.stderr = process.stderr;
    options.colorMode = true;
    super(options);
    this.console = new Console(options);

    this.dir = options.dir;
    this.ANSIColor = options.ANSIColor || '';
    this.source = options.source;
    this.channel = options.channel;
  }

  log(...args) {
    this.info(...args);
  }

  info(...args) {
    this.message({ level: 'info' }, ...args);
  }

  warn(...args) {
    this.message({ level: 'warn' }, ...args);
  }

  error(...args) {
    this.message({ level: 'error' }, ...args);
  }

  debug(...args) {
    this.message({ level: 'debug' }, ...args);
  }

  slog(...args) {
    this.sinfo(...args);
  }

  sinfo(...args) {
    this.message({ level: 'info', silent: true }, ...args);
  }

  swarn(...args) {
    this.message({ level: 'warn', silent: true }, ...args);
  }

  serror(...args) {
    this.message({ level: 'error', silent: true }, ...args);
  }

  sdebug(...args) {
    this.message({ level: 'debug', silent: true }, ...args);
  }

  message(options, ...args) {
    let consolePrefix = '';
    let filePrefix = '';

    const timestamp = new Date().format('YYYY-MM-DD hh:mm:ss.CCC');
    const level = options.level ? (options.level + '').toUpperCase() : 'INFO';

    consolePrefix += '\x1b[90m[\x1b[0m';
    consolePrefix += this.source
      ? this.ANSIColor + this.source.toUpperCase() + '\x1b[0m '
      : '';
    consolePrefix += '\x1b[0m' + '\x1b[36m' + timestamp + '\x1b[0m';
    consolePrefix += '\x1b[90m]\x1b[0m';

    filePrefix += this.source ? '[' + this.source.toUpperCase() + ']' : '';

    switch (level) {
      case 'INFO': {
        filePrefix += '[INFO]';
        break;
      }
      case 'WARN': {
        consolePrefix += ' \u001B[43m\u001B[30m[WARN]\u001B[0m\u001B[93m';
        filePrefix += '[WARN]';
        break;
      }
      case 'ERROR': {
        consolePrefix += ' \u001B[41m\u001B[30m[ERROR]\u001B[0m\u001B[91m';
        filePrefix += '[EROR]';
        break;
      }
      case 'DEBUG': {
        consolePrefix += ' \u001B[45m\u001B[30m[DEBUG]\u001B[0m\u001B[95m';
        filePrefix += '[DBUG]';
        break;
      }
      default: {
        consolePrefix += ' [' + level + ']\u001B[0m';
        filePrefix += '[' + level + ']';
        break;
      }
    }

    filePrefix += '[' + timestamp + ']:';

    const consoleArgs = [...args];
    const fileArgs = [...args];

    consoleArgs.unshift(consolePrefix);
    fileArgs.unshift(filePrefix);

    consoleArgs.push('\u001B[0m');

    if (!options.silent) {
      this.consoleMessage(options, ...consoleArgs);
    }
    this.fileMessage(options, ...fileArgs);
  }

  consoleMessage(options, ...args) {
    let f = this.console.log;
    switch (options.level) {
      case 'info': {
        f = this.console.info;
        break;
      }
      case 'warn': {
        f = this.console.warn;
        break;
      }
      case 'error': {
        f = this.console.error;
        break;
      }
      case 'debug': {
        f = this.console.debug;
        break;
      }
    }
    f(...args);
  }

  fileMessage(options, ...args) {
    if (!this.dir) {
      return;
    }

    const level = options.level ? (options.level + '').toUpperCase() : 'INFO';

    let dir = this.dir + '/' + new Date().format('YYYYMM');
    !fs.existsSync(dir) ? fs.mkdirSync(dir, { recursive: true }) : null;
    let filename = ''; // wanyne-req-20220430.log
    filename += this.source ? this.source + '-' : '';
    filename += this.channel ? this.channel + '-' : '';
    filename += new Date().format('YYYYMMDD');
    if (level == 'ERROR') {
      filename += '-error';
    } else if (level == 'DEBUG') {
      filename += '-debug';
    }
    filename += '.log';
    const file = dir + '/' + filename;

    let m = '';
    for (const arg of args) {
      try {
        if (arg?.stack) {
          m += arg.stack + ' ';
        } else {
          m += arg + ' ';
        }
      } catch (error) {}
    }
    m += '\r\n';

    fs.appendFileSync(file, m);
  }
}

let defaultLogger = new Logger();

export default class {
  constructor(options) {
    return new Logger(options);
  }

  static log(...args) {
    defaultLogger.log(...args);
  }

  static info(...args) {
    defaultLogger.info(...args);
  }

  static warn(...args) {
    defaultLogger.warn(...args);
  }

  static error(...args) {
    defaultLogger.error(...args);
  }

  static debug(...args) {
    defaultLogger.debug(...args);
  }

  static set(logger) {
    defaultLogger = logger;
  }

  static get() {
    return defaultLogger;
  }
}

export {
  Logger,
  defaultLogger,
  defaultLogger as console,
  defaultLogger as logger,
};
