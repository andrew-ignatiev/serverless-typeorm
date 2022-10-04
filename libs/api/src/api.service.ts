import { Injectable } from '@nestjs/common';
import { promisify } from 'util';

export const sleep = promisify(setTimeout);

@Injectable()
export class ApiService {
  /**
   *  Retries a function 'attempts' times with 'delay' ms when Promise rejects due to various issues.
   */
  retry<T>(fn: () => Promise<T>, attempts = 3, delay = 500): Promise<T> {
    return fn().catch((error) => {
      if (attempts <= 1) {
        throw error;
      }

      return sleep(delay).then(() => this.retry(fn, attempts - 1, 2 * delay));
    });
  }

  /**
   * Delays the function execution. Helpful for throttling heavy function calls.
   */
  delay<T>(fn: () => Promise<T>, delay: number): Promise<T> {
    return sleep(delay).then(() => fn());
  }
}
