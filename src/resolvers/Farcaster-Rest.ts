import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { FarcasterChannelWire } from '$/sources/Farcaster/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const stringValue = (value: unknown) => (
	typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
)

const userRefFromFid = (fid: number | undefined) => (
	fid == null ?
		undefined
	:	{
			[EntityMetaKey.Id]: {
				fid,
			},
		} as Entity<typeof schema, EntityType.FarcasterUser>
)

const channelFieldsFromWire = (channel: FarcasterChannelWire) => ({
	name: stringValue(channel.name) ?? channel.id,
	url: stringValue(channel.url),
	description: stringValue(channel.description),
	imageUrl: stringValue(channel.imageUrl),
	headerImageUrl: stringValue(channel.headerImageUrl),
	$lead: userRefFromFid(channel.leadFid),
	$moderator: userRefFromFid(channel.moderatorFids?.[0]),
	$$moderators: (channel.moderatorFids ?? []).flatMap((fid) => {
		const userRef = userRefFromFid(fid)
		return userRef == null ? [] : [userRef]
	}),
	createdAt: channel.createdAt,
	followerCount: channel.followerCount,
	memberCount: channel.memberCount,
	pinnedCastHash: stringValue(channel.pinnedCastHash),
	publicCasting: channel.publicCasting,
	externalLinkTitle: stringValue(channel.externalLink?.title),
	externalLinkUrl: stringValue(channel.externalLink?.url),
	followedAt: channel.followedAt,
})

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			source: Source.Farcaster,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
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

				return verifiedAddress == null ?
					{}
				:	{
						verifiedAddress,
					}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.FarcasterChannel,
			source: Source.Farcaster,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(entityId.id)
				return channel == null ? {} : channelFieldsFromWire(channel)
			},
		}),
		defineEntityResolver({
			entityType: EntityType.FarcasterNetwork,
			source: Source.Farcaster,
			resolve: async () => ({}),
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$farcasterChannels',
			source: Source.Farcaster,
			resolve: async () => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getAllChannels } = await import('$/sources/Farcaster/Rest/queries.ts')
				return (await singleFlight(getAllChannels)())
					.map((channel) => ({
						[EntityMetaKey.Id]: {
							id: channel.id,
						},
					}) as Entity<typeof schema, EntityType.FarcasterChannel>)
			},
		}),
	],
}
