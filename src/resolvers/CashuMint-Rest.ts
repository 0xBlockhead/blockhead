import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { CashuMintSelector } from '$/schema/CashuMint.ts'
import { CashuMint_TimestampSelector } from '$/schema/CashuMint_Timestamp.ts'
import { CashuKeysetSelector } from '$/schema/CashuKeyset.ts'
import { CashuKeyset_TimestampSelector } from '$/schema/CashuKeyset_Timestamp.ts'

export default {
	source: Source.CashuMint_Rest,

	resolvers: [
		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuMint,
			resolve: {
				[CashuMintSelector.MintUrl]: async ({ mintUrl }) => {
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
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuKeyset,
			resolve: {
				[CashuKeysetSelector.CashuMintKeysetId]: async ({ $mint, keysetId }) => {
				const {
					getMintKeysets,
					getMintKeysForKeyset,
				} = await import('$/sources/Cashu/Mint/Rest/queries.ts')
				const keyset = (await getMintKeysets({
					mintUrl: $mint.mintUrl,
				})).keysets.find((row) => row.id === keysetId)
				if (keyset == null)
					throw new Error(`CashuMint_Rest: keyset not found for ${keysetId}`)

				const keys = await getMintKeysForKeyset({
					mintUrl: $mint.mintUrl,
					keysetId: keysetId,
				})
				const keysByAmount = keys.keysets.find((row) => row.id === keysetId)?.keys

				return {
					unit: keyset.unit,
					...(keysByAmount != null && {
						keysByAmountJson: JSON.stringify(keysByAmount),
					}),
					$$timestamps: [{
						[EntityMetaKey.Selector]: {
							$keyset: { $mint, keysetId },
							timestampMs: Date.now(),
							source: Source.CashuMint_Rest,
						},
					}],
				}
				},
			},
		})({
			unit: (snapshot) => snapshot.unit,
			keysByAmountJson: (snapshot) => snapshot.keysByAmountJson,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuMint_Timestamp,
			resolve: {
				[CashuMint_TimestampSelector.MintTimestampMsSource]: async ({ $mint, timestampMs, source }) => {
					if (source !== Source.CashuMint_Rest)
						throw new Error(`CashuMint_Rest: unsupported source ${source}`)

					const { getMintInfo } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
					const info = await getMintInfo({ mintUrl: $mint.mintUrl })
					return {
						$mint: { [EntityMetaKey.Selector]: $mint },
						timestampMs,
						source,
						reachable: true,
						...(info.name != null && { name: info.name }),
						...(info.pubkey != null && { pubkey: info.pubkey }),
						...(info.version != null && { version: info.version }),
						...(info.description != null && { description: info.description }),
						...(info.motd != null && { motd: info.motd }),
						...(info.icon_url != null && { iconUrl: info.icon_url }),
						...(info.tos_url != null && { tosUrl: info.tos_url }),
						...(info.time != null && { serverTimeMs: info.time * 1000 }),
					}
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
			motd: (snapshot) => snapshot.motd,
			iconUrl: (snapshot) => snapshot.iconUrl,
			tosUrl: (snapshot) => snapshot.tosUrl,
			serverTimeMs: (snapshot) => snapshot.serverTimeMs,
		}),

		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuKeyset_Timestamp,
			resolve: {
				[CashuKeyset_TimestampSelector.KeysetTimestampMsSource]: async ({ $keyset, timestampMs, source }) => {
					if (source !== Source.CashuMint_Rest)
						throw new Error(`CashuMint_Rest: unsupported source ${source}`)

					const { getMintKeysets } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
					const keyset = (await getMintKeysets({
						mintUrl: $keyset.$mint.mintUrl,
					})).keysets.find((row) => row.id === $keyset.keysetId)
					if (keyset == null)
						throw new Error(`CashuMint_Rest: keyset not found for ${$keyset.keysetId}`)

					return {
						$keyset: { [EntityMetaKey.Selector]: $keyset },
						timestampMs,
						source,
						active: keyset.active,
						...(keyset.input_fee_ppk != null && { inputFeePpk: keyset.input_fee_ppk }),
						listedByKeysetsEndpoint: true,
					}
				},
			},
		})({
			$keyset: (snapshot) => snapshot.$keyset,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			active: (snapshot) => snapshot.active,
			inputFeePpk: (snapshot) => snapshot.inputFeePpk,
			listedByKeysetsEndpoint: (snapshot) => snapshot.listedByKeysetsEndpoint,
		}),

		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuMint,
			resolve: {
				[CashuMintSelector.MintUrl]: async ({ mintUrl }, context) => {
				const { getMintKeysets } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
				return (await getMintKeysets({
					mintUrl: mintUrl,
				})).keysets
					.slice(0, resolverContextRowLimit(context))
					.map((keyset) => ({
						[EntityMetaKey.Selector]: {
							$mint: { mintUrl },
							keysetId: keyset.id,
						},
						unit: keyset.unit,
					}))
				},
			},
		})({
			$$keysets: (snapshot) => snapshot,
		}),
	],
}
