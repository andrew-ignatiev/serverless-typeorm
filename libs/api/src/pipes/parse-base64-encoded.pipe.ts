import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isBase64 } from 'class-validator';
import { format } from 'util';

@Injectable()
export class ParseBase64EncodedPipe implements PipeTransform<string> {
  static ERROR_BAD_REQUEST = '%s must be base64 encoded';

  /**
   * Method that accesses and performs optional transformation on argument for
   * inflight requests.
   *
   * @param value currently processed route argument
   * @param metadata contains metadata about the currently processed route argument
   */
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isBase64(value)) {
      throw new BadRequestException(
        format(ParseBase64EncodedPipe.ERROR_BAD_REQUEST, metadata.data),
      );
    }

    return Buffer.from(value, 'base64').toString();
  }
}
