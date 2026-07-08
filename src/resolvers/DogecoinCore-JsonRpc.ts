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
import { Source } from '$/sources/Source.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'

const assertDogecoinMainnet = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== bitcoinNetworkBySlug.dogecoin.caip2.namespace
				|| network.caip2.reference !== bitcoinNetworkBySlug.dogecoin.caip2.reference
			)
		:
			network.slug !== networkBySlug.dogecoin.slug
	) {
		throw new Error('DogecoinCore_JsonRpc: unsupported Dogecoin network')
	}
}

export default {
	source: Source.DogecoinCore_JsonRpc,

	resolvers: [
		defineResolver(Source.DogecoinCore_JsonRpc, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
					assertDogecoinMainnet($network)
					const {
						getBlock,
					} = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
					const block = await getBlock({
						rpcUrl: bitcoinNetworkBySlug.dogecoin.dogecoinCoreRpcUrl,
						blockHash: hash,
					})
					if (typeof block === 'string')
						throw new Error('DogecoinCore_JsonRpc: expected verbose block')
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

		defineResolver(Source.DogecoinCore_JsonRpc, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async ({ $network, txId }) => {
					assertDogecoinMainnet($network)
					const { getRawTransaction } = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
					const transaction = await getRawTransaction({
						rpcUrl: bitcoinNetworkBySlug.dogecoin.dogecoinCoreRpcUrl,
						txId: txId,
					})
					if (typeof transaction === 'string')
						throw new Error('DogecoinCore_JsonRpc: expected verbose transaction')
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
