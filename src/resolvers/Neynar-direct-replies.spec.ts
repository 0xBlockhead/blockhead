import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
const getCastConversation = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Neynar/Rest/queries.ts', () => ({
	getCastConversation,
}))

const { default: neynarResolvers } = await import('$/resolvers/Neynar-Rest.ts')

const castDirectRepliesResolver = neynarResolvers.resolvers.find((resolver) => (
	'$$directReplies' in resolver.projections
))

if (castDirectRepliesResolver == null)
	throw new Error('Neynar spec missing FarcasterCast.$$directReplies resolver')

const directRepliesResolve = castDirectRepliesResolver.resolve

if (!('FidHash' in directRepliesResolve))
	throw new Error('Neynar spec missing FidHash direct replies resolver')

if (!('ClientUrl' in directRepliesResolve))
	throw new Error('Neynar spec missing ClientUrl direct replies resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Neynar Farcaster direct replies', () => {
	const conversation = {
		conversation: {
			cast: {
				hash: '0xabcdef',
				author: { fid: 42 },
				replies: { count: 1 },
				direct_replies: [
					{
						hash: '0x1111',
						author: {
							fid: 7,
							username: 'bob',
							display_name: 'Bob',
						},
						parent_hash: '0xabcdef',
						parent_author: { fid: 42 },
						text: 'Direct reply',
						timestamp: '2026-07-18T12:00:00.000Z',
						reactions: {
							likes: [],
							likes_count: 0,
							recasts: [],
							recasts_count: 0,
						},
						replies: { count: 1 },
						channel: {
							id: 'design',
							name: 'Design',
						},
						direct_replies: [{
							hash: '0x2222',
							author: { fid: 8 },
						}],
					},
					{
						hash: '0xnot-hex',
						author: { fid: 9 },
						parent_hash: '0xabcdef',
						parent_author: { fid: 42 },
					},
					{
						hash: '0x4444',
						author: { fid: 11 },
						parent_hash: '0xdeadbeef',
						parent_author: { fid: 99 },
					},
				],
			},
		},
	}

	it('projects valid direct siblings without nested descendants for hash identity', async () => {
		getCastConversation.mockResolvedValueOnce(conversation)

		await expect(directRepliesResolve.FidHash.resolve({
			fid: 42,
			hash: '0xABCDEF',
		}, resolverContext)).resolves.toEqual({
			$$directReplies: [{
				[EntityMetaKey.Selector]: {
					fid: 7,
					hash: '0x1111',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: 'Direct reply',
					[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
						[EntityMetaKey.Selector]: {
							fid: 42,
							hash: '0xabcdef',
						},
					},
					[entityFieldAddressKey(EntityType.FarcasterCast, [], '$channel')]: {
						[EntityMetaKey.Selector]: { id: 'design' },
					},
					[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
						[EntityMetaKey.Selector]: { fid: 7 },
					},
				}),
			}],
			directReplyCount: 1,
		})
		if (typeof castDirectRepliesResolver.projections.$$directReplies === 'function')
			throw new Error('Neynar spec missing direct replies resolveCount')
		expect(castDirectRepliesResolver.projections.$$directReplies.resolveCount({
			$$directReplies: [],
			directReplyCount: 1,
		})).toBe(1)
		expect(getCastConversation).toHaveBeenLastCalledWith({}, {
			identifier: '0xabcdef',
			type: 'hash',
		})
	})

	it('uses URL identity without changing the relationship semantics', async () => {
		getCastConversation.mockResolvedValueOnce(conversation)

		await directRepliesResolve.ClientUrl.resolve({
			clientUrl: 'https://warpcast.com/alice/0xabcdef',
		}, resolverContext)

		expect(getCastConversation).toHaveBeenLastCalledWith({}, {
			identifier: 'https://warpcast.com/alice/0xabcdef',
			type: 'url',
		})
	})

	it('fails closed when the focal conversation row is missing', async () => {
		getCastConversation.mockResolvedValueOnce(undefined)

		await expect(directRepliesResolve.FidHash.resolve({
			fid: 42,
			hash: '0xabcdef',
		}, resolverContext)).rejects.toThrow('conversation subject not found')
	})

	it('rejects conversation rows for a different fid/hash subject', async () => {
		getCastConversation.mockResolvedValueOnce({
			conversation: {
				cast: {
					...conversation.conversation.cast,
					author: { fid: 41 },
				},
			},
		})

		await expect(directRepliesResolve.FidHash.resolve({
			fid: 42,
			hash: '0xabcdef',
		}, resolverContext)).rejects.toThrow('conversation subject mismatch')
	})
})
