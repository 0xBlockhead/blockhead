import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { farcasterNetworkFieldValues, farcasterPlaceholderIconUrlFragments } from '$/constants/Social/Farcaster.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { FarcasterUserSelector } from '$/schema/FarcasterUser.ts'
import { FarcasterChannelSelector } from '$/schema/FarcasterChannel.ts'
import { FarcasterChannel_TimestampSelector } from '$/schema/FarcasterChannel_Timestamp.ts'
import { FarcasterNetworkSelector } from '$/schema/FarcasterNetwork.ts'
import { FarcasterFeedSelector } from '$/schema/FarcasterFeed.ts'
import { FarcasterCastSelector } from '$/schema/FarcasterCast.ts'


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
				[FarcasterUserSelector.Fid]: async (entitySelector) => {
				const { getPrimaryAddress } = await import('$/sources/Farcaster/Rest/queries.ts')
				const ethRaw = await singleFlight(getPrimaryAddress)({ fid: entitySelector.fid })
				const solRaw = await singleFlight(getPrimaryAddress)({
					fid: entitySelector.fid,
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
								fid: entitySelector.fid,
								protocol: 'ethereum' as const,
								address: evmAddress,
							},
							$user: {
								[EntityMetaKey.Selector]: entitySelector,
							},
							$evmAccount: {
								[EntityMetaKey.Selector]: {
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
							[EntityMetaKey.Selector]: {
								fid: entitySelector.fid,
								protocol: 'solana' as const,
								address: solAddress,
							},
							$user: {
								[EntityMetaKey.Selector]: entitySelector,
							},
							$solanaAccount: {
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
							[EntityMetaKey.Selector]: {
								address: EvmAddress.assert(ethAddress),
							},
						},
					}),
					$$verifiedAddresses: verifiedAddresses,
				}
			}
			},
		})({
				fields: {
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[FarcasterChannelSelector.Id]: async ({ id }) => {
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(id)
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
		})({
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

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel_Timestamp,
			resolve: {
				[FarcasterChannel_TimestampSelector.FarcasterChannelTimestampMs]: async ({ $channel }) => {
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
			}
			},
		})({
				fields: {
				followerCount: (timestamp) => timestamp.followerCount,
				memberCount: (timestamp) => timestamp.memberCount,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.UsernameHashPrefix]: async (entitySelector) => {
				if (!('username' in entitySelector) || !('hashPrefix' in entitySelector)) {
					throw new Error('Farcaster_Rest: cast id requires username and hash prefix')
				}
				const { getCastByUsernameAndHashPrefix } = await import('$/sources/Farcaster/Rest/queries.ts')
				const cast = await singleFlight(getCastByUsernameAndHashPrefix)({
					username: entitySelector.username,
					castHashPrefix: entitySelector.hashPrefix,
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
				if (!castHash.startsWith(zeroXLowerHexCastHash(entitySelector.hashPrefix))) {
					throw new Error('Farcaster_Rest: cast hash prefix mismatch')
				}
				const timestamp = farcasterCastTimestampMs(cast.timestamp)
				if (timestamp == null) {
					throw new Error('Farcaster_Rest: cast missing timestamp')
				}
				return {
					fid: cast.author.fid,
					hash: castHash,
					username: entitySelector.username,
					hashPrefix: zeroXLowerHexCastHash(entitySelector.hashPrefix),
					$author: {
						[EntityMetaKey.Selector]: {
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
		})({
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

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: async () => (
				farcasterNetworkFieldValues
			)
			},
		})({
				fields: {
				protocolName: (network) => network.protocolName,
				homeUrl: (network) => network.homeUrl,
				docsUrl: (network) => network.docsUrl,
				registryLabel: (network) => network.registryLabel,
				topology: (network) => network.topology,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[FarcasterFeedSelector.Trending]: async ({ channelId, fid, variant }) => (
				variant === 'trending' ?
					{ label: 'Trending' }
				: variant === 'byUser' ?
					{ label: `FID ${String(fid)}` }
				: variant === 'byChannel' ?
					{ label: channelId }
				:
					{ label: 'Following' }
			),
[FarcasterFeedSelector.ByUser]: async ({ channelId, fid, variant }) => (
				variant === 'trending' ?
					{ label: 'Trending' }
				: variant === 'byUser' ?
					{ label: `FID ${String(fid)}` }
				: variant === 'byChannel' ?
					{ label: channelId }
				:
					{ label: 'Following' }
			),
[FarcasterFeedSelector.ByChannel]: async ({ channelId, fid, variant }) => (
				variant === 'trending' ?
					{ label: 'Trending' }
				: variant === 'byUser' ?
					{ label: `FID ${String(fid)}` }
				: variant === 'byChannel' ?
					{ label: channelId }
				:
					{ label: 'Following' }
			),
[FarcasterFeedSelector.Following]: async ({ channelId, fid, variant }) => (
				variant === 'trending' ?
					{ label: 'Trending' }
				: variant === 'byUser' ?
					{ label: `FID ${String(fid)}` }
				: variant === 'byChannel' ?
					{ label: channelId }
				:
					{ label: 'Following' }
			)
			},
		})({
				fields: {
				label: (feed) => feed.label,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[FarcasterChannelSelector.Id]: async (entitySelector) => {
				const {
					getChannelFollowersCount,
					getChannelMembersCount,
				} = await import('$/sources/Farcaster/Rest/queries.ts')
				const [followerCount, memberCount] = await Promise.all([
					getChannelFollowersCount({
						channelId: entitySelector.id,
					}),
					getChannelMembersCount({
						channelId: entitySelector.id,
					}),
				])
				return [
					{
						[EntityMetaKey.Selector]: {
							$channel: entitySelector,
							timestampMs: Date.now(),
						},
						followerCount,
						memberCount,
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[FarcasterChannelSelector.Id]: async ({ id }) => {
				const { getChannelFollowersCount } = await import('$/sources/Farcaster/Rest/queries.ts')
				return getChannelFollowersCount({
					channelId: id,
				})
			}
			},
		})({
				fields: {
				followerCount: (followerCount) => followerCount,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[FarcasterChannelSelector.Id]: async ({ id }) => {
				const { getChannelMembersCount } = await import('$/sources/Farcaster/Rest/queries.ts')
				return getChannelMembersCount({
					channelId: id,
				})
			}
			},
		})({
				fields: {
				memberCount: (memberCount) => memberCount,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: async () => (
				[
					{
							[EntityMetaKey.Selector]: {
								variant: 'trending' as const,
							},
					},
				]
			)
			},
		})({
				fields: {
				$$feeds: (feeds) => feeds,
			},
			}),

		defineResolver(Source.Farcaster_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: async () => {
				const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
				return (await singleFlight(getAllChannels)())
					.map((farcasterChannel) => ({
						[EntityMetaKey.Selector]: {
							id: farcasterChannel.id,
						},
					}))
			}
			},
		})({
				fields: {
				$$channels: (channels) => channels,
			},
			}),
	],
}
