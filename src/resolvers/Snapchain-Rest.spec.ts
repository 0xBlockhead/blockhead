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
const getLinksByFid = vi.hoisted(() => vi.fn())
const countLinksByFid = vi.hoisted(() => vi.fn())
const countLinksByTargetFid = vi.hoisted(() => vi.fn())
const getUserDataByFid = vi.hoisted(() => vi.fn())
const getUsernameProofsByFid = vi.hoisted(() => vi.fn())
const getVerificationsByFid = vi.hoisted(() => vi.fn())
const getCastEngagementCountsForCast = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Snapchain/Rest/queries.ts', () => ({
	countLinksByFid,
	countLinksByTargetFid,
	getCastById,
	getCastEngagementCountsForCast,
	getCastsByFid,
	getCastsByParent,
	getLinksByFid,
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
const userTimestampsResolver = snapchainResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& '$$timestamps' in resolver.projections
))
const channelCastsResolver = snapchainResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterChannel
	&& '$$casts' in resolver.projections
))

if (directRepliesResolver == null)
	throw new Error('Snapchain spec missing FarcasterCast.$$directReplies resolver')
if (castResolver == null)
	throw new Error('Snapchain spec missing FarcasterCast detail resolver')
if (
	userResolver == null
	|| userCastsResolver == null
	|| userTimestampsResolver == null
	|| !('Fid' in userTimestampsResolver.resolve)
	|| channelCastsResolver == null
	|| !('ParentUrl' in channelCastsResolver.resolve)
)
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
				messages: [
					reply(),
					reply({
						fid: 8,
						hash: '0x3333333333333333333333333333333333333333',
					}),
				],
				nextPageToken: 'opaque+/=',
			})
			.mockResolvedValueOnce({
				messages: [reply({
					fid: 9,
					hash: '0x4444444444444444444444444444444444444444',
				})],
			})

		const snapshot = await directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, context)
		if (typeof directRepliesResolver.projections.$$directReplies === 'function')
			throw new Error('Snapchain direct replies require a paginated projection')
		const directReplies = directRepliesResolver.projections.$$directReplies.select(
			snapshot,
			{
				fid: 42,
				hash: parentHash,
			},
			context
		)

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
		expect(directRepliesResolver.projections.$$directReplies.continuation?.(
			snapshot,
			{
				fid: 42,
				hash: parentHash,
			},
			context
		)).toEqual({
			operation: 'cast-direct-replies',
			target: `42:${parentHash}`,
			terminal: false,
			token: 'opaque+/=',
		})

		await directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, {
			...context,
			providerContinuationToken: 'opaque+/=',
		})
		expect(getCastsByParent).toHaveBeenNthCalledWith(2, {
			fid: 42,
			hash: parentHash,
			pageSize: 2,
			pageToken: 'opaque+/=',
		})
		expect(snapchainResolvers.source).toBe(Source.Snapchain_Rest)
	})

	it('resolves an empty terminal page as an authoritative empty relationship', async () => {
		getCastsByParent.mockResolvedValueOnce({
			messages: [],
			nextPageToken: '',
		})

		const snapshot = await directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, context)
		if (typeof directRepliesResolver.projections.$$directReplies === 'function')
			throw new Error('Snapchain direct replies require a paginated projection')
		expect(directRepliesResolver.projections.$$directReplies.select(
			snapshot,
			{
				fid: 42,
				hash: parentHash,
			},
			context
		)).toEqual([])
		expect(getCastsByParent).toHaveBeenCalledTimes(1)
	})

	it('rejects a repeated native reply cursor', async () => {
		getCastsByParent.mockResolvedValueOnce({
			messages: [],
			nextPageToken: 'repeated-token',
		})

		await expect(directRepliesResolve({
			fid: 42,
			hash: parentHash,
		}, {
			...context,
			providerContinuationToken: 'repeated-token',
		})).rejects.toThrow('continuation did not advance')
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
	beforeEach(() => {
		getCastById.mockReset()
		getUsernameProofsByFid.mockReset()
		getUsernameProofsByFid.mockResolvedValue({ proofs: [] })
	})

	it('retains an arbitrary FIP-2 parent as the channel selector', async () => {
		const parentUrl = 'https://example.com/topics/design'
		getCastById.mockResolvedValueOnce({
			hash: parentHash,
			data: {
				fid: 42,
				timestamp: 1_752_840_001,
				castAddBody: {
					text: 'Portable channel parent',
					parentUrl,
				},
			},
		})

		await expect(castResolver.resolve.FidHash.resolve({
			fid: 42,
			hash: parentHash,
		})).resolves.toMatchObject({
			parentUrl,
			$channel: {
				[EntityMetaKey.Selector]: { parentUrl },
			},
		})
	})

	it('projects enrolled mentions onto mentionedProfileFids', async () => {
		getCastById.mockResolvedValueOnce({
			hash: parentHash,
			data: {
				type: 'MESSAGE_TYPE_CAST_ADD',
				fid: 42,
				timestamp: 1_752_840_001,
				network: 'FARCASTER_NETWORK_MAINNET',
				castAddBody: {
					text: 'hi @bob',
					mentions: [7, 9],
					mentionsPositions: [3],
				},
			},
			hashScheme: 'HASH_SCHEME_BLAKE3',
		})

		await expect(castResolver.resolve.FidHash.resolve({
			fid: 42,
			hash: parentHash,
		})).resolves.toMatchObject({
			mentions: [7, 9],
			mentionedProfileFids: [7, 9],
		})
	})

	it('projects username, hashPrefix, and Warpcast clientUrl from fname proofs', async () => {
		getCastById.mockResolvedValueOnce({
			hash: parentHash,
			data: {
				fid: 42,
				timestamp: 1_752_840_001,
				castAddBody: {
					text: 'hello',
				},
			},
		})
		getUsernameProofsByFid.mockResolvedValueOnce({
			proofs: [{
				fid: 42,
				name: 'alice',
				type: 'USERNAME_TYPE_FNAME',
			}],
		})

		await expect(castResolver.resolve.FidHash.resolve({
			fid: 42,
			hash: parentHash,
		})).resolves.toMatchObject({
			username: 'alice',
			hashPrefix: '0x1111111111',
			clientUrl: 'https://warpcast.com/alice/0x1111111111',
		})
		expect(castResolver.projections.username).toBeTypeOf('function')
		expect(castResolver.projections.hashPrefix).toBeTypeOf('function')
		expect(castResolver.projections.clientUrl).toBeTypeOf('function')
	})

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

describe('Snapchain Farcaster observations', () => {
	it('materializes zero counts with source identity without arbitrary timestamp replay', async () => {
		countLinksByTargetFid.mockResolvedValueOnce(0)
		countLinksByFid.mockResolvedValueOnce(0)

		const timestamps = await userTimestampsResolver.resolve.Fid.resolve({ fid: 42 })
		expect(timestamps).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$user: { fid: 42 },
				source: Source.Snapchain_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followerCount')]: 0,
				[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followingCount')]: 0,
			},
		}])
		expect(timestamps[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: Source.Snapchain_Rest,
		}))
		expect(userTimestampsResolver.projections.$$timestamps.resolveCount(timestamps)).toBe(1)
		expect(countLinksByTargetFid).toHaveBeenCalledWith({
			targetFid: 42,
			linkType: 'follow',
		})
		expect(countLinksByFid).toHaveBeenCalledWith({
			fid: 42,
			linkType: 'follow',
		})
		expect(snapchainResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.FarcasterUser_Timestamp
			&& 'UserTimestampMsSource' in resolver.resolve
		))).toBe(false)
		expect(snapchainResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.FarcasterCast_Timestamp
			&& 'CastTimestampMsSource' in resolver.resolve
		))).toBe(false)
	})

	it('queries casts by the selected protocol parent URL', async () => {
		getCastsByParent.mockResolvedValueOnce({ messages: [] })
		const parentUrl = 'https://farcaster.xyz/~/channel/design'

		const snapshot = await channelCastsResolver.resolve.ParentUrl.resolve(
			{ parentUrl },
			context
		)
		if (typeof channelCastsResolver.projections.$$casts === 'function')
			throw new Error('Snapchain channel casts require a paginated projection')
		expect(channelCastsResolver.projections.$$casts.select(
			snapshot,
			{ parentUrl },
			context
		)).toEqual([])
		expect(getCastsByParent).toHaveBeenCalledWith({
			url: parentUrl,
			pageSize: 2,
			pageToken: undefined,
		})
	})

	it('maps channel id feed and channel casts onto the FIP-2 parent URL', async () => {
		getCastsByParent.mockResolvedValue({ messages: [] })
		const feedResolver = snapchainResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.FarcasterFeed
			&& 'ByChannel' in resolver.resolve
		))
		const channelIdCastsResolver = snapchainResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.FarcasterChannel
			&& '$$casts' in resolver.projections
			&& 'Id' in resolver.resolve
		))
		const channelIdResolver = snapchainResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.FarcasterChannel
			&& 'id' in resolver.projections
		))
		if (feedResolver == null || channelIdCastsResolver == null || channelIdResolver == null)
			throw new Error('Snapchain spec missing channel-id feed/channel resolvers')

		await expect(feedResolver.resolve.ByChannel.resolve(
			{ variant: 'channel', channelId: 'design' },
			context
		)).resolves.toEqual([])
		const channelSnapshot = await channelIdCastsResolver.resolve.Id.resolve(
			{ id: 'design' },
			context
		)
		if (typeof channelIdCastsResolver.projections.$$casts === 'function')
			throw new Error('Snapchain channel casts require a paginated projection')
		expect(channelIdCastsResolver.projections.$$casts.select(
			channelSnapshot,
			{ id: 'design' },
			context
		)).toEqual([])
		await expect(channelIdResolver.resolve.Id.resolve({
			id: 'design',
		})).resolves.toEqual({
			id: 'design',
			parentUrl: 'https://farcaster.xyz/~/channel/design',
		})
		expect(getCastsByParent).toHaveBeenCalledWith({
			url: 'https://farcaster.xyz/~/channel/design',
			pageSize: 2,
			pageToken: undefined,
		})
	})

	it('preserves native following-feed cursors across followed-author pages', async () => {
		getLinksByFid.mockResolvedValueOnce({
			messages: [
				{ data: { linkBody: { targetFid: 7 } } },
				{ data: { linkBody: { targetFid: 8 } } },
			],
			nextPageToken: 'opaque+/=',
		})
		getCastsByFid.mockResolvedValue({ messages: [] })
		const feedResolver = snapchainResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.FarcasterFeed
			&& 'Following' in resolver.resolve
		))
		if (feedResolver == null || typeof feedResolver.projections.$$entries === 'function')
			throw new Error('Snapchain spec missing paginated following-feed resolver')

		const snapshot = await feedResolver.resolve.Following.resolve(
			{
				variant: 'following',
				viewerFid: 42,
			},
			{
				...context,
				providerContinuationToken: 'prior+/=',
			}
		)

		expect(getLinksByFid).toHaveBeenCalledWith({
			fid: 42,
			linkType: 'follow',
			pageSize: 2,
			pageToken: 'prior+/=',
			reverse: true,
		})
		expect(feedResolver.projections.$$entries.select(snapshot)).toEqual([])
		expect(feedResolver.projections.$$entries.continuation(snapshot, {
			variant: 'following',
			viewerFid: 42,
		}, context)).toEqual({
			operation: 'following-feed',
			target: '42',
			terminal: false,
			token: 'opaque+/=',
		})
	})
})

