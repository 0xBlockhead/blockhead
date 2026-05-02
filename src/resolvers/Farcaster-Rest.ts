import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { farcasterNetworkFieldValues } from '$/constants/Social/Farcaster.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	source: 'Farcaster_Rest' satisfies import('$/sources/$Source.ts').Source,

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
					imageUrl: trimmedNonEmptyString(channel.imageUrl),
					headerImageUrl: trimmedNonEmptyString(channel.headerImageUrl),
					$lead: (
						channel.leadFid == null ?
							undefined
						:	({
								[EntityMetaKey.Id]: { fid: channel.leadFid },
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>)
					),
					$moderator: (
						channel.moderatorFids?.[0] == null ?
							undefined
						:	({
								[EntityMetaKey.Id]: { fid: channel.moderatorFids[0] },
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>)
					),
					$$moderators: (channel.moderatorFids ?? []).flatMap((moderatorFid) => (
						moderatorFid == null ?
							[]
						:	[{
								[EntityMetaKey.Id]: { fid: moderatorFid },
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>]
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
					} satisfies Entity<typeof schema, EntityType.FarcasterFeed>,
				]
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$channels',
			resolve: async () => {
				const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
				return (await singleFlight(getAllChannels)())
					.map((farcasterChannel) => (({
						[EntityMetaKey.Id]: {
							id: farcasterChannel.id,
						},
					}) satisfies Entity<typeof schema, EntityType.FarcasterChannel>))
			},
		}),
	],
}
