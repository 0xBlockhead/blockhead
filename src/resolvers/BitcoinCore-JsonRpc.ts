import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const assertBitcoinMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== networkBySlug.bitcoin.caip2.namespace
		|| network.caip2.reference !== networkBySlug.bitcoin.caip2.reference
	) {
		throw new Error('BitcoinCore_JsonRpc: unsupported Bitcoin network')
	}
}

export default {
	source: Source.BitcoinCore_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, hash }) => {
						assertBitcoinMainnet($network)
						const {
							getBlock,
						} = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
						const block = await getBlock({
							blockHash: hash,
						})
						if (typeof block === 'string')
							throw new Error('BitcoinCore_JsonRpc: expected verbose block')
						return {
							hash: block.hash,
							...(block.previousblockhash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										height: BigInt(block.height - 1),
										hash: block.previousblockhash,
									},
								},
							}),
							timestampMs: block.time * 1000,
							merkleRoot: block.merkleroot,
							nonce: block.nonce,
							difficulty: block.difficulty,
							...(block.size != null && {
								sizeBytes: block.size,
							}),
							...(block.weight != null && {
								weightUnits: block.weight,
							}),
							transactionCount: block.nTx,
							$$transactions: block.tx.map((transaction) => (
								typeof transaction === 'string' ?
									{
										[EntityMetaKey.Selector]: {
											$network,
											txId: transaction,
										},
									}
								:
									{
										[EntityMetaKey.Selector]: {
											$network,
											txId: transaction.txid,
										},
									}
							)),
						}
					},
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
				$$transactions: (snapshot) => snapshot.$$transactions,
			}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async ({ $network, txId }) => {
						assertBitcoinMainnet($network)
						const { getRawTransaction } = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
						const transaction = await getRawTransaction({
							txId: txId,
						})
						if (typeof transaction === 'string')
							throw new Error('BitcoinCore_JsonRpc: expected verbose transaction')
						return {
							[EntityMetaKey.Selector]: {
								$network: $network,
								txId: transaction.txid,
							},
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							virtualSizeBytes: transaction.vsize,
							weightUnits: transaction.weight,
							isCoinbase: transaction.vin.some((input) => input.coinbase != null),
						}
					},
				}
			},
		})({
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.BitcoinCore_JsonRpc>
