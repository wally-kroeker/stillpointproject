import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	// Get published novel scenes
	const novelScenes = await getCollection('novel', ({ data }) => {
		return data.status !== 'draft' && data.status !== 'revision';
	});

	// Get published stories
	const stories = await getCollection('stories', ({ data }) => {
		return data.status === 'published' || data.status === 'canonical';
	});

	// Build novel items sorted by ID (chapter order)
	const novelItems = novelScenes
		.sort((a, b) => a.id.localeCompare(b.id))
		.map((scene, index) => ({
			title: `Ch. ${index + 1}: ${scene.data.title}`,
			description: scene.data.excerpt || `Chapter ${index + 1} of The StillPoint Saga — "${scene.data.title}". Set in ${scene.data.location}, from the perspective of ${scene.data.pov_character}.`,
			link: `/novel/${scene.id}/`,
			pubDate: scene.data.date_written || scene.data.date_revised || new Date('2025-01-01'),
			categories: ['Novel', scene.data.era],
		}));

	// Build story items
	const storyItems = stories.map((story) => ({
		title: story.data.title,
		description: story.data.description || story.data.excerpt || `A short story from The StillPoint universe.`,
		link: `/stories/${story.id}/`,
		pubDate: story.data.date_published || story.data.date_written || story.data.pubDate || new Date('2025-01-01'),
		categories: ['Short Story', story.data.era || 'The StillPoint'].filter(Boolean),
	}));

	// Combine all items, sort by date descending
	const allItems = [...novelItems, ...storyItems].sort((a, b) => {
		return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
	});

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: allItems,
		customData: `<language>en-us</language>`,
	});
}
