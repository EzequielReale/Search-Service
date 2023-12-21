import * as cheerio from 'cheerio';
import { Page, Website } from "../models";
import { PageRepository } from '../repositories';
import { MongoAtlasDataSource } from '../datasources';

const fetch = require('node-fetch');
const validUrl = require('valid-url');
const pageRepository = new PageRepository(new MongoAtlasDataSource());

async function getWebsiteInfo(website: Website) {
    if (!website.url) throw new Error('No se definió una url');
    if (!website.snippet) throw new Error('No se definió un extractor');
    if (!validUrl.isUri(website.url)) throw new Error('La URL tiene un formato no válido.');

    return fetch(website.url)
        .then((response: { ok: any; status: any; text: () => any; }) => {
            return response;
        })
        .catch((error: { message: any; }) => {
            console.error('Error obteniendo la información del website:', error.message);
            return null;
        });
}

function createWebsite(website: Website, link: string) {
    return new Website({
        id: website.id,
        name: website.name,
        url: link,
        pageLevels: website.pageLevels,
        snippet: website.snippet,
        frequency: website.frequency,
        userId: website.userId,
    });
}

async function createPage(doc: object, website: Website) {
    const page = new Page({
        doc: doc,
        websiteId: website.id,
    });
    await pageRepository.create(page);
}

export async function processWebsite(website: Website, visitedUrls: Set<string>, depth: number = 1) {
    try {
        if (visitedUrls.has(website.url)) return; // Para no procesar URLs ya visitadas

        visitedUrls.add(website.url);

        const response = await getWebsiteInfo(website);
        if (response) {
            const body = await response.text();
            const data = cheerio.load(body);
            const fn = eval(website.snippet);
            const result = fn(data);

            let doc = {};
            doc = { ...doc, ...result };
            doc = { ...doc, url: website.url };
            
            await createPage(doc, website);

            if (depth < website.pageLevels) {
                const links = data('a');
                links.each(async (index, element) => {
                    const link = data(element).attr('href');
                    if (link && link.startsWith('http')) {
                        const linkedWebsite = createWebsite(website, link);
                        await processWebsite(linkedWebsite, visitedUrls, depth + 1);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error procesando el website:', error.message);
    }
}