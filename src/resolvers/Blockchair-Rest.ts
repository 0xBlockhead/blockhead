import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { networkBySlug } from '$/constants/Network.ts'
import type {
	BlockchairBitcoinLikeChain,
	BlockchairBitcoinLikeBlock,
	BlockchairBitcoinLikeStats,
	BlockchairBitcoinLikeTransaction,
} from '$/sources/Blockchair/Rest/types.ts'
import { UtxoNetworkSelector } from '$/schema/UtxoNetwork.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { UtxoInputSelector } from '$/schema/UtxoInput.ts'
import { UtxoOutputSelector } from '$/schema/UtxoOutput.ts'
import { UtxoAddressSelector } from '$/schema/UtxoAddress.ts'
import { UtxoAddress_TimestampSelector } from '$/schema/UtxoAddress_Timestamp.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const blockchairChain = (
	network: NetworkId
): BlockchairBitcoinLikeChain => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			networkBySlug[network.slug]?.caip2
	)
	if (caip2 == null)
		throw new Error('Blockchair_Rest: unsupported UTXO network')
	if (
		caip2.namespace === networkBySlug.bitcoin.caip2.namespace
		&& caip2.reference === networkBySlug.bitcoin.caip2.reference
	) return 'bitcoin'
	if (caip2.namespace === networkBySlug.zcash.caip2.namespace && caip2.reference === networkBySlug.zcash.caip2.reference) return 'zcash'
	if (caip2.namespace === networkBySlug.litecoin.caip2.namespace && caip2.reference === networkBySlug.litecoin.caip2.reference) return 'litecoin'
	if (caip2.namespace === networkBySlug.dogecoin.caip2.namespace && caip2.reference === networkBySlug.dogecoin.caip2.reference) return 'dogecoin'
	if (caip2.namespace === networkBySlug['bitcoin-cash'].caip2.namespace && caip2.reference === networkBySlug['bitcoin-cash'].caip2.reference) return 'bitcoin-cash'
	throw new Error(`Blockchair_Rest: unsupported UTXO network ${caip2.namespace}:${caip2.reference}`)
}

const firstDashboardEntry = <_Row>(dashboardRows: Record<string, _Row>, subject: string) => {
	for (const dashboardEntry of Object.entries(dashboardRows))
		return dashboardEntry

	throw new Error(`Blockchair_Rest: no dashboard for ${subject}`)
}

const firstDashboardRow = <_Row>(dashboardRows: Record<string, _Row>, subject: string) => {
	return firstDashboardEntry(dashboardRows, subject)[1]
}

const timestampMsFromBlockchairTime = (time: string | undefined) => (
	((timestampMs) => (
		Number.isNaN(timestampMs) ? undefined : timestampMs
	))(time == null ? Number.NaN : Date.parse(time))
)

const bigintFromNumber = (value: number | undefined) => (
	value == null ? undefined : BigInt(value)
)

const getTransactionDashboard = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	const { getBitcoinLikeTransactionDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
	return firstDashboardRow(
		(
			await getBitcoinLikeTransactionDashboard({
				chain: blockchairChain($network),
				transactionHash: txId,
			})
		).data,
		txId
	)
}

