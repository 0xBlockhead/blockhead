import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'

const litecoinMainnetBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.LitecoinCore_JsonRpc
		&& binding.target.kind === SourceTargetKind.Caip2Network
		&& binding.target.key === `${bitcoinNetworkBySlug.litecoin.caip2.namespace}:${bitcoinNetworkBySlug.litecoin.caip2.reference}`
	))

if (litecoinMainnetBindings.length !== 1)
	throw new Error('LitecoinCore_JsonRpc: canonical Litecoin mainnet source binding is missing or ambiguous')

const litecoinMainnetRpcUrl = firstHttpUrlForBinding(litecoinMainnetBindings[0])

const assertLitecoinMainnet = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== bitcoinNetworkBySlug.litecoin.caip2.namespace
				|| network.caip2.reference !== bitcoinNetworkBySlug.litecoin.caip2.reference
			)
		:
			network.slug !== networkBySlug.litecoin.slug
	) {
		throw new Error('LitecoinCore_JsonRpc: unsupported Litecoin network')
	}
}

export default {
	source: Source.LitecoinCore_JsonRpc,

	resolvers: [
		defineResolver(Source.LitecoinCore_JsonRpc, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: {
					resolve: async ({ $network, hash }) => {
						assertLitecoinMainnet($network)
						const {
							getBlock,
						} = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')
						const block = await getBlock({
							rpcUrl: litecoinMainnetRpcUrl,
							blockHash: hash,
						})
						if (typeof block === 'string')
							throw new Error('LitecoinCore_JsonRpc: expected verbose block')
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

		defineResolver(Source.LitecoinCore_JsonRpc, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: {
					resolve: async ({ $network, txId }) => {
						assertLitecoinMainnet($network)
						const { getRawTransaction } = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')
						const transaction = await getRawTransaction({
							rpcUrl: litecoinMainnetRpcUrl,
							txId: txId,
						})
						if (typeof transaction === 'string')
							throw new Error('LitecoinCore_JsonRpc: expected verbose transaction')
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
}
