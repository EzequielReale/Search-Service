import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Frequency, FrequencyRelations, Website} from '../models';
import {WebsiteRepository} from './website.repository';

export class FrequencyRepository extends DefaultCrudRepository<
  Frequency,
  typeof Frequency.prototype.id,
  FrequencyRelations
> {

  public readonly websites: HasManyRepositoryFactory<Website, typeof Frequency.prototype.id>;

  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource, @repository.getter('WebsiteRepository') protected websiteRepositoryGetter: Getter<WebsiteRepository>,
  ) {
    super(Frequency, dataSource);
    this.websites = this.createHasManyRepositoryFactoryFor('websites', websiteRepositoryGetter,);
    this.registerInclusionResolver('websites', this.websites.inclusionResolver);
  }
}
