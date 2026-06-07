import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	bitcoinMainnetCaip2,
	bitcoinMainnetEsploraRestBaseUrl,
} from '$/constants/BitcoinNetwork.ts'
import {
	liquidBitcoinAssetId,
	liquidMainnetEsploraRestBaseUrl,
	liquidNetworkId,
} from '$/constants/ElementsNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { EsploraAsset } from '$/sources/Esplora/Rest/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const esploraRestBaseUrlForNetwork = (network: NetworkId) => {
	if (
		'caip2' in network
		&& network.caip2.namespace === bitcoinMainnetCaip2.namespace
		&& network.caip2.reference === bitcoinMainnetCaip2.reference
	)
		return bitcoinMainnetEsploraRestBaseUrl

	if ('networkSlug' in network && network.networkSlug === liquidNetworkId.networkSlug)
		return liquidMainnetEsploraRestBaseUrl

	throw new Error('Esplora_Rest: unsupported network')
}

const elementsAssetFieldsFromWire = (
	asset: EsploraAsset,
) => ({
	...(asset.name != null && { name: asset.name }),
	...(asset.ticker != null && { ticker: asset.ticker }),
	...(asset.precision != null && { precision: asset.precision }),
	...(asset.entity?.domain != null && { entityDomain: asset.entity.domain }),
	...(asset.contract != null && { contractJson: JSON.stringify(asset.contract) }),
	...(asset.chain_stats.issued_amount != null && {
		issuedAmount: BigInt(asset.chain_stats.issued_amount),
	}),
	...(asset.chain_stats.burned_amount != null && {
		burnedAmount: BigInt(asset.chain_stats.burned_amount),
	}),
	...(asset.chain_stats.has_blinded_issuances != null && {
		hasBlindedIssuances: asset.chain_stats.has_blinded_issuances,
	}),
	...(asset.chain_stats.reissuance_tokens != null && {
		reissuanceTokenCount: asset.chain_stats.reissuance_tokens,
	}),
})

const elementsAssetRowFromWire = (
	$network: typeof liquidNetworkId,
	asset: EsploraAsset,
) => ({
	[EntityMetaKey.Id]: {
		$network,
		assetId: asset.asset_id,
	},
	...elementsAssetFieldsFromWire(asset),
})

export default {
	source: Source.Esplora_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const restBaseUrl = esploraRestBaseUrlForNetwork(entityId.$network)
				const {
					getBlock,
					getBlockHashByHeight,
				} = await import('$/sources/Esplora/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl,
					blockHash: entityId.hash ?? await getBlockHashByHeight({
						restBaseUrl,
						height: entityId.height,
					}),
				})
				return {
					hash: block.id,
					...(block.previousblockhash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(block.height - 1),
								hash: block.previousblockhash,
							},
						},
					}),
					timestampMs: block.timestamp * 1000,
					merkleRoot: block.merkle_root,
					nonce: block.nonce,
					difficulty: block.difficulty,
					sizeBytes: block.size,
					weightUnits: block.weight,
					transactionCount: block.tx_count,
				}
			},
			fields: {
			hash: (snapshot) => snapshot.hash,
			$parent: (snapshot) => snapshot.$parent,
			timestampMs: (snapshot) => snapshot.timestampMs,
			merkleRoot: (snapshot) => snapshot.merkleRoot,
			nonce: (snapshot) => snapshot.nonce,
			difficulty: (snapshot) => snapshot.difficulty,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			weightUnits: (snapshot) => snapshot.weightUnits,
			transactionCount: (snapshot) => snapshot.transactionCount,
		}
		}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const restBaseUrl = esploraRestBaseUrlForNetwork(entityId.$network)
				const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
				const transaction = await getTransaction({
					restBaseUrl,
					txId: entityId.txId,
				})
				return {
					...(transaction.status.block_height != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(transaction.status.block_height),
								...(transaction.status.block_hash != null && {
									hash: transaction.status.block_hash,
								}),
							},
						},
					}),
					version: transaction.version,
					lockTime: transaction.locktime,
					sizeBytes: transaction.size,
					weightUnits: transaction.weight,
					virtualSizeBytes: Math.ceil(transaction.weight / 4),
					...(transaction.fee != null && {
						feeSats: BigInt(transaction.fee),
					}),
					isCoinbase: transaction.vin.some((input) => input.is_coinbase),
				}
			},
			fields: {
			$block: (snapshot) => snapshot.$block,
			version: (snapshot) => snapshot.version,
			lockTime: (snapshot) => snapshot.lockTime,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			weightUnits: (snapshot) => snapshot.weightUnits,
			virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
			feeSats: (snapshot) => snapshot.feeSats,
			isCoinbase: (snapshot) => snapshot.isCoinbase,
		}
		}),

		defineResolver({
			entityType: EntityType.ElementsAsset,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				if (
					!('networkSlug' in entityId.$network)
					|| entityId.$network.networkSlug !== liquidNetworkId.networkSlug
				)
					throw new Error('Esplora_Rest: unsupported Elements network')

				const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
				const asset = await getAsset({
					restBaseUrl: liquidMainnetEsploraRestBaseUrl,
					assetId: entityId.assetId,
				})
				if (asset.asset_id !== entityId.assetId)
					throw new Error(`Esplora_Rest: asset id mismatch for ${entityId.assetId}`)

				return elementsAssetFieldsFromWire(asset)
			},
			fields: {
			name: (snapshot) => snapshot.name,
			ticker: (snapshot) => snapshot.ticker,
			precision: (snapshot) => snapshot.precision,
			entityDomain: (snapshot) => snapshot.entityDomain,
			contractJson: (snapshot) => snapshot.contractJson,
			issuedAmount: (snapshot) => snapshot.issuedAmount,
			burnedAmount: (snapshot) => snapshot.burnedAmount,
			hasBlindedIssuances: (snapshot) => snapshot.hasBlindedIssuances,
			reissuanceTokenCount: (snapshot) => snapshot.reissuanceTokenCount,
		}
		}),

		defineResolver({
			entityType: EntityType.ElementsNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				if (
					!('networkSlug' in entityId)
					|| entityId.networkSlug !== liquidNetworkId.networkSlug
				)
					throw new Error('Esplora_Rest: unsupported Elements network')

				const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
				const asset = await getAsset({
					restBaseUrl: liquidMainnetEsploraRestBaseUrl,
					assetId: liquidBitcoinAssetId,
				})

					return elementsAssetRowFromWire(liquidNetworkId, asset)
			},
			fields: {
			$nativeAsset: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.ElementsNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				if (
					!('networkSlug' in entityId)
					|| entityId.networkSlug !== liquidNetworkId.networkSlug
				)
					throw new Error('Esplora_Rest: unsupported Elements network')

				const { listRegistryAssets } = await import('$/sources/Esplora/Rest/queries.ts')
				return (await listRegistryAssets({
					restBaseUrl: liquidMainnetEsploraRestBaseUrl,
				}))
					.slice(0, resolverContextRowLimit(context))
						.map((asset) => elementsAssetRowFromWire(liquidNetworkId, asset))
			},
			fields: {
			$$assets: (snapshot) => snapshot,
		}
		}),
	],
}
