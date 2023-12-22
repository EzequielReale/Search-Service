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
  Website,
  WebsiteError,
} from '../models';
import {WebsiteRepository} from '../repositories';

export class WebsiteWebsiteErrorController {
  constructor(
    @repository(WebsiteRepository) protected websiteRepository: WebsiteRepository,
  ) { }

  @get('/websites/{id}/website-errors', {
    responses: {
      '200': {
        description: 'Array of Website has many WebsiteError',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(WebsiteError)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<WebsiteError>,
  ): Promise<WebsiteError[]> {
    return this.websiteRepository.websiteErrors(id).find(filter);
  }

  @post('/websites/{id}/website-errors', {
    responses: {
      '200': {
        description: 'Website model instance',
        content: {'application/json': {schema: getModelSchemaRef(WebsiteError)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Website.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WebsiteError, {
            title: 'NewWebsiteErrorInWebsite',
            exclude: ['id'],
            optional: ['websiteId']
          }),
        },
      },
    }) websiteError: Omit<WebsiteError, 'id'>,
  ): Promise<WebsiteError> {
    return this.websiteRepository.websiteErrors(id).create(websiteError);
  }

  @patch('/websites/{id}/website-errors', {
    responses: {
      '200': {
        description: 'Website.WebsiteError PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WebsiteError, {partial: true}),
        },
      },
    })
    websiteError: Partial<WebsiteError>,
    @param.query.object('where', getWhereSchemaFor(WebsiteError)) where?: Where<WebsiteError>,
  ): Promise<Count> {
    return this.websiteRepository.websiteErrors(id).patch(websiteError, where);
  }

  @del('/websites/{id}/website-errors', {
    responses: {
      '200': {
        description: 'Website.WebsiteError DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(WebsiteError)) where?: Where<WebsiteError>,
  ): Promise<Count> {
    return this.websiteRepository.websiteErrors(id).delete(where);
  }
}
