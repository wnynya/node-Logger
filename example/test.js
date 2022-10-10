const Logger = require('../').default;

Logger.log('normal info', 1, 0.1, true, false, { test: 'is', number: 2.7 }, [
  1,
  2,
  'a',
  'b',
]);
Logger.info('normal info');
Logger.warn('some warning');
Logger.error('error message');
Logger.debug('debug message');

const logger = new Logger({
  source: 'source',
  channel: 'channel',
});

Logger.set(logger);

const console = require('../').default;

console.log('normal info');
console.info('normal info');
console.warn('some warning');
console.error('error message');
console.debug('debug message');
