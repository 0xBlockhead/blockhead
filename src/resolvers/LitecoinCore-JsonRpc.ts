import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { BitcoinCoreTransaction } from '$/sources/BitcoinCore/JsonRpc/types.ts'

const litecoinCoreRpcUrl = 'http://127.0.0.1:9332'

const assertLitecoinMainnet = (network: { namespace: string; reference: string }) => {
	if (
		network.namespace !== NetworkNamespace.Litecoin
		|| network.reference !== '12a765e31ffd4059bada1e25190f6e98'
	) {
		throw new Error(`LitecoinCore_JsonRpc: unsupported UTXO network ${network.namespace}:${network.reference}`)
	}
}

const transactionEntityFromCoreTransaction = (
	network: { namespace: string; reference: string },
	transaction: BitcoinCoreTransaction,
) => ({
	[EntityMetaKey.Id]: {
		$network: network,
		txId: transaction.txid,
	},
	version: transaction.version,
	lockTime: transaction.locktime,
	sizeBytes: transaction.size,
	virtualSizeBytes: transaction.vsize,
	weightUnits: transaction.weight,
	isCoinbase: transaction.vin.some((input) => input.coinbase != null),
})

export default {
	source: Source.LitecoinCore_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				assertLitecoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: litecoinCoreRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: litecoinCoreRpcUrl,
						height: entityId.height,
					}),
				})
				if (typeof block === 'string') {
					throw new Error('LitecoinCore_JsonRpc: expected verbose block')
				}
				return {
					hash: block.hash,
					...(block.previousblockhash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(block.height - 1),
								hash: block.previousblockhash,
							},
						},
					}),
					timestampMs: block.time * 1000,
					merkleRoot: block.merkleroot,
					nonce: BigInt(block.nonce),
					difficulty: block.difficulty,
					...(block.size != null && {
						sizeBytes: block.size,
					}),
					...(block.weight != null && {
						weightUnits: block.weight,
					}),
					transactionCount: block.nTx,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				assertLitecoinMainnet(entityId.$network)
				const { getRawTransaction } = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')
				const transaction = await getRawTransaction({
					rpcUrl: litecoinCoreRpcUrl,
					txId: entityId.txId,
				})
				if (typeof transaction === 'string') {
					throw new Error('LitecoinCore_JsonRpc: expected verbose transaction')
				}
				return {
					...transactionEntityFromCoreTransaction(entityId.$network, transaction),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.UtxoBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				assertLitecoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: litecoinCoreRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: litecoinCoreRpcUrl,
						height: entityId.height,
					}),
				})
				if (typeof block === 'string') {
					throw new Error('LitecoinCore_JsonRpc: expected verbose block')
				}
				return block.tx.map((transaction) => (
					typeof transaction === 'string' ?
						{
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								txId: transaction,
							},
						}
					:
						transactionEntityFromCoreTransaction(entityId.$network, transaction)
				))
			},
		}),
	],
}
