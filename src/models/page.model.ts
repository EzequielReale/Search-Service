import {Entity, model, property} from '@loopback/repository';

@model()
export class Page extends Entity {
  @property({
    type: 'object',
    required: true,
  })
  doc: object;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  websiteId?: string;

  constructor(data?: Partial<Page>) {
    super(data);
  }
}

export interface PageRelations {
  // describe navigational properties here
}

export type PageWithRelations = Page & PageRelations;
