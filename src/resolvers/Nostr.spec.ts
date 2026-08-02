import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	nostrArticleEventFieldValues,
	nostrArticleFieldValues,
	nostrEventsNewestFirst,
	nostrProfileMetadataEventFieldValues,
	nostrReactionFieldValues,
	nostrRepostFieldValues,
} from '$/resolvers/Nostr.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { NostrEventEnvelope } from '$/sources/NostrRelay/Nip01/event.ts'


const pubkey = '1'.repeat(64)
const event = (
	id: string,
	kind: number,
	tags: string[][] = [],
	content = '',
	createdAt = 1_700_000_000
) => ({
	id,
	pubkey,
	created_at: createdAt,
	kind,
	tags,
	content,
	sig: '2'.repeat(128),
}) satisfies NostrEventEnvelope

describe('Nostr protocol projections', () => {
	it('orders replaceable events by newest timestamp then lowest lexical id', () => {
		const lowerId = 'a'.repeat(64)
		const higherId = 'b'.repeat(64)
		expect(nostrEventsNewestFirst([
			event(higherId, 0),
			event(lowerId, 0),
			event('c'.repeat(64), 0, [], '', 1_700_000_001),
		])).toEqual([
			event('c'.repeat(64), 0, [], '', 1_700_000_001),
			event(lowerId, 0),
			event(higherId, 0),
		])
	})

	it('projects NIP-18 and NIP-25 address targets without an event lookup', () => {
		const coordinate = `30023:${pubkey}:article:with:colons`
		expect(nostrRepostFieldValues(event(
			'3'.repeat(64),
			16,
			[['a', coordinate]]
		)).$repostedArticle).toEqual({
			[EntityMetaKey.Selector]: {
				kind: 30_023,
				pubkey,
				identifier: 'article:with:colons',
			},
		})
		expect(nostrReactionFieldValues(event(
			'4'.repeat(64),
			7,
			[['a', coordinate]],
			'+'
		)).$targetArticle).toEqual({
			[EntityMetaKey.Selector]: {
				kind: 30_023,
				pubkey,
				identifier: 'article:with:colons',
			},
		})
	})

	it('narrows profile metadata once at the JSON boundary', () => {
		expect(nostrProfileMetadataEventFieldValues(event(
			'5'.repeat(64),
			0,
			[],
			JSON.stringify({
				display_name: 'Alice',
				about: 42,
				website: 'https://example.com/profile',
				picture: 'not a URL',
			})
		))).toEqual(expect.objectContaining({
			displayName: 'Alice',
			website: 'https://example.com/profile',
		}))
		expect(nostrProfileMetadataEventFieldValues(event(
			'5'.repeat(64),
			0,
			[],
			JSON.stringify({
				display_name: 'Alice',
				about: 42,
				website: 'https://example.com/profile',
				picture: 'not a URL',
			})
		))).not.toHaveProperty('about')
		expect(nostrProfileMetadataEventFieldValues(event(
			'5'.repeat(64),
			0,
			[],
			'[]'
		))).not.toHaveProperty('displayName')
	})

	it('keeps NIP-23 URLs and published_at on their strict wire domains', () => {
		expect(nostrArticleFieldValues(event(
			'6'.repeat(64),
			30_023,
			[
				['d', 'article'],
				['image', 'not a URL'],
				['published_at', '2026-08-02'],
			]
		))).toEqual(expect.objectContaining({
			imageUrl: undefined,
			publishedAt: 1_700_000_000_000,
		}))
		expect(nostrArticleFieldValues(event(
			'6'.repeat(64),
			30_023,
			[
				['d', 'article'],
				['image', 'https://example.com/article.png'],
				['published_at', '1700000001'],
			]
		))).toEqual(expect.objectContaining({
			imageUrl: 'https://example.com/article.png',
			publishedAt: 1_700_000_001_000,
		}))
		expect(() => nostrArticleEventFieldValues(event(
			'6'.repeat(64),
			30_023
		))).toThrow(/identifier/)
	})
})
