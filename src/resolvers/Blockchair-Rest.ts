import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	BlockchairBitcoinLikeChain,
	BlockchairBitcoinLikeBlock,
	BlockchairBitcoinLikeStats,
	BlockchairBitcoinLikeTransaction,
} from '$/sources/Blockchair/Rest/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const blockchairChain = (
	network: NetworkId,
): BlockchairBitcoinLikeChain => {
	if (!('caip2' in network)) throw new Error('Blockchair_Rest: unsupported UTXO network')
	if (
		network.caip2.namespace === 'bip122'
		&& network.caip2.reference === '000000000019d6689c085ae165831e93'
	) return 'bitcoin'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '00040fe8ec8471911baa1db1266ea15') return 'zcash'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '12a765e31ffd4059bada1e25190f6e98') return 'litecoin'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '1a91e3dace36e2be3bf030a65679fe82') return 'dogecoin'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '000000000000000000651ef99cb9fcbe') return 'bitcoin-cash'
	throw new Error(`Blockchair_Rest: unsupported UTXO network ${network.caip2.namespace}:${network.caip2.reference}`)
}

const firstDashboardRow = <_Row>(dashboardRows: Record<string, _Row>, subject: string) => {
	const dashboardRow = Object.values(dashboardRows)[0]
	if (dashboardRow == null) throw new Error(`Blockchair_Rest: no dashboard for ${subject}`)
	return dashboardRow
}

const timestampMsFromBlockchairTime = (time: string | undefined) => (
	((timestampMs) => (
		Number.isNaN(timestampMs) ? undefined : timestampMs
	))(time == null ? Number.NaN : Date.parse(time))
)

const bigintFromNumber = (value: number | undefined) => (
	value == null ? undefined : BigInt(value)
)

const utxoBlockRow = (
	network: NetworkId,
	block: BlockchairBitcoinLikeBlock,
) => ({
	[EntityMetaKey.Id]: {
		$network: network,
		height: BigInt(block.id),
		hash: block.hash,
	},
	hash: block.hash,
	...(timestampMsFromBlockchairTime(block.time) != null && { timestampMs: timestampMsFromBlockchairTime(block.time) }),
	...(block.merkle_root != null && { merkleRoot: block.merkle_root }),
	...(block.nonce != null && { nonce: block.nonce }),
	...(block.difficulty != null && { difficulty: block.difficulty }),
	...(block.size != null && { sizeBytes: block.size }),
	...(block.weight != null && { weightUnits: block.weight }),
	...(block.transaction_count != null && { transactionCount: block.transaction_count }),
})

const utxoTransactionRow = (
	network: NetworkId,
	transaction: BlockchairBitcoinLikeTransaction,
) => ({
	[EntityMetaKey.Id]: {
		$network: network,
		txId: transaction.hash,
	},
	...(transaction.block_id != null && {
		$block: {
			[EntityMetaKey.Id]: {
				$network: network,
				height: BigInt(transaction.block_id),
			},
		},
	}),
	version: transaction.version,
	lockTime: transaction.lock_time,
	sizeBytes: transaction.size,
	virtualSizeBytes: transaction.size,
	weightUnits: transaction.weight,
	...(bigintFromNumber(transaction.fee) != null && { feeSats: bigintFromNumber(transaction.fee) }),
	isCoinbase: transaction.is_coinbase,
})

