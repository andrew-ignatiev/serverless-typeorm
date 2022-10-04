import * as serverless from 'serverless-http';
import {
  Context,
  Callback,
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { createApp } from './app.factory';

let cachedHttpHandler: Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

async function bootstrap(): Promise<Handler> {
  if (!cachedHttpHandler) {
    const nestApp = await createApp();
    const httpApp = nestApp.getHttpAdapter().getInstance();
    await nestApp.init();

    cachedHttpHandler = serverless(httpApp);
  }

  return cachedHttpHandler;
}

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) {
  return (await bootstrap())(event, context, callback);
}
