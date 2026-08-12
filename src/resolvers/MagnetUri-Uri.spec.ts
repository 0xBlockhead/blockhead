import {
	describe,
	expect,
	it,
} from 'vitest'

import magnetUri from '$/resolvers/MagnetUri-Uri.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
}

describe('Magnet URI resolver', () => {
	it('materializes URI metadata and its native torrent identity', async () => {
		const resolver = magnetUri.resolvers[0]
		const snapshot = await resolver.resolve.MagnetUri.resolve({
			magnetUri: 'magnet:?xt=urn%3Abtih%3A0123456789ABCDEF0123456789ABCDEF01234567&dn=Release&xl=42&tr=https%3A%2F%2Ftracker.example%2Fannounce&ws=https%3A%2F%2Fseed.example%2Ffile&as=https%3A%2F%2Fsource.example%2Ffile',
		}, resolverContext)

		expect(resolver.projections.displayName(snapshot)).toBe('Release')
		expect(resolver.projections.exactLength(snapshot)).toBe(42n)
		expect(resolver.projections.trackers(snapshot)).toEqual([
			'https://tracker.example/announce',
		])
		expect(resolver.projections.webSeeds(snapshot)).toEqual([
			'https://seed.example/file',
		])
		expect(resolver.projections.acceptableSources(snapshot)).toEqual([
			'https://source.example/file',
		])
		expect(resolver.projections.$torrent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				infoHash: '0123456789abcdef0123456789abcdef01234567',
				hashVersion: 'v1',
			},
		})
	})

	it('keeps unsupported exact topics visible without inventing torrent identity', async () => {
		const resolver = magnetUri.resolvers[0]
		const snapshot = await resolver.resolve.MagnetUri.resolve({
			magnetUri: 'magnet:?xt=urn%3Asha1%3AYNCKHTQCWBTRNJIV4WNAE52SJUQCZO5C',
		}, resolverContext)

		expect(resolver.projections.infoHash(snapshot)).toBeUndefined()
		expect(resolver.projections.$torrent(snapshot)).toBeUndefined()
	})

	it('retains passive, credential-free parser authority', () => {
		expect(magnetUri.source).toBe(Source.MagnetUri_Uri)
		expect(magnetUri.resolvers).toHaveLength(1)
	})
})
