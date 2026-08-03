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
							...(info.time != null && { serverTimeMs: info.time * 1000 }),
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
			entityType: EntityType.CashuKeyset_Timestamp,
			resolve: {
				KeysetTimestampMsSource: {
					resolve: async ({ $keyset, timestampMs, source }) => {
						if (source !== Source.CashuMint_Rest)
							throw new Error(`CashuMint_Rest: unsupported source ${source}`)

						const { getMintKeysets } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
						const keyset = (
							await getMintKeysets($keyset.$mint.mintUrl)
						).keysets.find((row) => row.id === $keyset.keysetId)
						if (keyset == null)
							throw new Error(`CashuMint_Rest: keyset not found for ${$keyset.keysetId}`)

						return {
							$keyset: { [EntityMetaKey.Selector]: $keyset },
							timestampMs,
							source,
							active: keyset.active,
							inputFeePpk: keyset.input_fee_ppk ?? 0,
							...(keyset.final_expiry != null && { finalExpiryMs: keyset.final_expiry * 1000 }),
							listedByKeysetsEndpoint: true,
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