describe('Snapchain Farcaster embeds', () => {
	beforeEach(() => {
		getCastById.mockReset()
		getUsernameProofsByFid.mockReset()
		getUsernameProofsByFid.mockResolvedValue({ proofs: [] })
		getCastEngagementCountsForCast.mockReset()
		countLinksByFid.mockReset()
		countLinksByTargetFid.mockReset()
	})

	it('merges embedsDeprecated url embeds after modern embeds', async () => {
		getCastById.mockResolvedValueOnce({
			hash: parentHash,
			data: {
				fid: 42,
				timestamp: 1_752_840_001,
				castAddBody: {
					text: 'with embeds',
					embeds: [{
						url: 'https://example.com/modern',
					}],
					embedsDeprecated: [
						'https://example.com/modern',
						'https://example.com/legacy',
					],
				},
			},
		})

		const cast = await castResolver.resolve.FidHash.resolve({
			fid: 42,
			hash: parentHash,
		})
		expect(cast).toMatchObject({
			$$embeds: [
				{
					[EntityMetaKey.Selector]: {
						$cast: { fid: 42, hash: parentHash },
						indexInCast: 0,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'url')]: 'https://example.com/modern',
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$cast: { fid: 42, hash: parentHash },
						indexInCast: 1,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'url')]: 'https://example.com/legacy',
					},
				},
			],
		})
		expect(castResolver.projections.$$embeds.resolveCount(cast)).toBe(2)
		expect(castResolver.projections.$$embeds.select(cast)).toHaveLength(2)
	})

	it('projects quotedPreviewText from the embedded cast body', async () => {
		const embedResolver = snapchainResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.FarcasterCastEmbed
			&& 'quotedPreviewText' in resolver.projections
		))
		if (embedResolver == null)
			throw new Error('Snapchain spec missing FarcasterCastEmbed resolver')

		const embeddedHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		getCastById
			.mockResolvedValueOnce({
				hash: parentHash,
				data: {
					fid: 42,
					timestamp: 1_752_840_001,
					castAddBody: {
						text: 'parent',
						embeds: [{
							castId: {
								fid: 7,
								hash: embeddedHash,
							},
						}],
					},
				},
			})
			.mockResolvedValueOnce({
				hash: embeddedHash,
				data: {
					fid: 7,
					timestamp: 1_752_840_000,
					castAddBody: {
						text: 'Quoted body',
					},
				},
			})

		await expect(embedResolver.resolve.CastIndexInCast.resolve({
			$cast: {
				fid: 42,
				hash: parentHash,
			},
			indexInCast: 0,
		})).resolves.toMatchObject({
			$embeddedCast: {
				[EntityMetaKey.Selector]: {
					fid: 7,
					hash: embeddedHash,
				},
			},
			quotedPreviewText: 'Quoted body',
		})
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
					type: 'USERNAME_TYPE_FNAME',
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
		const castsSnapshot = await userCastsResolver.resolve['Fid'].resolve(
			{ fid: 42 },
			context
		)
		if (typeof userCastsResolver.projections.$$casts === 'function')
			throw new Error('Snapchain user casts require a paginated projection')
		expect(userCastsResolver.projections.$$casts.select(
			castsSnapshot,
			{ fid: 42 },
			context
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				fid: 42,
				hash: parentHash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]: 42,
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]: parentHash,
				[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
					[EntityMetaKey.Selector]: { fid: 42 },
				},
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: 'Reply 42',
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'timestamp')]: 1_752_840_001_000,
				[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
					[EntityMetaKey.Selector]: {
						fid: 42,
						hash: parentHash,
					},
				},
			},
		}])
	})

	it('prefers fname proofs, USER_DATA username fallback, primary EVM userData, and legacy ETH verifications', async () => {
		getUserDataByFid.mockResolvedValueOnce({
			messages: [
				{
					data: {
						fid: 42,
						userDataBody: {
							type: 6,
							value: 'alice-from-userdata',
						},
					},
				},
				{
					data: {
						fid: 42,
						userDataBody: {
							type: 'USER_DATA_PRIMARY_ADDRESS_ETHEREUM',
							value: '0x91031dcfdea024b4d51e775486111d2b2a715871',
						},
					},
				},
			],
		})
		getUsernameProofsByFid.mockResolvedValueOnce({
			proofs: [
				{
					fid: 42,
					name: 'alice.eth',
					type: 'USERNAME_TYPE_ENS_L1',
				},
				{
					fid: 42,
					name: 'alice',
					type: 'USERNAME_TYPE_FNAME',
				},
			],
		})
		getVerificationsByFid.mockResolvedValueOnce({
			messages: [{
				data: {
					fid: 42,
					verificationAddEthAddressBody: {
						address: '0x74232bf61e994655592747e20bdf6fa9b9476f79',
						ethSignature: 'ethsig',
						blockHash: '0xd74860c4bbf574d5ad60f03a478a30f990e05ac723e138a5c860cdb3095f4296',
					},
				},
			}],
		})

		await expect(userResolver.resolve['Fid'].resolve({
			fid: 42,
		})).resolves.toMatchObject({
			username: 'alice',
			$primaryEvmAccount: {
				[EntityMetaKey.Selector]: {
					address: '0x91031dcfdea024b4d51e775486111d2b2a715871',
				},
			},
			$$verifiedAddresses: [{
				[EntityMetaKey.Selector]: {
					fid: 42,
					protocol: 'ethereum',
					address: '0x74232bf61e994655592747e20bdf6fa9b9476f79',
				},
			}],
		})
	})
})
