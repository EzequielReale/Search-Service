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
import {Page} from '../models';
import {PageRepository} from '../repositories';

export class PageController {
  constructor(
    @repository(PageRepository)
    public pageRepository : PageRepository,
  ) {}

  @post('/pages')
  @response(200, {
    description: 'Page model instance',
    content: {'application/json': {schema: getModelSchemaRef(Page)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Page, {
            title: 'NewPage',
            exclude: ['id'],
          }),
        },
      },
    })
    page: Omit<Page, 'id'>,
  ): Promise<Page> {
    return this.pageRepository.create(page);
  }

  @get('/pages/count')
  @response(200, {
    description: 'Page model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Page) where?: Where<Page>,
  ): Promise<Count> {
    return this.pageRepository.count(where);
  }

  @get('/pages')
  @response(200, {
    description: 'Array of Page model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Page, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Page) filter?: Filter<Page>,
  ): Promise<Page[]> {
    return this.pageRepository.find(filter);
  }

  @patch('/pages')
  @response(200, {
    description: 'Page PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Page, {partial: true}),
        },
      },
    })
    page: Page,
    @param.where(Page) where?: Where<Page>,
  ): Promise<Count> {
    return this.pageRepository.updateAll(page, where);
  }

  @get('/pages/{id}')
  @response(200, {
    description: 'Page model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Page, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Page, {exclude: 'where'}) filter?: FilterExcludingWhere<Page>
  ): Promise<Page> {
    return this.pageRepository.findById(id, filter);
  }

  @patch('/pages/{id}')
  @response(204, {
    description: 'Page PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Page, {partial: true}),
        },
      },
    })
    page: Page,
  ): Promise<void> {
    await this.pageRepository.updateById(id, page);
  }

  @put('/pages/{id}')
  @response(204, {
    description: 'Page PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() page: Page,
  ): Promise<void> {
    await this.pageRepository.replaceById(id, page);
  }

  @del('/pages/{id}')
  @response(204, {
    description: 'Page DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pageRepository.deleteById(id);
  }
}
