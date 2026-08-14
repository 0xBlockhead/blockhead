import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	CashuMintInfoWire,
	CashuMintKeysetWire,
	CashuMintQuoteBolt11Wire,
	CashuMeltQuoteBolt11Wire,
} from '$/sources/Cashu/Mint/Rest/types.ts'

const cashuMillisecondsFromSeconds = (
	seconds: number,
	label: string
) => {
	if (
		!Number.isSafeInteger(seconds)
		|| seconds < 0
		|| seconds > Math.floor(Number.MAX_SAFE_INTEGER / 1000)
	)
		throw new Error(`CashuMint_Rest: invalid ${label}`)

	return seconds * 1000
}

const cashuMintQuoteBolt11 = async (
	mintUrl: string,
	method: string,
	quoteId: string
) => {
	if (method !== 'bolt11')
		throw new Error(`CashuMint_Rest: unsupported mint method ${method}`)

	const { getMintQuoteBolt11 } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
	const quote = await getMintQuoteBolt11(mintUrl, quoteId)
	if (quote.quote !== quoteId)
		throw new Error(`CashuMint_Rest: mint quote identity mismatch ${quote.quote} !== ${quoteId}`)

	return quote
}

const cashuMeltQuoteBolt11 = async (
	mintUrl: string,
	method: string,
	quoteId: string
) => {
	if (method !== 'bolt11')
		throw new Error(`CashuMint_Rest: unsupported melt method ${method}`)

	const { getMeltQuoteBolt11 } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
	const quote = await getMeltQuoteBolt11(mintUrl, quoteId)
	if (quote.quote !== quoteId)
		throw new Error(`CashuMint_Rest: melt quote identity mismatch ${quote.quote} !== ${quoteId}`)

	return quote
}

const cashuMintTimestampEntityFields = (
	info: CashuMintInfoWire
) => ({
	[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'reachable')]: true,
	...(info.name != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'name')]: info.name,
	}),
	...(info.pubkey != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'pubkey')]: info.pubkey,
	}),
	...(info.version != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'version')]: info.version,
	}),
	...(info.description != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'description')]: info.description,
	}),
	...(info.description_long != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'descriptionLong')]: info.description_long,
	}),
	...(info.motd != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'motd')]: info.motd,
	}),
	...(info.icon_url != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'iconUrl')]: info.icon_url,
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], '$icon')]: mediaFromUrl(info.icon_url, MediaType.Image),
	}),
	...(info.tos_url != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'tosUrl')]: info.tos_url,
	}),
	...(info.time != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'serverTimeMs')]: cashuMillisecondsFromSeconds(info.time, 'mint server time'),
	}),
	...(info.contact != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'contactJson')]: JSON.stringify(info.contact),
	}),
	...(info.urls != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'urls')]: info.urls,
	}),
	...(info.nuts != null && {
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'nutsJson')]: JSON.stringify(info.nuts),
		...(info.nuts['4']?.methods != null && {
			[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'mintMethodsJson')]: JSON.stringify(info.nuts['4'].methods),
		}),
		...(info.nuts['5']?.methods != null && {
			[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'meltMethodsJson')]: JSON.stringify(info.nuts['5'].methods),
		}),
		[entityFieldAddressKey(EntityType.CashuMint_Timestamp, [], 'supportedNutNumbers')]: Object.keys(info.nuts).map(Number).toSorted((left, right) => left - right),
	}),
})

const cashuKeysetTimestampEntityFields = (
	keyset: CashuMintKeysetWire,
	listedByKeysEndpoint: boolean
) => ({
	[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'active')]: keyset.active,
	[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'inputFeePpk')]: keyset.input_fee_ppk ?? 0,
	...(keyset.final_expiry != null && {
		[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'finalExpiryMs')]: cashuMillisecondsFromSeconds(keyset.final_expiry, 'keyset final expiry'),
	}),
	[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysetsEndpoint')]: true,
	[entityFieldAddressKey(EntityType.CashuKeyset_Timestamp, [], 'listedByKeysEndpoint')]: listedByKeysEndpoint,
})

const cashuMintQuoteTimestampEntityFields = (
	quote: CashuMintQuoteBolt11Wire
) => ({
	[entityFieldAddressKey(EntityType.BlockheadCashuMintQuote_Timestamp, [], 'state')]: quote.state,
	...(quote.expiry != null && {
		[entityFieldAddressKey(EntityType.BlockheadCashuMintQuote_Timestamp, [], 'expiryMs')]: cashuMillisecondsFromSeconds(quote.expiry, 'mint quote expiry'),
	}),
})

const cashuMeltQuoteTimestampEntityFields = (
	quote: CashuMeltQuoteBolt11Wire
) => ({
	[entityFieldAddressKey(EntityType.BlockheadCashuMeltQuote_Timestamp, [], 'state')]: quote.state,
	[entityFieldAddressKey(EntityType.BlockheadCashuMeltQuote_Timestamp, [], 'expiryMs')]: cashuMillisecondsFromSeconds(quote.expiry, 'melt quote expiry'),
})


