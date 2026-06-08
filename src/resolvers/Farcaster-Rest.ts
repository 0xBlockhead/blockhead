import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { farcasterNetworkFieldValues, farcasterPlaceholderIconUrlFragments } from '$/constants/Social/Farcaster.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


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
		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getPrimaryAddress } = await import('$/sources/Farcaster/Rest/queries.ts')
				const ethRaw = await singleFlight(getPrimaryAddress)({ fid: entityId.fid })
				const solRaw = await singleFlight(getPrimaryAddress)({
					fid: entityId.fid,
					protocol: 'solana',
				})
				const ethAddress = optionalNonemptyString(ethRaw ?? undefined)
				const solAddress = optionalNonemptyString(solRaw ?? undefined)
				const verifiedAddresses = [
					...(ethAddress == null ?
						[]
					:
						[((evmAddress) => ({
							[EntityMetaKey.Id]: {
								fid: entityId.fid,
								protocol: 'ethereum' as const,
								address: evmAddress,
							},
							$user: {
								[EntityMetaKey.Id]: entityId,
							},
							$evmAccount: {
								[EntityMetaKey.Id]: {
									address: evmAddress,
								},
							},
							protocol: 'ethereum' as const,
							address: evmAddress,
						}))(EvmAddress.assert(ethAddress))]),
					...(solAddress == null ?
						[]
					:
						[{
							[EntityMetaKey.Id]: {
								fid: entityId.fid,
								protocol: 'solana' as const,
								address: solAddress,
							},
							$user: {
								[EntityMetaKey.Id]: entityId,
							},
							$solanaAccount: {
								[EntityMetaKey.Id]: {
									$network: {
										caip2: {
											namespace: 'solana',
											reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
										},
									},
									pubkey: solAddress,
								},
							},
							protocol: 'solana' as const,
							address: solAddress,
						}]),
				]
				if (verifiedAddresses.length === 0) {
					throw new Error('Farcaster_Rest: verified address not found')
				}
				return {
					...(ethAddress != null && {
						$primaryEvmAccount: {
							[EntityMetaKey.Id]: {
								address: EvmAddress.assert(ethAddress),
							},
						},
					}),
					$$verifiedAddresses: verifiedAddresses,
				}
			}
			},
			fields: {
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(entityId.id)
				if (channel == null) throw new Error('Farcaster_Rest: channel not found')
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
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(imageUrl, MediaType.Image)),
					...((
						headerMedia,
					) => (
						headerMedia != null && {
							$headerImage: headerMedia,
						}
					))(mediaFromUrl(headerImageUrl, MediaType.Image)),
					$lead: (
						channel.leadFid == null ?
							undefined
						:
							{
								[EntityMetaKey.Id]: { fid: channel.leadFid },
							}
					),
					$moderator: (
						channel.moderatorFids?.[0] == null ?
							undefined
						:
							{
								[EntityMetaKey.Id]: { fid: channel.moderatorFids[0] },
							}
					),
					$$moderators: (channel.moderatorFids ?? []).map((moderatorFid) => (
						{
								[EntityMetaKey.Id]: { fid: moderatorFid },
							}
					)),
					...(createdAt != null && { createdAt }),
					...(channel.followerCount != null && { followerCount: channel.followerCount }),
					...(channel.memberCount != null && { memberCount: channel.memberCount }),
					...(pinnedCastHash != null && { pinnedCastHash }),
					...(channel.publicCasting != null && { publicCasting: channel.publicCasting }),
					...(externalLinkTitle != null && { externalLinkTitle }),
					...(externalLinkUrl != null && { externalLinkUrl }),
					...(followedAt != null && { followedAt }),
				}
			}
			},
			fields: {
				name: (channel) => channel.name,
				url: (channel) => channel.url,
				description: (channel) => channel.description,
				$icon: (channel) => channel.$icon,
				$headerImage: (channel) => channel.$headerImage,
				$lead: (channel) => channel.$lead,
				$moderator: (channel) => channel.$moderator,
				$$moderators: (channel) => channel.$$moderators,
				createdAt: (channel) => channel.createdAt,
				followerCount: (channel) => channel.followerCount,
				memberCount: (channel) => channel.memberCount,
				pinnedCastHash: (channel) => channel.pinnedCastHash,
				publicCasting: (channel) => channel.publicCasting,
				externalLinkTitle: (channel) => channel.externalLinkTitle,
				externalLinkUrl: (channel) => channel.externalLinkUrl,
				followedAt: (channel) => channel.followedAt,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getChannelFollowersCount,
					getChannelMembersCount,
				} = await import('$/sources/Farcaster/Rest/queries.ts')
				const [followerCount, memberCount] = await Promise.all([
					getChannelFollowersCount({
						channelId: entityId.$channel.id,
					}),
					getChannelMembersCount({
						channelId: entityId.$channel.id,
					}),
				])
				return {
					followerCount,
					memberCount,
				}
			}
			},
			fields: {
				followerCount: (timestamp) => timestamp.followerCount,
				memberCount: (timestamp) => timestamp.memberCount,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				['usernameHashPrefix']: async (entityId) => {
				if (!('username' in entityId) || !('hashPrefix' in entityId)) {
					throw new Error('Farcaster_Rest: cast id requires username and hash prefix')
				}
				const { getCastByUsernameAndHashPrefix } = await import('$/sources/Farcaster/Rest/queries.ts')
				const cast = await singleFlight(getCastByUsernameAndHashPrefix)({
					username: entityId.username,
					castHashPrefix: entityId.hashPrefix,
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
				if (!castHash.startsWith(zeroXLowerHexCastHash(entityId.hashPrefix))) {
					throw new Error('Farcaster_Rest: cast hash prefix mismatch')
				}
				const timestamp = farcasterCastTimestampMs(cast.timestamp)
				if (timestamp == null) {
					throw new Error('Farcaster_Rest: cast missing timestamp')
				}
				return {
					fid: cast.author.fid,
					hash: castHash,
					username: entityId.username,
					hashPrefix: zeroXLowerHexCastHash(entityId.hashPrefix),
					$author: {
						[EntityMetaKey.Id]: {
							fid: cast.author.fid,
						},
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					text: optionalNonemptyString(cast.text) ?? '',
					timestamp,
					...(cast.reactions?.count != null && {
						likeCount: cast.reactions.count,
					}),
					...(cast.recasts?.count != null && {
						recastCount: cast.recasts.count,
					}),
					...(cast.replies?.count != null && {
						replyCount: cast.replies.count,
					}),
					...(cast.threadHash != null && cast.threadHash !== '' && {
						threadHash: zeroXLowerHexCastHash(cast.threadHash),
					}),
				}
			}
			},
			fields: {
				fid: (cast) => cast.fid,
				hash: (cast) => cast.hash,
				username: (cast) => cast.username,
				hashPrefix: (cast) => cast.hashPrefix,
				$author: (cast) => cast.$author,
				text: (cast) => cast.text,
				timestamp: (cast) => cast.timestamp,
				likeCount: (cast) => cast.likeCount,
				recastCount: (cast) => cast.recastCount,
				replyCount: (cast) => cast.replyCount,
				threadHash: (cast) => cast.threadHash,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async () => (
				farcasterNetworkFieldValues
			)
			},
			fields: {
				protocolName: (network) => network.protocolName,
				homeUrl: (network) => network.homeUrl,
				docsUrl: (network) => network.docsUrl,
				registryLabel: (network) => network.registryLabel,
				topology: (network) => network.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => (
				entityId.variant === 'trending' ?
					{ label: 'Trending' }
				: entityId.variant === 'byUser' ?
					{ label: `FID ${String(entityId.fid)}` }
				: entityId.variant === 'byChannel' ?
					{ label: entityId.channelId }
				:
					{ label: 'Following' }
			)
			},
			fields: {
				label: (feed) => feed.label,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getChannelFollowersCount,
					getChannelMembersCount,
				} = await import('$/sources/Farcaster/Rest/queries.ts')
				const [followerCount, memberCount] = await Promise.all([
					getChannelFollowersCount({
						channelId: entityId.id,
					}),
					getChannelMembersCount({
						channelId: entityId.id,
					}),
				])
				return [
					{
						[EntityMetaKey.Id]: {
							$channel: entityId,
							timestampMs: Date.now(),
						},
						followerCount,
						memberCount,
					},
				]
			}
			},
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getChannelFollowersCount } = await import('$/sources/Farcaster/Rest/queries.ts')
				return getChannelFollowersCount({
					channelId: entityId.id,
				})
			}
			},
			fields: {
				followerCount: (followerCount) => followerCount,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getChannelMembersCount } = await import('$/sources/Farcaster/Rest/queries.ts')
				return getChannelMembersCount({
					channelId: entityId.id,
				})
			}
			},
			fields: {
				memberCount: (memberCount) => memberCount,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async () => (
				[
					{
							[EntityMetaKey.Id]: {
								variant: 'trending' as const,
							},
					},
				]
			)
			},
			fields: {
				$$feeds: (feeds) => feeds,
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
				return (await singleFlight(getAllChannels)())
					.map((farcasterChannel) => ({
						[EntityMetaKey.Id]: {
							id: farcasterChannel.id,
						},
					}))
			}
			},
			fields: {
				$$channels: (channels) => channels,
			},
		}),
	],
}
