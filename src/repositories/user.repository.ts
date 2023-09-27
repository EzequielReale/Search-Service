import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {User, UserRelations, Website} from '../models';
import {WebsiteRepository} from './website.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly websites: HasManyRepositoryFactory<Website, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource, @repository.getter('WebsiteRepository') protected websiteRepositoryGetter: Getter<WebsiteRepository>,
  ) {
    super(User, dataSource);
    this.websites = this.createHasManyRepositoryFactoryFor('websites', websiteRepositoryGetter,);
    this.registerInclusionResolver('websites', this.websites.inclusionResolver);
  }
}
