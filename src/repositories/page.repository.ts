import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoAtlasDataSource} from '../datasources';
import {Page, PageRelations} from '../models';

export class PageRepository extends DefaultCrudRepository<
  Page,
  typeof Page.prototype.id,
  PageRelations
> {
  constructor(
    @inject('datasources.mongoAtlas') dataSource: MongoAtlasDataSource,
  ) {
    super(Page, dataSource);
  }
}
