import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	MempoolSpaceTransaction,
	MempoolSpaceTransactionInput,
	MempoolSpaceTransactionOutput,
} from '$/sources/MempoolSpace/Rest/types.ts'

const mempoolSpaceBitcoinMainnetRestBaseUrl = 'https://mempool.space/api'

const assertBitcoinMainnet = (network: { namespace: string; reference: string }) => {
	if (
		network.namespace !== NetworkNamespace.Bip122
		|| network.reference !== '000000000019d6689c085ae165831e93'
	) {
		throw new Error(`MempoolSpace_Rest: unsupported UTXO network ${network.namespace}:${network.reference}`)
	}
}

const inputEntityFromMempoolSpaceInput = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	},
	input: MempoolSpaceTransactionInput,
	inputIndex: number,
) => ({
	[EntityMetaKey.Id]: {
		$transaction: transactionId,
		inputIndex,
	},
	...(input.txid != null && input.vout != null && {
		$spentOutput: {
			[EntityMetaKey.Id]: {
				$transaction: {
					$network: transactionId.$network,
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
	sequence: BigInt(input.sequence),
	...(input.witness != null && {
		witness: input.witness,
	}),
})

const outputEntityFromMempoolSpaceOutput = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	},
	output: MempoolSpaceTransactionOutput,
	outputIndex: number,
) => ({
	[EntityMetaKey.Id]: {
		$transaction: transactionId,
		outputIndex,
	},
	valueSats: BigInt(output.value),
	...(output.scriptpubkey_asm != null && {
		scriptPubKeyAsm: output.scriptpubkey_asm,
	}),
	scriptPubKeyHex: output.scriptpubkey,
	scriptPubKeyType: output.scriptpubkey_type,
	...(output.scriptpubkey_address != null && {
		address: output.scriptpubkey_address,
	}),
})

const transactionEntityFromMempoolSpaceTransaction = (
	network: { namespace: string; reference: string },
	transaction: MempoolSpaceTransaction,
) => ({
	[EntityMetaKey.Id]: {
		$network: network,
		txId: transaction.txid,
	},
	...(transaction.status.block_height != null && {
		$block: {
			[EntityMetaKey.Id]: {
				$network: network,
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
})

const getTransaction = async (entityId: {
	$network: {
		namespace: string
		reference: string
	}
	txId: string
}) => {
	assertBitcoinMainnet(entityId.$network)
	const { getTransaction } = await import('$/sources/MempoolSpace/Rest/queries.ts')
	return getTransaction({
		restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
		txId: entityId.txId,
	})
}

export default {
	source: Source.MempoolSpace_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHashByHeight,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
					blockHash: entityId.hash ?? await getBlockHashByHeight({
						restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
						height: entityId.height,
					}),
				})
				return {
					hash: block.id,
					...(block.previousblockhash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(block.height - 1),
								hash: block.previousblockhash,
							},
						},
					}),
					timestampMs: block.timestamp * 1000,
					merkleRoot: block.merkle_root,
					nonce: BigInt(block.nonce),
					difficulty: block.difficulty,
					sizeBytes: block.size,
					weightUnits: block.weight,
					transactionCount: block.tx_count,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => transactionEntityFromMempoolSpaceTransaction(
				entityId.$network,
				await getTransaction(entityId),
			),
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoInput,
			resolve: async (entityId) => (
				inputEntityFromMempoolSpaceInput(
					entityId.$transaction,
					(await getTransaction(entityId.$transaction)).vin[entityId.inputIndex],
					entityId.inputIndex,
				)
			),
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoOutput,
			resolve: async (entityId) => (
				outputEntityFromMempoolSpaceOutput(
					entityId.$transaction,
					(await getTransaction(entityId.$transaction)).vout[entityId.outputIndex],
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
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlockHashByHeight,
					getBlockTransactionIds,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				return (
					await getBlockTransactionIds({
						restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
						blockHash: entityId.hash ?? await getBlockHashByHeight({
							restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
							height: entityId.height,
						}),
					})
				).map((txId) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txId,
					},
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$inputs',
			resolve: async (entityId) => (
				(await getTransaction(entityId)).vin.map((input, inputIndex) => (
					inputEntityFromMempoolSpaceInput(
						entityId,
						input,
						inputIndex,
					)
				))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$outputs',
			resolve: async (entityId) => (
				(await getTransaction(entityId)).vout.map((output, outputIndex) => (
					outputEntityFromMempoolSpaceOutput(
						entityId,
						output,
						outputIndex,
					)
				))
			),
		}),
	],
}