const getTransactionDashboard = async (entityId: {
	$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
	txId: string
}) => {
	const { getBitcoinLikeTransactionDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
	return firstDashboardRow(
		(
			await getBitcoinLikeTransactionDashboard({
				chain: blockchairChain(entityId.$network),
				transactionHash: entityId.txId,
			})
		).data,
		entityId.txId,
	)
}

export default {
	source: Source.Blockchair_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoNetwork,
			resolve: async (entityId) => {
				blockchairChain(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
				const dashboard = firstDashboardRow(
					(
						await getBitcoinLikeBlockDashboard({
							chain: blockchairChain(entityId.$network),
							block: entityId.hash ?? entityId.height,
						})
					).data,
					entityId.hash ?? entityId.height.toString(),
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				const transactionDashboard = await getTransactionDashboard(entityId)
				return {
					...(transactionDashboard.transaction.block_id != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoInput,
			resolve: async (entityId) => {
				const input = (await getTransactionDashboard(entityId.$transaction)).inputs[entityId.inputIndex]
				return {
					[EntityMetaKey.Id]: {
						$transaction: entityId.$transaction,
						inputIndex: entityId.inputIndex,
					},
					...(input.transaction_hash != null && input.index != null && {
						$spentOutput: {
							[EntityMetaKey.Id]: {
								$transaction: {
									$network: entityId.$transaction.$network,
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoOutput,
			resolve: async (entityId) => {
				const output = (await getTransactionDashboard(entityId.$transaction)).outputs[entityId.outputIndex]
				return {
					[EntityMetaKey.Id]: {
						$transaction: entityId.$transaction,
						outputIndex: entityId.outputIndex,
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
						address: output.recipient,
					}),
					isSpent: output.spending_transaction_hash != null,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.UtxoNetwork,
			fieldName: '$network',
			resolve: async (entityId) => {
				blockchairChain(entityId)
				return {
					[EntityMetaKey.Id]: entityId,
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getBitcoinLikeStats } = await import('$/sources/Blockchair/Rest/queries.ts')
				const stats = (await getBitcoinLikeStats({
					chain: blockchairChain(entityId),
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
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: bestBlockTimeMs ?? Date.now(),
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				const { getBlocks } = await import('$/sources/Blockchair/Rest/queries.ts')
				return (await getBlocks<BlockchairBitcoinLikeBlock>({
					chain: blockchairChain(entityId),
					params: {
						sort: 'id(desc)',
						limit: resolverLoadSubsetRowLimit(context),
					},
				})).data.map((block) => utxoBlockRow(
					entityId,
					block,
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoNetwork,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const { getTransactions } = await import('$/sources/Blockchair/Rest/queries.ts')
				return (await getTransactions<BlockchairBitcoinLikeTransaction>({
					chain: blockchairChain(entityId),
					params: {
						sort: 'id(desc)',
						limit: resolverLoadSubsetRowLimit(context),
					},
				})).data.map((transaction) => utxoTransactionRow(
					entityId,
					transaction,
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
				const dashboard = firstDashboardRow(
					(
						await getBitcoinLikeBlockDashboard({
							chain: blockchairChain(entityId.$network),
							block: entityId.hash ?? entityId.height,
						})
					).data,
					entityId.hash ?? entityId.height.toString(),
				)
				return dashboard.transactions.map((transaction) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txId: transaction.hash,
					},
					version: transaction.version,
					lockTime: transaction.lock_time,
					sizeBytes: transaction.size,
					virtualSizeBytes: transaction.size,
					weightUnits: transaction.weight,
					...(transaction.fee != null && {
						feeSats: BigInt(transaction.fee),
					}),
					isCoinbase: transaction.is_coinbase,
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$inputs',
			resolve: async (entityId) => {
				const transactionDashboard = await getTransactionDashboard(entityId)
				return transactionDashboard.inputs.map((input, inputIndex) => (
					{
						[EntityMetaKey.Id]: {
							$transaction: entityId,
							inputIndex,
						},
						...(input.transaction_hash != null && input.index != null && {
							$spentOutput: {
								[EntityMetaKey.Id]: {
									$transaction: {
										$network: entityId.$network,
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
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$outputs',
			resolve: async (entityId) => {
				const transactionDashboard = await getTransactionDashboard(entityId)
				return transactionDashboard.outputs.map((output, outputIndex) => (
					{
						[EntityMetaKey.Id]: {
							$transaction: entityId,
							outputIndex,
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
							address: output.recipient,
						}),
						isSpent: output.spending_transaction_hash != null,
					}
				))
			},
		}),
	],
}
