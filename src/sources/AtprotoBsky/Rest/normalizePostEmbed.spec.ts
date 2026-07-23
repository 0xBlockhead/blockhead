import { describe, expect, it } from 'vitest'

import { normalizeBskyPostEmbed } from '$/sources/AtprotoBsky/Rest/normalizePostEmbed.ts'
import type { BskyAppViewPostEmbed } from '$/sources/AtprotoBsky/Rest/types.ts'

const image = {
	$type: 'app.bsky.embed.images#view',
	images: [
		{
			thumb: 'https://cdn.bsky.app/thumb.jpg',
			fullsize: 'https://cdn.bsky.app/full.jpg',
			alt: 'A blue sky',
			aspectRatio: { width: 16, height: 9 },
		},
	],
} as const satisfies BskyAppViewPostEmbed

const video = {
	$type: 'app.bsky.embed.video#view',
	cid: 'bafyreivideo',
	playlist: 'https://video.bsky.app/watch.m3u8',
	thumbnail: 'https://video.bsky.app/thumb.jpg',
	alt: 'A short clip',
	aspectRatio: { width: 9, height: 16 },
	presentation: 'gif',
} as const satisfies BskyAppViewPostEmbed

const external = {
	$type: 'app.bsky.embed.external#view',
	external: {
		uri: 'https://example.com/story',
		title: 'Story',
		description: 'Context',
		thumb: 'https://example.com/thumb.jpg',
		createdAt: '2026-07-21T12:00:00.000Z',
		updatedAt: '2026-07-22T12:00:00.000Z',
		readingTime: 4,
		labels: [{
			src: 'did:plc:labeler',
			uri: 'https://example.com/story',
			val: 'news',
			cts: '2026-07-22T12:00:00.000Z',
		}],
		source: {
			uri: 'at://did:plc:publication/site.standard.publication/main',
			icon: 'https://example.com/icon.png',
			title: 'Example',
			description: 'Independent publication',
			theme: {
				backgroundRGB: {
					r: 1,
					g: 2,
					b: 3,
				},
			},
		},
		associatedRefs: [
			{
				uri: 'at://did:plc:author/site.standard.document/story',
				cid: 'bafyreidocument',
			},
		],
		associatedProfiles: [
			{
				did: 'did:plc:author',
				handle: 'author.example.com',
				displayName: 'Author',
				pronouns: 'they/them',
				avatar: 'https://example.com/avatar.jpg',
				createdAt: '2025-01-01T00:00:00.000Z',
			},
		],
	},
} as const satisfies BskyAppViewPostEmbed

const recordByStatus = {
	found: {
		$type: 'app.bsky.embed.record#viewRecord',
		uri: 'at://did:plc:quoted/app.bsky.feed.post/3quote',
		cid: 'bafyreiquote',
		author: {
			did: 'did:plc:quoted',
			handle: 'quoted.example.com',
		},
		value: {
			$type: 'app.bsky.feed.post',
			text: 'Quoted post',
			createdAt: '2026-07-22T00:00:00.000Z',
		},
		indexedAt: '2026-07-22T00:00:01.000Z',
		replyCount: 1,
		repostCount: 2,
		likeCount: 3,
		quoteCount: 4,
		embeds: [image, video, external],
	},
	notFound: {
		$type: 'app.bsky.embed.record#viewNotFound',
		uri: 'at://did:plc:missing/app.bsky.feed.post/3missing',
		notFound: true,
	},
	blocked: {
		$type: 'app.bsky.embed.record#viewBlocked',
		uri: 'at://did:plc:blocked/app.bsky.feed.post/3blocked',
		blocked: true,
		author: { did: 'did:plc:blocked' },
	},
	detached: {
		$type: 'app.bsky.embed.record#viewDetached',
		uri: 'at://did:plc:detached/app.bsky.feed.post/3detached',
		detached: true,
	},
} as const

