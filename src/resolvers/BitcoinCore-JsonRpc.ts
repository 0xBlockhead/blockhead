import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { BitcoinCoreTransaction } from '$/sources/BitcoinCore/JsonRpc/types.ts'

const bitcoinCoreRpcUrl = 'http://127.0.0.1:8332'

const assertBitcoinMainnet = (network: { namespace: string; reference: string }) => {
	if (
		network.namespace !== NetworkNamespace.Bip122
		|| network.reference !== '000000000019d6689c085ae165831e93'
	) {
		throw new Error(`BitcoinCore_JsonRpc: unsupported UTXO network ${network.namespace}:${network.reference}`)
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
	source: Source.BitcoinCore_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: bitcoinCoreRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: bitcoinCoreRpcUrl,
						height: entityId.height,
					}),
				})
				if (typeof block === 'string') {
					throw new Error('BitcoinCore_JsonRpc: expected verbose block')
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
				assertBitcoinMainnet(entityId.$network)
				const { getRawTransaction } = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
				const transaction = await getRawTransaction({
					rpcUrl: bitcoinCoreRpcUrl,
					txId: entityId.txId,
				})
				if (typeof transaction === 'string') {
					throw new Error('BitcoinCore_JsonRpc: expected verbose transaction')
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
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: bitcoinCoreRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: bitcoinCoreRpcUrl,
						height: entityId.height,
					}),
				})
				if (typeof block === 'string') {
					throw new Error('BitcoinCore_JsonRpc: expected verbose block')
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
