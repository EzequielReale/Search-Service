import * as cheerio from 'cheerio';
import { Website } from "../models";

const fetch = require('node-fetch');

export async function getWebsiteInfo(website: Website) {
    if (!website.url) throw new Error('No se definió una url');
    if (!website.snippet) throw new Error('No se definió un extractor');

    const response = await fetch(website.url);
    const body = await response.text();
    const data = cheerio.load(body);

    const fn = eval(website.snippet);

    return fn(data);
}