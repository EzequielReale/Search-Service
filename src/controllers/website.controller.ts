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
import {Website} from '../models';
import {WebsiteRepository} from '../repositories';

export class WebsiteController {
  constructor(
    @repository(WebsiteRepository)
    public websiteRepository : WebsiteRepository,
  ) {}

  @post('/websites')
  @response(200, {
    description: 'Website model instance',
    content: {'application/json': {schema: getModelSchemaRef(Website)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Website, {
            title: 'NewWebsite',
            exclude: ['id'],
          }),
        },
      },
    })
    website: Omit<Website, 'id'>,
  ): Promise<Website> {
    return this.websiteRepository.create(website);
  }

  @get('/websites/count')
  @response(200, {
    description: 'Website model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Website) where?: Where<Website>,
  ): Promise<Count> {
    return this.websiteRepository.count(where);
  }

  @get('/websites')
  @response(200, {
    description: 'Array of Website model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Website, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Website) filter?: Filter<Website>,
  ): Promise<Website[]> {
    return this.websiteRepository.find(filter);
  }

  @patch('/websites')
  @response(200, {
    description: 'Website PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Website, {partial: true}),
        },
      },
    })
    website: Website,
    @param.where(Website) where?: Where<Website>,
  ): Promise<Count> {
    return this.websiteRepository.updateAll(website, where);
  }

  @get('/websites/{id}')
  @response(200, {
    description: 'Website model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Website, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Website, {exclude: 'where'}) filter?: FilterExcludingWhere<Website>
  ): Promise<Website> {
    return this.websiteRepository.findById(id, filter);
  }

  @patch('/websites/{id}')
  @response(204, {
    description: 'Website PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Website, {partial: true}),
        },
      },
    })
    website: Website,
  ): Promise<void> {
    await this.websiteRepository.updateById(id, website);
  }

  @put('/websites/{id}')
  @response(204, {
    description: 'Website PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() website: Website,
  ): Promise<void> {
    await this.websiteRepository.replaceById(id, website);
  }

  @del('/websites/{id}')
  @response(204, {
    description: 'Website DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.websiteRepository.deleteById(id);
  }
}
