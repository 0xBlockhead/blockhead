import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	BlockchairBitcoinLikeInput,
	BlockchairBitcoinLikeOutput,
	BlockchairBitcoinLikeTransactionDashboard,
} from '$/sources/Blockchair/Rest/types.ts'
import type { BlockchairBitcoinLikeChain } from '$/sources/Blockchair/Rest/constants.ts'

const blockchairChain = (network: { namespace: string; reference: string }): BlockchairBitcoinLikeChain => {
	if (
		network.namespace === NetworkNamespace.Bip122
		&& network.reference === '000000000019d6689c085ae165831e93'
	) return 'bitcoin'
	if (network.namespace === NetworkNamespace.Zcash && network.reference === '00040fe8ec8471911baa1db1266ea15') return 'zcash'
	if (network.namespace === NetworkNamespace.Litecoin && network.reference === '12a765e31ffd4059bada1e25190f6e98') return 'litecoin'
	if (network.namespace === NetworkNamespace.Dogecoin && network.reference === '1a91e3dace36e2be3bf030a65679fe82') return 'dogecoin'
	if (network.namespace === NetworkNamespace.BitcoinCash && network.reference === '000000000000000000651ef99cb9fcbe') return 'bitcoin-cash'
	throw new Error(`Blockchair_Rest: unsupported UTXO network ${network.namespace}:${network.reference}`)
}

const firstDashboardRow = <_Row>(rows: Record<string, _Row>, subject: string) => {
	const row = Object.values(rows)[0]
	if (row == null) throw new Error(`Blockchair_Rest: no dashboard row for ${subject}`)
	return row
}

const getTransactionDashboard = async (entityId: {
	$network: {
		namespace: string
		reference: string
	}
	txId: string
}) => {
	const { getBlockchairBitcoinLikeTransactionDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
	return firstDashboardRow(
		(
			await getBlockchairBitcoinLikeTransactionDashboard({
				chain: blockchairChain(entityId.$network),
				transactionHash: entityId.txId,
			})
		).data,
		entityId.txId,
	)
}

const outputEntityFromBlockchairOutput = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	},
	output: BlockchairBitcoinLikeOutput,
	outputIndex: number,
) => ({
	[EntityMetaKey.Id]: {
		$transaction: transactionId,
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
})

const inputEntityFromBlockchairInput = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	},
	input: BlockchairBitcoinLikeInput,
	inputIndex: number,
) => ({
	[EntityMetaKey.Id]: {
		$transaction: transactionId,
		inputIndex,
	},
	...(input.transaction_hash != null && input.index != null && {
		$spentOutput: {
			[EntityMetaKey.Id]: {
				$transaction: {
					$network: transactionId.$network,
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
		sequence: BigInt(input.spending_sequence),
	}),
	...(input.spending_witness != null && {
		witness: [
			input.spending_witness,
		],
	}),
})

export default {
	source: Source.Blockchair_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				const { getBlockchairBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
				const row = firstDashboardRow(
					(
						await getBlockchairBitcoinLikeBlockDashboard({
							chain: blockchairChain(entityId.$network),
							block: entityId.hash ?? entityId.height,
						})
					).data,
					entityId.hash ?? entityId.height.toString(),
				)
				return {
					hash: row.block.hash,
					timestampMs: row.block.time == null ? undefined : Date.parse(row.block.time),
					merkleRoot: row.block.merkle_root,
					...(row.block.nonce != null && {
						nonce: BigInt(row.block.nonce),
					}),
					difficulty: row.block.difficulty,
					sizeBytes: row.block.size,
					weightUnits: row.block.weight,
					transactionCount: row.block.transaction_count,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				const row = await getTransactionDashboard(entityId)
				return {
					...(row.transaction.block_id != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.transaction.block_id),
							},
						},
					}),
					version: row.transaction.version,
					lockTime: row.transaction.lock_time,
					sizeBytes: row.transaction.size,
					virtualSizeBytes: row.transaction.size,
					weightUnits: row.transaction.weight,
					...(row.transaction.fee != null && {
						feeSats: BigInt(row.transaction.fee),
					}),
					isCoinbase: row.transaction.is_coinbase,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoInput,
			resolve: async (entityId) => (
				inputEntityFromBlockchairInput(
					entityId.$transaction,
					(await getTransactionDashboard(entityId.$transaction)).inputs[entityId.inputIndex],
					entityId.inputIndex,
				)
			),
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoOutput,
			resolve: async (entityId) => (
				outputEntityFromBlockchairOutput(
					entityId.$transaction,
					(await getTransactionDashboard(entityId.$transaction)).outputs[entityId.outputIndex],
					entityId.outputIndex,
				)
			),
		}),
	],

	entityFieldResolvers: [






		defineEntityFieldResolver({
			entityType: EntityType.UtxoBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const { getBlockchairBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
				const row = firstDashboardRow(
					(
						await getBlockchairBitcoinLikeBlockDashboard({
							chain: blockchairChain(entityId.$network),
							block: entityId.hash ?? entityId.height,
						})
					).data,
					entityId.hash ?? entityId.height.toString(),
				)
				return row.transactions.map((transaction) => ({
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
				const row: BlockchairBitcoinLikeTransactionDashboard = await getTransactionDashboard(entityId)
				return row.inputs.map((input, inputIndex) => (
					inputEntityFromBlockchairInput(
						entityId,
						input,
						inputIndex,
					)
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$outputs',
			resolve: async (entityId) => {
				const row: BlockchairBitcoinLikeTransactionDashboard = await getTransactionDashboard(entityId)
				return row.outputs.map((output, outputIndex) => (
					outputEntityFromBlockchairOutput(
						entityId,
						output,
						outputIndex,
					)
				))
			},
		}),
	],
}
