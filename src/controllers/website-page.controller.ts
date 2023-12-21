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
  Page,
} from '../models';
import {WebsiteRepository} from '../repositories';

export class WebsitePageController {
  constructor(
    @repository(WebsiteRepository) protected websiteRepository: WebsiteRepository,
  ) { }

  @get('/websites/{id}/pages', {
    responses: {
      '200': {
        description: 'Array of Website has many Page',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Page)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Page>,
  ): Promise<Page[]> {
    return this.websiteRepository.pages(id).find(filter);
  }

  @post('/websites/{id}/pages', {
    responses: {
      '200': {
        description: 'Website model instance',
        content: {'application/json': {schema: getModelSchemaRef(Page)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Website.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Page, {
            title: 'NewPageInWebsite',
            exclude: ['id'],
            optional: ['websiteId']
          }),
        },
      },
    }) page: Omit<Page, 'id'>,
  ): Promise<Page> {
    return this.websiteRepository.pages(id).create(page);
  }

  @patch('/websites/{id}/pages', {
    responses: {
      '200': {
        description: 'Website.Page PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Page, {partial: true}),
        },
      },
    })
    page: Partial<Page>,
    @param.query.object('where', getWhereSchemaFor(Page)) where?: Where<Page>,
  ): Promise<Count> {
    return this.websiteRepository.pages(id).patch(page, where);
  }

  @del('/websites/{id}/pages', {
    responses: {
      '200': {
        description: 'Website.Page DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Page)) where?: Where<Page>,
  ): Promise<Count> {
    return this.websiteRepository.pages(id).delete(where);
  }
}
