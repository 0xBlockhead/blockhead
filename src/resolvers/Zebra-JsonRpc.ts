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
import { UtxoInputSelector } from '$/schema/UtxoInput.ts'
import { UtxoOutputSelector } from '$/schema/UtxoOutput.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const assertZcashMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== bitcoinNetworkBySlug.zcash.caip2.namespace
				|| network.caip2.reference !== bitcoinNetworkBySlug.zcash.caip2.reference
			)
		:
			network.slug !== networkBySlug.zcash.slug
	) {
		throw new Error('Zebra_JsonRpc: unsupported Zcash network')
	}
}

const valueSatsFromZec = (valueZec: number) => BigInt(Math.round(valueZec * 100_000_000))

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertZcashMainnet($network)
	const { getRawTransaction } = await import('$/sources/Zebra/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: bitcoinNetworkBySlug.zcash.zebraRpcUrl,
		txId: txId,
	})
}

export default {
	source: Source.Zebra_JsonRpc,

	resolvers: [
		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
					assertZcashMainnet($network)
					const {
						getBlock,
					} = await import('$/sources/Zebra/JsonRpc/queries.ts')
					const block = await getBlock({
						rpcUrl: bitcoinNetworkBySlug.zcash.zebraRpcUrl,
						blockHash: hash,
					})
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

		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => {
					const transaction = await getTransaction(entitySelector)
					return {
						version: transaction.version,
						lockTime: transaction.locktime,
						sizeBytes: transaction.size,
						virtualSizeBytes: transaction.vsize,
						weightUnits: transaction.weight,
						isCoinbase: transaction.vin.some((input) => input.coinbase != null),
						$$inputs: transaction.vin.map((input, indexInTransaction) => (
							{
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
							}
						)),
						$$outputs: transaction.vout.map((output, indexInTransaction) => (
							{
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
							}
						)),
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
				$$inputs: (snapshot) => snapshot.$$inputs,
				$$outputs: (snapshot) => snapshot.$$outputs,
			}),

		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoInput,
			resolve: {
				[UtxoInputSelector.TransactionIndexInTransaction]: async ({ $transaction, indexInTransaction }) => {
					const input = (await getTransaction($transaction)).vin[indexInTransaction]
					return {
						[EntityMetaKey.Selector]: {
							$transaction: $transaction,
							indexInTransaction: indexInTransaction,
						},
						...(input.txid != null && input.vout != null && {
							$spentOutput: {
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: $transaction.$network,
										txId: input.txid,
									},
									indexInTransaction: input.vout,
								},
							},
						}),
						...(input.coinbase != null && {
							coinbaseScript: input.coinbase,
						}),
						...(input.scriptSig != null && {
							scriptSigAsm: input.scriptSig.asm,
						}),
						sequence: input.sequence,
						...(input.txinwitness != null && {
							witness: input.txinwitness,
						}),
					}
				}
			},
		})({
				$spentOutput: (snapshot) => snapshot.$spentOutput,
				coinbaseScript: (snapshot) => snapshot.coinbaseScript,
				scriptSigAsm: (snapshot) => snapshot.scriptSigAsm,
				sequence: (snapshot) => snapshot.sequence,
				witness: (snapshot) => snapshot.witness ?? [],
			}),

		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				[UtxoOutputSelector.TransactionIndexInTransaction]: async ({ $transaction, indexInTransaction }) => {
					const output = (await getTransaction($transaction)).vout[indexInTransaction]
					return {
						[EntityMetaKey.Selector]: {
							$transaction: $transaction,
							indexInTransaction: indexInTransaction,
						},
						valueSats: valueSatsFromZec(output.value),
						scriptPubKeyAsm: output.scriptPubKey.asm,
						scriptPubKeyHex: output.scriptPubKey.hex,
						scriptPubKeyType: output.scriptPubKey.type,
						...(output.scriptPubKey.address != null && {
							$address: {
								[EntityMetaKey.Selector]: {
									$network: $transaction.$network,
									address: output.scriptPubKey.address,
								},
							},
						}),
					}
				}
			},
		})({
				valueSats: (snapshot) => snapshot.valueSats,
				scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
				scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
				scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
				$address: (snapshot) => snapshot.$address,
			}),
	],
}
