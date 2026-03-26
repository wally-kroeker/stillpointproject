import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import rehypeDataTypes from './plugins/rehype-data-types.js';

// Novel collection - StillPoint novel scenes
const novel = defineCollection({
	loader: glob({ base: './src/content/novel', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		// Required fields
		title: z.string(),
		era: z.string(),
		location: z.string(),
		pov_character: z.string(),
		voice: z.string(),
		word_count: z.number(),
		page_count: z.number(),
		status: z.enum(['draft', 'draft-revised', 'revision', 'revised', 'revised_draft_2', 'proofread', 'published', 'canonical']),

		// Optional structural fields
		chapter: z.string().optional(),
		scene: z.string().optional(),

		// Optional metadata
		characters: z.array(z.string()).optional(),
		date_written: z.coerce.date().optional(),
		date_revised: z.coerce.date().optional(),
		themes: z.array(z.string()).optional(),
		excerpt: z.string().optional(),
		reading_time: z.number().optional(),

		// Optional navigation
		previous_scene: z.string().optional(),
		next_scene: z.string().optional(),

		// Optional media
		audio_file: z.string().optional(),
		audio_exclude: z.boolean().default(false),

		// Optional relationships
		related_world: z.array(z.string()).optional(),
		content_warnings: z.array(z.string()).optional(),
	}),
});

// Stories collection - Short stories, vignettes, and story planning documents
const stories = defineCollection({
	loader: glob({ base: './src/content/stories', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		// Required fields
		title: z.string(),
		status: z.enum(['draft', 'draft-revised', 'revision', 'revised', 'revised_draft_2', 'proofread', 'published', 'canonical']).default('draft'),

		// Strongly recommended
		type: z.enum(['short_story', 'vignette', 'outline', 'scene_brief', 'planning']).default('short_story'),
		description: z.string().optional(),
		word_count: z.number().optional(),
		page_count: z.number().optional(),
		era: z.string().optional(),

		// Optional story metadata
		location: z.string().optional(),
		pov_character: z.union([z.string(), z.array(z.string())]).optional(),
		voice: z.string().optional(),
		characters: z.array(z.string()).optional(),

		// Optional dates
		date_written: z.coerce.date().optional(),
		date_published: z.coerce.date().optional(),
		date_revised: z.coerce.date().optional(),
		pubDate: z.coerce.date().optional(), // Alias for date_published (Astro convention)

		// Optional display
		featured: z.boolean().default(false),
		reading_time: z.number().optional(),
		excerpt: z.string().optional(),

		// Optional categorization
		themes: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		canonical_order: z.number().optional(), // For chronological in-universe ordering

		// Optional media
		audio_file: z.string().optional(),
		audio_exclude: z.boolean().default(false),

		// Optional relationships
		related_novel_chapters: z.array(z.string()).optional(),
		related_world: z.array(z.string()).optional(),
		content_warnings: z.array(z.string()).optional(),
	}),
});

// World collection - Character cards, locations, technology, lore
const world = defineCollection({
	loader: glob({ base: './src/content/world', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		// Required fields
		title: z.string(),
		type: z.enum(['character', 'location', 'technology', 'lore', 'timeline', 'philosophy']),
		status: z.enum(['draft', 'canon', 'archived']).default('draft'),

		// Strongly recommended
		era: z.string().optional(),
		description: z.string().optional(),

		// Optional relationships
		related_characters: z.array(z.string()).optional(),
		related_locations: z.array(z.string()).optional(),
		related_technology: z.array(z.string()).optional(),
		related_lore: z.array(z.string()).optional(),
		wiki_links: z.array(z.string()).optional(),

		// Optional timeline
		first_appearance: z.string().optional(),
		timeline_start: z.union([z.string(), z.number()]).optional(),
		timeline_end: z.union([z.string(), z.number()]).optional(),

		// Optional metadata
		aliases: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		content_warnings: z.array(z.string()).optional(),
	}),
});

export const collections = { novel, stories, world };