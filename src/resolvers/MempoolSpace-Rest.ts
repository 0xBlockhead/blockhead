import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { Network_TimestampSelector } from '$/schema/Network_Timestamp.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { UtxoInputSelector } from '$/schema/UtxoInput.ts'
import { UtxoAddressSelector } from '$/schema/UtxoAddress.ts'
import { UtxoAddress_TimestampSelector } from '$/schema/UtxoAddress_Timestamp.ts'
import { UtxoOutputSelector } from '$/schema/UtxoOutput.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertBitcoinMainnet = (network: NetworkId) => {
	if (
		(
			!('caip2' in network)
			|| network.caip2.namespace !== bitcoinNetworkBySlug.bitcoin.caip2.namespace
			|| network.caip2.reference !== bitcoinNetworkBySlug.bitcoin.caip2.reference
		)
		&& (
			!('slug' in network)
			|| network.slug !== 'bitcoin'
		)
	)
		throw new Error('MempoolSpace_Rest: unsupported Bitcoin network')
}

const bitcoinMainnet = {
	caip2: bitcoinNetworkBySlug.bitcoin.caip2,
} as const

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertBitcoinMainnet($network)
	const { getTransaction } = await import('$/sources/MempoolSpace/Rest/queries.ts')
	return getTransaction({
		restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl,
		txId: txId,
	})
}

