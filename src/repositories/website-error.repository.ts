import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {WebsiteError, WebsiteErrorRelations} from '../models';

export class WebsiteErrorRepository extends DefaultCrudRepository<
  WebsiteError,
  typeof WebsiteError.prototype.id,
  WebsiteErrorRelations
> {
  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource,
  ) {
    super(WebsiteError, dataSource);
  }
}
