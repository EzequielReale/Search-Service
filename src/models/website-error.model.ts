import {Entity, model, property} from '@loopback/repository';

@model()
export class WebsiteError extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  log: string;

  @property({
    type: 'string',
  })
  websiteId?: string;

  constructor(data?: Partial<WebsiteError>) {
    super(data);
  }
}

export interface WebsiteErrorRelations {
  // describe navigational properties here
}

export type WebsiteErrorWithRelations = WebsiteError & WebsiteErrorRelations;
