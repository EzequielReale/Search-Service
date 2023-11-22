import {inject} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/sleep', {
    parameters: [{
      name: 'ms', schema: {type: 'number'}, in:
        'query'
    }],
    responses: {
      '200': {
        description: 'Sleep in ms',
        content: {
          'application/json': {
            schema: {type: 'string'},
          },
        },
      },
    },
  })
  async sleep(ms: number) {
    await this.delay(ms)
    return `Waking up after ${ms} ms`;
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @get('/fib', {
    parameters: [{name: 'num', schema: {type: 'number'}, in: 'query'}],
    responses: {
      '200': {
        description: 'Compute fibonacci',
        content: {
          'application/json': {
            schema: {type: 'number'},
          },
        },
      },
    },
  })
  async fib(num: number) {return this.fibonacci(num)}
  fibonacci(num: number): number {
    if (num <= 1) return 1;
    return this.fibonacci(num - 1) + this.fibonacci(num - 2);
  }
}
