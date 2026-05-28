import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	MoneroRpcTransaction,
	MoneroRpcTransactionInput,
	MoneroRpcTransactionOutput,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'

const moneroDaemonRpcUrl = 'http://127.0.0.1:18081/json_rpc'

const assertMoneroMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Monero || network.reference !== '418015bb9ae982a1975da7d79277c270') {
		throw new Error(`MoneroDaemonRpc_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const moneroTransactionOutputFields = (
	transaction: MoneroRpcTransaction,
	output: MoneroRpcTransactionOutput,
	outputIndex: number,
) => ({
	...(output.target.key != null && {
		publicKey: output.target.key,
	}),
	...(output.target.key == null && output.target.tagged_key?.key != null && {
		publicKey: output.target.tagged_key.key,
	}),
	...(transaction.decoded_json?.rct_signatures?.outPk?.[outputIndex]?.mask != null && {
		commitment: transaction.decoded_json.rct_signatures.outPk[outputIndex].mask,
	}),
})

const moneroKeyImageFields = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txHash: string
	},
	input: MoneroRpcTransactionInput,
	inputIndex: number,
) => ({
	...(input.key != null && {
		$ring: {
			[EntityMetaKey.Id]: {
				$keyImage: {
					$transaction: transactionId,
					inputIndex,
					keyImage: input.key.k_image,
				},
			},
		},
	}),
})

const moneroRingMemberFields = (
	input: MoneroRpcTransactionInput,
	memberIndex: number,
) => (
	input.key?.key_offsets[memberIndex] == null ?
		{}
	:	{
			globalOutputIndex: BigInt(input.key.key_offsets[memberIndex]),
		}
)

const moneroTransactionFields = (
	network: {
		namespace: string
		reference: string
	},
	transaction: MoneroRpcTransaction,
) => ({
	...(!transaction.in_pool && {
		$block: {
			[EntityMetaKey.Id]: {
				$network: network,
				height: BigInt(transaction.block_height),
			},
		},
	}),
	...(transaction.decoded_json != null && {
		version: transaction.decoded_json.version,
		unlockTime: BigInt(transaction.decoded_json.unlock_time),
		...(transaction.decoded_json.rct_signatures?.txnFee != null && {
			feeAtomicUnits: BigInt(transaction.decoded_json.rct_signatures.txnFee),
		}),
		$$keyImages: transaction.decoded_json.vin.flatMap((input, inputIndex) => (
			input.key == null ?
				[]
			:	[
				{
					[EntityMetaKey.Id]: {
						$transaction: {
							$network: network,
							txHash: transaction.tx_hash,
						},
						inputIndex,
						keyImage: input.key.k_image,
					},
					...moneroKeyImageFields(
						{
							$network: network,
							txHash: transaction.tx_hash,
						},
						input,
						inputIndex,
					),
				},
			]
		)),
		$$stealthOutputs: transaction.decoded_json.vout.map((output, outputIndex) => ({
			[EntityMetaKey.Id]: {
				$transaction: {
					$network: network,
					txHash: transaction.tx_hash,
				},
				outputIndex,
			},
			...moneroTransactionOutputFields(
				transaction,
				output,
				outputIndex,
			),
		})),
	}),
})

const getMoneroTransaction = async (entityId: {
	$network: {
		namespace: string
		reference: string
	}
	txHash: string
}) => {
	assertMoneroMainnet(entityId.$network)
	const { getTransactions } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
	const transaction = (await getTransactions({
		rpcUrl: moneroDaemonRpcUrl,
		txHashes: [entityId.txHash],
	})).txs[0]
	if (transaction == null) {
		throw new Error(`MoneroDaemonRpc_JsonRpc: transaction not found for hash ${entityId.txHash}`)
	}
	return transaction
}

export default {
	source: Source.MoneroDaemonRpc_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.MoneroBlock,
			resolve: async (entityId) => {
				assertMoneroMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: moneroDaemonRpcUrl,
					height: entityId.height,
				})
				return {
					hash: block.block_header.hash,
					...(block.block_header.height > 0 && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(block.block_header.height - 1),
								hash: block.block_header.prev_hash,
							},
						},
					}),
					timestampMs: block.block_header.timestamp * 1000,
					difficulty: BigInt(block.block_header.difficulty),
					weightBytes: block.block_header.block_weight,
					$$transactions: [
						block.miner_tx_hash,
						...block.tx_hashes,
					].map((txHash) => ({
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							txHash,
						},
						$block: {
							[EntityMetaKey.Id]: entityId,
						},
					})),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MoneroTransaction,
			resolve: async (entityId) => (
				moneroTransactionFields(
					entityId.$network,
					await getMoneroTransaction(entityId),
				)
			),
		}),

		defineEntityResolver({
			entityType: EntityType.MoneroKeyImage,
			resolve: async (entityId) => {
				const transaction = await getMoneroTransaction(entityId.$transaction)
				const input = transaction.decoded_json?.vin[entityId.inputIndex]
				if (input?.key == null || input.key.k_image !== entityId.keyImage) {
					throw new Error(`MoneroDaemonRpc_JsonRpc: key image ${entityId.keyImage} not found for ${entityId.$transaction.txHash}`)
				}
				return moneroKeyImageFields(
					entityId.$transaction,
					input,
					entityId.inputIndex,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MoneroRing,
			resolve: async (entityId) => {
				const transaction = await getMoneroTransaction(entityId.$keyImage.$transaction)
				const input = transaction.decoded_json?.vin[entityId.$keyImage.inputIndex]
				if (input?.key == null || input.key.k_image !== entityId.$keyImage.keyImage) {
					throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${entityId.$keyImage.keyImage}`)
				}
				return {
					$$members: input.key.key_offsets.map((_keyOffset, memberIndex) => ({
						[EntityMetaKey.Id]: {
							$ring: entityId,
							memberIndex,
						},
						...moneroRingMemberFields(
							input,
							memberIndex,
						),
					})),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MoneroRingMember,
			resolve: async (entityId) => {
				const transaction = await getMoneroTransaction(entityId.$ring.$keyImage.$transaction)
				const input = transaction.decoded_json?.vin[entityId.$ring.$keyImage.inputIndex]
				if (input?.key == null || input.key.k_image !== entityId.$ring.$keyImage.keyImage) {
					throw new Error(`MoneroDaemonRpc_JsonRpc: ring member ${entityId.memberIndex.toString()} not found for key image ${entityId.$ring.$keyImage.keyImage}`)
				}
				return moneroRingMemberFields(
					input,
					entityId.memberIndex,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MoneroStealthOutput,
			resolve: async (entityId) => {
				const transaction = await getMoneroTransaction(entityId.$transaction)
				const output = transaction.decoded_json?.vout[entityId.outputIndex]
				if (output == null) {
					throw new Error(`MoneroDaemonRpc_JsonRpc: stealth output ${entityId.outputIndex.toString()} not found for ${entityId.$transaction.txHash}`)
				}
				return moneroTransactionOutputFields(
					transaction,
					output,
					entityId.outputIndex,
				)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.MoneroRing,
			fieldName: '$$members',
			resolve: async (entityId) => {
				const transaction = await getMoneroTransaction(entityId.$keyImage.$transaction)
				const input = transaction.decoded_json?.vin[entityId.$keyImage.inputIndex]
				if (input?.key == null || input.key.k_image !== entityId.$keyImage.keyImage) {
					throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${entityId.$keyImage.keyImage}`)
				}
				return input.key.key_offsets.map((_keyOffset, memberIndex) => ({
					[EntityMetaKey.Id]: {
						$ring: entityId,
						memberIndex,
					},
					...moneroRingMemberFields(
						input,
						memberIndex,
					),
				}))
			},
		}),
	],
}
