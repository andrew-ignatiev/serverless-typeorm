import { Options } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export const ApiOptionsRequest = (path?: string) => {
  return (target: any, method?: string | symbol): any => {
    if (method) {
      const field = `${method.toString()}Options`;
      target[field] = () => {
        return;
      };

      const decorator = !path ? Options() : Options(path);
      const descriptor = Object.getOwnPropertyDescriptor(target, field);
      const operationId = `${target.constructor.name}_${field}`;

      decorator(target, field, descriptor);
      ApiOkResponse({
        description: 'No Content',
      })(target, field, descriptor);
      ApiOperation({ operationId })(target, field, descriptor);
    }
  };
};