export default {
	source: Source.CashuMint_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.CashuMint,
			resolve: {
				MintUrl: {
					resolve: async ({ mintUrl }) => {
						const { getMintInfo } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						const info = await getMintInfo(mintUrl)
						const timestampMs = Date.now()
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$mint: { mintUrl },
									timestampMs,
									source: Source.CashuMint_Rest,
								},
								[EntityMetaKey.Fields]: cashuMintTimestampEntityFields(info),
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CashuKeyset,
			resolve: {
				CashuMintKeysetId: {
					resolve: async ({ $mint, keysetId }) => {
						const {
							getMintKeysets,
							getMintKeysForKeyset,
						} = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						const keyset = (
							await getMintKeysets($mint.mintUrl)
						).keysets.find((row) => row.id === keysetId)
						if (keyset == null)
							throw new Error(`CashuMint_Rest: keyset not found for ${keysetId}`)

						const keys = await getMintKeysForKeyset(
							$mint.mintUrl,
							{
								keysetId,
							}
						)
						const keysByAmount = keys.keysets.find((row) => row.id === keysetId)?.keys
						const timestampMs = Date.now()

						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$keyset: { $mint, keysetId },
									source: Source.CashuMint_Rest,
									timestampMs,
								},
								[EntityMetaKey.Fields]: cashuKeysetTimestampEntityFields(
									keyset,
									keysByAmount != null
								),
							}],
							...(keysByAmount != null && {
								keysByAmountJson: JSON.stringify(keysByAmount),
							}),
							unit: keyset.unit,
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			keysByAmountJson: (snapshot) => snapshot.keysByAmountJson,
			unit: (snapshot) => snapshot.unit,
		}),

		defineResolver({
			entityType: EntityType.BlockheadCashuMintQuote,
			resolve: {
				MintMethodQuoteId: {
					resolve: async ({ $mint, method, quoteId }) => {
						const quote = await cashuMintQuoteBolt11(
							$mint.mintUrl,
							method,
							quoteId
						)
						return {
							request: quote.request,
							unit: quote.unit,
							amount: BigInt(quote.amount),
							$$timestamps: (
								quote.state == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$mintQuote: { $mint, method, quoteId },
											timestampMs: cashuMillisecondsFromSeconds(quote.updated_at, 'mint quote updated_at'),
											source: Source.CashuMint_Rest,
										},
										[EntityMetaKey.Fields]: cashuMintQuoteTimestampEntityFields(quote),
									}]
							),
						}
					},
				},
			},
		})({
			request: (snapshot) => snapshot.request,
			unit: (snapshot) => snapshot.unit,
			amount: (snapshot) => snapshot.amount,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadCashuMeltQuote,
			resolve: {
				MintMethodQuoteId: {
					resolve: async ({ $mint, method, quoteId }) => {
						const quote = await cashuMeltQuoteBolt11(
							$mint.mintUrl,
							method,
							quoteId
						)
						const timestampMs = Date.now()
						return {
							request: quote.request,
							amount: BigInt(quote.amount),
							unit: quote.unit,
							feeReserve: BigInt(quote.fee_reserve),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$meltQuote: { $mint, method, quoteId },
									timestampMs,
									source: Source.CashuMint_Rest,
								},
								[EntityMetaKey.Fields]: cashuMeltQuoteTimestampEntityFields(quote),
							}],
						}
					},
				},
			},
		})({
			request: (snapshot) => snapshot.request,
			amount: (snapshot) => snapshot.amount,
			unit: (snapshot) => snapshot.unit,
			feeReserve: (snapshot) => snapshot.feeReserve,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CashuMint,
			resolve: {
				MintUrl: {
					resolve: async ({ mintUrl }, context) => {
						const {
							getMintKeys,
							getMintKeysets,
						} = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						const timestampMs = Date.now()
						const [keysets, keys] = await Promise.all([
							getMintKeysets(mintUrl),
							getMintKeys(mintUrl),
						])
						const keysByKeysetId = new Map(keys.keysets.map((keyset) => [keyset.id, keyset]))
						return keysets.keysets
							.slice(0, resolverContextRowLimit(context))
							.map((keyset) => {
								const keysForKeyset = keysByKeysetId.get(keyset.id)
								return {
									[EntityMetaKey.Selector]: {
										$mint: { mintUrl },
										keysetId: keyset.id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.CashuKeyset, [], 'unit')]: keyset.unit,
										...(keysForKeyset != null && {
											[entityFieldAddressKey(EntityType.CashuKeyset, [], 'keysByAmountJson')]: JSON.stringify(keysForKeyset.keys),
										}),
										[entityFieldAddressKey(EntityType.CashuKeyset, [], '$$timestamps')]: [{
											[EntityMetaKey.Selector]: {
												$keyset: {
													$mint: { mintUrl },
													keysetId: keyset.id,
												},
												timestampMs,
												source: Source.CashuMint_Rest,
											},
											[EntityMetaKey.Fields]: cashuKeysetTimestampEntityFields(
												keyset,
												keysForKeyset != null
											),
										}],
									},
								}
							})
					},
				},
			},
		})({
			$$keysets: (snapshot) => snapshot,
		}),
	],
} satisfies RegisteredSourceResolverModule
