import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getUserThreadCasts = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Farcaster/Rest/queries.ts', () => ({
	getUserThreadCasts,
}))

const { default: farcasterResolvers } = await import('$/resolvers/Farcaster-Rest.ts')

const castResolver = farcasterResolvers.resolvers[3]
const castResolve = castResolver.resolve

if (!('UsernameHashPrefix' in castResolve))
	throw new Error('Farcaster spec missing UsernameHashPrefix cast resolver')

describe('Farcaster public cast direct replies', () => {
	it('keeps valid direct reply siblings when another row is malformed', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [
					{
						hash: '0xabcdef',
						author: { fid: 42 },
						text: 'Focal cast',
						timestamp: 1_752_840_000,
					},
					{
						hash: '0x1111',
						parentHash: 'ABCDEF',
						parentAuthor: { fid: 42 },
						author: {
							fid: 7,
							username: 'bob',
						},
						text: 'Direct reply',
						timestamp: 1_752_840_001,
						channel: { id: 'design' },
					},
					{
						hash: '0x2222',
						parentHash: '0xabcdef',
						parentAuthor: { fid: 42 },
					},
					{
						hash: '0x3333',
						parentHash: '0x1111',
						parentAuthor: { fid: 7 },
						author: { fid: 8 },
					},
					{
						hash: '0x4444',
						parentHash: '0xabcdef',
						parentAuthor: { fid: 99 },
						author: { fid: 9 },
					},
					{
						hash: '0x5555',
						parentHash: '0xABCDEF',
						parentAuthor: { fid: 42 },
						author: { fid: 10 },
						timestamp: 1_752_840_002,
					},
				],
			},
		})

		const cast = await castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})

		expect(cast.$$directReplies.map((reply) => reply[EntityMetaKey.Selector])).toEqual([
			{
				fid: 7,
				hash: '0x1111',
			},
			{
				fid: 10,
				hash: '0x5555',
			},
		])
		expect(cast.$$directReplies[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
				[EntityMetaKey.Selector]: { fid: 7 },
			},
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
				[EntityMetaKey.Selector]: {
					fid: 42,
					hash: '0xabcdef',
				},
			},
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$channel')]: {
				[EntityMetaKey.Selector]: { id: 'design' },
			},
		})
	})

	it('rejects a hash-prefix result for another username subject', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [{
					hash: '0xabcdef',
					author: {
						fid: 42,
						username: 'mallory',
					},
					timestamp: 1_752_840_000,
				}],
			},
		})

		await expect(castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})).rejects.toThrow('cast author username mismatch')
	})
})
