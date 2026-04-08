import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type {
	Entity,
	EntityFieldValues,
	EntityId,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/$schema.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type {
	SnapchainCastEmbedWire,
	SnapchainCastWire,
	SnapchainUserDataWire,
	SnapchainVerificationWire,
} from '$/sources/Snapchain/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const stringValue = (value: unknown) => (
	typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
)

const normalizeCastHash = (hash: `0x${string}`) => (
	`${hash.slice(0, 2)}${hash.slice(2).toLowerCase()}` as `0x${string}`
)

const farcasterEpochUnixSeconds = 1609459200

const timestampMsFromFarcasterTimestamp = (timestamp: number) => (
	timestamp >= 1e12 ?
		timestamp
	: timestamp >= 1e9 ?
		timestamp * 1000
	:
		(timestamp + farcasterEpochUnixSeconds) * 1000
)

const castEmbedEntitiesFromWire = (
	castId: EntityId<typeof schema, EntityType.FarcasterCast>,
	embeds: SnapchainCastEmbedWire[] | undefined,
): Entity<typeof schema, EntityType.FarcasterCastEmbed>[] => (
	(embeds ?? []).flatMap((embed, index) => {
		return [
			{
				[EntityMetaKey.Id]: {
					$cast: castId,
					index,
				},
				url: stringValue(embed?.url),
				$embeddedCast: (
					embed?.castId?.fid != null
					&& embed.castId.hash != null
				) ?
					{
						[EntityMetaKey.Id]: {
							fid: embed.castId.fid,
							hash: normalizeCastHash(embed.castId.hash as CastHash),
						},
					} as Entity<typeof schema, EntityType.FarcasterCast>
				:	undefined,
			} as Entity<typeof schema, EntityType.FarcasterCastEmbed>,
		]
	})
)

const userFieldsFromNode = ({
	userDataMessages,
	username,
	verifiedAddress,
}: {
	userDataMessages: SnapchainUserDataWire[]
	username?: string
	verifiedAddress?: `0x${string}`
}) => {
	const fields: Partial<EntityFieldValues<typeof schema, EntityType.FarcasterUser>> = {
		username: stringValue(username),
		verifiedAddress: stringValue(verifiedAddress),
	}

	for (const message of userDataMessages) {
		const type = message.data?.userDataBody?.type
		const value = stringValue(message.data?.userDataBody?.value)

		if (value == null) continue
		if (type === 'USER_DATA_TYPE_PFP') fields.pfpUrl = value
		else if (type === 'USER_DATA_TYPE_DISPLAY') fields.displayName = value
		else if (type === 'USER_DATA_TYPE_BIO') fields.bio = value
		else if (type === 'USER_DATA_TYPE_URL') fields.url = value
	}

	return fields
}

const countReactionsByCast = async ({
	targetFid,
	targetHash,
	reactionType,
}: {
	targetFid: number
	targetHash: `0x${string}`
	reactionType: number | string
}) => {
	const { getReactionsByCast } = await import('$/sources/Snapchain/Rest/queries.ts')

	let count = 0
	let pageToken: string | undefined

	do {
		const page = await getReactionsByCast({
			targetFid,
			targetHash,
			reactionType,
			pageSize: 100,
			pageToken,
		})
		count += page.messages?.length ?? 0
		pageToken = page.nextPageToken
	} while (pageToken != null)

	return count
}

const castTimestampMsFromWire = (cast: SnapchainCastWire) => (
	typeof cast.data?.timestamp === 'number' ?
		timestampMsFromFarcasterTimestamp(cast.data.timestamp)
	:	0
)

const loadFarcasterUsersFromSnapchain = async (limit = 100) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getFids } = await import('$/sources/Snapchain/Rest/queries.ts')

	const fids: number[] = []
	let pageToken: string | undefined

	do {
		const remaining = Math.max(limit - fids.length, 0)
		if (remaining === 0) break

		const page = await singleFlight(getFids)({
			pageSize: Math.min(remaining, 100),
			pageToken,
		})

		fids.push(...(page.fids ?? []))
		pageToken = page.nextPageToken
	} while (pageToken != null && fids.length < limit)

	return fids
}

const loadFarcasterUserFieldsFromSnapchain = async (fid: number) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const {
		getUserDataByFid,
		getUsernameProofsByFid,
		getVerificationsByFid,
	} = await import('$/sources/Snapchain/Rest/queries.ts')

	const [userData, usernameProofs, verifications] = await Promise.all([
		singleFlight(getUserDataByFid)({ fid }),
		singleFlight(getUsernameProofsByFid)({ fid }),
		singleFlight(getVerificationsByFid)({ fid }),
	])

	const verifiedAddress = (
		(verifications.messages ?? [])
			.map((message: SnapchainVerificationWire) => (
				message.data?.verificationAddEthAddressBody?.address
			))
			.find((address) => address != null)
	)

	return userFieldsFromNode({
		userDataMessages: userData.messages ?? [],
		username: usernameProofs.proofs?.[0]?.name,
		verifiedAddress,
	})
}

const loadFarcasterCastsFromSnapchain = async ({
	fid,
	limit = 25,
}: {
	fid: number
	limit?: number
}) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')

	const casts: SnapchainCastWire[] = []
	let pageToken: string | undefined

	do {
		const remaining = Math.max(limit - casts.length, 0)
		if (remaining === 0) break

		const page = await singleFlight(getCastsByFid)({
			fid,
			pageSize: Math.min(remaining, 100),
			pageToken,
			reverse: true,
		})

		casts.push(...(page.messages ?? []))
		pageToken = page.nextPageToken
	} while (pageToken != null && casts.length < limit)

	return casts
}

