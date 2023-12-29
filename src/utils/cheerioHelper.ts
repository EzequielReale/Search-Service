import * as cheerio from 'cheerio';
import { Page, Website, WebsiteError } from "../models";
import { PageRepository, WebsiteErrorRepository } from '../repositories';
import { MongoAtlasDataSource } from '../datasources';

const fetch = require('node-fetch');
const pageRepository = new PageRepository(new MongoAtlasDataSource());
const websiteErrorRepository = new WebsiteErrorRepository(new MongoAtlasDataSource());
var originalLink = '';

async function getWebsiteInfo(website: Website) {
    try {
        return await fetch(website.url);
    }
    catch (error) {
        await createError(website, error);
        return null;
    }
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

async function createPage(document: object, website: Website) {
    const page = new Page({
        doc: document,
        websiteId: website.id,
    });
    await pageRepository.create(page);
}

export async function createError(website: Website, error: Error) {
    const err = new WebsiteError({
        log: `Razón: ${error.message}`,
        websiteId: website.id,
    });
    await websiteErrorRepository.create(err);
}

export async function processWebsite(website: Website, visitedUrls: Set<string>, depth: number = 1) {
    try {
        if (depth === 1) originalLink = website.url;
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
                    if (link && link.startsWith(originalLink)) {
                        const linkedWebsite = createWebsite(website, link);
                        await processWebsite(linkedWebsite, visitedUrls, depth + 1);
                    }
                });
            }
        }
    } catch (error) {
        await createError(website, error);
    }
}