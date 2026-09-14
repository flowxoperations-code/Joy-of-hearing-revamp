import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const branches = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/branches" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    city: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    phone: z.string(),
    whatsapp: z.string().optional(),
    hours: z.string().default('Mon-Sat (10 AM to 7PM)'),
    geo: z.object({ lat: z.number(), lng: z.number() }),
    googleMapsEmbedUrl: z.string().url(),
    order: z.number().default(99),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    icon: z.string(),
    summary: z.string().max(160),
    heroImage: image().optional(),
    heroAlt: z.string().optional(),
    heroImagePosition: z.string().optional(),
    whoFor: z.array(z.string()).min(1),
    whatToExpect: z.array(z.string()).min(1),
    faqIds: z.array(z.string()).default([]),
    order: z.number().default(99),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    firstName: z.string(),
    city: z.string().optional(),
    branchSlug: z.string().optional(),
    serviceSlug: z.string().optional(),
    quote: z.string().min(20).max(400),
    rating: z.number().min(1).max(5).default(5),
    consent: z.literal(true),
    photoCredit: z.string().optional(),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/faqs" }),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  }),
});

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blogs" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    date: z.date(),
    author: z.string().default("Joy of Hearing Team"),
    category: z.string(),
    heroImage: image().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { branches, services, testimonials, faqs, blogs };
