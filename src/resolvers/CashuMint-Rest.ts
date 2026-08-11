import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

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


export default {
	source: Source.CashuMint_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.CashuMint,
			resolve: {
				MintUrl: {
					resolve: async ({ mintUrl }) => {
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$mint: { mintUrl },
									timestampMs: Date.now(),
									source: Source.CashuMint_Rest,
								},
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

						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$keyset: { $mint, keysetId },
									source: Source.CashuMint_Rest,
									timestampMs: Date.now(),
								},
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
			entityType: EntityType.CashuMint_Timestamp,
			resolve: {
				MintTimestampMsSource: {
					resolve: async ({ $mint, timestampMs, source }) => {
						if (source !== Source.CashuMint_Rest)
							throw new Error(`CashuMint_Rest: unsupported source ${source}`)

						const { getMintInfo } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						const info = await getMintInfo($mint.mintUrl)
						return {
							$mint: { [EntityMetaKey.Selector]: $mint },
							timestampMs,
							source,
							reachable: true,
							...(info.name != null && { name: info.name }),
							...(info.pubkey != null && { pubkey: info.pubkey }),
							...(info.version != null && { version: info.version }),
							...(info.description != null && { description: info.description }),
							...(info.description_long != null && { descriptionLong: info.description_long }),
							...(info.motd != null && { motd: info.motd }),
							...(info.icon_url != null && { iconUrl: info.icon_url }),
							...(info.tos_url != null && { tosUrl: info.tos_url }),
							...(info.time != null && { serverTimeMs: cashuMillisecondsFromSeconds(info.time, 'mint server time') }),
							...(info.contact != null && { contactJson: JSON.stringify(info.contact) }),
							...(info.urls != null && { urls: info.urls }),
							...(info.nuts != null && {
								nutsJson: JSON.stringify(info.nuts),
								...(info.nuts['4']?.methods != null && { mintMethodsJson: JSON.stringify(info.nuts['4'].methods) }),
								...(info.nuts['5']?.methods != null && { meltMethodsJson: JSON.stringify(info.nuts['5'].methods) }),
								supportedNutNumbers: Object.keys(info.nuts).map(Number).toSorted((left, right) => left - right),
							}),
						}
					},
				},
			},
		})({
			$mint: (snapshot) => snapshot.$mint,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			reachable: (snapshot) => snapshot.reachable,
			name: (snapshot) => snapshot.name,
			pubkey: (snapshot) => snapshot.pubkey,
			version: (snapshot) => snapshot.version,
			description: (snapshot) => snapshot.description,
			descriptionLong: (snapshot) => snapshot.descriptionLong,
			motd: (snapshot) => snapshot.motd,
			iconUrl: (snapshot) => snapshot.iconUrl,
			tosUrl: (snapshot) => snapshot.tosUrl,
			serverTimeMs: (snapshot) => snapshot.serverTimeMs,
			contactJson: (snapshot) => snapshot.contactJson,
			urls: (snapshot) => snapshot.urls ?? [],
			nutsJson: (snapshot) => snapshot.nutsJson,
			mintMethodsJson: (snapshot) => snapshot.mintMethodsJson,
			meltMethodsJson: (snapshot) => snapshot.meltMethodsJson,
			supportedNutNumbers: (snapshot) => snapshot.supportedNutNumbers ?? [],
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
			entityType: EntityType.BlockheadCashuMintQuote_Timestamp,
			resolve: {
				MintQuoteTimestampMsSource: {
					resolve: async ({ $mintQuote, timestampMs, source }) => {
						if (source !== Source.CashuMint_Rest)
							throw new Error(`CashuMint_Rest: unsupported source ${source}`)

						const quote = await cashuMintQuoteBolt11(
							$mintQuote.$mint.mintUrl,
							$mintQuote.method,
							$mintQuote.quoteId
						)
						const updatedAtMs = cashuMillisecondsFromSeconds(quote.updated_at, 'mint quote updated_at')
						if (updatedAtMs !== timestampMs)
							throw new Error(`CashuMint_Rest: mint quote observation timestamp mismatch ${updatedAtMs} !== ${timestampMs}`)
						if (quote.state == null)
							throw new Error('CashuMint_Rest: mint quote state is absent')

						return {
							$mintQuote: {
								[EntityMetaKey.Selector]: $mintQuote,
							},
							timestampMs,
							source,
							state: quote.state,
							...(quote.expiry != null && {
								expiryMs: cashuMillisecondsFromSeconds(quote.expiry, 'mint quote expiry'),
							}),
						}
					},
				},
			},
		})({
			$mintQuote: (snapshot) => snapshot.$mintQuote,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			state: (snapshot) => snapshot.state,
			expiryMs: (snapshot) => snapshot.expiryMs,
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
						return {
							request: quote.request,
							amount: BigInt(quote.amount),
							unit: quote.unit,
							feeReserve: BigInt(quote.fee_reserve),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$meltQuote: { $mint, method, quoteId },
									timestampMs: Date.now(),
									source: Source.CashuMint_Rest,
								},
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
			entityType: EntityType.BlockheadCashuMeltQuote_Timestamp,
			resolve: {
				MeltQuoteTimestampMsSource: {
					resolve: async ({ $meltQuote, timestampMs, source }) => {
						if (source !== Source.CashuMint_Rest)
							throw new Error(`CashuMint_Rest: unsupported source ${source}`)

						const quote = await cashuMeltQuoteBolt11(
							$meltQuote.$mint.mintUrl,
							$meltQuote.method,
							$meltQuote.quoteId
						)

						return {
							$meltQuote: {
								[EntityMetaKey.Selector]: $meltQuote,
							},
							timestampMs,
							source,
							state: quote.state,
							expiryMs: cashuMillisecondsFromSeconds(quote.expiry, 'melt quote expiry'),
							...(quote.payment_preimage != null && {
								paymentPreimage: quote.payment_preimage,
							}),
						}
					},
				},
			},
		})({
			$meltQuote: (snapshot) => snapshot.$meltQuote,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			state: (snapshot) => snapshot.state,
			expiryMs: (snapshot) => snapshot.expiryMs,
			paymentPreimage: (snapshot) => snapshot.paymentPreimage,
		}),

		defineResolver({
			entityType: EntityType.CashuKeyset_Timestamp,
			resolve: {
				KeysetTimestampMsSource: {
					resolve: async ({ $keyset, timestampMs, source }) => {
						if (source !== Source.CashuMint_Rest)
							throw new Error(`CashuMint_Rest: unsupported source ${source}`)

						const {
							getMintKeysets,
							getMintKeysForKeyset,
						} = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						const keyset = (
							await getMintKeysets($keyset.$mint.mintUrl)
						).keysets.find((row) => row.id === $keyset.keysetId)
						if (keyset == null)
							throw new Error(`CashuMint_Rest: keyset not found for ${$keyset.keysetId}`)

						const keys = await getMintKeysForKeyset(
							$keyset.$mint.mintUrl,
							{
								keysetId: $keyset.keysetId,
							}
						)
						const listedByKeysEndpoint = keys.keysets.some((row) => row.id === $keyset.keysetId)

						return {
							$keyset: { [EntityMetaKey.Selector]: $keyset },
							timestampMs,
							source,
							active: keyset.active,
							inputFeePpk: keyset.input_fee_ppk ?? 0,
							...(keyset.final_expiry != null && { finalExpiryMs: cashuMillisecondsFromSeconds(keyset.final_expiry, 'keyset final expiry') }),
							listedByKeysetsEndpoint: true,
							listedByKeysEndpoint,
						}
					},
				},
			},
		})({
			$keyset: (snapshot) => snapshot.$keyset,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			active: (snapshot) => snapshot.active,
			inputFeePpk: (snapshot) => snapshot.inputFeePpk,
			finalExpiryMs: (snapshot) => snapshot.finalExpiryMs,
			listedByKeysetsEndpoint: (snapshot) => snapshot.listedByKeysetsEndpoint,
			listedByKeysEndpoint: (snapshot) => snapshot.listedByKeysEndpoint,
		}),

		defineResolver({
			entityType: EntityType.CashuMint,
			resolve: {
				MintUrl: {
					resolve: async ({ mintUrl }, context) => {
						const { getMintKeysets } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						return (await getMintKeysets(mintUrl)).keysets
							.slice(0, resolverContextRowLimit(context))
							.map((keyset) => ({
								[EntityMetaKey.Selector]: {
									$mint: { mintUrl },
									keysetId: keyset.id,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CashuKeyset, [], 'unit')]: keyset.unit,
								},
							}))
					},
				},
			},
		})({
			$$keysets: (snapshot) => snapshot,
		}),
	],
} satisfies RegisteredSourceResolverModule