export default {
	source: Source.MempoolSpace_Rest,

	resolvers: [
		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertBitcoinMainnet(network)
					return {
						[EntityMetaKey.Selector]: network,
					}
				}
			},
		})({
				slug: (network) => network.slug,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
					assertBitcoinMainnet($network)
					const {
						getBlock,
					} = await import('$/sources/MempoolSpace/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl,
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
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				timestampMs: (block) => block.timestampMs,
				merkleRoot: (block) => block.merkleRoot,
				nonce: (block) => block.nonce,
				difficulty: (block) => block.difficulty,
				sizeBytes: (block) => block.sizeBytes,
				weightUnits: (block) => block.weightUnits,
				transactionCount: (block) => block.transactionCount,
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
			},
		})({
				$block: (transaction) => transaction.$block,
				version: (transaction) => transaction.version,
				lockTime: (transaction) => transaction.lockTime,
				sizeBytes: (transaction) => transaction.sizeBytes,
				weightUnits: (transaction) => transaction.weightUnits,
				virtualSizeBytes: (transaction) => transaction.virtualSizeBytes,
				feeSats: (transaction) => transaction.feeSats,
				isCoinbase: (transaction) => transaction.isCoinbase,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
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
			},
		})({
				$spentOutput: (input) => input.$spentOutput,
				coinbaseScript: (input) => input.coinbaseScript,
				scriptSigAsm: (input) => input.scriptSigAsm,
				sequence: (input) => input.sequence,
				witness: (input) => input.witness ?? [],
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoAddress,
			resolve: {
					[UtxoAddressSelector.NetworkAddress]: async ({ $network, address: addressSelector }) => {
						assertBitcoinMainnet($network)
						return {
							address: addressSelector,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$address: {
											$network,
											address: addressSelector,
										},
										timestampMs: Date.now(),
										source: Source.MempoolSpace_Rest,
									},
								},
							],
						}
					}
				},
			})({
					address: (address) => address.address,
					$$timestamps: (address) => address.$$timestamps,
				}),

			defineResolver(Source.MempoolSpace_Rest, {
				entityType: EntityType.UtxoAddress_Timestamp,
				resolve: {
					[UtxoAddress_TimestampSelector.AddressTimestampMsSource]: async ({ $address }) => {
						assertBitcoinMainnet($address.$network)
						const { getAddress } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const address = await getAddress({
							restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl,
							address: $address.address,
						})
						const chainStats = address.chain_stats
						return {
							balanceSats: BigInt(chainStats.funded_txo_sum - chainStats.spent_txo_sum),
							transactionCount: chainStats.tx_count,
							unspentOutputCount: chainStats.funded_txo_count - chainStats.spent_txo_count,
							fundedOutputCount: chainStats.funded_txo_count,
							spentOutputCount: chainStats.spent_txo_count,
							fundedValueSats: BigInt(chainStats.funded_txo_sum),
							spentValueSats: BigInt(chainStats.spent_txo_sum),
						}
					}
				},
			})({
					balanceSats: (address) => address.balanceSats,
					transactionCount: (address) => address.transactionCount,
					unspentOutputCount: (address) => address.unspentOutputCount,
					fundedOutputCount: (address) => address.fundedOutputCount,
					spentOutputCount: (address) => address.spentOutputCount,
					fundedValueSats: (address) => address.fundedValueSats,
					spentValueSats: (address) => address.spentValueSats,
				}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				[UtxoOutputSelector.TransactionIndexInTransaction]: async ({ $transaction, indexInTransaction }) => {
					const output = (await getTransaction($transaction)).vout[indexInTransaction]
					return {
						[EntityMetaKey.Selector]: {
							$transaction: $transaction,
							indexInTransaction: indexInTransaction,
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
			},
		})({
				valueSats: (output) => output.valueSats,
				scriptPubKeyAsm: (output) => output.scriptPubKeyAsm,
				scriptPubKeyHex: (output) => output.scriptPubKeyHex,
				scriptPubKeyType: (output) => output.scriptPubKeyType,
				$address: (output) => output.$address,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.Network_Timestamp,
			resolve: {
				[Network_TimestampSelector.NetworkTimestampMsSource]: async ({
					$network,
					timestampMs,
					source,
				}) => {
					if (source !== Source.MempoolSpace_Rest)
						throw new Error(`MempoolSpace_Rest: unsupported network timestamp source ${source}`)

					assertBitcoinMainnet($network)
					const {
						getBlocks,
						getMempoolStats,
						getRecommendedFees,
					} = await import('$/sources/MempoolSpace/Rest/queries.ts')
					const [blocks, mempoolStats, fees] = await Promise.all([
						getBlocks({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl }),
						getMempoolStats({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl }),
						getRecommendedFees({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl }),
					])
					const block = blocks.at(0)
					if (block == null) throw new Error('MempoolSpace_Rest: no blocks returned')
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
						timestampMs,
						source,
						bestBlockHeight: BigInt(block.height),
						bestBlockHash: block.id,
						mempoolTransactionCount: mempoolStats.count,
						mempoolSizeBytes: BigInt(Math.ceil(mempoolStats.vsize)),
						suggestedTransactionFeePerByteSats: fees.hourFee,
					}
				}
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				bestBlockHeight: (timestamp) => timestamp.bestBlockHeight,
				bestBlockHash: (timestamp) => timestamp.bestBlockHash,
				mempoolTransactionCount: (timestamp) => timestamp.mempoolTransactionCount,
				mempoolSizeBytes: (timestamp) => timestamp.mempoolSizeBytes,
				suggestedTransactionFeePerByteSats: (timestamp) => timestamp.suggestedTransactionFeePerByteSats,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertBitcoinMainnet(network)
					return {
						[EntityMetaKey.Selector]: network,
					}
				}
			},
		})({
				slug: (network) => network.slug,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertBitcoinMainnet(network)
					const {
						getBlocks,
						getMempoolStats,
						getRecommendedFees,
					} = await import('$/sources/MempoolSpace/Rest/queries.ts')
					const [blocks, mempoolStats, fees] = await Promise.all([
						getBlocks({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl }),
						getMempoolStats({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl }),
						getRecommendedFees({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl }),
					])
					const block = blocks.at(0)
					if (block == null) throw new Error('MempoolSpace_Rest: no blocks returned')
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: Date.now(),
								source: Source.MempoolSpace_Rest,
							},
							bestBlockHeight: BigInt(block.height),
							bestBlockHash: block.id,
							mempoolTransactionCount: mempoolStats.count,
							mempoolSizeBytes: BigInt(Math.ceil(mempoolStats.vsize)),
							suggestedTransactionFeePerByteSats: fees.hourFee,
						},
					]
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertBitcoinMainnet(network)
					const { getBlocks } = await import('$/sources/MempoolSpace/Rest/queries.ts')
					const blocks = await getBlocks({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl })
					return blocks.slice(0, resolverContextRowLimit(context)).map((block) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							height: BigInt(block.height),
							hash: block.id,
						},
					}))
				}
			},
		})({
				Utxo: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertBitcoinMainnet(network)
					const { getMempoolTxids } = await import('$/sources/MempoolSpace/Rest/queries.ts')
					const txids = await getMempoolTxids({ restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl })
					return txids.slice(0, resolverContextRowLimit(context)).map((txId) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							txId,
						},
					}))
				}
			},
		})({
				Utxo: {
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
							restBaseUrl: bitcoinNetworkBySlug.bitcoin.mempoolSpaceRestBaseUrl,
							blockHash: hash,
						})
					).map((txId) => ({
						[EntityMetaKey.Selector]: {
							$network,
							txId,
						},
					}))
				}
			},
		})({
				$$transactions: (transactions) => transactions,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => (
					(await getTransaction(entitySelector)).vin.map((input, indexInTransaction) => (
						{
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector,
								indexInTransaction,
							},
						}
					))
				)
			},
		})({
				$$inputs: (inputs) => inputs,
			}),

		defineResolver(Source.MempoolSpace_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => (
					(await getTransaction(entitySelector)).vout.map((output, indexInTransaction) => (
						{
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector,
								indexInTransaction,
							},
						}
					))
				)
			},
		})({
				$$outputs: (outputs) => outputs,
			}),
	],
}
