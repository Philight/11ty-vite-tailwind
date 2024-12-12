import { EleventyRenderPlugin } from '@11ty/eleventy';
import type { UserConfig } from '@11ty/eleventy';
import EleventyPluginNavigation from '@11ty/eleventy-navigation';
import EleventyPluginRss from '@11ty/eleventy-plugin-rss';
import EleventyPluginSyntaxhighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import svgSprite from 'eleventy-plugin-svg-sprite';

import rollupPluginCritical from 'rollup-plugin-critical';

import { isValidElement } from 'react';
// import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { jsxToString } from 'jsx-async-runtime';

import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

import tailwindcss from 'tailwindcss';
// import plugin from 'tailwindcss/plugin.js';
import twconfig from './tailwind.config';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

import filters from './utils/filters.js';
import transforms from './utils/transforms.js';
import shortcodes from './utils/shortcodes.js';

// ==================================================================

const SVG_DIR = 'public/assets/icons';

// ==================================================================

export default function (eleventyConfig: UserConfig) {
	/***
	 * Development: Watch .CSS files
	 */

	eleventyConfig.addWatchTarget('src/assets/css/**/*.css');

	/****
	 * Development: Copy/pass-through files
	 */

	eleventyConfig.setServerPassthroughCopyBehavior('copy');
	eleventyConfig.addPassthroughCopy('public');
	eleventyConfig.addPassthroughCopy({ 'src/global.css': 'global.css' });
	eleventyConfig.addPassthroughCopy({ 'src/assets/css': 'assets/css' });
	eleventyConfig.addPassthroughCopy({ 'src/assets/js': 'assets/js' });

	/***
	 * Plugins
	 */

	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(EleventyPluginNavigation);
	eleventyConfig.addPlugin(EleventyPluginRss);
	eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight);

	// SVG Sprite
	eleventyConfig.addPlugin(svgSprite, [
		{
			path: `./${SVG_DIR}`,
			svgSpriteShortcode: 'svgsprite', // default
			svgShortcode: 'spriteIcon', // optional to have custom svgShortcode per instance. The default "svg" shortcode would work for all instances.
			globalClasses: 'svgicon',
			defaultClasses: 'default-class',
		},
		// {
		// 	path: './assets/svg_home',
		// 	svgSpriteShortcode: 'svgspriteHome',
		// 	svgShortcode: 'svgHome', // optional to have custom svgShortcode per instance. The default "svg" shortcode would work for all instances.
		// 	globalClasses: 'svgicon',
		// 	defaultClasses: 'default-class',
		// },
	]);

	/***
	 * BUILD: Vite (Vite.config.js)
	 */

	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			publicDir: 'public',
			clearScreen: false,
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			appType: 'custom',
			assetsInclude: ['**/*.xml', '**/*.txt'],
			build: {
				mode: 'production',
				sourcemap: 'true',
				manifest: true,
				// This puts CSS and JS in subfolders – remove if you want all of it to be in /assets instead
				rollupOptions: {
					output: {
						assetFileNames: 'assets/css/main.[hash].css',
						chunkFileNames: 'assets/js/[name].[hash].js',
						entryFileNames: 'assets/js/[name].[hash].js',
					},
					plugins: [
						rollupPluginCritical({
							criticalUrl: './_site/',
							criticalBase: './_site/',
							criticalPages: [
								{ uri: 'index.html', template: 'index' },
								{ uri: 'posts/index.html', template: 'posts/index' },
								{ uri: '404.html', template: '404' },
							],
							criticalConfig: {
								inline: true,
								dimensions: [
									{
										height: 900,
										width: 375,
									},
									{
										height: 720,
										width: 1280,
									},
									{
										height: 1080,
										width: 1920,
									},
								],
								penthouse: {
									forceInclude: ['.fonts-loaded-1 body', '.fonts-loaded-2 body'],
								},
							},
						}),
					],
				},
			},
		},
	});

	/****
	 * Typescript & TSX
	 */

	eleventyConfig.addExtension(['11ty.jsx', '11ty.ts', '11ty.tsx'], {
		key: '11ty.js',
	});
	// eleventyConfig.addTemplateFormats("11ty.ts,11ty.tsx")

	eleventyConfig.addTransform('tsx', async (content: any) => {
		if (isValidElement(content)) {
			// const result = await renderToString(content);
			const result = await jsxToString(content);
			return `<!doctype html>\n${result}`;
		}
		return content;
	});

	/***
	 * Tailwind & CSS
	 */

	eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
		postcss([tailwindcss(twconfig), autoprefixer()])
			.process(cssCode)
			.then(
				r => done(null, r.css),
				e => done(e, null),
			);
	});

	/***
	 * Customize Markdown library and settings:
	 */

	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
	}).use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1, 2, 3, 4],
		}),
		slugify: eleventyConfig.getFilter('slug'),
	});
	eleventyConfig.setLibrary('md', markdownLibrary);

	/***
	 * Filters
	 */

	Object.keys(filters).forEach(filterName => {
		eleventyConfig.addFilter(filterName, filters[filterName]);
	});

	/***
	 * Transforms
	 */

	Object.keys(transforms).forEach(transformName => {
		eleventyConfig.addTransform(transformName, transforms[transformName]);
	});

	/***
	 * Shortcodes
	 */

	Object.keys(shortcodes).forEach(shortcodeName => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
	});

	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

	// SVG Sprite Plugin, extend shortcode, #svg- is the prefix created by svg-sprite
	eleventyConfig.addShortcode('svgicon', function (name) {
		return `<svg><use xlink:href="#svg-${name}"></use></svg>`;
	});

	// // Custom SVG loader shortcode
	// eleventyConfig.addNunjucksAsyncShortcode('icon', async function (name, kwargs = {}) {
	// 	const { __keywords, ...attrs } = kwargs ?? {};

	// 	this.page.icons ||= new Set();
	// 	this.page.icons.add(name);
	// 	const attributes = Object.entries(attrs)
	// 		.map(([key, value]) => `${key}="${value}"`)
	// 		.join(' ');
	// 	console.log('this.page.icons', this.page.icons);
	// 	console.log('this.ctx.collections.icons', this.ctx.collections.icons);
	// 	return `<svg ${attributes}><use href="/assets/icons/#${name}"></use></svg>`;
	// });

	// // Custom SVG loader shortcode
	// eleventyConfig.addAsyncShortcode('svg', async function (filename, svgOptions = {}) {
	// 	const { isNjk = false, filePathOption, engineOption } = svgOptions;
	// 	// console.log('eleventyConfig', eleventyConfig);
	// 	// console.log('this.ctx', this.ctx);
	// 	console.log('this.page', this.page);
	// 	// console.log('this.eleventy', this.eleventy);
	// 	const filePath = filePathOption ?? `${SVG_DIR}/${filename}.svg${isNjk ? '.njk' : ''}`;
	// 	const engine = engineOption ?? (isNjk ? 'njk' : 'html'); // HTML engine for vanilla SVG if none is provided
	// 	const content = eleventyConfig.javascript.functions.renderFile(filePath, svgOptions, engine);
	// 	return content;
	// });

	/*****
	 * Layouts
	 */

	eleventyConfig.addLayoutAlias('base', 'base.njk');
	eleventyConfig.addLayoutAlias('post', 'post.njk');

	return {
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		htmlTemplateEngine: 'njk',
		passthroughFileCopy: true,
		dir: {
			// input: 'src',
			input: 'src/content',
			includes: '../_includes',
			layouts: '../layouts',
			data: '../_data',
			// better not use "public" as the name of the output folder (see above...)
			output: '_site',
		},
	};
}
