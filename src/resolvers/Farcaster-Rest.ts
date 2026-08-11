import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { farcasterPlaceholderIconUrlFragments } from '$/constants/Social/Farcaster.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type {
	Entity,
	EntityReferenceValue,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	FarcasterChannel,
	FarcasterUserThreadCastsResponse,
} from '$/sources/Farcaster/Rest/types.ts'
const normalizeMediaUrl = (value: string | null | undefined) => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	if (farcasterPlaceholderIconUrlFragments.some((fragment) => raw.toLowerCase().includes(fragment))) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

const zeroXLowerHexCastHash = (hash: string) => {
	const hex = (
		hash.startsWith('0x')
		|| hash.startsWith('0X') ?
			hash.slice(2)
		:
			hash
	)
	if (!/^[0-9a-fA-F]+$/.test(hex))
		throw new Error('Farcaster_Rest: cast hash is not hexadecimal')

	return `0x${hex.toLowerCase()}`
}

const farcasterTimestampMs = (timestamp: number | undefined) => {
	if (timestamp == null)
		return undefined

	const timestampMs = timestamp >= 1e12 ? timestamp : timestamp * 1000
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('Farcaster_Rest: timestamp must resolve to safe nonnegative milliseconds')

	return timestampMs
}

const farcasterChannelFields = (channel: FarcasterChannel) => {
	if (
		(channel.followerCount != null && (!Number.isSafeInteger(channel.followerCount) || channel.followerCount < 0))
		|| (channel.memberCount != null && (!Number.isSafeInteger(channel.memberCount) || channel.memberCount < 0))
	)
		throw new Error('Farcaster_Rest: channel counts must be safe nonnegative integers')

	const imageUrl = normalizeMediaUrl(optionalNonemptyString(channel.imageUrl))
	const headerImageUrl = normalizeMediaUrl(optionalNonemptyString(channel.headerImageUrl))
	const timestampMs = Date.now()

	return {
		id: channel.id,
		parentUrl: channel.parentUrl,
		createdAt: farcasterTimestampMs(channel.createdAt),
		$lead: (
			channel.leadFid == null ?
				undefined
			:
				{
					[EntityMetaKey.Selector]: { fid: channel.leadFid },
				}
		),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$channel: { id: channel.id },
				timestampMs,
				source: Source.Farcaster_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'name')]: optionalNonemptyString(channel.name),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'description')]: optionalNonemptyString(channel.description),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'iconUrl')]: imageUrl,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$icon')]: mediaFromUrl(imageUrl, MediaType.Image),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'headerImageUrl')]: headerImageUrl,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$headerImage')]: mediaFromUrl(headerImageUrl, MediaType.Image),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$moderator')]: (
					channel.moderatorFids?.[0] == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: { fid: channel.moderatorFids[0] },
						}
				),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$$moderators')]: (
					channel.moderatorFids ?? []
				).map((moderatorFid) => ({
					[EntityMetaKey.Selector]: { fid: moderatorFid },
				})),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'pinnedCastHash')]: optionalNonemptyString(channel.pinnedCastHash),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'publicCasting')]: channel.publicCasting,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'externalLinkTitle')]: optionalNonemptyString(channel.externalLink?.title),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'externalLinkUrl')]: optionalNonemptyString(channel.externalLink?.url),
				...(channel.followerCount != null && {
					[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'followerCount')]: channel.followerCount,
				}),
				...(channel.memberCount != null && {
					[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'memberCount')]: channel.memberCount,
				}),
			},
		}],
	}
}

const getFarcasterChannel = async (channelId: string) => {
	const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
	const channel = await getChannel(channelId)
	if (channel == null)
		throw new Error('Farcaster_Rest: channel not found')
	if (channel.id !== channelId)
		throw new Error('Farcaster_Rest: channel subject mismatch')

	return channel
}

const getFarcasterChannelByParentUrl = async (parentUrl: string) => {
	const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
	const channels = await getAllChannels()
	const channel = channels.find((candidate) => candidate.parentUrl === parentUrl)
	if (channel == null)
		throw new Error('Farcaster_Rest: channel not found')

	return channel
}