const getAddressDashboard = async ({ $network, address }: {
	$network: NetworkId
	address: string
}) => {
	const { getBitcoinLikeAddressDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
	return firstDashboardRow(
		(
			await getBitcoinLikeAddressDashboard({
				chain: blockchairChain($network),
				address,
			})
		).data,
		address
	).address
}

export default {
	source: Source.Blockchair_Rest,

	resolvers: [
		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async ({ $network }) => {
					blockchairChain($network)
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
					}
				}
			},
		})({
			fields: {
				$network: (network) => network.$network,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoBlock,
				resolve: {
					[UtxoBlockSelector.NetworkHeight]: async ({ $network, height }) => {
						const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
						const [hash, dashboard] = firstDashboardEntry(
							(
							await getBitcoinLikeBlockDashboard({
								chain: blockchairChain($network),
								block: height,
							})
							).data,
							height.toString()
						)
						return {
							hash,
							timestampMs: dashboard.block.time == null ? undefined : Date.parse(dashboard.block.time),
							merkleRoot: dashboard.block.merkle_root,
							...(dashboard.block.nonce != null && {
								nonce: dashboard.block.nonce,
							}),
							difficulty: dashboard.block.difficulty,
							sizeBytes: dashboard.block.size,
							weightUnits: dashboard.block.weight,
							transactionCount: dashboard.block.transaction_count,
						}
					},
					[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
						const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
						const dashboard = firstDashboardRow(
						(
						await getBitcoinLikeBlockDashboard({
							chain: blockchairChain($network),
							block: hash,
						})
						).data,
						hash
					)
					return {
						hash: dashboard.block.hash,
						timestampMs: dashboard.block.time == null ? undefined : Date.parse(dashboard.block.time),
						merkleRoot: dashboard.block.merkle_root,
						...(dashboard.block.nonce != null && {
							nonce: dashboard.block.nonce,
						}),
						difficulty: dashboard.block.difficulty,
						sizeBytes: dashboard.block.size,
						weightUnits: dashboard.block.weight,
						transactionCount: dashboard.block.transaction_count,
					}
				}
			},
		})({
			fields: {
				hash: (block) => block.hash,
				timestampMs: (block) => block.timestampMs,
				merkleRoot: (block) => block.merkleRoot,
				nonce: (block) => block.nonce,
				difficulty: (block) => block.difficulty,
				sizeBytes: (block) => block.sizeBytes,
				weightUnits: (block) => block.weightUnits,
				transactionCount: (block) => block.transactionCount,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => {
					const transactionDashboard = await getTransactionDashboard(entitySelector)
					return {
						...(transactionDashboard.transaction.block_id != null && {
							$block: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									height: BigInt(transactionDashboard.transaction.block_id),
								},
							},
						}),
						version: transactionDashboard.transaction.version,
						lockTime: transactionDashboard.transaction.lock_time,
						sizeBytes: transactionDashboard.transaction.size,
						virtualSizeBytes: transactionDashboard.transaction.size,
						weightUnits: transactionDashboard.transaction.weight,
						...(transactionDashboard.transaction.fee != null && {
							feeSats: BigInt(transactionDashboard.transaction.fee),
						}),
						isCoinbase: transactionDashboard.transaction.is_coinbase,
					}
				}
			},
		})({
			fields: {
				$block: (transaction) => transaction.$block,
				version: (transaction) => transaction.version,
				lockTime: (transaction) => transaction.lockTime,
				sizeBytes: (transaction) => transaction.sizeBytes,
				virtualSizeBytes: (transaction) => transaction.virtualSizeBytes,
				weightUnits: (transaction) => transaction.weightUnits,
				feeSats: (transaction) => transaction.feeSats,
				isCoinbase: (transaction) => transaction.isCoinbase,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoAddress,
			resolve: {
				[UtxoAddressSelector.NetworkAddress]: async ({ $network, address }) => ({
					address,
					$$timestamps: [
						{
							[EntityMetaKey.Selector]: {
								$address: {
									$network,
									address,
								},
								timestampMs: Date.now(),
								source: Source.Blockchair_Rest,
							},
						},
					],
				}),
			},
		})({
			fields: {
				address: (address) => address.address,
				$$timestamps: (address) => address.$$timestamps,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoAddress_Timestamp,
			resolve: {
				[UtxoAddress_TimestampSelector.AddressTimestampMsSource]: async ({ $address }) => getAddressDashboard($address),
			},
		})({
			fields: {
				balanceSats: (address) => bigintFromNumber(address.balance),
				transactionCount: (address) => address.transaction_count,
				unspentOutputCount: (address) => address.unspent_output_count,
				fundedValueSats: (address) => bigintFromNumber(address.received),
				spentValueSats: (address) => bigintFromNumber(address.spent),
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoInput,
			resolve: {
				[UtxoInputSelector.UtxoTransactionInputIndex]: async ({ $transaction, inputIndex }) => {
					const input = (await getTransactionDashboard($transaction)).inputs[inputIndex]
					return {
						[EntityMetaKey.Selector]: {
							$transaction: $transaction,
							inputIndex: inputIndex,
						},
						...(input.transaction_hash != null && input.index != null && {
							$spentOutput: {
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: $transaction.$network,
										txId: input.transaction_hash,
									},
									outputIndex: input.index,
								},
							},
						}),
						...(input.script_hex != null && {
							scriptSigAsm: input.script_hex,
						}),
						...(input.spending_sequence != null && {
							sequence: input.spending_sequence,
						}),
						...(input.spending_witness != null && {
							witness: [
								input.spending_witness,
							],
						}),
					}
				}
			},
		})({
			fields: {
				$spentOutput: (input) => input.$spentOutput,
				scriptSigAsm: (input) => input.scriptSigAsm,
				sequence: (input) => input.sequence,
				witness: (input) => input.witness ?? [],
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				[UtxoOutputSelector.UtxoTransactionOutputIndex]: async ({ $transaction, outputIndex }) => {
					const output = (await getTransactionDashboard($transaction)).outputs[outputIndex]
					return {
						[EntityMetaKey.Selector]: {
							$transaction: $transaction,
							outputIndex: outputIndex,
						},
						...(output.value != null && {
							valueSats: BigInt(output.value),
						}),
						...(output.script_hex != null && {
							scriptPubKeyHex: output.script_hex,
						}),
						...(output.type != null && {
							scriptPubKeyType: output.type,
						}),
						...(output.recipient != null && {
							$address: {
								[EntityMetaKey.Selector]: {
									$network: $transaction.$network,
									address: output.recipient,
								},
							},
						}),
						isSpent: output.spending_transaction_hash != null,
					}
				}
			},
		})({
			fields: {
				valueSats: (output) => output.valueSats,
				scriptPubKeyHex: (output) => output.scriptPubKeyHex,
				scriptPubKeyType: (output) => output.scriptPubKeyType,
				$address: (output) => output.$address,
				isSpent: (output) => output.isSpent,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async ({ $network }) => {
					blockchairChain($network)
					return {
						[EntityMetaKey.Selector]: $network,
					}
				}
			},
		})({
			fields: {
				$network: (network) => network,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async ({ $network }) => {
					const { getBitcoinLikeStats } = await import('$/sources/Blockchair/Rest/queries.ts')
					const stats = (await getBitcoinLikeStats({
						chain: blockchairChain($network),
					})).data
					const bestBlockHeight = bigintFromNumber(stats.best_block_height)
					const blockCount = bigintFromNumber(stats.blocks)
					const transactionCount = bigintFromNumber(stats.transactions)
					const mempoolSizeBytes = bigintFromNumber(stats.mempool_size)
					const averageTransactionFee24hSats = bigintFromNumber(stats.average_transaction_fee_24h)
					const medianTransactionFee24hSats = bigintFromNumber(stats.median_transaction_fee_24h)
					const blockchainSizeBytes = bigintFromNumber(stats.blockchain_size)
					const bestBlockTimeMs = timestampMsFromBlockchairTime(stats.best_block_time)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: $network,
								timestampMs: bestBlockTimeMs ?? Date.now(),
								source: Source.Blockchair_Rest,
							},
							...(bestBlockHeight != null && { bestBlockHeight }),
							...(stats.best_block_hash != null && { bestBlockHash: stats.best_block_hash }),
							...(bestBlockTimeMs != null && { bestBlockTimeMs }),
							...(blockCount != null && { blockCount }),
							...(transactionCount != null && { transactionCount }),
							...(stats.blocks_24h != null && { blocks24h: stats.blocks_24h }),
							...(stats.transactions_24h != null && { transactions24h: stats.transactions_24h }),
							...(stats.mempool_transactions != null && { mempoolTransactionCount: stats.mempool_transactions }),
							...(mempoolSizeBytes != null && { mempoolSizeBytes }),
							...(stats.mempool_tps != null && { mempoolTps: stats.mempool_tps }),
							...(averageTransactionFee24hSats != null && { averageTransactionFee24hSats }),
							...(medianTransactionFee24hSats != null && { medianTransactionFee24hSats }),
							...(stats.suggested_transaction_fee_per_byte_sat != null && {
								suggestedTransactionFeePerByteSats: stats.suggested_transaction_fee_per_byte_sat,
							}),
							...(blockchainSizeBytes != null && { blockchainSizeBytes }),
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async ({ $network }, context) => {
					const { getBlocks } = await import('$/sources/Blockchair/Rest/queries.ts')
					return (await getBlocks<BlockchairBitcoinLikeBlock>({
						chain: blockchairChain($network),
						params: {
							sort: 'id(desc)',
							limit: resolverContextRowLimit(context),
						},
					})).data.map((block) => ({
						[EntityMetaKey.Selector]: {
							$network: $network,
							height: BigInt(block.id),
							hash: block.hash,
						},
					}))
				}
			},
		})({
			fields: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoNetwork,
			resolve: {
				[UtxoNetworkSelector.Network]: async ({ $network }, context) => {
					const { getTransactions } = await import('$/sources/Blockchair/Rest/queries.ts')
					return (await getTransactions<BlockchairBitcoinLikeTransaction>({
						chain: blockchairChain($network),
						params: {
							sort: 'id(desc)',
							limit: resolverContextRowLimit(context),
						},
					})).data.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network: $network,
							txId: transaction.hash,
						},
					}))
				}
			},
		})({
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoBlock,
				resolve: {
					[UtxoBlockSelector.NetworkHeight]: async ({ $network, height }) => {
						const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
						const dashboard = firstDashboardRow(
							(
							await getBitcoinLikeBlockDashboard({
								chain: blockchairChain($network),
								block: height,
							})
							).data,
							height.toString()
						)
						return dashboard.transactions.map((transaction) => ({
							[EntityMetaKey.Selector]: {
								$network,
								txId: transaction.hash,
							},
						}))
					},
					[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
						const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
						const dashboard = firstDashboardRow(
						(
						await getBitcoinLikeBlockDashboard({
							chain: blockchairChain($network),
							block: hash,
						})
						).data,
						hash
					)
					return dashboard.transactions.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network,
							txId: transaction.hash,
						},
					}))
				}
			},
		})({
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => {
					const transactionDashboard = await getTransactionDashboard(entitySelector)
					return transactionDashboard.inputs.map((input, inputIndex) => (
						{
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector,
								inputIndex,
							},
						}
					))
				}
			},
		})({
			fields: {
				$$inputs: (inputs) => inputs,
			},
		}),

		defineResolver(Source.Blockchair_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => {
					const transactionDashboard = await getTransactionDashboard(entitySelector)
					return transactionDashboard.outputs.map((output, outputIndex) => (
						{
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector,
								outputIndex,
							},
						}
					))
				}
			},
		})({
			fields: {
				$$outputs: (outputs) => outputs,
			},
		}),
	],
}
