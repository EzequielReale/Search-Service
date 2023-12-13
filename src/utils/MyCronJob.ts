import { CronJob, cronJob } from '@loopback/cron';
import { repository } from '@loopback/repository';
import { Website } from '../models';
import { WebsiteRepository } from '../repositories';
import { getWebsiteInfo } from './cheerioHelper';

@cronJob()
export class MyCronJob extends CronJob {
  constructor(@repository(WebsiteRepository) public websiteRepository: WebsiteRepository,) {
    super({
      name: 'job-B', onTick: async () => {
        let websites: Website[] = await websiteRepository.find();
        console.log(new Date());
        websites.forEach(async website => {
          console.log(website);
          const result = await getWebsiteInfo(website);
          console.log("Datos extraidos:", result);
        });
      },
      cronTime: '*/10 * * * * *',
      start: true,
    });
  }
}