const farcasterCastFromThread = ({
	username,
	hashPrefix,
	clientUrl,
	response,
}: {
	username: string
	hashPrefix: string
	clientUrl: string
	response: FarcasterUserThreadCastsResponse
}) => {
	const casts = response.result?.casts ?? []
	const cast = casts.at(0)
	const hash = optionalNonemptyString(cast?.hash)
	if (
		cast == null
		|| hash == null
		|| cast.author?.fid == null
	)
		throw new Error('Farcaster_Rest: cast not found')

	const castHash = zeroXLowerHexCastHash(hash)
	if (!castHash.startsWith(zeroXLowerHexCastHash(hashPrefix)))
		throw new Error('Farcaster_Rest: cast hash prefix mismatch')
	if (
		cast.author.username != null
		&& cast.author.username.toLowerCase() !== username.toLowerCase()
	)
		throw new Error('Farcaster_Rest: cast author username mismatch')

	const timestamp = farcasterTimestampMs(cast.timestamp)
	if (timestamp == null)
		throw new Error('Farcaster_Rest: cast missing timestamp')

	const parentHash = optionalNonemptyString(cast.parentHash)
	const parentUrl = optionalNonemptyString(cast.parentUrl)
	const channelId = optionalNonemptyString(cast.channel?.id)
	return {
		fid: cast.author.fid,
		hash: castHash,
		username,
		hashPrefix: zeroXLowerHexCastHash(hashPrefix),
		clientUrl,
		$author: {
			[EntityMetaKey.Selector]: {
				fid: cast.author.fid,
			},
		} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
		text: optionalNonemptyString(cast.text) ?? '',
		$parentCast: (
			cast.parentAuthor?.fid == null
			|| parentHash == null
		) ?
			undefined
		:
			({
				[EntityMetaKey.Selector]: {
					fid: cast.parentAuthor.fid,
					hash: zeroXLowerHexCastHash(parentHash),
				},
			} satisfies Entity<typeof schema, EntityType.FarcasterCast>),
		parentUrl,
		$channel: (
			channelId == null ?
				undefined
			:
				({
					[EntityMetaKey.Selector]: {
						id: channelId,
					},
				} satisfies Entity<typeof schema, EntityType.FarcasterChannel>)
		),
		timestamp,
		$$directReplies: casts
			.filter((reply) => (
				reply.hash != null
				&& reply.author != null
				&& Number.isSafeInteger(reply.author.fid)
				&& reply.author.fid >= 0
				&& reply.parentHash != null
				&& reply.parentAuthor?.fid === cast.author.fid
				&& zeroXLowerHexCastHash(reply.parentHash) === castHash
			))
			.flatMap((reply) => {
				const replyHash = optionalNonemptyString(reply.hash)
				if (replyHash == null || reply.author?.fid == null)
					return []

				const replyTimestamp = farcasterTimestampMs(reply.timestamp)
				const replyUsername = optionalNonemptyString(reply.author.username)
				const replyChannelId = optionalNonemptyString(reply.channel?.id)
				return [{
					[EntityMetaKey.Selector]: {
						fid: reply.author.fid,
						hash: zeroXLowerHexCastHash(replyHash),
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]: reply.author.fid,
						[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]: zeroXLowerHexCastHash(replyHash),
						[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
							[EntityMetaKey.Selector]: { fid: reply.author.fid },
						},
						[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: optionalNonemptyString(reply.text),
						[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
							[EntityMetaKey.Selector]: {
								fid: cast.author.fid,
								hash: castHash,
							},
						},
						...(replyTimestamp != null && {
							[entityFieldAddressKey(EntityType.FarcasterCast, [], 'timestamp')]: replyTimestamp,
						}),
						...(replyUsername != null && {
							[entityFieldAddressKey(EntityType.FarcasterCast, [], 'username')]: replyUsername,
						}),
						...(replyChannelId != null && {
							[entityFieldAddressKey(EntityType.FarcasterCast, [], '$channel')]: {
								[EntityMetaKey.Selector]: { id: replyChannelId },
							},
						}),
					},
				}]
			}),
		...(cast.threadHash != null && cast.threadHash !== '' && {
			threadHash: zeroXLowerHexCastHash(cast.threadHash),
		}),
	}
}

