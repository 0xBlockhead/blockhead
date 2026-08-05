import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertBitcoinCashMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug['bitcoin-cash'].caip2.namespace
				|| network.caip2.reference !== networkBySlug['bitcoin-cash'].caip2.reference
			)
		:
			network.slug !== networkBySlug['bitcoin-cash'].slug
	) {
		throw new Error('BitcoinCashNode_JsonRpc: unsupported network')
	}
}

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertBitcoinCashMainnet($network)
	const { getRawTransaction } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	return getRawTransaction({
		txId,
	})
}

const getOutput = async ({ $transaction, indexInTransaction }: {
	$transaction: {
		$network: NetworkId
		txId: string
	}
	indexInTransaction: number
}) => {
	const output = (await getTransaction($transaction)).vout.at(indexInTransaction)
	if (output == null) throw new Error(`BitcoinCashNode_JsonRpc: output not found for ${$transaction.txId}:${String(indexInTransaction)}`)
	return output
}

export default {
	source: Source.BitcoinCashNode_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								txId: transaction.txid,
							},
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							virtualSizeBytes: transaction.vsize,
							weightUnits: transaction.weight,
							isCoinbase: transaction.vin.some((input) => input.coinbase != null),
							$$inputs: transaction.vin.map((_input, indexInTransaction) => (
								{
									[EntityMetaKey.Selector]: {
										$transaction: entitySelector,
										indexInTransaction,
									},
								}
							)),
							$$outputs: transaction.vout.map((_output, indexInTransaction) => (
								{
									[EntityMetaKey.Selector]: {
										$transaction: entitySelector,
										indexInTransaction,
									},
								}
							)),
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
				$$inputs: (snapshot) => snapshot.$$inputs,
				$$outputs: (snapshot) => snapshot.$$outputs,
			}),

		defineResolver({
			entityType: EntityType.UtxoInput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
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
					},
				}
			},
		})({
				$spentOutput: (snapshot) => snapshot.$spentOutput,
				coinbaseScript: (snapshot) => snapshot.coinbaseScript,
				scriptSigAsm: (snapshot) => snapshot.scriptSigAsm,
				sequence: (snapshot) => snapshot.sequence,
				witness: (snapshot) => snapshot.witness ?? [],
			}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const output = await getOutput(entitySelector)
						return {
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector.$transaction,
								indexInTransaction: entitySelector.indexInTransaction,
							},
							valueSats: BigInt(Math.round(output.value * 100_000_000)),
							scriptPubKeyAsm: output.scriptPubKey.asm,
							scriptPubKeyHex: output.scriptPubKey.hex,
							scriptPubKeyType: output.scriptPubKey.type,
							...(output.scriptPubKey.address != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$transaction.$network,
										address: output.scriptPubKey.address,
									},
								},
							}),
							...(output.tokenData?.amount != null && {
								$bitcoinCashCashTokenFungibleAmount: {
									[EntityMetaKey.Selector]: {
										$output: entitySelector,
									},
								},
							}),
							...(output.tokenData?.nft != null && {
								$bitcoinCashCashTokenNft: {
									[EntityMetaKey.Selector]: {
										$output: entitySelector,
									},
								},
							}),
						}
					},
				}
			},
		})({
				valueSats: (snapshot) => snapshot.valueSats,
				scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
				scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
				scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
				$address: (snapshot) => snapshot.$address,
				$bitcoinCashCashTokenFungibleAmount: (snapshot) => snapshot.$bitcoinCashCashTokenFungibleAmount,
				$bitcoinCashCashTokenNft: (snapshot) => snapshot.$bitcoinCashCashTokenNft,
			}),

		defineResolver({
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.amount == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken fungible amount')
						return {
							$category: {
								[EntityMetaKey.Selector]: {
									$network: $output.$transaction.$network,
									categoryId: output.tokenData.category,
								},
							},
							amount: BigInt(output.tokenData.amount),
						}
					},
				}
			},
		})({
				$category: (snapshot) => snapshot.$category,
				amount: (snapshot) => snapshot.amount,
			}),

		defineResolver({
			entityType: EntityType.BitcoinCashCashTokenNft,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT')
						return {
							$category: {
								[EntityMetaKey.Selector]: {
									$network: $output.$transaction.$network,
									categoryId: output.tokenData.category,
								},
							},
							$commitment: {
								[EntityMetaKey.Selector]: {
									$output: $output,
								},
							},
							capability: output.tokenData.nft.capability,
						}
					},
				}
			},
		})({
				$category: (snapshot) => snapshot.$category,
				$commitment: (snapshot) => snapshot.$commitment,
				capability: (snapshot) => snapshot.capability,
			}),

		defineResolver({
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT commitment')
						return {
							commitmentHex: output.tokenData.nft.commitment,
						}
					},
				}
			},
		})({
				commitmentHex: (snapshot) => snapshot.commitmentHex,
			}),
	],
}
