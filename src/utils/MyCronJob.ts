import { CronJob, cronJob } from '@loopback/cron';
import { repository } from '@loopback/repository';
import { Website } from '../models';
import { WebsiteRepository } from '../repositories';
import { processWebsite } from './cheerioHelper';

@cronJob()
export class MyCronJob extends CronJob {
  private websiteJobs: { [websiteId: string]: CronJob } = {};

  constructor(@repository(WebsiteRepository) public websiteRepository: WebsiteRepository) {
    super({
      name: 'job-B',
      onTick: async () => {
        let websites: Website[] = await websiteRepository.find();
        console.log(new Date());

        websites.forEach(website => {
          const cronTime = `*/${website.frequency} * * * * *`;

          // Si hay otra instancia le pego un tiro
          if (this.websiteJobs[website.id]) this.websiteJobs[website.id].stop();

          const websiteJob = new CronJob({ // Un cronjob por website
            cronTime: cronTime,
            onTick: async () => {
              const visitedUrls = new Set<string>(); // Conjunto para almacenar URLs visitadas
              try {
                await processWebsite(website, visitedUrls);
                visitedUrls.clear();
              }
              catch (error) {
                console.error(error);
              }
            },
            start: true,
          });

          // Almacenar la instancia actual en la lista así la mato despues
          this.websiteJobs[website.id] = websiteJob;
        });
      },
      cronTime: '*/10 * * * * *',
      start: true,
    });
  }
}

