import {Entity, model, property} from '@loopback/repository';

@model()
export class Website extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'number',
    required: true,
  })
  pageLevels: number;

  @property({
    type: 'string',
    required: true,
  })
  snippet: string;

  @property({
    type: 'number',
  })
  frequency: number;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Website>) {
    super(data);
  }
}

export interface WebsiteRelations {
  // describe navigational properties here
}

export type WebsiteWithRelations = Website & WebsiteRelations;
