import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { EsploraAsset } from '$/sources/Esplora/Rest/types.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { ElementsAssetSelector } from '$/schema/ElementsAsset.ts'
import { ElementsAsset_TimestampSelector } from '$/schema/ElementsAsset_Timestamp.ts'
import { ElementsNetworkSelector } from '$/schema/ElementsNetwork.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const esploraRestBaseUrls = async () => (
	(await import('$/sources/Esplora/Rest/queries.ts')).esploraRestBaseUrlByNetworkKey
)

const esploraRestBaseUrlForNetwork = async (network: NetworkId): Promise<string | undefined> => (
	(await esploraRestBaseUrls())[
		'caip2' in network ?
			`${network.caip2.namespace}:${network.caip2.reference}`
		:
			network.slug
	]
)

const requireEsploraRestBaseUrlForNetwork = async (network: NetworkId) => {
	const restBaseUrl = await esploraRestBaseUrlForNetwork(network)
	if (restBaseUrl == null)
		throw new Error('Esplora_Rest: unsupported network')

	return restBaseUrl
}

const liquidEsploraRestBaseUrl = async () => (
	(await esploraRestBaseUrls()).liquid
)

const elementsAssetFieldsFromWire = (
	asset: EsploraAsset
) => ({
	...(asset.name != null && { name: asset.name }),
	...(asset.ticker != null && { ticker: asset.ticker }),
	...(asset.precision != null && { precision: asset.precision }),
	...(asset.entity?.domain != null && { entityDomain: asset.entity.domain }),
	...(asset.contract != null && { contractJson: JSON.stringify(asset.contract) }),
	...(asset.chain_stats.has_blinded_issuances != null && {
		hasBlindedIssuances: asset.chain_stats.has_blinded_issuances,
	}),
})

const elementsAssetTimestampFieldsFromWire = (
	asset: EsploraAsset
) => ({
	...(asset.chain_stats.issued_amount != null && {
		issuedAmount: BigInt(asset.chain_stats.issued_amount),
	}),
	...(asset.chain_stats.burned_amount != null && {
		burnedAmount: BigInt(asset.chain_stats.burned_amount),
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
					const {
						getBlock,
					} = await import('$/sources/Esplora/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await requireEsploraRestBaseUrlForNetwork($network),
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
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				timestampMs: (snapshot) => snapshot.timestampMs,
				merkleRoot: (snapshot) => snapshot.merkleRoot,
				nonce: (snapshot) => snapshot.nonce,
				difficulty: (snapshot) => snapshot.difficulty,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				transactionCount: (snapshot) => snapshot.transactionCount,
			}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async ({ $network, txId }) => {
					const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
					const transaction = await getTransaction({
						restBaseUrl: await requireEsploraRestBaseUrlForNetwork($network),
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
				$block: (snapshot) => snapshot.$block,
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				feeSats: (snapshot) => snapshot.feeSats,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
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
						restBaseUrl: await liquidEsploraRestBaseUrl(),
						assetId: assetId,
					})
					if (asset.asset_id !== assetId)
						throw new Error(`Esplora_Rest: asset id mismatch for ${assetId}`)

					return elementsAssetFieldsFromWire(asset)
				}
			},
		})({
				name: (snapshot) => snapshot.name,
				ticker: (snapshot) => snapshot.ticker,
				precision: (snapshot) => snapshot.precision,
				entityDomain: (snapshot) => snapshot.entityDomain,
				contractJson: (snapshot) => snapshot.contractJson,
				hasBlindedIssuances: (snapshot) => snapshot.hasBlindedIssuances,
			}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.ElementsAsset,
			resolve: {
				[ElementsAssetSelector.ElementsNetworkAssetId]: async (entitySelector) => [
					{
						[EntityMetaKey.Selector]: {
							$asset: entitySelector,
							timestampMs: Date.now(),
							source: Source.Esplora_Rest,
						},
					},
				],
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.Esplora_Rest, {
			entityType: EntityType.ElementsAsset_Timestamp,
			resolve: {
				[ElementsAsset_TimestampSelector.AssetTimestampMsSource]: async ({ $asset }) => {
					if (
						!('$network' in $asset)
						|| !('$network' in $asset.$network)
						|| !('slug' in $asset.$network.$network)
						|| $asset.$network.$network.slug !== 'liquid'
					)
						throw new Error('Esplora_Rest: unsupported Elements network')

					const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
					const asset = await getAsset({
						restBaseUrl: await liquidEsploraRestBaseUrl(),
						assetId: $asset.assetId,
					})
					if (asset.asset_id !== $asset.assetId)
						throw new Error(`Esplora_Rest: asset id mismatch for ${$asset.assetId}`)

					return elementsAssetTimestampFieldsFromWire(asset)
				},
			},
		})({
				issuedAmount: (snapshot) => snapshot.issuedAmount,
				burnedAmount: (snapshot) => snapshot.burnedAmount,
				reissuanceTokenCount: (snapshot) => snapshot.reissuanceTokenCount,
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
						restBaseUrl: await liquidEsploraRestBaseUrl(),
						assetId: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
					})

					return elementsAssetRowFromWire(asset)
				}
			},
		})({
				$nativeAsset: (snapshot) => ({
					[EntityMetaKey.Selector]: snapshot[EntityMetaKey.Selector],
				}),
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
						restBaseUrl: await liquidEsploraRestBaseUrl(),
					}))
						.slice(0, resolverContextRowLimit(context))
						.map((asset) => elementsAssetRowFromWire(asset))
				}
			},
		})({
				$$assets: (snapshot) => snapshot.map((asset) => ({
					[EntityMetaKey.Selector]: asset[EntityMetaKey.Selector],
				})),
			}),
	],
}
