import {
	defineResolver,
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


type CastHash = `0x${string}`

const normalizeMediaUrl = (value: string | null | undefined): string | undefined => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	if (farcasterPlaceholderIconUrlFragments.some((fragment) => raw.toLowerCase().includes(fragment))) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

const zeroXLowerHexCastHash = (hash: string): CastHash => {
	const hex = (
		hash.startsWith('0x')
		|| hash.startsWith('0X') ?
			hash.slice(2)
		:
			hash
	)
	return `0x${hex.toLowerCase()}`
}

const farcasterCastTimestampMs = (timestamp: number | undefined) => (
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

export default {
	source: Source.Farcaster_Rest,

	resolvers: [
		defineResolver(Source.Farcaster_Rest, {
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

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
						const channel = await getChannel(id)
						if (channel == null) throw new Error('Farcaster_Rest: channel not found')
						if (channel.id !== id)
							throw new Error('Farcaster_Rest: channel subject mismatch')
						const name = optionalNonemptyString(channel.name) ?? channel.id
						const url = optionalNonemptyString(channel.url)
						const description = optionalNonemptyString(channel.description)
						const imageUrl = normalizeMediaUrl(optionalNonemptyString(channel.imageUrl))
						const headerImageUrl = normalizeMediaUrl(optionalNonemptyString(channel.headerImageUrl))
						const pinnedCastHash = optionalNonemptyString(channel.pinnedCastHash)
						const externalLinkTitle = optionalNonemptyString(channel.externalLink?.title)
						const externalLinkUrl = optionalNonemptyString(channel.externalLink?.url)
						const createdAt = (
							channel.createdAt != null && Number.isFinite(channel.createdAt) ?
								channel.createdAt >= 1e12 ?
									channel.createdAt
								:
									channel.createdAt * 1000
							:
								undefined
						)
						const followedAt = (
							channel.followedAt != null && Number.isFinite(channel.followedAt) ?
								channel.followedAt >= 1e12 ?
									channel.followedAt
								:
									channel.followedAt * 1000
							:
								undefined
						)
						return {
							name,
							...(url != null && { url }),
							...(description != null && { description }),
							...(imageUrl != null && { iconUrl: imageUrl }),
							...((iconMedia) => iconMedia != null && { $icon: iconMedia })(mediaFromUrl(imageUrl, MediaType.Image)),
							...(headerImageUrl != null && { headerImageUrl }),
							...((headerImageMedia) => headerImageMedia != null && { $headerImage: headerImageMedia })(mediaFromUrl(headerImageUrl, MediaType.Image)),
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
							$$moderators: (channel.moderatorFids ?? []).map((moderatorFid) => (
								{
									[EntityMetaKey.Selector]: { fid: moderatorFid },
								}
							)),
							...(createdAt != null && { createdAt }),
							...(pinnedCastHash != null && { pinnedCastHash }),
							...(channel.publicCasting != null && { publicCasting: channel.publicCasting }),
							...(externalLinkTitle != null && { externalLinkTitle }),
							...(externalLinkUrl != null && { externalLinkUrl }),
							...(followedAt != null && { followedAt }),
						}
					},
				}
			},
		})({
				name: (channel) => channel.name,
				url: (channel) => channel.url,
				description: (channel) => channel.description,
				iconUrl: (channel) => channel.iconUrl,
				$icon: (channel) => channel.$icon,
				headerImageUrl: (channel) => channel.headerImageUrl,
				$headerImage: (channel) => channel.$headerImage,
				$lead: (channel) => channel.$lead,
				$moderator: (channel) => channel.$moderator,
				$$moderators: (channel) => channel.$$moderators,
				createdAt: (channel) => channel.createdAt,
				pinnedCastHash: (channel) => channel.pinnedCastHash,
				publicCasting: (channel) => channel.publicCasting,
				externalLinkTitle: (channel) => channel.externalLinkTitle,
				externalLinkUrl: (channel) => channel.externalLinkUrl,
				followedAt: (channel) => channel.followedAt,
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel_Timestamp,
			resolve: {
				FarcasterChannelTimestampMs: {
					resolve: async ({ $channel }) => {
						const {
							getChannelFollowersCount,
							getChannelMembersCount,
						} = await import('$/sources/Farcaster/Rest/queries.ts')
						const [followerCount, memberCount] = await Promise.all([
							getChannelFollowersCount({
								channelId: $channel.id,
							}),
							getChannelMembersCount({
								channelId: $channel.id,
							}),
						])
						return {
							followerCount,
							memberCount,
						}
					},
				}
			},
		})({
				followerCount: (timestamp) => timestamp.followerCount,
				memberCount: (timestamp) => timestamp.memberCount,
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				UsernameHashPrefix: {
					resolve: async ({ username, hashPrefix }) => {
						const { getCastAndDirectRepliesByUsernameAndHashPrefix } = await import('$/sources/Farcaster/Rest/queries.ts')
						const { cast, directReplies } = await getCastAndDirectRepliesByUsernameAndHashPrefix({
							username,
							castHashPrefix: hashPrefix,
						})
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
						const timestamp = farcasterCastTimestampMs(cast.timestamp)
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
							$$directReplies: directReplies.flatMap((reply) => {
								const replyHash = optionalNonemptyString(reply.hash)
								if (replyHash == null || reply.author?.fid == null)
									return []
								const replyTimestamp = farcasterCastTimestampMs(reply.timestamp)
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

		defineResolver(Source.Farcaster_Rest, {
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

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const {
							getChannelFollowersCount,
							getChannelMembersCount,
						} = await import('$/sources/Farcaster/Rest/queries.ts')
						const [followerCount, memberCount] = await Promise.all([
							getChannelFollowersCount({
								channelId: id,
							}),
							getChannelMembersCount({
								channelId: id,
							}),
						])
						return [
							{
								[EntityMetaKey.Selector]: {
									$channel: { id },
									timestampMs: Date.now(),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'followerCount')]:
										followerCount,
									[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'memberCount')]:
										memberCount,
								},
							},
						]
					},
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Farcaster_Rest, {
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
				}
			},
		})({
				$$feeds: (feeds) => feeds,
		}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				Scope: {
					resolve: async (_selector, context) => {
						const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
						return (await getAllChannels())
							.slice(0, resolverContextRowLimit(context))
							.map((farcasterChannel) => ({
								[EntityMetaKey.Selector]: {
									id: farcasterChannel.id,
								},
							}))
					},
				}
			},
		})({
				$$channels: (channels) => channels,
		}),
	],
}
