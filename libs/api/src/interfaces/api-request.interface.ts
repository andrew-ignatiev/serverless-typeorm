import { Request } from 'express';
import { Context, APIGatewayProxyEventV2 } from 'aws-lambda';

export interface ApiRequest extends Request {
  apiGateway: {
    event: APIGatewayProxyEventV2;
    context: Context;
  };
}
