// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeDataTypes from './src/plugins/rehype-data-types.js';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://stillpointproject.org',

  integrations: [mdx({
			rehypePlugins: [rehypeDataTypes],
  }), sitemap({
    filter: (page) => !page.includes('/draft/'),
    serialize(item) {
      // Homepage - highest priority, updated frequently
      if (item.url === 'https://stillpointproject.org/' || item.url === 'https://stillpointproject.org') {
        item.priority = 1.0;
        item.changefreq = 'weekly';
      }
      // Listing pages (novel index, stories index) - high priority
      else if (item.url.match(/\/(novel|stories)\/?$/) ) {
        item.priority = 0.9;
        item.changefreq = 'weekly';
      }
      // Individual novel chapters
      else if (item.url.includes('/novel/')) {
        item.priority = 0.8;
        item.changefreq = 'monthly';
      }
      // Individual short stories
      else if (item.url.includes('/stories/')) {
        item.priority = 0.7;
        item.changefreq = 'monthly';
      }
      // About and lore pages - lower priority, rarely change
      else if (item.url.includes('/about') || item.url.includes('/lore')) {
        item.priority = 0.5;
        item.changefreq = 'yearly';
      }
      // Default for any other pages
      else {
        item.priority = 0.5;
        item.changefreq = 'monthly';
      }
      return item;
    },
  }), react()],

  markdown: {
      rehypePlugins: [rehypeDataTypes],
	},

  vite: {
    plugins: [tailwindcss()],
  },
});