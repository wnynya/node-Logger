import Logger from '../logger.mjs';

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

import { console } from '../logger.mjs';

console.log('normal info');
console.info('normal info');
console.warn('some warning');
console.error('error message');
console.debug('debug message');
