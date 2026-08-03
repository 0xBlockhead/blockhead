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
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { FarcasterChannel } from '$/sources/Farcaster/Rest/types.ts'

const loadFarcasterQueries = () => import('$/sources/Farcaster/Rest/queries.ts')

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
	return `0x${hex.toLowerCase()}`
}

const farcasterTimestampMs = (timestamp: number | undefined) => (
	timestamp != null && Number.isFinite(timestamp) ?
		(
			timestamp >= 1e12 ?
				timestamp
			:
				timestamp * 1000
		)
	:
	undefined
)

const farcasterChannelFields = (channel: FarcasterChannel) => {
	const imageUrl = normalizeMediaUrl(optionalNonemptyString(channel.imageUrl))
	const headerImageUrl = normalizeMediaUrl(optionalNonemptyString(channel.headerImageUrl))

	return {
		$icon: mediaFromUrl(imageUrl, MediaType.Image),
		$headerImage: mediaFromUrl(headerImageUrl, MediaType.Image),
		$lead: (
			channel.leadFid == null ?
				undefined
			:
				{
					[EntityMetaKey.Selector]: { fid: channel.leadFid },
				}
		),
		$moderator: (
			channel.moderatorFids?.[0] == null ?
				undefined
			:
				{
					[EntityMetaKey.Selector]: { fid: channel.moderatorFids[0] },
				}
		),
		$$moderators: (channel.moderatorFids ?? []).map((moderatorFid) => ({
			[EntityMetaKey.Selector]: { fid: moderatorFid },
		})),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$channel: { id: channel.id },
				timestampMs: Date.now(),
			},
			[EntityMetaKey.Fields]: {
				...(channel.followerCount != null && {
					[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'followerCount')]: channel.followerCount,
				}),
				...(channel.memberCount != null && {
					[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'memberCount')]: channel.memberCount,
				}),
			},
		}],
		createdAt: farcasterTimestampMs(channel.createdAt),
		description: optionalNonemptyString(channel.description),
		externalLinkTitle: optionalNonemptyString(channel.externalLink?.title),
		externalLinkUrl: optionalNonemptyString(channel.externalLink?.url),
		followedAt: farcasterTimestampMs(channel.followedAt),
		headerImageUrl,
		iconUrl: imageUrl,
		name: optionalNonemptyString(channel.name) ?? channel.id,
		pinnedCastHash: optionalNonemptyString(channel.pinnedCastHash),
		publicCasting: channel.publicCasting,
		url: optionalNonemptyString(channel.url),
	}
}

const getFarcasterChannel = async (channelId: string) => {
	const { getChannel } = await loadFarcasterQueries()
	const channel = await getChannel(channelId)
	if (channel == null)
		throw new Error('Farcaster_Rest: channel not found')
	if (channel.id !== channelId)
		throw new Error('Farcaster_Rest: channel subject mismatch')

	return channel
}

export default {
	source: Source.Farcaster_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }) => {
						const { getPrimaryAddress } = await loadFarcasterQueries()
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
			entityType: EntityType.FarcasterChannel,
			resolve: {
				Id: {
					resolve: async ({ id }) => farcasterChannelFields(await getFarcasterChannel(id)),
				}
			},
		})({
			$icon: (channel) => channel.$icon,
			$headerImage: (channel) => channel.$headerImage,
			$lead: (channel) => channel.$lead,
			$moderator: (channel) => channel.$moderator,
			$$moderators: (channel) => channel.$$moderators,
			$$timestamps: (channel) => channel.$$timestamps,
			createdAt: (channel) => channel.createdAt,
			description: (channel) => channel.description,
			externalLinkTitle: (channel) => channel.externalLinkTitle,
			externalLinkUrl: (channel) => channel.externalLinkUrl,
			followedAt: (channel) => channel.followedAt,
			headerImageUrl: (channel) => channel.headerImageUrl,
			iconUrl: (channel) => channel.iconUrl,
			name: (channel) => channel.name,
			pinnedCastHash: (channel) => channel.pinnedCastHash,
			publicCasting: (channel) => channel.publicCasting,
			url: (channel) => channel.url,
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel_Timestamp,
			resolve: {
				FarcasterChannelTimestampMs: {
					resolve: async ({ $channel }) => getFarcasterChannel($channel.id),
				}
			},
		})({
			followerCount: (channel) => channel.followerCount,
			memberCount: (channel) => channel.memberCount,
		}),

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				UsernameHashPrefix: {
					resolve: async ({ username, hashPrefix }) => {
						const { getUserThreadCasts } = await loadFarcasterQueries()
						const casts = (await getUserThreadCasts({
							username,
							castHashPrefix: hashPrefix,
						})).result?.casts ?? []
						const cast = casts.at(0)
						const hash = optionalNonemptyString(cast?.hash)
						if (
						cast == null
						|| hash == null
						|| cast.author?.fid == null
						) {
							throw new Error('Farcaster_Rest: cast not found')
						}
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
							clientUrl: `https://warpcast.com/${username}/${zeroXLowerHexCastHash(hashPrefix)}`,
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
					},
				}
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
						const { getAllChannels } = await loadFarcasterQueries()
						const channels = await getAllChannels()
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Farcaster_Rest: invalid all-channels continuation')

						return {
							offset,
							rows: channels.slice(offset, offset + resolverContextRowLimit(context)).map((farcasterChannel) => {
								const icon = mediaFromUrl(
									normalizeMediaUrl(optionalNonemptyString(farcasterChannel.imageUrl)),
									MediaType.Image
								)
								const createdAt = farcasterTimestampMs(farcasterChannel.createdAt)
								return {
									[EntityMetaKey.Selector]: {
										id: farcasterChannel.id,
									},
									[EntityMetaKey.Fields]: {
										...(icon != null && {
											[entityFieldAddressKey(EntityType.FarcasterChannel, [], '$icon')]: icon,
										}),
										...(createdAt != null && {
											[entityFieldAddressKey(EntityType.FarcasterChannel, [], 'createdAt')]: createdAt,
										}),
										[entityFieldAddressKey(EntityType.FarcasterChannel, [], 'name')]: optionalNonemptyString(farcasterChannel.name) ?? farcasterChannel.id,
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
					return {
						operation: 'all-channels',
						target: 'client-api',
						terminal: nextOffset >= snapshot.totalCount,
						...(nextOffset < snapshot.totalCount && { token: String(nextOffset) }),
					}
				},
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
