import {
	beforeEach,
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
import { Source } from '$/sources/Source.ts'

const getCastsByParent = vi.hoisted(() => vi.fn())
const getCastById = vi.hoisted(() => vi.fn())
const getCastsByFid = vi.hoisted(() => vi.fn())
const getUserDataByFid = vi.hoisted(() => vi.fn())
const getUsernameProofsByFid = vi.hoisted(() => vi.fn())
const getVerificationsByFid = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Snapchain/Rest/queries.ts', () => ({
	getCastById,
	getCastsByFid,
	getCastsByParent,
	getUserDataByFid,
	getUsernameProofsByFid,
	getVerificationsByFid,
}))

const { default: snapchainResolvers } = await import('$/resolvers/Snapchain-Rest.ts')
const directRepliesResolver = snapchainResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterCast
	&& '$$directReplies' in resolver.projections
))
const castResolver = snapchainResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterCast
	&& 'text' in resolver.projections
))
const userResolver = snapchainResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& 'username' in resolver.projections
))
const userCastsResolver = snapchainResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& '$$casts' in resolver.projections
))

if (directRepliesResolver == null)
	throw new Error('Snapchain spec missing FarcasterCast.$$directReplies resolver')
if (castResolver == null)
	throw new Error('Snapchain spec missing FarcasterCast detail resolver')
if (userResolver == null || userCastsResolver == null)
	throw new Error('Snapchain spec missing FarcasterUser resolvers')

const directRepliesResolve = directRepliesResolver.resolve['FidHash'].resolve
const parentHash = '0x1111111111111111111111111111111111111111'
const reply = ({
	fid = 7,
	hash = '0x2222222222222222222222222222222222222222',
	parentFid = 42,
	parentCastHash = parentHash,
}: {
	fid?: number
	hash?: `0x${string}`
	parentFid?: number
	parentCastHash?: `0x${string}`
} = {}) => ({
	hash,
	data: {
		fid,
		timestamp: 1_752_840_001,
		castAddBody: {
			text: `Reply ${fid}`,
			parentCastId: {
				fid: parentFid,
				hash: parentCastHash,
			},
		},
	},
})
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Snapchain Farcaster direct replies', () => {
	beforeEach(() => {
		getCastsByParent.mockReset()
	})

	it('pages to the requested bound and embeds card-ready reply summaries', async () => {
		getCastsByParent
			.mockResolvedValueOnce({
				messages: [reply()],
				nextPageToken: 'opaque+/=',
			})
			.mockResolvedValueOnce({
				messages: [reply({
					fid: 8,
					hash: '0x3333333333333333333333333333333333333333',
				})],
			})

		const directReplies = await directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, context)

		expect(directReplies).toHaveLength(2)
		expect(directReplies[0]).toEqual({
			[EntityMetaKey.Selector]: {
				fid: 7,
				hash: '0x2222222222222222222222222222222222222222',
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]: 7,
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]: '0x2222222222222222222222222222222222222222',
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: 'Reply 7',
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'timestamp')]: 1_752_840_001_000,
			}),
		})
		expect(getCastsByParent).toHaveBeenNthCalledWith(
			1,
			{
				fid: 42,
				hash: parentHash,
				pageSize: 2,
				pageToken: undefined,
			}
		)
		expect(getCastsByParent).toHaveBeenNthCalledWith(
			2,
			{
				fid: 42,
				hash: parentHash,
				pageSize: 1,
				pageToken: 'opaque+/=',
			}
		)
		expect(snapchainResolvers.source).toBe(Source.Snapchain_Rest)
	})

	it('resolves an empty terminal page as an authoritative empty relationship', async () => {
		getCastsByParent.mockResolvedValueOnce({
			messages: [],
			nextPageToken: '',
		})

		await expect(directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, context)).resolves.toEqual([])
		expect(getCastsByParent).toHaveBeenCalledTimes(1)
	})

	it.each([
		['missing author identity', {
			...reply(),
			data: {
				...reply().data,
				fid: undefined,
			},
		}],
		['malformed cast hash', reply({ hash: '0x22' })],
		['wrong parent identity', reply({ parentFid: 41 })],
		['wrong parent hash', reply({
			parentCastHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		})],
	] as const)('rejects %s', async (_label, malformedReply) => {
		getCastsByParent.mockResolvedValueOnce({
			messages: [malformedReply],
		})

		await expect(directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, context)).rejects.toThrow('malformed or mismatched direct reply')
	})
})

describe('Snapchain Farcaster cast identity', () => {
	it('rejects a provider row for a different fid/hash subject', async () => {
		getCastById.mockResolvedValueOnce({
			hash: parentHash,
			data: {
				fid: 41,
				timestamp: 1_752_840_001,
				castAddBody: {
					text: 'Wrong subject',
				},
			},
		})

		await expect(castResolver.resolve['FidHash'].resolve({
			fid: 42,
			hash: parentHash,
		})).rejects.toThrow('cast subject mismatch')
	})
})

describe('Snapchain Farcaster account ownership', () => {
	it('excludes foreign account facts and cast rows', async () => {
		getUserDataByFid.mockResolvedValueOnce({
			messages: [
				{
					data: {
						fid: 42,
						userDataBody: {
							type: 'USER_DATA_TYPE_DISPLAY',
							value: 'Alice',
						},
					},
				},
				{
					data: {
						fid: 99,
						userDataBody: {
							type: 'USER_DATA_TYPE_BIO',
							value: 'Foreign bio',
						},
					},
				},
			],
		})
		getUsernameProofsByFid.mockResolvedValueOnce({
			proofs: [
				{
					fid: 99,
					name: 'mallory',
				},
				{
					fid: 42,
					name: 'alice',
				},
			],
		})
		getVerificationsByFid.mockResolvedValueOnce({
			messages: [],
		})
		await expect(userResolver.resolve['Fid'].resolve({
			fid: 42,
		})).resolves.toMatchObject({
			username: 'alice',
			displayName: 'Alice',
		})
		expect(getUserDataByFid).toHaveBeenCalledWith({ fid: 42 })
		expect(getUsernameProofsByFid).toHaveBeenCalledWith({ fid: 42 })
		expect(getVerificationsByFid).toHaveBeenCalledWith({ fid: 42 })

		getCastsByFid.mockResolvedValueOnce({
			messages: [
				reply({
					fid: 42,
					hash: parentHash,
				}),
				reply({
					fid: 99,
					hash: '0x3333333333333333333333333333333333333333',
				}),
			],
		})
		await expect(userCastsResolver.resolve['Fid'].resolve(
			{ fid: 42 },
			context
		)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				fid: 42,
				hash: parentHash,
			},
		}])
	})
})
