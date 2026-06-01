import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import {
	bitcoinMainnetCaip2,
	bitcoinMainnetEsploraRestBaseUrl,
} from '$/constants/BitcoinNetwork.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertBitcoinMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== bitcoinMainnetCaip2.namespace
		|| network.caip2.reference !== bitcoinMainnetCaip2.reference
	) {
		throw new Error('Esplora_Rest: unsupported UTXO network')
	}
}

export default {
	source: Source.Esplora_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHashByHeight,
				} = await import('$/sources/Esplora/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: bitcoinMainnetEsploraRestBaseUrl,
					blockHash: entityId.hash ?? await getBlockHashByHeight({
						restBaseUrl: bitcoinMainnetEsploraRestBaseUrl,
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
					nonce: BigInt(block.nonce),
					difficulty: block.difficulty,
					sizeBytes: block.size,
					weightUnits: block.weight,
					transactionCount: block.tx_count,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				assertBitcoinMainnet(entityId.$network)
				const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
				const transaction = await getTransaction({
					restBaseUrl: bitcoinMainnetEsploraRestBaseUrl,
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
		}),
	],

	entityFieldResolvers: [],
}
