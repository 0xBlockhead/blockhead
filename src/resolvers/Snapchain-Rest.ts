import { SnapchainReactionType } from '$/constants/Snapchain.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const farcasterEpochUnixSeconds = 1609459200

const canonicalFarcasterCastHash = (hash: `0x${string}`) => (
	`${hash.slice(0, 2)}${hash.slice(2).toLowerCase()}` as `0x${string}`
)

const farcasterTimestampToUnixMilliseconds = (timestamp: number) => (
	timestamp >= 1e12 ?
		timestamp
	: timestamp >= 1e9 ?
		timestamp * 1000
	:
		(timestamp + farcasterEpochUnixSeconds) * 1000
)

const trimmedNonEmptyString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const unixMillisecondsFromSnapchainCast = (
	cast: import('$/sources/Snapchain/Rest/types.ts').SnapchainCastWire,
) => (
	typeof cast.data?.timestamp === 'number' ?
		farcasterTimestampToUnixMilliseconds(cast.data.timestamp)
	:	0
)

export default {
	source: Source.Snapchain_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			resolve: async (entityId) => {
				type UserFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterUser>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerificationWire
				const { getSnapchainUserBundleByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const { userData, usernameProofs, verifications } = await getSnapchainUserBundleByFid({
					fid: entityId.fid,
				})
				const verifiedAddress = (
					(verifications.messages ?? [])
						.map((message: SnapVerify) => (
							message.data?.verificationAddEthAddressBody?.address
						))
						.find((address) => address != null)
				)
				const userFields: Partial<UserFields> = {
					username: trimmedNonEmptyString(usernameProofs.proofs?.[0]?.name),
					verifiedAddress: trimmedNonEmptyString(verifiedAddress),
				}
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = trimmedNonEmptyString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') userFields.pfpUrl = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_DISPLAY') userFields.displayName = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_BIO') userFields.bio = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_URL') userFields.url = fieldValue
				}
				return userFields
			},
		}),
		defineEntityResolver({
			entityType: EntityType.FarcasterCast,
			resolve: async (entityId) => {
				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				const {
					getCastById,
					getLikeAndRecastCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entityId.fid,
					hash: entityId.hash,
				})
				if (snapchainCast == null) return {}
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const { likeCount, recastCount } = await getLikeAndRecastCountsForCast({
					targetFid: entityId.fid,
					targetHash: entityId.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
				return {
					$author: {
						[EntityMetaKey.Id]: {
							fid: entityId.fid,
						},
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					text: trimmedNonEmptyString(castAddBody?.text),
					$parentCast: (
						castAddBody?.parentCastId?.fid != null
						&& castAddBody.parentCastId.hash != null
					) ?
						{
							[EntityMetaKey.Id]: {
								fid: castAddBody.parentCastId.fid,
								hash: canonicalFarcasterCastHash(castAddBody.parentCastId.hash),
							},
						} satisfies CastEntity
					:	undefined,
					parentUrl: trimmedNonEmptyString(castAddBody?.parentUrl),
					timestamp: (
						typeof farcasterTimestamp === 'number' ?
							farcasterTimestampToUnixMilliseconds(farcasterTimestamp)
						:	undefined
					),
					mentions: castAddBody?.mentions,
					$$embeds: (castAddBody?.embeds ?? []).flatMap((embed, index) => (
						[
							(({
								[EntityMetaKey.Id]: {
									$cast: entityId,
									index,
								},
								url: trimmedNonEmptyString(embed?.url),
								$embeddedCast: (
									embed?.castId?.fid != null
									&& embed.castId.hash != null
								) ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.castId.fid,
											hash: canonicalFarcasterCastHash(embed.castId.hash),
										},
									} satisfies CastEntity
								:	undefined,
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
				} satisfies Partial<CastFieldValues>
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$users',
			resolve: async (_entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type UserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
				const { getFids } = await import('$/sources/Snapchain/Rest/queries.ts')
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const fids: number[] = []
				let pageToken: string | undefined
				do {
					const remaining = (
						subsetRowLimit == null ?
							snapchainMaxPageSize
						:	Math.max(subsetRowLimit - fids.length, 0)
					)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
						pageSize: Math.min(remaining, snapchainMaxPageSize),
						pageToken,
					})
					fids.push(...(page.fids ?? []))
					pageToken = page.nextPageToken
				} while (
					pageToken != null
					&& (subsetRowLimit == null ? fids.length === 0 : fids.length < subsetRowLimit)
				)
				return (
					fids.map((fid) => (({
						[EntityMetaKey.Id]: {
							fid,
						},
					}) satisfies UserEntity))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterUser,
			fieldName: '$$casts',
			resolve: async (entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCastWire
				const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const casts: SnapCast[] = []
				let pageToken: string | undefined
				do {
					const remaining = (
						subsetRowLimit == null ?
							snapchainMaxPageSize
						:	Math.max(subsetRowLimit - casts.length, 0)
					)
					if (remaining === 0) break
					const page = await singleFlight(getCastsByFid)({
						fid: entityId.fid,
						pageSize: Math.min(remaining, snapchainMaxPageSize),
						pageToken,
						reverse: true,
					})
					casts.push(...(page.messages ?? []))
					pageToken = page.nextPageToken
				} while (
					pageToken != null
					&& (subsetRowLimit == null ? casts.length === 0 : casts.length < subsetRowLimit)
				)
				return (
					casts
						.map((cast) => (({
							[EntityMetaKey.Id]: {
								fid: entityId.fid,
								hash: canonicalFarcasterCastHash(cast.hash),
							},
						}) satisfies CastEntity))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: '$$casts',
			resolve: async (entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCastWire
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(entityId.id)
				const channelPageUrl = trimmedNonEmptyString(channel?.url) ?? `https://warpcast.com/~/channel/${entityId.id}`
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const casts: SnapCast[] = []
				let pageToken: string | undefined
				do {
					const remaining = (
						subsetRowLimit == null ?
							snapchainMaxPageSize
						:	Math.max(subsetRowLimit - casts.length, 0)
					)
					if (remaining === 0) break
					const page = await singleFlight(getCastsByParent)({
						url: channelPageUrl,
						pageSize: Math.min(remaining, snapchainMaxPageSize),
						pageToken,
					})
					casts.push(...(page.messages ?? []))
					pageToken = page.nextPageToken
				} while (
					pageToken != null
					&& (subsetRowLimit == null ? casts.length === 0 : casts.length < subsetRowLimit)
				)
				const sortedByNewestFirst = casts.sort((leftCast, rightCast) => (
					unixMillisecondsFromSnapchainCast(rightCast) - unixMillisecondsFromSnapchainCast(leftCast)
				))
				return (
					sortedByNewestFirst
						.map((cast) => {
							const authorFid = cast.data?.fid
							return authorFid == null ?
								undefined
							:	(({
									[EntityMetaKey.Id]: {
										fid: authorFid,
										hash: canonicalFarcasterCastHash(cast.hash),
									},
								}) satisfies CastEntity)
						})
						.filter((cast): cast is CastEntity => cast != null)
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterFeed,
			fieldName: '$$entries',
			resolve: async (entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCastWire
				if (entityId.variant === 'following') return []

				if (entityId.variant === 'byUser') {
					const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const subsetRowLimit = resolverLoadSubsetRowLimit(context)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = (
							subsetRowLimit == null ?
								snapchainMaxPageSize
							:	Math.max(subsetRowLimit - casts.length, 0)
						)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByFid)({
							fid: entityId.fid,
							pageSize: Math.min(remaining, snapchainMaxPageSize),
							pageToken,
							reverse: true,
						})
						casts.push(...(page.messages ?? []))
						pageToken = page.nextPageToken
					} while (
						pageToken != null
						&& (subsetRowLimit == null ? casts.length === 0 : casts.length < subsetRowLimit)
					)
					return (
						casts
							.map((cast) => (({
								[EntityMetaKey.Id]: {
									fid: entityId.fid,
									hash: canonicalFarcasterCastHash(cast.hash),
								},
							}) satisfies CastEntity))
					)
				}

				if (entityId.variant === 'byChannel') {
					const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
					const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
					const channel = await singleFlight(getChannel)(entityId.channelId)
					const channelPageUrl = (
						trimmedNonEmptyString(channel?.url)
						?? `https://warpcast.com/~/channel/${entityId.channelId}`
					)
					const subsetRowLimit = resolverLoadSubsetRowLimit(context)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = (
							subsetRowLimit == null ?
								snapchainMaxPageSize
							:	Math.max(subsetRowLimit - casts.length, 0)
						)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByParent)({
							url: channelPageUrl,
							pageSize: Math.min(remaining, snapchainMaxPageSize),
							pageToken,
						})
						casts.push(...(page.messages ?? []))
						pageToken = page.nextPageToken
					} while (
						pageToken != null
						&& (subsetRowLimit == null ? casts.length === 0 : casts.length < subsetRowLimit)
					)
					const sortedByNewestFirst = casts.sort((leftCast, rightCast) => (
						unixMillisecondsFromSnapchainCast(rightCast) - unixMillisecondsFromSnapchainCast(leftCast)
					))
					return (
						sortedByNewestFirst
							.map((cast) => {
								const authorFid = cast.data?.fid
							return authorFid == null ?
									undefined
								:	(({
										[EntityMetaKey.Id]: {
											fid: authorFid,
											hash: canonicalFarcasterCastHash(cast.hash),
										},
									}) satisfies CastEntity)
							})
							.filter((cast): cast is CastEntity => cast != null)
					)
				}

				// `trending` — best-effort sample across hub fids (not provider-ranked).
				if (entityId.variant !== 'trending') return []
				const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const fids: number[] = []
				let fidsPageToken: string | undefined
				do {
					const remaining = (
						subsetRowLimit == null ?
							snapchainMaxPageSize
						:	Math.max(subsetRowLimit - fids.length, 0)
					)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
						pageSize: Math.min(remaining, snapchainMaxPageSize),
						pageToken: fidsPageToken,
					})
					fids.push(...(page.fids ?? []))
					fidsPageToken = page.nextPageToken
				} while (
					fidsPageToken != null
					&& (subsetRowLimit == null ? fids.length === 0 : fids.length < subsetRowLimit)
				)
				const feedCasts: SnapCast[] = []
				fidLoop: for (const fid of fids) {
					if (subsetRowLimit != null && feedCasts.length >= subsetRowLimit) break fidLoop
					let pageToken: string | undefined
					do {
						const page = await singleFlight(getCastsByFid)({
							fid,
							pageSize: snapchainMaxPageSize,
							pageToken,
							reverse: true,
						})
						const batch = page.messages ?? []
						if (subsetRowLimit == null) {
							feedCasts.push(...batch)
							break fidLoop
						}
						const need = subsetRowLimit - feedCasts.length
						feedCasts.push(...batch.slice(0, need))
						pageToken = page.nextPageToken
					} while (pageToken != null && feedCasts.length < subsetRowLimit)
				}
				const sortedByNewestFirst = feedCasts.sort((leftCast, rightCast) => (
					unixMillisecondsFromSnapchainCast(rightCast) - unixMillisecondsFromSnapchainCast(leftCast)
				))
				const cappedCasts = (
					subsetRowLimit == null ?
						sortedByNewestFirst
					:	sortedByNewestFirst.slice(0, subsetRowLimit)
				)
				return (
					cappedCasts
						.map((cast) => {
							const authorFid = cast.data?.fid
							return authorFid == null ?
								undefined
							:	(({
									[EntityMetaKey.Id]: {
										fid: authorFid,
										hash: canonicalFarcasterCastHash(cast.hash),
									},
								}) satisfies CastEntity)
						})
						.filter((cast): cast is CastEntity => cast != null)
				)
			},
		}),
	],
}
