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
import { FarcasterCastSelector } from '$/schema/FarcasterCast.ts'

const getCastAndDirectRepliesByUsernameAndHashPrefix = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Farcaster/Rest/queries.ts', () => ({
	getCastAndDirectRepliesByUsernameAndHashPrefix,
}))

const { default: farcasterResolvers } = await import('$/resolvers/Farcaster-Rest.ts')

const castResolver = farcasterResolvers.resolvers[3]
const castResolve = castResolver.resolve

if (!(FarcasterCastSelector.UsernameHashPrefix in castResolve))
	throw new Error('Farcaster spec missing UsernameHashPrefix cast resolver')

describe('Farcaster public cast direct replies', () => {
	it('keeps valid direct reply siblings when another row is malformed', async () => {
		getCastAndDirectRepliesByUsernameAndHashPrefix.mockResolvedValueOnce({
			cast: {
				hash: '0xabcdef',
				author: { fid: 42 },
				text: 'Focal cast',
				timestamp: 1_752_840_000,
			},
			directReplies: [
				{
					hash: '0x1111',
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
				},
			],
		})

		const cast = await castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})

		expect(cast.$$directReplies).toHaveLength(1)
		expect(cast.$$directReplies[0]?.[EntityMetaKey.Selector]).toEqual({
			fid: 7,
			hash: '0x1111',
		})
		expect(cast.$$directReplies[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
				[EntityMetaKey.Selector]: { fid: 7 },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FarcasterUser, [], 'username')]: 'bob',
				},
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
		getCastAndDirectRepliesByUsernameAndHashPrefix.mockResolvedValueOnce({
			cast: {
				hash: '0xabcdef',
				author: {
					fid: 42,
					username: 'mallory',
				},
				timestamp: 1_752_840_000,
			},
			directReplies: [],
		})

		await expect(castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})).rejects.toThrow('cast author username mismatch')
	})
})
