#! /usr/bin/env node

import META from '../src/_data/meta.json' with { type: 'json' };
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

function generateRobotsTxt() {
  // Create a non-crawlable robots.txt in non-production environments
  const crawlText = process.env.VERCEL_ENV === 'production' ? crawlableRobotsTxt : uncrawlableRobotsTxt;

  const robotsTxt = `
# www.robotstxt.org 

${crawlText}

Sitemap: ${META.url}/sitemap.xml
  `;

  // Generate robots.txt file
  fs.writeFileSync('public/robots.txt', robotsTxt);

  console.log(`Generated a ${process.env.VERCEL_ENV === 'production' ? 'crawlable' : 'non-crawlable'} public/robots.txt`);
}

export default generateRobotsTxt;
// module.exports = generateRobotsTxt;
