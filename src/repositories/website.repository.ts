import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Website, WebsiteRelations} from '../models';

export class WebsiteRepository extends DefaultCrudRepository<
  Website,
  typeof Website.prototype.id,
  WebsiteRelations
> {
  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource,
  ) {
    super(Website, dataSource);
  }
}
