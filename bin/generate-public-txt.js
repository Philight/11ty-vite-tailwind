#! /usr/bin/env node

import META from '../src/_data/meta.json' with { type: 'json' };
import BUILD from '../src/_data/build.js';
import filters from '../utils/filters.js';
// const fs = require('fs');
import * as fs from 'fs';

// ========================================

const crawlableRobotsTxt = `
User-agent: *
Disallow: /build.txt 
`;

const uncrawlableRobotsTxt = `
User-agent: *
Disallow: /
`;

export function generateRobotsTxt() {
  // Create a non-crawlable robots.txt in non-production environments
  const crawlText = process.env.VERCEL_ENV === 'production' ? crawlableRobotsTxt : uncrawlableRobotsTxt;

  const robotsTxt = `
# www.robotstxt.org 

${crawlText}

Sitemap: ${META.url}/sitemap.xml
  `;

  // Generate robots.txt file
  fs.writeFileSync('public/robots.txt', robotsTxt);

  console.log(`-- Generated a ${process.env.VERCEL_ENV === 'production' ? 'crawlable' : 'non-crawlable'} public/robots.txt`);
}

export function generateBuildTxt() {
  const buildTxt = `
LAST BUILD: ${filters.dateToISO(BUILD.timestamp)} 
ENV: ${BUILD.env}
`;

  // Generate build.txt file
  fs.writeFileSync('public/build.txt', buildTxt);

  console.log(`-- Generated build stats: public/build.txt`);
}

// Self-invocation async function
(async () => {
  await generateRobotsTxt();
  await generateBuildTxt();
})().catch(err => {
  console.error(err);
  throw err;
});
