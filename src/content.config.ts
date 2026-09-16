import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * A bullet is either a plain string or, once the work has merged, a string
 * with the pull request and the month it landed. Both are permanent facts,
 * so a bullet never needs revisiting after it is written. Work still in
 * flight is described without a number and without a status.
 */
const bullet = z
  .union([
    z.string(),
    z.object({
      text: z.string(),
      pr: z.number().int().positive().optional(),
      month: z.string().optional(),
    }),
  ])
  .transform((value) => (typeof value === 'string' ? { text: value } : value));

const roles = defineCollection({
  loader: file('src/data/roles.yaml'),
  schema: z.object({
    order: z.number(),
    org: z.string(),
    url: z.string().url().optional(),
    role: z.string(),
    /** A year range, never a live state. */
    dates: z.string(),
    current: z.boolean().default(false),
    note: z.string().optional(),
    summary: z.string().optional(),
    bullets: z.array(bullet).default([]),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.yaml'),
  schema: z.object({
    order: z.number(),
    section: z.enum(['kubernetes', 'elsewhere']),
    /** Rail title for a workstream; the repository name for a card. */
    title: z.string(),
    /** Rail metadata. Falls back to the repository when left out. */
    meta: z.string().optional(),
    repo: z.string().optional(),
    current: z.boolean().default(false),
    heading: z.string().optional(),
    summary: z.string().optional(),
    blurb: z.string().optional(),
    url: z.string().url().optional(),
    bullets: z.array(bullet).default([]),
  }),
});

const writing = defineCollection({
  loader: file('src/data/writing.yaml'),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    url: z.string().url(),
    publication: z.string(),
    dek: z.string(),
    /** The one article that gets the full-width treatment. */
    latest: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { roles, projects, writing };