describe('normalizeBskyPostEmbed', () => {
	it('preserves image, video, and contextual external metadata', () => {
		expect([image, video, external].map(normalizeBskyPostEmbed)).toEqual([
			image,
			video,
			external,
		])
	})

	it.each(Object.entries(recordByStatus))('preserves the %s record status', (_status, record) => {
		expect(normalizeBskyPostEmbed({
			$type: 'app.bsky.embed.record#view',
			record,
		} satisfies BskyAppViewPostEmbed)).toEqual({
			$type: 'app.bsky.embed.record#view',
			record,
		})
	})

	it('preserves record-with-media structure and nested embed order', () => {
		expect(normalizeBskyPostEmbed({
			$type: 'app.bsky.embed.recordWithMedia#view',
			record: {
				$type: 'app.bsky.embed.record#view',
				record: recordByStatus.found,
			},
			media: video,
		})).toMatchObject({
			$type: 'app.bsky.embed.recordWithMedia#view',
			record: {
				record: {
					embeds: [image, video, external],
				},
			},
			media: video,
		})
	})

	it('preserves nested post record embeds while omitting unsupported gallery siblings', () => {
		const gallery: BskyAppViewPostEmbed = JSON.parse('{"$type":"app.bsky.embed.gallery#view","items":[]}')
		const nestedRecord = {
			$type: 'app.bsky.embed.record#view',
			record: {
				...recordByStatus.found,
				uri: 'at://did:plc:nested/app.bsky.feed.post/3nested',
				cid: 'bafyreinested',
				embeds: [gallery, image, external],
			},
		} as const satisfies BskyAppViewPostEmbed

		expect(normalizeBskyPostEmbed({
			$type: 'app.bsky.embed.recordWithMedia#view',
			record: {
				$type: 'app.bsky.embed.record#view',
				record: {
					...recordByStatus.found,
					embeds: [video, nestedRecord, image],
				},
			},
			media: external,
		})).toMatchObject({
			record: {
				record: {
					embeds: [
						video,
						{
							record: {
								embeds: [image, external],
							},
						},
						image,
					],
				},
			},
			media: external,
		})
	})

	it('omits generic records instead of promoting them as posts', () => {
		expect(normalizeBskyPostEmbed(JSON.parse(JSON.stringify({
			$type: 'app.bsky.embed.record#view',
			record: {
				...recordByStatus.found,
				uri: 'at://did:plc:quoted/app.bsky.graph.list/3list',
				value: {
					$type: 'app.bsky.graph.list',
					name: 'Not a post',
				},
			},
		})))).toBeUndefined()
		expect(normalizeBskyPostEmbed(JSON.parse(JSON.stringify({
			$type: 'app.bsky.embed.record#view',
			record: {
				...recordByStatus.notFound,
				uri: 'at://did:plc:missing/app.bsky.feed.generator/3missing',
			},
		})))).toBeUndefined()
	})

	it.each([
		null,
		{ $type: 'app.bsky.embed.images#view' },
		{
			$type: 'app.bsky.embed.video#view',
			cid: 'bafyreivideo',
		},
		{
			$type: 'app.bsky.embed.external#view',
			external: {
				uri: 'https://example.com',
				title: 42,
				description: '',
			},
		},
		{
			$type: 'app.bsky.embed.record#view',
		},
		{
			$type: 'app.bsky.embed.recordWithMedia#view',
			record: null,
			media: image,
		},
	])('fails closed for malformed supported wire %#', (malformed) => {
		expect(normalizeBskyPostEmbed(
			JSON.parse(JSON.stringify(malformed))
		)).toBeUndefined()
	})

	it('omits unknown future top-level and nested variants without blank rows', () => {
		const futureEmbed: BskyAppViewPostEmbed = JSON.parse('{"$type":"app.bsky.embed.future#view"}')
		const recordWithFutureEmbed: BskyAppViewPostEmbed = JSON.parse(JSON.stringify({
			$type: 'app.bsky.embed.record#view',
			record: {
				...recordByStatus.found,
				embeds: [image, futureEmbed, external],
			},
		}))

		expect(normalizeBskyPostEmbed(futureEmbed)).toBeUndefined()
		expect(normalizeBskyPostEmbed(recordWithFutureEmbed)).toMatchObject({
			record: {
				embeds: [image, external],
			},
		})
	})
})
