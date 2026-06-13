import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { SnapchainReactionType } from '$/constants/Snapchain.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const lowerHex0xCastHash = (hash: `0x${string}`): `0x${string}` => (
	hexLowerOfByteSize(hash, 20)
		?? hexLowerOfByteSize(`${hash.slice(0, 2)}${hash.slice(2).toLowerCase()}`, 20)
		?? hash
)


const channelIdFromParentUrl = (parentUrl: string | undefined) => {
	const parentUrlString = optionalNonemptyString(parentUrl)
	if (parentUrlString == null) return undefined
	return (
		/warpcast\.com\/~\/channel\/([^/?#]+)/.exec(parentUrlString)?.[1]
		?? /farcaster\.xyz\/([^/?#]+)/.exec(parentUrlString)?.[1]
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
	:
		undefined
)

const snapchainUserDataPfpHttpUrl = (value: string | null | undefined) => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export default {
	source: Source.Snapchain_Rest,

	resolvers: [
		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				type UserFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterUser>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerification
				const {
					getUserBundleByFid,
					countLinksByFid,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const [{ userData, usernameProofs, verifications }, followerCount, followingCount] = await Promise.all([
					getUserBundleByFid({
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
				const verifiedAddresses = (
					(verifications.messages ?? [])
						.flatMap<Entity<typeof schema, EntityType.FarcasterVerifiedAddress>>((message: SnapVerify) => {
							const body = message.data?.verificationAddAddressBody
							const address = optionalNonemptyString(body?.address)
							const protocol = (
								body?.protocol === 'PROTOCOL_ETHEREUM' ?
									'ethereum' as const
								: body?.protocol === 'PROTOCOL_SOLANA' ?
									'solana' as const
							:
								undefined
							)
							return protocol == null || address == null ?
								[]
							:
								protocol === 'ethereum' ?
									(
										(evmAddress) => (
											[{
													[EntityMetaKey.Id]: {
														fid: entityId.fid,
														protocol,
														address: evmAddress,
													},
													$user: {
														[EntityMetaKey.Id]: entityId,
													},
													$evmAccount: {
														[EntityMetaKey.Id]: {
															address: evmAddress,
														},
													},
													protocol,
													address: evmAddress,
												}]
										)
									)(EvmAddress.assert(address))
							:
									[{
										[EntityMetaKey.Id]: {
											fid: entityId.fid,
											protocol,
											address,
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
												pubkey: address,
											},
										},
										protocol,
										address,
									}]
						})
						.filter((verification, index, verificationsList) => (
							verificationsList.findIndex((otherVerification) => (
								otherVerification[EntityMetaKey.Id].protocol === verification[EntityMetaKey.Id].protocol
								&& otherVerification[EntityMetaKey.Id].address === verification[EntityMetaKey.Id].address
							)) === index
						))
				)
				const primaryVerifiedEvmAddress = verifiedAddresses.find((verification) => (
					verification[EntityMetaKey.Id].protocol === 'ethereum'
				))?.[EntityMetaKey.Id].address
				const userFields: Partial<UserFields> = {
					username: optionalNonemptyString(usernameProofs.proofs?.[0]?.name),
					followerCount,
					followingCount,
					$$verifiedAddresses: verifiedAddresses,
				}
				if (primaryVerifiedEvmAddress != null)
					userFields.$primaryEvmAccount = {
						[EntityMetaKey.Id]: {
							address: EvmAddress.assert(primaryVerifiedEvmAddress),
						},
					}
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalNonemptyString(message.data?.userDataBody?.value)
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
			}
			},
		})({
				fields: {
				username: (user) => user.username,
				displayName: (user) => user.displayName,
				$icon: (user) => user.$icon,
				bio: (user) => user.bio,
				url: (user) => user.url,
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses,
				followerCount: (user) => user.followerCount,
				followingCount: (user) => user.followingCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { countLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const [followerCount, followingCount] = await Promise.all([
					singleFlight(countLinksByFid)({
						fid: entityId.$user.fid,
						linkType: 'follow',
						reverse: true,
					}),
					singleFlight(countLinksByFid)({
						fid: entityId.$user.fid,
						linkType: 'follow',
					}),
				])
				return {
					followerCount,
					followingCount,
				}
			}
			},
		})({
				fields: {
				followerCount: (timestamp) => timestamp.followerCount,
				followingCount: (timestamp) => timestamp.followingCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				if (!('fid' in entityId) || !('hash' in entityId)) {
					throw new Error('Snapchain_Rest: cast id requires fid and hash')
				}
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entityId.fid,
					hash: entityId.hash,
				})
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
				const channelId = channelIdFromParentUrl(parentUrl)
				const { likeCount, recastCount, replyCount } = await getCastEngagementCountsForCast({
					targetFid: entityId.fid,
					targetHash: entityId.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
				const timestamp = snapchainCastTimestampMs(farcasterTimestamp)
				if (timestamp == null) {
					throw new Error('Snapchain_Rest: cast missing timestamp')
				}
				return {
					fid: entityId.fid,
					hash: lowerHex0xCastHash(entityId.hash),
					$author: {
						[EntityMetaKey.Id]: {
							fid: entityId.fid,
						},
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					text: optionalNonemptyString(castAddBody?.text) ?? '',
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
					:
						undefined,
					parentUrl,
					timestamp,
					mentions: castAddBody?.mentions,
					$channel: (
						channelId == null ?
							undefined
						:
							{
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
									url: optionalNonemptyString(embed.url),
								$embeddedCast: (
										embed.castId?.fid != null
									&& embed.castId.hash != null
								) ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.castId.fid,
											hash: lowerHex0xCastHash(embed.castId.hash),
										},
									} satisfies CastEntity
								:
									undefined,
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
					replyCount,
				} satisfies Partial<CastFieldValues>
			},
				['hash']: async (entityId) => {
				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				if (!('fid' in entityId) || !('hash' in entityId)) {
					throw new Error('Snapchain_Rest: cast id requires fid and hash')
				}
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entityId.fid,
					hash: entityId.hash,
				})
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
				const channelId = channelIdFromParentUrl(parentUrl)
				const { likeCount, recastCount, replyCount } = await getCastEngagementCountsForCast({
					targetFid: entityId.fid,
					targetHash: entityId.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
				const timestamp = snapchainCastTimestampMs(farcasterTimestamp)
				if (timestamp == null) {
					throw new Error('Snapchain_Rest: cast missing timestamp')
				}
				return {
					fid: entityId.fid,
					hash: lowerHex0xCastHash(entityId.hash),
					$author: {
						[EntityMetaKey.Id]: {
							fid: entityId.fid,
						},
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					text: optionalNonemptyString(castAddBody?.text) ?? '',
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
					:
						undefined,
					parentUrl,
					timestamp,
					mentions: castAddBody?.mentions,
					$channel: (
						channelId == null ?
							undefined
						:
							{
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
									url: optionalNonemptyString(embed.url),
								$embeddedCast: (
										embed.castId?.fid != null
									&& embed.castId.hash != null
								) ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.castId.fid,
											hash: lowerHex0xCastHash(embed.castId.hash),
										},
									} satisfies CastEntity
								:
									undefined,
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
					replyCount,
				} satisfies Partial<CastFieldValues>
			},
				['fidHash']: async (entityId) => {
				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				if (!('fid' in entityId) || !('hash' in entityId)) {
					throw new Error('Snapchain_Rest: cast id requires fid and hash')
				}
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entityId.fid,
					hash: entityId.hash,
				})
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
				const channelId = channelIdFromParentUrl(parentUrl)
				const { likeCount, recastCount, replyCount } = await getCastEngagementCountsForCast({
					targetFid: entityId.fid,
					targetHash: entityId.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
				const timestamp = snapchainCastTimestampMs(farcasterTimestamp)
				if (timestamp == null) {
					throw new Error('Snapchain_Rest: cast missing timestamp')
				}
				return {
					fid: entityId.fid,
					hash: lowerHex0xCastHash(entityId.hash),
					$author: {
						[EntityMetaKey.Id]: {
							fid: entityId.fid,
						},
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					text: optionalNonemptyString(castAddBody?.text) ?? '',
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
					:
						undefined,
					parentUrl,
					timestamp,
					mentions: castAddBody?.mentions,
					$channel: (
						channelId == null ?
							undefined
						:
							{
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
									url: optionalNonemptyString(embed.url),
								$embeddedCast: (
										embed.castId?.fid != null
									&& embed.castId.hash != null
								) ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.castId.fid,
											hash: lowerHex0xCastHash(embed.castId.hash),
										},
									} satisfies CastEntity
								:
									undefined,
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
					replyCount,
				} satisfies Partial<CastFieldValues>
			}
			},
		})({
				fields: {
				fid: (cast) => cast.fid,
				hash: (cast) => cast.hash,
				$author: (cast) => cast.$author,
				text: (cast) => cast.text,
				$parentCast: (cast) => cast.$parentCast,
				parentUrl: (cast) => cast.parentUrl,
				timestamp: (cast) => cast.timestamp,
				mentions: (cast) => cast.mentions,
				$channel: (cast) => cast.$channel,
				$$embeds: (cast) => cast.$$embeds,
				likeCount: (cast) => cast.likeCount,
				recastCount: (cast) => cast.recastCount,
				replyCount: (cast) => cast.replyCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				if (!('fid' in entityId.$cast) || !('hash' in entityId.$cast)) {
					throw new Error('Snapchain_Rest: cast snapshot id requires cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: entityId.$cast.fid,
					hash: entityId.$cast.hash,
				})
				return getCastEngagementCountsForCast({
					targetFid: entityId.$cast.fid,
					targetHash: entityId.$cast.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
			}
			},
		})({
				fields: {
				likeCount: (timestamp) => timestamp.likeCount,
				recastCount: (timestamp) => timestamp.recastCount,
				replyCount: (timestamp) => timestamp.replyCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				type ConnectionFields = import('$/schema/$schema.ts').EntityFieldValues<
					typeof schema,
					EntityType.BlockheadFarcasterAccountConnection
				>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerification
				const {
					getOnChainIdRegisterEventsByFid,
					getUserBundleByFid,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const { userData, usernameProofs, verifications } = await singleFlight(getUserBundleByFid)({ fid: entityId.fid })
				const idRegisterPage = await singleFlight(getOnChainIdRegisterEventsByFid)({ fid: entityId.fid, reverse: true })
				const ethList = (
					(verifications.messages ?? [])
						.map((message: SnapVerify) => {
							const body = message.data?.verificationAddAddressBody
							if (body?.protocol !== 'PROTOCOL_ETHEREUM') return undefined
							return optionalNonemptyString(body.address)
						})
						.filter((address): address is string => address != null)
				)
				const custodyEvent = (idRegisterPage.events ?? []).find(
					(event) => (
						event.idRegisterEventBody?.eventType === 'ID_REGISTER_EVENT_TYPE_REGISTER'
					),
				)
				const connectionFields: Partial<ConnectionFields> = {
					username: optionalNonemptyString(usernameProofs.proofs?.[0]?.name),
					...(ethList.length > 0 && { verifications: ethList }),
					...((
						custodyAddress,
					) => (
						custodyAddress != null && {
							custody: custodyAddress,
						}
					))(optionalNonemptyString(custodyEvent?.idRegisterEventBody?.to)),
				}
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalNonemptyString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						const icon = mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						if (icon != null) connectionFields.$icon = icon
					}
					else if (userDataType === 'USER_DATA_TYPE_DISPLAY') connectionFields.displayName = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_BIO') connectionFields.bio = fieldValue
				}
				return connectionFields
			}
			},
		})({
				fields: {
				username: (connection) => connection.username,
				displayName: (connection) => connection.displayName,
				$icon: (connection) => connection.$icon,
				bio: (connection) => connection.bio,
				verifications: (connection) => connection.verifications,
				custody: (connection) => connection.custody,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getUserBundleByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const { userData } = await singleFlight(getUserBundleByFid)({
					fid: entityId.fid,
				})
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalNonemptyString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						return (
							mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						)
					}
				}
				return undefined
			}
			},
		})({
				fields: {
				$icon: (icon) => icon,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type UserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
				const { getFids } = await import('$/sources/Snapchain/Rest/queries.ts')
				const subsetRowLimit = resolverContextRowLimit(context)
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
			}
			},
		})({
				fields: {
				$$users: (users) => users,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { countLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const [followerCount, followingCount] = await Promise.all([
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
				return [
					{
						[EntityMetaKey.Id]: {
							$user: entityId,
							timestampMs: Date.now(),
						},
						followerCount,
						followingCount,
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const subsetRowLimit = resolverContextRowLimit(context)
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
			},
		})({
				fields: {
				$$casts: (casts) => casts,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const castId = (
					'fid' in entityId
					&& 'hash' in entityId ?
						{
							fid: entityId.fid,
							hash: entityId.hash,
						}
					:
						undefined
				)
				if (castId === undefined) {
					throw new Error('Snapchain_Rest: cast timestamps require cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: castId.fid,
					hash: castId.hash,
				})
				return [
						{
							[EntityMetaKey.Id]: {
								$cast: castId,
								timestampMs: Date.now(),
							},
							...(await getCastEngagementCountsForCast({
								targetFid: castId.fid,
								targetHash: castId.hash,
								likeReactionType: SnapchainReactionType.Like,
								recastReactionType: SnapchainReactionType.Recast,
							})),
					},
				]
			},
				['hash']: async (entityId) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const castId = (
					'fid' in entityId
					&& 'hash' in entityId ?
						{
							fid: entityId.fid,
							hash: entityId.hash,
						}
					:
						undefined
				)
				if (castId === undefined) {
					throw new Error('Snapchain_Rest: cast timestamps require cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: castId.fid,
					hash: castId.hash,
				})
				return [
						{
							[EntityMetaKey.Id]: {
								$cast: castId,
								timestampMs: Date.now(),
							},
							...(await getCastEngagementCountsForCast({
								targetFid: castId.fid,
								targetHash: castId.hash,
								likeReactionType: SnapchainReactionType.Like,
								recastReactionType: SnapchainReactionType.Recast,
							})),
					},
				]
			},
				['fidHash']: async (entityId) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const castId = (
					'fid' in entityId
					&& 'hash' in entityId ?
						{
							fid: entityId.fid,
							hash: entityId.hash,
						}
					:
						undefined
				)
				if (castId === undefined) {
					throw new Error('Snapchain_Rest: cast timestamps require cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: castId.fid,
					hash: castId.hash,
				})
				return [
						{
							[EntityMetaKey.Id]: {
								$cast: castId,
								timestampMs: Date.now(),
							},
							...(await getCastEngagementCountsForCast({
								targetFid: castId.fid,
								targetHash: castId.hash,
								likeReactionType: SnapchainReactionType.Like,
								recastReactionType: SnapchainReactionType.Recast,
							})),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(entityId.id)
				const channelPageUrl = optionalNonemptyString(channel?.url) ?? `https://warpcast.com/~/channel/${entityId.id}`
				const subsetRowLimit = resolverContextRowLimit(context)
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
							.flatMap((cast) => {
								const authorFid = cast.data?.fid
								return authorFid == null ?
									[]
									:
										[({
											[EntityMetaKey.Id]: {
												fid: authorFid,
												hash: lowerHex0xCastHash(cast.hash),
											},
										}) satisfies CastEntity]
								})
					)
				}
			},
		})({
				fields: {
				$$casts: (casts) => casts,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const subsetRowLimit = resolverContextRowLimit(context)

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
					const refs: CastEntity[] = []
					const perAuthor = Math.max(
						1,
						Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1)),
					)
					for (const fid of followedFids) {
						if (refs.length >= subsetRowLimit) break
						const page = await singleFlight(getCastsByFid)({
							fid,
							pageSize: Math.min(perAuthor, snapchainMaxPageSize),
							reverse: true,
						})
						for (const cast of page.messages ?? []) {
							const authorFid = cast.data?.fid
							if (authorFid == null) continue
							refs.push({
								[EntityMetaKey.Id]: {
									fid: authorFid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							} satisfies CastEntity)
							if (refs.length >= subsetRowLimit) break
						}
					}
					return refs
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
						optionalNonemptyString(channel?.url)
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
							.flatMap((cast) => {
								const authorFid = cast.data?.fid
								return authorFid == null ?
									[]
								:
									[({
										[EntityMetaKey.Id]: {
											fid: authorFid,
											hash: lowerHex0xCastHash(cast.hash),
										},
									}) satisfies CastEntity]
							})
					)
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
						.flatMap((cast) => {
							const authorFid = cast.data?.fid
							return authorFid == null ?
								[]
							:
								[({
									[EntityMetaKey.Id]: {
										fid: authorFid,
										hash: lowerHex0xCastHash(cast.hash),
									},
								}) satisfies CastEntity]
						})
				)
			}
			},
		})({
				fields: {
				$$entries: (entries) => entries,
			},
			}),

	],
}
