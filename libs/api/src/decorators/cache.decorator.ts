import { CACHE } from '@app-libs/api';
import { SetMetadata } from '@nestjs/common';

/**
 * Sets metadata about ttl in cache header per controller method
 */
export const Cache = (ttl = 86400) => SetMetadata(CACHE, ttl);
