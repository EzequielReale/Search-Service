import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Website, WebsiteRelations, Page} from '../models';
import {PageRepository} from './page.repository';

export class WebsiteRepository extends DefaultCrudRepository<
  Website,
  typeof Website.prototype.id,
  WebsiteRelations
> {

  public readonly pages: HasManyRepositoryFactory<Page, typeof Website.prototype.id>;

  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource, @repository.getter('PageRepository') protected pageRepositoryGetter: Getter<PageRepository>,
  ) {
    super(Website, dataSource);
    this.pages = this.createHasManyRepositoryFactoryFor('pages', pageRepositoryGetter,);
    this.registerInclusionResolver('pages', this.pages.inclusionResolver);
  }
}
