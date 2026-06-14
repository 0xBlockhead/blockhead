import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinMainnetCaip2,
	mempoolSpaceBitcoinMainnetRestBaseUrl,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { UtxoNetworkSelector } from '$/schema/UtxoNetwork.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { UtxoInputSelector } from '$/schema/UtxoInput.ts'
import { UtxoAddressSelector } from '$/schema/UtxoAddress.ts'
import { UtxoOutputSelector } from '$/schema/UtxoOutput.ts'

const assertBitcoinMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== bitcoinMainnetCaip2.namespace
		|| network.caip2.reference !== bitcoinMainnetCaip2.reference
	) {
		throw new Error('MempoolSpace_Rest: unsupported Bitcoin network')
	}
}

const bitcoinMainnet = {
	caip2: bitcoinMainnetCaip2,
} as const

const getTransaction = async ({ $network, txId }: {
	$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
	txId: string
}) => {
	assertBitcoinMainnet($network)
	const { getTransaction } = await import('$/sources/MempoolSpace/Rest/queries.ts')
	return getTransaction({
		restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
		txId: txId,
	})
}

export default {
	source: Source.MempoolSpace_Rest,

	resolvers: [
		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async (entitySelector) => {
				assertBitcoinMainnet(entitySelector)
				return {
					$network: {
						[EntityMetaKey.Selector]: entitySelector,
					},
				}
			}
			}
		})({
				fields: {
			$network: (network) => network.$network,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
				assertBitcoinMainnet($network)
				const {
					getBlock,
					getBlockHashByHeight,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
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
			}
		})({
				fields: {
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			timestampMs: (block) => block.timestampMs,
			merkleRoot: (block) => block.merkleRoot,
			nonce: (block) => block.nonce,
			difficulty: (block) => block.difficulty,
			sizeBytes: (block) => block.sizeBytes,
			weightUnits: (block) => block.weightUnits,
			transactionCount: (block) => block.transactionCount,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => {
				const transaction = await getTransaction(entitySelector)
				return {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						txId: transaction.txid,
					},
					...(transaction.status.block_height != null && {
						$block: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
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
			}
			}
		})({
				fields: {
			$block: (transaction) => transaction.$block,
			version: (transaction) => transaction.version,
			lockTime: (transaction) => transaction.lockTime,
			sizeBytes: (transaction) => transaction.sizeBytes,
			weightUnits: (transaction) => transaction.weightUnits,
			virtualSizeBytes: (transaction) => transaction.virtualSizeBytes,
			feeSats: (transaction) => transaction.feeSats,
			isCoinbase: (transaction) => transaction.isCoinbase,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoInput,
			resolve: {
				[UtxoInputSelector.UtxoTransactionInputIndex]: async ({ $transaction, inputIndex }) => {
				const input = (await getTransaction($transaction)).vin[inputIndex]
				return {
					[EntityMetaKey.Selector]: {
						$transaction: $transaction,
						inputIndex: inputIndex,
					},
					...(input.txid != null && input.vout != null && {
						$spentOutput: {
							[EntityMetaKey.Selector]: {
								$transaction: {
									$network: $transaction.$network,
									txId: input.txid,
								},
								outputIndex: input.vout,
							},
						},
					}),
					...(input.scriptsig != null && {
						coinbaseScript: input.scriptsig,
					}),
					...(input.scriptsig_asm != null && {
						scriptSigAsm: input.scriptsig_asm,
					}),
					sequence: input.sequence,
					...(input.witness != null && {
						witness: input.witness,
					}),
				}
			}
			}
		})({
				fields: {
			$spentOutput: (input) => input.$spentOutput,
			coinbaseScript: (input) => input.coinbaseScript,
			scriptSigAsm: (input) => input.scriptSigAsm,
			sequence: (input) => input.sequence,
			witness: (input) => input.witness,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoAddress,
			resolve: {
				[UtxoAddressSelector.NetworkAddress]: async ({ $network, address: addressSelector }) => {
				assertBitcoinMainnet($network)
				const { getAddress } = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const address = await getAddress({
					restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
					addressSelector: addressSelector,
				})
				const chainStats = address.chain_stats
				return {
					balanceSats: BigInt(chainStats.funded_txo_sum - chainStats.spent_txo_sum),
					transactionCount: chainStats.tx_count,
					unspentOutputCount: chainStats.funded_txo_count - chainStats.spent_txo_count,
					totalReceivedSats: BigInt(chainStats.funded_txo_sum),
					totalSpentSats: BigInt(chainStats.spent_txo_sum),
				}
			}
			}
		})({
				fields: {
			balanceSats: (address) => address.balanceSats,
			transactionCount: (address) => address.transactionCount,
			unspentOutputCount: (address) => address.unspentOutputCount,
			totalReceivedSats: (address) => address.totalReceivedSats,
			totalSpentSats: (address) => address.totalSpentSats,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				[UtxoOutputSelector.UtxoTransactionOutputIndex]: async ({ $transaction, outputIndex }) => {
				const output = (await getTransaction($transaction)).vout[outputIndex]
				return {
					[EntityMetaKey.Selector]: {
						$transaction: $transaction,
						outputIndex: outputIndex,
					},
					valueSats: BigInt(output.value),
					...(output.scriptpubkey_asm != null && {
						scriptPubKeyAsm: output.scriptpubkey_asm,
					}),
					scriptPubKeyHex: output.scriptpubkey,
					scriptPubKeyType: output.scriptpubkey_type,
					...(output.scriptpubkey_address != null && {
						$address: {
							[EntityMetaKey.Selector]: {
								$network: $transaction.$network,
								address: output.scriptpubkey_address,
							},
						},
					}),
				}
			}
			}
		})({
				fields: {
			valueSats: (output) => output.valueSats,
			scriptPubKeyAsm: (output) => output.scriptPubKeyAsm,
			scriptPubKeyHex: (output) => output.scriptPubKeyHex,
			scriptPubKeyType: (output) => output.scriptPubKeyType,
			$address: (output) => output.$address,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async (entitySelector) => {
				assertBitcoinMainnet(entitySelector)
				return {
					[EntityMetaKey.Selector]: entitySelector,
				}
			}
			}
		})({
				fields: {
			$network: (network) => network,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async (entitySelector) => {
				assertBitcoinMainnet(entitySelector)
				const {
					getBlocks,
					getMempoolStats,
					getRecommendedFees,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const [blocks, mempoolStats, fees] = await Promise.all([
					getBlocks({ restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl }),
					getMempoolStats({ restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl }),
					getRecommendedFees({ restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl }),
				])
				const block = blocks.at(0)
				if (block == null) throw new Error('MempoolSpace_Rest: no blocks returned')
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							timestampMs: Date.now(),
						},
						bestBlockHeight: BigInt(block.height),
						bestBlockHash: block.id,
						mempoolTransactionCount: mempoolStats.count,
						mempoolSizeBytes: BigInt(Math.ceil(mempoolStats.vsize)),
						suggestedTransactionFeePerByteSats: fees.hourFee,
					},
				]
			}
			}
		})({
				fields: {
			$$timestamps: (timestamps) => timestamps,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async (entitySelector, context) => {
				assertBitcoinMainnet(entitySelector)
				const { getBlocks } = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const blocks = await getBlocks({ restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl })
				return blocks.slice(0, resolverContextRowLimit(context)).map((block) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						height: BigInt(block.height),
						hash: block.id,
					},
					hash: block.id,
					timestampMs: block.timestamp * 1000,
					merkleRoot: block.merkle_root,
					nonce: block.nonce,
					difficulty: block.difficulty,
					sizeBytes: block.size,
					weightUnits: block.weight,
					transactionCount: block.tx_count,
				}))
			}
			}
		})({
				fields: {
			$$blocks: (blocks) => blocks,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async (entitySelector, context) => {
				assertBitcoinMainnet(entitySelector)
				const { getMempoolTxids } = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const txids = await getMempoolTxids({ restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl })
				return txids.slice(0, resolverContextRowLimit(context)).map((txId) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						txId,
					},
				}))
			}
			}
		})({
				fields: {
			$$transactions: (transactions) => transactions,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
				assertBitcoinMainnet($network)
				const {
					getBlockHashByHeight,
					getBlockTransactionIds,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				return (
					await getBlockTransactionIds({
						restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
						blockHash: hash,
					})
				).map((txId) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						txId,
					},
				}))
			}
			}
		})({
				fields: {
			$$transactions: (transactions) => transactions,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => (
				(await getTransaction(entitySelector)).vin.map((input, inputIndex) => (
					{
						[EntityMetaKey.Selector]: {
							$transaction: entitySelector,
							inputIndex,
						},
						...(input.txid != null && input.vout != null && {
							$spentOutput: {
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: entitySelector.$network,
										txId: input.txid,
									},
									outputIndex: input.vout,
								},
							},
						}),
						...(input.scriptsig != null && {
							coinbaseScript: input.scriptsig,
						}),
						...(input.scriptsig_asm != null && {
							scriptSigAsm: input.scriptsig_asm,
						}),
						sequence: input.sequence,
						...(input.witness != null && {
							witness: input.witness,
						}),
					}
				))
			)
			}
		})({
				fields: {
			$$inputs: (inputs) => inputs,
		},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => (
				(await getTransaction(entitySelector)).vout.map((output, outputIndex) => (
					{
						[EntityMetaKey.Selector]: {
							$transaction: entitySelector,
							outputIndex,
						},
						valueSats: BigInt(output.value),
						...(output.scriptpubkey_asm != null && {
							scriptPubKeyAsm: output.scriptpubkey_asm,
						}),
						scriptPubKeyHex: output.scriptpubkey,
						scriptPubKeyType: output.scriptpubkey_type,
						...(output.scriptpubkey_address != null && {
							$address: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									address: output.scriptpubkey_address,
								},
							},
						}),
					}
				))
			)
			}
		})({
				fields: {
			$$outputs: (outputs) => outputs,
		},
			}),
	],
}
