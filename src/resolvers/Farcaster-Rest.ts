import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { farcasterNetworkFieldValues } from '$/constants/Social/Farcaster.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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

const normalizeIconHttpUrl = (value: string | null | undefined): string | undefined => {
	const raw = typeof value === 'string' ? value.trim() : ''
	if (raw.length === 0) return undefined
	if (placeholderIconFragments.some((fragment) => raw.toLowerCase().includes(fragment))) return undefined
	const withProtocol = raw.startsWith('//') ? `https:${raw}` : raw
	if (withProtocol.startsWith('ipfs://')) {
		const path = withProtocol.slice('ipfs://'.length).replace(/^\/+/, '')
		return path.length > 0 ? `https://ipfs.io/ipfs/${path}` : undefined
	}
	if (withProtocol.startsWith('ar://')) {
		const path = withProtocol.slice('ar://'.length).replace(/^\/+/, '')
		return path.length > 0 ? `https://arweave.net/${path}` : undefined
	}
	return withProtocol.startsWith('http://') || withProtocol.startsWith('https://') ? withProtocol : undefined
}

export default {
	source: Source.Farcaster_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			resolve: async (entityId) => {
				const { getPrimaryAddress } = await import('$/sources/Farcaster/Rest/queries.ts')
				const verifiedAddress = (
					await singleFlight(getPrimaryAddress)({
						fid: entityId.fid,
					})
				) ?? (
					await singleFlight(getPrimaryAddress)({
						fid: entityId.fid,
						protocol: 'solana',
					})
				)

				if (verifiedAddress == null) throw new Error('Farcaster_Rest: verified address not found')
				return {
					verifiedAddress,
				}
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
								$icon: {
									[EntityMetaKey.Id]: { url: t },
									type: MediaType.Image,
								},
							}
					))(normalizeIconHttpUrl(trimmedNonEmptyString(channel.imageUrl))),
					...((
						t,
					) => (
						t == null ?
							{}
						:	{
								$headerImage: {
									[EntityMetaKey.Id]: { url: t },
									type: MediaType.Image,
								},
							}
					))(normalizeIconHttpUrl(trimmedNonEmptyString(channel.headerImageUrl))),
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
