import { CronJob, cronJob } from '@loopback/cron';
import { repository } from '@loopback/repository';
import { Website } from '../models';
import { WebsiteRepository } from '../repositories';
import { createError, processWebsite } from './cheerioHelper';

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

          if (this.websiteJobs[website.id]) this.websiteJobs[website.id].stop(); // Si hay otra instancia la detengo

          const websiteJob = new CronJob({ // Un cronjob por website
            cronTime: cronTime,
            onTick: async () => {
              const visitedUrls = new Set<string>(); // Conjunto para almacenar URLs visitadas
              try {
                await websiteRepository.pages(website.id).delete(); // Borro las páginas y errores anteriores
                await websiteRepository.websiteErrors(website.id).delete();

                await processWebsite(website, visitedUrls); // Proceso el website
                console.log(`Fin del procesamiento del website ${website.name} (${website.url})`);

                visitedUrls.clear();
              }
              catch (error) {
                await createError(website, error);
              }
            },
            start: true,
          });

          this.websiteJobs[website.id] = websiteJob; // Almaceno la instancia actual en la lista así la detengo despues
        });
      },
      cronTime: '*/10 * * * * *',
      start: true,
    });
  }
}

