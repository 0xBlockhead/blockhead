import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.CashuMint_Rest,

	resolvers: [
		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuMint,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getMintInfo } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
				const info = await getMintInfo({ mintUrl: entityId.mintUrl })
				return {
					...(info.name != null && { name: info.name }),
					...(info.pubkey != null && { pubkey: info.pubkey }),
					...(info.version != null && { version: info.version }),
					...(info.description != null && { description: info.description }),
					...(info.motd != null && { motd: info.motd }),
					...(info.icon_url != null && { iconUrl: info.icon_url }),
					...(info.tos_url != null && { tosUrl: info.tos_url }),
					...(info.time != null && { timeMs: info.time * 1000 }),
				}
			}
			}
		})({
				fields: {
			name: (snapshot) => snapshot.name,
			pubkey: (snapshot) => snapshot.pubkey,
			version: (snapshot) => snapshot.version,
			description: (snapshot) => snapshot.description,
			motd: (snapshot) => snapshot.motd,
			iconUrl: (snapshot) => snapshot.iconUrl,
			tosUrl: (snapshot) => snapshot.tosUrl,
			timeMs: (snapshot) => snapshot.timeMs,
		},
			}),

		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuKeyset,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getMintKeysets,
					getMintKeysForKeyset,
				} = await import('$/sources/Cashu/Mint/Rest/queries.ts')
				const keyset = (await getMintKeysets({
					mintUrl: entityId.$mint.mintUrl,
				})).keysets.find((row) => row.id === entityId.keysetId)
				if (keyset == null)
					throw new Error(`CashuMint_Rest: keyset not found for ${entityId.keysetId}`)

				const keys = await getMintKeysForKeyset({
					mintUrl: entityId.$mint.mintUrl,
					keysetId: entityId.keysetId,
				})
				const keysByAmount = keys.keysets.find((row) => row.id === entityId.keysetId)?.keys

				return {
					unit: keyset.unit,
					active: keyset.active,
					...(keyset.input_fee_ppk != null && { inputFeePpk: keyset.input_fee_ppk }),
					...(keysByAmount != null && {
						keysByAmountJson: JSON.stringify(keysByAmount),
					}),
				}
			}
			}
		})({
				fields: {
			unit: (snapshot) => snapshot.unit,
			active: (snapshot) => snapshot.active,
			inputFeePpk: (snapshot) => snapshot.inputFeePpk,
			keysByAmountJson: (snapshot) => snapshot.keysByAmountJson,
		},
			}),

		defineResolver(Source.CashuMint_Rest, {
			entityType: EntityType.CashuMint,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getMintKeysets } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
				return (await getMintKeysets({
					mintUrl: entityId.mintUrl,
				})).keysets
					.slice(0, resolverContextRowLimit(context))
					.map((keyset) => ({
						[EntityMetaKey.Id]: {
							$mint: entityId,
							keysetId: keyset.id,
						},
						unit: keyset.unit,
						active: keyset.active,
						...(keyset.input_fee_ppk != null && { inputFeePpk: keyset.input_fee_ppk }),
					}))
			}
			}
		})({
				fields: {
			$$keysets: (snapshot) => snapshot,
		},
			}),
	],
}
