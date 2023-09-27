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
  User,
  Website,
} from '../models';
import {UserRepository} from '../repositories';

export class UserWebsiteController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/websites', {
    responses: {
      '200': {
        description: 'Array of User has many Website',
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
    return this.userRepository.websites(id).find(filter);
  }

  @post('/users/{id}/websites', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Website)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Website, {
            title: 'NewWebsiteInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) website: Omit<Website, 'id'>,
  ): Promise<Website> {
    return this.userRepository.websites(id).create(website);
  }

  @patch('/users/{id}/websites', {
    responses: {
      '200': {
        description: 'User.Website PATCH success count',
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
    return this.userRepository.websites(id).patch(website, where);
  }

  @del('/users/{id}/websites', {
    responses: {
      '200': {
        description: 'User.Website DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Website)) where?: Where<Website>,
  ): Promise<Count> {
    return this.userRepository.websites(id).delete(where);
  }
}
