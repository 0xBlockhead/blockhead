import { type as arktype } from 'arktype'

import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { farcasterNetworkFieldValues, farcasterPlaceholderIconUrlFragments } from '$/constants/Social/Farcaster.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


const normalizeMediaUrl = (value: string | null | undefined): string | undefined => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	if (farcasterPlaceholderIconUrlFragments.some((fragment) => raw.toLowerCase().includes(fragment))) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export default {
	source: Source.Farcaster_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			resolve: async (entityId) => {
				const { getPrimaryAddress } = await import('$/sources/Farcaster/Rest/queries.ts')
				const ethRaw = await singleFlight(getPrimaryAddress)({ fid: entityId.fid })
				const solRaw = await singleFlight(getPrimaryAddress)({
					fid: entityId.fid,
					protocol: 'solana',
				})
				const ethAddress = optionalNonemptyString(ethRaw ?? undefined)
				const ethParsed = (
					ethAddress == null ?
						arktype.errors
					:
						EvmAddress(ethAddress)
				)
				const solAddress = optionalNonemptyString(solRaw ?? undefined)
				const verifiedAddresses = [
					...(ethAddress == null ?
						[]
					:
						[{
								[EntityMetaKey.Id]: {
									fid: entityId.fid,
									protocol: 'ethereum' as const,
									address: ethAddress,
								},
							$user: {
								[EntityMetaKey.Id]: entityId,
							},
							$evmAccount: {
								[EntityMetaKey.Id]: {
									address: ethAddress,
								},
							},
								protocol: 'ethereum' as const,
								address: ethAddress,
							}]),
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
						...(ethParsed instanceof arktype.errors ? {} : { primaryEvmAddress: EvmAddress.assert(ethAddress) }),
					$$verifiedAddresses: verifiedAddresses,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FarcasterChannel_Timestamp,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: async () => (
				farcasterNetworkFieldValues
			),
		}),

		defineEntityResolver({
			entityType: EntityType.FarcasterFeed,
			resolve: async (entityId) => (
				entityId.variant === 'trending' ?
					{ label: 'Trending' }
				: entityId.variant === 'byUser' ?
					{ label: `FID ${String(entityId.fid)}` }
				: entityId.variant === 'byChannel' ?
					{ label: entityId.channelId }
				:
					{ label: 'Following' }
			),
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: 'followerCount',
			resolve: async (entityId) => {
				const { getChannelFollowersCount } = await import('$/sources/Farcaster/Rest/queries.ts')
				return getChannelFollowersCount({
					channelId: entityId.id,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: 'memberCount',
			resolve: async (entityId) => {
				const { getChannelMembersCount } = await import('$/sources/Farcaster/Rest/queries.ts')
				return getChannelMembersCount({
					channelId: entityId.id,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$feeds',
			resolve: async () => (
				[
					{
							[EntityMetaKey.Id]: {
								variant: 'trending' as const,
							},
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$channels',
			resolve: async () => {
				const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
				return (await singleFlight(getAllChannels)())
					.map((farcasterChannel) => ({
						[EntityMetaKey.Id]: {
							id: farcasterChannel.id,
						},
					}))
			},
		}),
	],
}
