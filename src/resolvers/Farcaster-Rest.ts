import { type as arktype } from 'arktype'

import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { farcasterNetworkFieldValues } from '$/constants/Social/Farcaster.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const placeholderIconFragments = [
	'/missing.',
	'missing.png',
	'missing.jpg',
	'missing.jpeg',
	'default-avatar',
	'default_avatar',
	'default_profile',
	'profile_images/default',
	'avatar-default',
	'anonymous.',
	'grey_silhouette',
	'person_blue_generic',
] as const

const optionalTrimmedString = (value: string | undefined | null) => (
	value?.trim() || undefined
)

const normalizeMediaUrl = (value: string | null | undefined): string | undefined => {
	const raw = value?.trim() ?? ''
	if (raw.length === 0) return undefined
	if (placeholderIconFragments.some((fragment) => raw.toLowerCase().includes(fragment))) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export default {
	source: Source.Farcaster_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			resolve: async (entityId) => {
				const { getPrimaryAddress } = await import('$/sources/Farcaster/Rest/queries.ts')
				const ethRaw = await singleFlight(getPrimaryAddress)({
					fid: entityId.fid,
				})
				const ethTrimmed = optionalTrimmedString(ethRaw ?? undefined)
				const ethParsed = (
					ethTrimmed == null ?
						arktype.errors
					:
						EvmAddress(ethTrimmed)
				)
				if (!(ethParsed instanceof arktype.errors)) return { verifiedAddress: ethParsed }
				if (ethRaw == null) {
					const solRaw = await singleFlight(getPrimaryAddress)({
						fid: entityId.fid,
						protocol: 'solana',
					})
					if (solRaw == null) throw new Error('Farcaster_Rest: verified address not found')
				}
				throw new Error('Farcaster_Rest: only ethereum verified addresses are supported')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: async (entityId) => {
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const trimmedNonEmptyString = (value: string | undefined) => (
					value?.trim() || undefined
				)
				const channel = await singleFlight(getChannel)(entityId.id)
				if (channel == null) throw new Error('Farcaster_Rest: channel not found')
				return {
					name: trimmedNonEmptyString(channel.name) ?? channel.id,
					url: trimmedNonEmptyString(channel.url),
					description: trimmedNonEmptyString(channel.description),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(normalizeMediaUrl(trimmedNonEmptyString(channel.imageUrl)), MediaType.Image)),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$headerImage: iconMedia,
						}
					))(mediaFromUrl(normalizeMediaUrl(trimmedNonEmptyString(channel.headerImageUrl)), MediaType.Image)),
					$lead: (
						channel.leadFid == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { fid: channel.leadFid },
							}
					),
					$moderator: (
						channel.moderatorFids?.[0] == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { fid: channel.moderatorFids[0] },
							}
					),
					$$moderators: (channel.moderatorFids ?? []).flatMap((moderatorFid) => (
						moderatorFid == null ?
							[]
						:	[{
								[EntityMetaKey.Id]: { fid: moderatorFid },
							}]
					)),
					createdAt: (
						channel.createdAt != null && Number.isFinite(channel.createdAt) ?
							channel.createdAt >= 1e12 ?
								channel.createdAt
							:
								channel.createdAt * 1000
						:
							undefined
					),
					followerCount: channel.followerCount,
					memberCount: channel.memberCount,
					pinnedCastHash: trimmedNonEmptyString(channel.pinnedCastHash),
					publicCasting: channel.publicCasting,
					externalLinkTitle: trimmedNonEmptyString(channel.externalLink?.title),
					externalLinkUrl: trimmedNonEmptyString(channel.externalLink?.url),
					followedAt: (
						channel.followedAt != null && Number.isFinite(channel.followedAt) ?
							channel.followedAt >= 1e12 ?
								channel.followedAt
							:
								channel.followedAt * 1000
						:
							undefined
					),
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
							variant: 'trending',
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
