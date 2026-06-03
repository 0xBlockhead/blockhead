import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import {
	litecoinCoreDefaultLocalRpcUrl,
	litecoinMainnetCaip2,
} from '$/constants/BitcoinNetwork.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertLitecoinMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== litecoinMainnetCaip2.namespace
		|| network.caip2.reference !== litecoinMainnetCaip2.reference
	) {
		throw new Error('LitecoinCore_JsonRpc: unsupported Litecoin network')
	}
}

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
					rpcUrl: litecoinCoreDefaultLocalRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: litecoinCoreDefaultLocalRpcUrl,
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
					nonce: block.nonce,
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
					rpcUrl: litecoinCoreDefaultLocalRpcUrl,
					txId: entityId.txId,
				})
				if (typeof transaction === 'string') {
					throw new Error('LitecoinCore_JsonRpc: expected verbose transaction')
				}
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
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
					rpcUrl: litecoinCoreDefaultLocalRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: litecoinCoreDefaultLocalRpcUrl,
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
						{
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								txId: transaction.txid,
							},
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							virtualSizeBytes: transaction.vsize,
							weightUnits: transaction.weight,
							isCoinbase: transaction.vin.some((input) => input.coinbase != null),
						}
				))
			},
		}),
	],
}
