import {Entity, model, property, hasMany} from '@loopback/repository';
import {Website} from './website.model';

@model()
export class Frequency extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasMany(() => Website)
  websites: Website[];

  constructor(data?: Partial<Frequency>) {
    super(data);
  }
}

export interface FrequencyRelations {
  // describe navigational properties here
}

export type FrequencyWithRelations = Frequency & FrequencyRelations;
