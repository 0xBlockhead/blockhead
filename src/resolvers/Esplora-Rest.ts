import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { EsploraAsset } from '$/sources/Esplora/Rest/types.ts'
import {
	liquidMainnetEsploraRestEndpoints,
} from '$/sources/Esplora/index.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { ElementsAssetSelector } from '$/schema/ElementsAsset.ts'
import { ElementsNetworkSelector } from '$/schema/ElementsNetwork.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const esploraRestBaseUrlForNetwork = (network: NetworkId) => {
	if (
		'caip2' in network
		&& network.caip2.namespace === bitcoinNetworkBySlug.bitcoin.caip2.namespace
		&& network.caip2.reference === bitcoinNetworkBySlug.bitcoin.caip2.reference
	)
		return bitcoinNetworkBySlug.bitcoin.esploraRestBaseUrl

	if ('slug' in network && network.slug === 'liquid')
		return liquidMainnetEsploraRestEndpoints[0].restBaseUrl

	throw new Error('Esplora_Rest: unsupported network')
}

const elementsAssetFieldsFromWire = (
	asset: EsploraAsset
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
	asset: EsploraAsset
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			$network: {
				slug: 'liquid',
			},
		},
		assetId: asset.asset_id,
	},
	...elementsAssetFieldsFromWire(asset),
})

export default {
	source: Source.Esplora_Rest,

	resolvers: [
		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
					const restBaseUrl = esploraRestBaseUrlForNetwork($network)
					const {
						getBlock,
						getBlockHashByHeight,
					} = await import('$/sources/Esplora/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl,
						blockHash: hash,
					})
					return {
						hash: block.id,
						...(block.previousblockhash != null && {
							$parent: {
								[EntityMetaKey.Selector]: {
									$network: $network,
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
				}
			},
		})({
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
			},
		}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async ({ $network, txId }) => {
					const restBaseUrl = esploraRestBaseUrlForNetwork($network)
					const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
					const transaction = await getTransaction({
						restBaseUrl,
						txId: txId,
					})
					return {
						...(transaction.status.block_height != null && transaction.status.block_hash != null && {
							$block: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									height: BigInt(transaction.status.block_height),
									hash: transaction.status.block_hash,
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
				}
			},
		})({
			fields: {
				$block: (snapshot) => snapshot.$block,
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				feeSats: (snapshot) => snapshot.feeSats,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
			},
		}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.ElementsAsset,
			resolve: {
				[ElementsAssetSelector.ElementsNetworkAssetId]: async ({ $network, assetId }) => {
					if (
						!('slug' in $network)
						|| $network.slug !== 'liquid'
					)
					throw new Error('Esplora_Rest: unsupported Elements network')

					const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
					const asset = await getAsset({
						restBaseUrl: liquidMainnetEsploraRestEndpoints[0].restBaseUrl,
						assetId: assetId,
					})
					if (asset.asset_id !== assetId)
						throw new Error(`Esplora_Rest: asset id mismatch for ${assetId}`)

					return elementsAssetFieldsFromWire(asset)
				}
			},
		})({
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
			},
		}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.ElementsNetwork,
			resolve: {
				[ElementsNetworkSelector.Network]: async ({ $network }) => {
					if (
						!('slug' in $network)
						|| $network.slug !== 'liquid'
					)
						throw new Error('Esplora_Rest: unsupported Elements network')

					const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
					const asset = await getAsset({
						restBaseUrl: liquidMainnetEsploraRestEndpoints[0].restBaseUrl,
						assetId: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
					})

					return elementsAssetRowFromWire(asset)
				}
			},
		})({
			fields: {
				$nativeAsset: (snapshot) => ({
					[EntityMetaKey.Selector]: snapshot[EntityMetaKey.Selector],
				}),
			},
		}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.ElementsNetwork,
			resolve: {
				[ElementsNetworkSelector.Network]: async ({ $network }, context) => {
					if (
						!('slug' in $network)
						|| $network.slug !== 'liquid'
					)
					throw new Error('Esplora_Rest: unsupported Elements network')

					const { listRegistryAssets } = await import('$/sources/Esplora/Rest/queries.ts')
					return (await listRegistryAssets({
						restBaseUrl: liquidMainnetEsploraRestEndpoints[0].restBaseUrl,
					}))
						.slice(0, resolverContextRowLimit(context))
						.map((asset) => elementsAssetRowFromWire(asset))
				}
			},
		})({
			fields: {
				$$assets: (snapshot) => snapshot.map((asset) => ({
					[EntityMetaKey.Selector]: asset[EntityMetaKey.Selector],
				})),
			},
		}),
	],
}
