import { format } from 'util';
import { Logger } from '@nestjs/common';
import { DEBUG } from '@app-libs/api/constants';

export const DEBUG_FORMAT = 'DEBUG: %j';

const logger = new Logger('DebugHelper');

/**
 * Prints debug output if given function wasn't completed within given time.
 */
export async function debug<T>(
  fn: () => Promise<T>,
  timeout: number,
  ctx: any,
) {
  const timeId = setTimeout(() => {
    logger.log(
      format(DEBUG_FORMAT, {
        stack: 'Function timed out',
        debug: {
          ctx,
          timeout,
        },
        tag: DEBUG,
      }),
    );
  }, timeout);

  try {
    return await fn();
  } catch (e) {
    throw e;
  } finally {
    clearTimeout(timeId);
  }
}

/**
 * Prints function execution time as debug output.
 */
export async function debugExecutionTime<T>(fn: () => Promise<T>, ctx: any) {
  const start = process.hrtime();

  try {
    return await fn();
  } catch (e) {
    throw e;
  } finally {
    const end = process.hrtime(start);
    const time = (end[0] * 1000000000 + end[1]) / 1000000;

    logger.log(
      format(DEBUG_FORMAT, {
        stack: `Function execution time ${time} ms`,
        debug: {
          ctx,
        },
        tag: DEBUG,
      }),
    );
  }
}
