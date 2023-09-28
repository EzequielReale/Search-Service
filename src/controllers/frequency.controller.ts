import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Frequency} from '../models';
import {FrequencyRepository} from '../repositories';

export class FrequencyController {
  constructor(
    @repository(FrequencyRepository)
    public frequencyRepository : FrequencyRepository,
  ) {}

  @post('/frequencies')
  @response(200, {
    description: 'Frequency model instance',
    content: {'application/json': {schema: getModelSchemaRef(Frequency)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Frequency, {
            title: 'NewFrequency',
            exclude: ['id'],
          }),
        },
      },
    })
    frequency: Omit<Frequency, 'id'>,
  ): Promise<Frequency> {
    return this.frequencyRepository.create(frequency);
  }

  @get('/frequencies/count')
  @response(200, {
    description: 'Frequency model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Frequency) where?: Where<Frequency>,
  ): Promise<Count> {
    return this.frequencyRepository.count(where);
  }

  @get('/frequencies')
  @response(200, {
    description: 'Array of Frequency model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Frequency, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Frequency) filter?: Filter<Frequency>,
  ): Promise<Frequency[]> {
    return this.frequencyRepository.find(filter);
  }

  @patch('/frequencies')
  @response(200, {
    description: 'Frequency PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Frequency, {partial: true}),
        },
      },
    })
    frequency: Frequency,
    @param.where(Frequency) where?: Where<Frequency>,
  ): Promise<Count> {
    return this.frequencyRepository.updateAll(frequency, where);
  }

  @get('/frequencies/{id}')
  @response(200, {
    description: 'Frequency model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Frequency, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Frequency, {exclude: 'where'}) filter?: FilterExcludingWhere<Frequency>
  ): Promise<Frequency> {
    return this.frequencyRepository.findById(id, filter);
  }

  @patch('/frequencies/{id}')
  @response(204, {
    description: 'Frequency PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Frequency, {partial: true}),
        },
      },
    })
    frequency: Frequency,
  ): Promise<void> {
    await this.frequencyRepository.updateById(id, frequency);
  }

  @put('/frequencies/{id}')
  @response(204, {
    description: 'Frequency PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() frequency: Frequency,
  ): Promise<void> {
    await this.frequencyRepository.replaceById(id, frequency);
  }

  @del('/frequencies/{id}')
  @response(204, {
    description: 'Frequency DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.frequencyRepository.deleteById(id);
  }
}