const loadFarcasterCastsByParentFromSnapchain = async ({
	url,
	limit = 25,
}: {
	url: string
	limit?: number
}) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')

	const casts: SnapchainCastWire[] = []
	let pageToken: string | undefined

	do {
		const remaining = Math.max(limit - casts.length, 0)
		if (remaining === 0) break

		const page = await singleFlight(getCastsByParent)({
			url,
			pageSize: Math.min(remaining, 100),
			pageToken,
		})

		casts.push(...(page.messages ?? []))
		pageToken = page.nextPageToken
	} while (pageToken != null && casts.length < limit)

	return casts.sort((castA, castB) => (
		castTimestampMsFromWire(castB) - castTimestampMsFromWire(castA)
	))
}

const loadFarcasterFeedFromSnapchain = async (limit = 50) => {
	const userLimit = Math.min(Math.max(limit, 10), 25)
	const castsPerUser = Math.max(1, Math.ceil(limit / userLimit))

	return (await Promise.all(
		(await loadFarcasterUsersFromSnapchain(userLimit))
			.map(async (fid) => (
				await loadFarcasterCastsFromSnapchain({
					fid,
					limit: castsPerUser,
				})
			)),
	))
		.flat()
		.sort((castA, castB) => (
			castTimestampMsFromWire(castB) - castTimestampMsFromWire(castA)
		))
		.slice(0, limit)
}

const castFieldsFromNode = async (
	entityId: EntityId<typeof schema, EntityType.FarcasterCast>,
	cast: SnapchainCastWire,
) => {
	const body = cast.data?.castAddBody
	const timestamp = cast.data?.timestamp

	const [likeCount, recastCount] = await Promise.all([
		countReactionsByCast({
			targetFid: entityId.fid,
			targetHash: entityId.hash,
			reactionType: 1,
		}).catch(() => undefined),
		countReactionsByCast({
			targetFid: entityId.fid,
			targetHash: entityId.hash,
			reactionType: 2,
		}).catch(() => undefined),
	])

	return {
		$author: {
			[EntityMetaKey.Id]: {
				fid: entityId.fid,
			},
		} as Entity<typeof schema, EntityType.FarcasterUser>,
		text: stringValue(body?.text) ?? '',
		$parentCast: (
			body?.parentCastId?.fid != null
			&& body.parentCastId.hash != null
		) ?
			{
				[EntityMetaKey.Id]: {
					fid: body.parentCastId.fid,
					hash: normalizeCastHash(body.parentCastId.hash as CastHash),
				},
			} as Entity<typeof schema, EntityType.FarcasterCast>
		:	undefined,
		parentUrl: stringValue(body?.parentUrl),
		timestamp: (
			typeof timestamp === 'number' ?
				timestampMsFromFarcasterTimestamp(timestamp)
			:	undefined
		),
		mentions: Array.isArray(body?.mentions) ? body.mentions : undefined,
		$$embeds: castEmbedEntitiesFromWire(entityId, body?.embeds),
		likeCount,
		recastCount,
	} as Partial<EntityFieldValues<typeof schema, EntityType.FarcasterCast>>
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			source: Source.Snapchain,
			resolve: async (entityId) => (
				loadFarcasterUserFieldsFromSnapchain(entityId.fid)
			),
		}),
		defineEntityResolver({
			entityType: EntityType.FarcasterCast,
			source: Source.Snapchain,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getCastById } = await import('$/sources/Snapchain/Rest/queries.ts')
				const cast = await singleFlight(getCastById)({
					fid: entityId.fid,
					hash: entityId.hash,
				})
				return cast == null ? {} : castFieldsFromNode(entityId, cast)
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$farcasterUsers',
			source: Source.Snapchain,
			resolve: async (_entityId, context) => (
				(await loadFarcasterUsersFromSnapchain(context?.limit ?? 100))
					.map((fid) => ({
						[EntityMetaKey.Id]: {
							fid,
						},
					}) as Entity<typeof schema, EntityType.FarcasterUser>)
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterUser,
			fieldName: '$$casts',
			source: Source.Snapchain,
			resolve: async (entityId, context) => (
				(await loadFarcasterCastsFromSnapchain({
					fid: entityId.fid,
					limit: context?.limit ?? 25,
				}))
					.map((cast) => (
						cast.hash == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									fid: entityId.fid,
									hash: normalizeCastHash(cast.hash),
								},
							} as Entity<typeof schema, EntityType.FarcasterCast>
					))
					.filter((cast): cast is Entity<typeof schema, EntityType.FarcasterCast> => cast != null)
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: '$$casts',
			source: Source.Snapchain,
			resolve: async (entityId, context) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')

				const channel = await singleFlight(getChannel)(entityId.id)
				const channelUrl = stringValue(channel?.url) ?? `https://warpcast.com/~/channel/${entityId.id}`

				return (await loadFarcasterCastsByParentFromSnapchain({
					url: channelUrl,
					limit: context?.limit ?? 25,
				}))
					.map((cast) => {
						const fid = cast.data?.fid
						return fid == null || cast.hash == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									fid,
									hash: normalizeCastHash(cast.hash),
								},
							} as Entity<typeof schema, EntityType.FarcasterCast>
					})
					.filter((cast): cast is Entity<typeof schema, EntityType.FarcasterCast> => cast != null)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$casts',
			source: Source.Snapchain,
			resolve: async (_entityId, context) => (
				(await loadFarcasterFeedFromSnapchain(context?.limit ?? 50))
					.map((cast) => {
						const fid = cast.data?.fid
						return fid == null || cast.hash == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									fid,
									hash: normalizeCastHash(cast.hash),
								},
							} as Entity<typeof schema, EntityType.FarcasterCast>
					})
					.filter((cast): cast is Entity<typeof schema, EntityType.FarcasterCast> => cast != null)
			),
		}),
	],
}
