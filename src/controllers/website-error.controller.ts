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
import {WebsiteError} from '../models';
import {WebsiteErrorRepository} from '../repositories';

export class WebsiteErrorController {
  constructor(
    @repository(WebsiteErrorRepository)
    public websiteErrorRepository : WebsiteErrorRepository,
  ) {}

  @post('/website-errors')
  @response(200, {
    description: 'WebsiteError model instance',
    content: {'application/json': {schema: getModelSchemaRef(WebsiteError)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WebsiteError, {
            title: 'NewWebsiteError',
            exclude: ['id'],
          }),
        },
      },
    })
    websiteError: Omit<WebsiteError, 'id'>,
  ): Promise<WebsiteError> {
    return this.websiteErrorRepository.create(websiteError);
  }

  @get('/website-errors/count')
  @response(200, {
    description: 'WebsiteError model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WebsiteError) where?: Where<WebsiteError>,
  ): Promise<Count> {
    return this.websiteErrorRepository.count(where);
  }

  @get('/website-errors')
  @response(200, {
    description: 'Array of WebsiteError model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WebsiteError, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WebsiteError) filter?: Filter<WebsiteError>,
  ): Promise<WebsiteError[]> {
    return this.websiteErrorRepository.find(filter);
  }

  @patch('/website-errors')
  @response(200, {
    description: 'WebsiteError PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WebsiteError, {partial: true}),
        },
      },
    })
    websiteError: WebsiteError,
    @param.where(WebsiteError) where?: Where<WebsiteError>,
  ): Promise<Count> {
    return this.websiteErrorRepository.updateAll(websiteError, where);
  }

  @get('/website-errors/{id}')
  @response(200, {
    description: 'WebsiteError model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WebsiteError, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(WebsiteError, {exclude: 'where'}) filter?: FilterExcludingWhere<WebsiteError>
  ): Promise<WebsiteError> {
    return this.websiteErrorRepository.findById(id, filter);
  }

  @patch('/website-errors/{id}')
  @response(204, {
    description: 'WebsiteError PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WebsiteError, {partial: true}),
        },
      },
    })
    websiteError: WebsiteError,
  ): Promise<void> {
    await this.websiteErrorRepository.updateById(id, websiteError);
  }

  @put('/website-errors/{id}')
  @response(204, {
    description: 'WebsiteError PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() websiteError: WebsiteError,
  ): Promise<void> {
    await this.websiteErrorRepository.replaceById(id, websiteError);
  }

  @del('/website-errors/{id}')
  @response(204, {
    description: 'WebsiteError DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.websiteErrorRepository.deleteById(id);
  }
}