export default {
	source: Source.Farcaster_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }) => {
						const { getPrimaryAddress } = await import('$/sources/Farcaster/Rest/queries.ts')
						const ethRaw = await getPrimaryAddress({ fid })
						const solRaw = await getPrimaryAddress({
							fid,
							protocol: 'solana',
						})
						const ethAddress = optionalNonemptyString(ethRaw ?? undefined)
						const solAddress = optionalNonemptyString(solRaw ?? undefined)
						const verifiedAddresses = [
							...(ethAddress == null ?
								[]
							:
								[((evmAddress) => ({
									[EntityMetaKey.Selector]: {
										fid,
										protocol: 'ethereum' as const,
										address: evmAddress,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$user')]: {
											[EntityMetaKey.Selector]: { fid },
										},
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$evmAccount')]: {
											[EntityMetaKey.Selector]: {
												address: evmAddress,
											},
										},
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'protocol')]: 'ethereum' as const,
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'address')]: evmAddress,
									},
								}))(EvmAddress.assert(ethAddress))]),
							...(solAddress == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										fid,
										protocol: 'solana' as const,
										address: solAddress,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$user')]: {
											[EntityMetaKey.Selector]: { fid },
										},
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$solanaAccount')]: {
											[EntityMetaKey.Selector]: {
												$network: {
													caip2: {
														namespace: 'solana',
														reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
													},
												},
												pubkey: solAddress,
											},
										},
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'protocol')]: 'solana' as const,
										[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'address')]: solAddress,
									},
								}]),
						]
						if (verifiedAddresses.length === 0)
							throw new Error('Farcaster_Rest: verified address not found')
						return {
							...(ethAddress != null && {
								$primaryEvmAccount: {
									[EntityMetaKey.Selector]: {
										address: EvmAddress.assert(ethAddress),
									},
								},
							}),
							$$verifiedAddresses: verifiedAddresses,
						}
					},
				}
			},
		})({
			$primaryEvmAccount: (user) => user.$primaryEvmAccount,
			$$verifiedAddresses: (user) => user.$$verifiedAddresses,
		}),

		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }, context) => {
						const {
							getChannelMember,
							getUserFollowingChannelsPage,
						} = await import('$/sources/Farcaster/Rest/queries.ts')
						const page = await getUserFollowingChannelsPage({
							fid,
							limit: resolverContextRowLimit(context),
							cursor: context.providerContinuationToken,
						})
						const timestampMs = Date.now()

						return {
							rows: await Promise.all((page.result?.channels ?? []).map(async (channel) => {
								const member = await getChannelMember({
									channelId: channel.id,
									fid,
								})

								return {
									[EntityMetaKey.Selector]: {
										$channel: { id: channel.id },
										$viewer: { fid },
										timestampMs,
										source: Source.Farcaster_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'following')]: true,
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'member')]: member != null,
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'followedAt')]: farcasterTimestampMs(channel.followedAt),
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'memberAt')]: farcasterTimestampMs(member?.memberAt),
									},
								} satisfies EntityReferenceValue<typeof schema, EntityType.FarcasterChannel_Viewer_Timestamp>
							})),
							nextCursor: page.next?.cursor,
						}
					},
				},
			},
		})({
			$$channelViewerTimestamps: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => (
					snapshot.nextCursor == null || snapshot.nextCursor === '' ?
						{
							operation: 'user-following-channels',
							target: 'client-api',
							terminal: true,
						}
					:
						{
							operation: 'user-following-channels',
							target: 'client-api',
							terminal: false,
							token: snapshot.nextCursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				Id: {
					resolve: async ({ id }) => farcasterChannelFields(await getFarcasterChannel(id)),
				},
				ParentUrl: {
					resolve: async ({ parentUrl }) => farcasterChannelFields(await getFarcasterChannelByParentUrl(parentUrl)),
				},
			},
		})({
			id: (channel) => channel.id,
			parentUrl: (channel) => channel.parentUrl,
			createdAt: (channel) => channel.createdAt,
			$lead: (channel) => channel.$lead,
			$$timestamps: (channel) => channel.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				ClientUrl: {
					resolve: async ({ clientUrl }) => {
						const { getUserThreadCastsByClientUrl } = await import(
							'$/sources/Farcaster/Rest/queries.ts'
						)
						const {
							username,
							castHashPrefix,
							response,
						} = await getUserThreadCastsByClientUrl(clientUrl)
						return farcasterCastFromThread({
							username,
							hashPrefix: castHashPrefix,
							clientUrl,
							response,
						})
					},
				},
				UsernameHashPrefix: {
					resolve: async ({ username, hashPrefix }) => {
						const { getUserThreadCasts } = await import('$/sources/Farcaster/Rest/queries.ts')
						return farcasterCastFromThread({
							username,
							hashPrefix,
							clientUrl: `https://warpcast.com/${username}/${zeroXLowerHexCastHash(hashPrefix)}`,
							response: await getUserThreadCasts({
								username,
								castHashPrefix: hashPrefix,
							}),
						})
					},
				},
			},
		})({
			fid: (cast) => cast.fid,
			hash: (cast) => cast.hash,
			username: (cast) => cast.username,
			hashPrefix: (cast) => cast.hashPrefix,
			clientUrl: (cast) => cast.clientUrl,
			$author: (cast) => cast.$author,
			text: (cast) => cast.text,
			$parentCast: (cast) => cast.$parentCast,
			parentUrl: (cast) => cast.parentUrl,
			$channel: (cast) => cast.$channel,
			timestamp: (cast) => cast.timestamp,
			$$directReplies: (cast) => cast.$$directReplies,
			threadHash: (cast) => cast.threadHash,
		}),

		defineResolver({
			entityType: EntityType.FarcasterFeed,
			resolve: {
				Variant: {
					resolve: async ({ variant }) => ({
						label: variant === 'trending' ? 'Trending' : variant,
					}),
				},
				ByUser: {
					resolve: async ({ fid }) => ({
						label: `FID ${String(fid)}`,
					}),
				},
				ByChannel: {
					resolve: async ({ channelId }) => ({
						label: channelId,
					}),
				},
				Following: {
					resolve: async () => ({
						label: 'Following',
					}),
				},
			},
		})({
			label: (feed) => feed.label,
		}),

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				Scope: {
					resolve: async () => (
						[
							{
								[EntityMetaKey.Selector]: {
									variant: 'trending' as const,
								},
							},
						]
					),
				},
			},
		})({
			$$feeds: (feeds) => feeds,
		}),

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				Scope: {
					resolve: async (_selector, context) => {
						const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
						const channels = await getAllChannels()
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Farcaster_Rest: invalid all-channels continuation')

						return {
							offset,
							rows: channels.slice(offset, offset + resolverContextRowLimit(context)).map((channel) => {
								const farcasterChannel = farcasterChannelFields(channel)
								return {
									[EntityMetaKey.Selector]: {
										id: channel.id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterChannel, [], 'parentUrl')]: farcasterChannel.parentUrl,
										[entityFieldAddressKey(EntityType.FarcasterChannel, [], 'createdAt')]: farcasterChannel.createdAt,
										[entityFieldAddressKey(EntityType.FarcasterChannel, [], '$lead')]: farcasterChannel.$lead,
										[entityFieldAddressKey(EntityType.FarcasterChannel, [], '$$timestamps')]: farcasterChannel.$$timestamps,
									},
								}
							}),
							totalCount: channels.length,
						}
					},
				}
			},
		})({
			$$channels: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.rows.length
					if (nextOffset >= snapshot.totalCount)
						return {
							operation: 'all-channels',
							target: 'client-api',
							terminal: true,
						}

					return {
						operation: 'all-channels',
						target: 'client-api',
						terminal: false,
						token: String(nextOffset),
					}
				},
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
