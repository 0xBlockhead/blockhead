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
	value?.trim() ? value.trim() : undefined
)

const normalizeMediaUrl = (value: string | null | undefined): string | undefined => {
	const raw = typeof value === 'string' ? value.trim() : ''
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
				const [ethRaw, solRaw] = await Promise.all([
					singleFlight(getPrimaryAddress)({
						fid: entityId.fid,
					}),
					singleFlight(getPrimaryAddress)({
						fid: entityId.fid,
						protocol: 'solana',
					}),
				])
				const ethTrimmed = optionalTrimmedString(ethRaw ?? undefined)
				const ethParsed = (
					ethTrimmed == null ?
						arktype.errors
					:
						EvmAddress(ethTrimmed)
				)
				if (!(ethParsed instanceof arktype.errors)) return { verifiedAddress: ethParsed }
				if (ethRaw == null && solRaw == null) throw new Error('Farcaster_Rest: verified address not found')
				throw new Error('Farcaster_Rest: only ethereum verified addresses are supported')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: async (entityId) => {
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const trimmedNonEmptyString = (value: string | undefined) => (
					value?.trim() ? value.trim() : undefined
				)
				const channel = await singleFlight(getChannel)(entityId.id)
				if (channel == null) throw new Error('Farcaster_Rest: channel not found')
				return {
					name: trimmedNonEmptyString(channel.name) ?? channel.id,
					url: trimmedNonEmptyString(channel.url),
					description: trimmedNonEmptyString(channel.description),
					...((
						t,
					) => (
						t == null ?
							{}
						:	{
								$icon: t,
							}
					))(mediaFromUrl(normalizeMediaUrl(trimmedNonEmptyString(channel.imageUrl)), MediaType.Image)),
					...((
						t,
					) => (
						t == null ?
							{}
						:	{
								$headerImage: t,
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
					createdAt: ((rawCreatedAt) => (
						typeof rawCreatedAt === 'number' && Number.isFinite(rawCreatedAt) ?
							rawCreatedAt >= 1e12 ?
								rawCreatedAt
							:
								rawCreatedAt * 1000
						:
							undefined
					))(channel.createdAt),
					followerCount: channel.followerCount,
					memberCount: channel.memberCount,
					pinnedCastHash: trimmedNonEmptyString(channel.pinnedCastHash),
					publicCasting: channel.publicCasting,
					externalLinkTitle: trimmedNonEmptyString(channel.externalLink?.title),
					externalLinkUrl: trimmedNonEmptyString(channel.externalLink?.url),
					followedAt: ((rawFollowedAt) => (
						typeof rawFollowedAt === 'number' && Number.isFinite(rawFollowedAt) ?
							rawFollowedAt >= 1e12 ?
								rawFollowedAt
							:
								rawFollowedAt * 1000
						:
							undefined
					))(channel.followedAt),
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
