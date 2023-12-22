import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Website, WebsiteRelations, Page, WebsiteError} from '../models';
import {PageRepository} from './page.repository';
import {WebsiteErrorRepository} from './website-error.repository';

export class WebsiteRepository extends DefaultCrudRepository<
  Website,
  typeof Website.prototype.id,
  WebsiteRelations
> {

  public readonly pages: HasManyRepositoryFactory<Page, typeof Website.prototype.id>;

  public readonly websiteErrors: HasManyRepositoryFactory<WebsiteError, typeof Website.prototype.id>;

  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource, @repository.getter('PageRepository') protected pageRepositoryGetter: Getter<PageRepository>, @repository.getter('WebsiteErrorRepository') protected websiteErrorRepositoryGetter: Getter<WebsiteErrorRepository>,
  ) {
    super(Website, dataSource);
    this.websiteErrors = this.createHasManyRepositoryFactoryFor('websiteErrors', websiteErrorRepositoryGetter,);
    this.registerInclusionResolver('websiteErrors', this.websiteErrors.inclusionResolver);
    this.pages = this.createHasManyRepositoryFactoryFor('pages', pageRepositoryGetter,);
    this.registerInclusionResolver('pages', this.pages.inclusionResolver);
  }
}
