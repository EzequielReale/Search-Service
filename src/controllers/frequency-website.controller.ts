import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Frequency,
  Website,
} from '../models';
import {FrequencyRepository} from '../repositories';

export class FrequencyWebsiteController {
  constructor(
    @repository(FrequencyRepository) protected frequencyRepository: FrequencyRepository,
  ) { }

  @get('/frequencies/{id}/websites', {
    responses: {
      '200': {
        description: 'Array of Frequency has many Website',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Website)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Website>,
  ): Promise<Website[]> {
    return this.frequencyRepository.websites(id).find(filter);
  }

  @post('/frequencies/{id}/websites', {
    responses: {
      '200': {
        description: 'Frequency model instance',
        content: {'application/json': {schema: getModelSchemaRef(Website)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Frequency.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Website, {
            title: 'NewWebsiteInFrequency',
            exclude: ['id'],
            optional: ['frequencyId']
          }),
        },
      },
    }) website: Omit<Website, 'id'>,
  ): Promise<Website> {
    return this.frequencyRepository.websites(id).create(website);
  }

  @patch('/frequencies/{id}/websites', {
    responses: {
      '200': {
        description: 'Frequency.Website PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Website, {partial: true}),
        },
      },
    })
    website: Partial<Website>,
    @param.query.object('where', getWhereSchemaFor(Website)) where?: Where<Website>,
  ): Promise<Count> {
    return this.frequencyRepository.websites(id).patch(website, where);
  }

  @del('/frequencies/{id}/websites', {
    responses: {
      '200': {
        description: 'Frequency.Website DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Website)) where?: Where<Website>,
  ): Promise<Count> {
    return this.frequencyRepository.websites(id).delete(where);
  }
}
