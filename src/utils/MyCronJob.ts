import { CronJob, cronJob } from '@loopback/cron';
import { repository } from '@loopback/repository';
import { Website } from '../models';
import { WebsiteRepository } from '../repositories';
import { createError, processWebsite } from './cheerioHelper';

@cronJob()
export class MyCronJob extends CronJob {
  private websiteJobs: { [websiteId: string]: CronJob } = {};
  private websitesIds: string[];

  constructor(@repository(WebsiteRepository) public websiteRepository: WebsiteRepository) {
    super({
      name: 'job-B',
      onTick: async () => {
        let websites: Website[] = await websiteRepository.find();
                
        // Elimino las instancias antiguas
        let i = 0;
        Object.values(this.websiteJobs).forEach(job => {
          job.stop();
          if (websites[i]) delete this.websiteJobs[websites[i].id];
          else {
            websiteRepository.websiteErrors(this.websitesIds[i]).delete();
            websiteRepository.pages(this.websitesIds[i]).delete();
            delete this.websiteJobs[this.websitesIds[i]];
          }
          i++;
        });

        this.websitesIds = websites.map(website => website.id);

        websites.forEach(website => {
          const cronTime = `*/${website.frequency} * * * * *`;

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

