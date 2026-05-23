import { type as arktype } from 'arktype'

import { SnapchainReactionType } from '$/constants/Snapchain.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const lowerHex0xCastHash = (hash: `0x${string}`): `0x${string}` => (
	hexLowerOfByteSize(hash, 20)
		?? hexLowerOfByteSize(`${hash.slice(0, 2)}${hash.slice(2).toLowerCase()}`, 20)
		?? hash
)

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const channelIdFromParentUrl = (parentUrl: string | undefined) => {
	const trimmed = optionalTrimmedString(parentUrl)
	if (trimmed == null) return undefined
	return (
		/warpcast\.com\/~\/channel\/([^/?#]+)/.exec(trimmed)?.[1]
		?? /farcaster\.xyz\/([^/?#]+)/.exec(trimmed)?.[1]
	)
}

const snapchainCastTimestampMs = (farcasterTimestamp: number | undefined) => (
	farcasterTimestamp != null && Number.isFinite(farcasterTimestamp) ?
		(
			farcasterTimestamp >= 1e12 ?
				farcasterTimestamp
			: farcasterTimestamp >= 1e9 ?
				farcasterTimestamp * 1000
			:
				(farcasterTimestamp + 1609459200) * 1000
		)
	:	undefined
)

const snapchainUserDataPfpHttpUrl = (value: string | null | undefined) => {
	const raw = value?.trim() ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export default {
	source: Source.Snapchain_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			resolve: async (entityId) => {
				type UserFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterUser>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerificationWire
				const {
					getSnapchainUserBundleByFid,
					countLinksByFid,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const [{ userData, usernameProofs, verifications }, followerCount, followingCount] = await Promise.all([
					getSnapchainUserBundleByFid({
						fid: entityId.fid,
					}),
					singleFlight(countLinksByFid)({
						fid: entityId.fid,
						linkType: 'follow',
						reverse: true,
					}),
					singleFlight(countLinksByFid)({
						fid: entityId.fid,
						linkType: 'follow',
					}),
				])
				const verifiedAddressWire = (
					(verifications.messages ?? [])
						.map((message: SnapVerify) => {
							const body = message.data?.verificationAddAddressBody
							if (body?.protocol !== 'PROTOCOL_ETHEREUM') return undefined
							return body.address
						})
						.find((address) => address != null)
				)
				const verifiedTrimmed = optionalTrimmedString(verifiedAddressWire)
				const verifiedParsed = (
					verifiedTrimmed == null ?
						arktype.errors
					:
						EvmAddress(verifiedTrimmed)
				)
				const userFields: Partial<UserFields> = {
					username: optionalTrimmedString(usernameProofs.proofs?.[0]?.name),
					followerCount,
					followingCount,
				}
				if (!(verifiedParsed instanceof arktype.errors)) userFields.verifiedAddress = verifiedParsed
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalTrimmedString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						const icon = mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						if (icon != null) userFields.$icon = icon
					}
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
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entityId.fid,
					hash: entityId.hash,
				})
				if (snapchainCast == null) throw new Error('Snapchain_Rest: cast not found')
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const parentUrl = optionalTrimmedString(castAddBody?.parentUrl)
				const channelId = channelIdFromParentUrl(parentUrl)
				const { likeCount, recastCount, replyCount } = await getCastEngagementCountsForCast({
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
					text: optionalTrimmedString(castAddBody?.text),
					$parentCast: (
						castAddBody?.parentCastId?.fid != null
						&& castAddBody.parentCastId.hash != null
					) ?
						{
							[EntityMetaKey.Id]: {
								fid: castAddBody.parentCastId.fid,
								hash: lowerHex0xCastHash(castAddBody.parentCastId.hash),
							},
						} satisfies CastEntity
					:	undefined,
					parentUrl,
					timestamp: snapchainCastTimestampMs(farcasterTimestamp),
					mentions: castAddBody?.mentions,
					$channel: (
						channelId == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									id: channelId,
								},
							} satisfies Entity<typeof schema, EntityType.FarcasterChannel>
					),
					$$embeds: (castAddBody?.embeds ?? []).flatMap((embed, index) => (
						[
							(({
								[EntityMetaKey.Id]: {
									$cast: entityId,
									index,
								},
								url: optionalTrimmedString(embed?.url),
								$embeddedCast: (
									embed?.castId?.fid != null
									&& embed.castId.hash != null
								) ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.castId.fid,
											hash: lowerHex0xCastHash(embed.castId.hash),
										},
									} satisfies CastEntity
								:	undefined,
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
					replyCount,
				} satisfies Partial<CastFieldValues>
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: async (entityId) => {
				type ConnectionFields = import('$/schema/$schema.ts').EntityFieldValues<
					typeof schema,
					EntityType.BlockheadFarcasterAccountConnection
				>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerificationWire
				const {
					getOnChainIdRegisterEventsByFid,
					getSnapchainUserBundleByFid,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const [{ userData, usernameProofs, verifications }, idRegisterPage] = await Promise.all([
					singleFlight(getSnapchainUserBundleByFid)({ fid: entityId.fid }),
					singleFlight(getOnChainIdRegisterEventsByFid)({ fid: entityId.fid, reverse: true }),
				])
				const ethList = (
					(verifications.messages ?? [])
						.map((message: SnapVerify) => {
							const body = message.data?.verificationAddAddressBody
							if (body?.protocol !== 'PROTOCOL_ETHEREUM') return undefined
							return optionalTrimmedString(body.address)
						})
						.filter((address): address is string => address != null)
				)
				const custodyEvent = (idRegisterPage.events ?? []).find(
					(event) => (
						event.idRegisterEventBody?.eventType === 'ID_REGISTER_EVENT_TYPE_REGISTER'
					),
				)
				const connectionFields: Partial<ConnectionFields> = {
					username: optionalTrimmedString(usernameProofs.proofs?.[0]?.name),
					...(ethList.length > 0 && { verifications: ethList }),
					...((
						custodyAddress,
					) => (
						custodyAddress != null && {
							custody: custodyAddress,
						}
					))(optionalTrimmedString(custodyEvent?.idRegisterEventBody?.to)),
				}
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalTrimmedString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						const icon = mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						if (icon != null) connectionFields.$icon = icon
					}
					else if (userDataType === 'USER_DATA_TYPE_DISPLAY') connectionFields.displayName = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_BIO') connectionFields.bio = fieldValue
				}
				return connectionFields
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			fieldName: '$icon',
			resolve: async (entityId) => {
				const { getSnapchainUserBundleByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const { userData } = await singleFlight(getSnapchainUserBundleByFid)({
					fid: entityId.fid,
				})
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalTrimmedString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						return (
							mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						)
					}
				}
				return undefined
			},
		}),

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
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
						pageSize: Math.min(remaining, snapchainMaxPageSize),
						pageToken,
					})
					fids.push(...(page.fids ?? []))
					pageToken = page.nextPageToken
				} while (
					pageToken != null
					&& fids.length < subsetRowLimit
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
					const remaining = Math.max(subsetRowLimit - casts.length, 0)
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
					&& casts.length < subsetRowLimit
				)
				return (
					casts
						.map((cast) => (({
							[EntityMetaKey.Id]: {
								fid: entityId.fid,
								hash: lowerHex0xCastHash(cast.hash),
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
				const channelPageUrl = optionalTrimmedString(channel?.url) ?? `https://warpcast.com/~/channel/${entityId.id}`
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)
				const casts: SnapCast[] = []
				let pageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - casts.length, 0)
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
					&& casts.length < subsetRowLimit
				)
				return (
					casts
						.map((cast) => {
							const authorFid = cast.data?.fid
							return authorFid == null ?
								undefined
							:	(({
									[EntityMetaKey.Id]: {
										fid: authorFid,
										hash: lowerHex0xCastHash(cast.hash),
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
				const subsetRowLimit = resolverLoadSubsetRowLimit(context)

				if (entityId.variant === 'following') {
					const { getCastsByFid, getLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const followedFids: number[] = []
					let linksPageToken: string | undefined
					const maxFollowedFids = Math.min(subsetRowLimit * 2, 50)
					do {
						const remaining = Math.max(maxFollowedFids - followedFids.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getLinksByFid)({
							fid: entityId.viewerFid,
							linkType: 'follow',
							pageSize: Math.min(remaining, snapchainMaxPageSize),
							pageToken: linksPageToken,
							reverse: true,
						})
						for (const message of page.messages ?? []) {
							const targetFid = message.data?.linkBody?.targetFid
							if (targetFid != null) followedFids.push(targetFid)
						}
						linksPageToken = page.nextPageToken
					} while (
						linksPageToken != null
						&& followedFids.length < maxFollowedFids
					)
					const castEntries: { cast: SnapCast; sortMs: number }[] = []
					const perAuthor = Math.max(
						1,
						Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1)),
					)
					for (const fid of followedFids) {
						if (castEntries.length >= subsetRowLimit) break
						const page = await singleFlight(getCastsByFid)({
							fid,
							pageSize: Math.min(perAuthor, snapchainMaxPageSize),
							reverse: true,
						})
						for (const cast of page.messages ?? []) {
							castEntries.push({
								cast,
								sortMs: snapchainCastTimestampMs(cast.data?.timestamp) ?? 0,
							})
						}
					}
					return (
						castEntries
							.toSorted((left, right) => right.sortMs - left.sortMs)
							.slice(0, subsetRowLimit)
							.flatMap(({ cast }) => {
								const authorFid = cast.data?.fid
								return authorFid == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											fid: authorFid,
											hash: lowerHex0xCastHash(cast.hash),
										},
									} satisfies CastEntity]
							})
					)
				}

				if (entityId.variant === 'byUser') {
					const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
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
						&& casts.length < subsetRowLimit
					)
					return (
						casts
							.map((cast) => (({
								[EntityMetaKey.Id]: {
									fid: entityId.fid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							}) satisfies CastEntity))
					)
				}

				if (entityId.variant === 'byChannel') {
					const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
					const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
					const channel = await singleFlight(getChannel)(entityId.channelId)
					const channelPageUrl = (
						optionalTrimmedString(channel?.url)
						?? `https://warpcast.com/~/channel/${entityId.channelId}`
					)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
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
						&& casts.length < subsetRowLimit
					)
					return (
						casts
							.map((cast) => {
								const authorFid = cast.data?.fid
								return authorFid == null ?
										undefined
									:	(({
											[EntityMetaKey.Id]: {
												fid: authorFid,
												hash: lowerHex0xCastHash(cast.hash),
											},
										}) satisfies CastEntity)
							})
							.filter((cast): cast is CastEntity => cast != null)
					)
				}

				if (entityId.variant !== 'trending') {
					throw new Error(`Snapchain_Rest: unsupported FarcasterFeed variant ${JSON.stringify(entityId)}`)
				}
				const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const fids: number[] = []
				let fidsPageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
						pageSize: Math.min(remaining, snapchainMaxPageSize),
						pageToken: fidsPageToken,
					})
					fids.push(...(page.fids ?? []))
					fidsPageToken = page.nextPageToken
				} while (
					fidsPageToken != null
					&& fids.length < subsetRowLimit
				)
				const feedCasts: SnapCast[] = []
				fidLoop: for (const fid of fids) {
					if (feedCasts.length >= subsetRowLimit) break fidLoop
					let pageToken: string | undefined
					do {
						const page = await singleFlight(getCastsByFid)({
							fid,
							pageSize: snapchainMaxPageSize,
							pageToken,
							reverse: true,
						})
						const batch = page.messages ?? []
						const need = subsetRowLimit - feedCasts.length
						feedCasts.push(...batch.slice(0, need))
						pageToken = page.nextPageToken
					} while (pageToken != null && feedCasts.length < subsetRowLimit)
				}
				return (
					feedCasts
						.map((cast) => {
							const authorFid = cast.data?.fid
							return authorFid == null ?
								undefined
							:	(({
									[EntityMetaKey.Id]: {
										fid: authorFid,
										hash: lowerHex0xCastHash(cast.hash),
									},
								}) satisfies CastEntity)
						})
						.filter((cast): cast is CastEntity => cast != null)
				)
			},
		}),

	],
}
