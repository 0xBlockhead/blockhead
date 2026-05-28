import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { ZebraTransaction } from '$/sources/Zebra/JsonRpc/types.ts'

const zebraRpcUrl = 'http://127.0.0.1:8232'

const assertZcashMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Zcash || network.reference !== '00040fe8ec8471911baa1db1266ea15') {
		throw new Error(`Zebra_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const valueSatsFromZec = (valueZec: number) => BigInt(Math.round(valueZec * 100_000_000))

const transactionEntityFromZebraTransaction = (
	network: { namespace: string; reference: string },
	transaction: ZebraTransaction,
) => ({
	[EntityMetaKey.Id]: {
		$network: network,
		txId: transaction.txid,
	},
	version: transaction.version,
	lockTime: transaction.locktime,
	sizeBytes: transaction.size,
	virtualSizeBytes: transaction.vsize,
	weightUnits: transaction.weight,
	isCoinbase: transaction.vin.some((input) => input.coinbase != null),
})

const inputEntityFromZebraInput = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	},
	input: ZebraTransaction['vin'][number],
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
	...(input.coinbase != null && {
		coinbaseScript: input.coinbase,
	}),
	...(input.scriptSig != null && {
		scriptSigAsm: input.scriptSig.asm,
	}),
	sequence: BigInt(input.sequence),
	...(input.txinwitness != null && {
		witness: input.txinwitness,
	}),
})

const outputEntityFromZebraOutput = (
	transactionId: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	},
	output: ZebraTransaction['vout'][number],
	outputIndex: number,
) => ({
	[EntityMetaKey.Id]: {
		$transaction: transactionId,
		outputIndex,
	},
	valueSats: valueSatsFromZec(output.value),
	scriptPubKeyAsm: output.scriptPubKey.asm,
	scriptPubKeyHex: output.scriptPubKey.hex,
	scriptPubKeyType: output.scriptPubKey.type,
	...(output.scriptPubKey.address != null && {
		address: output.scriptPubKey.address,
	}),
})

const getTransaction = async (entityId: {
	$network: {
		namespace: string
		reference: string
	}
	txId: string
}) => {
	assertZcashMainnet(entityId.$network)
	const { getRawTransaction } = await import('$/sources/Zebra/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: zebraRpcUrl,
		txId: entityId.txId,
	})
}

export default {
	source: Source.Zebra_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				assertZcashMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Zebra/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: zebraRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: zebraRpcUrl,
						height: entityId.height,
					}),
				})
				return {
					hash: block.hash,
					...(block.previousblockhash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(block.height - 1),
								hash: block.previousblockhash,
							},
						},
					}),
					timestampMs: block.time * 1000,
					merkleRoot: block.merkleroot,
					nonce: BigInt(block.nonce),
					difficulty: block.difficulty,
					...(block.size != null && {
						sizeBytes: block.size,
					}),
					...(block.weight != null && {
						weightUnits: block.weight,
					}),
					transactionCount: block.nTx,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => transactionEntityFromZebraTransaction(
				entityId.$network,
				await getTransaction(entityId),
			),
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoInput,
			resolve: async (entityId) => (
				inputEntityFromZebraInput(
					entityId.$transaction,
					(await getTransaction(entityId.$transaction)).vin[entityId.inputIndex],
					entityId.inputIndex,
				)
			),
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoOutput,
			resolve: async (entityId) => (
				outputEntityFromZebraOutput(
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
				assertZcashMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Zebra/JsonRpc/queries.ts')
				return (
					await getBlock({
						rpcUrl: zebraRpcUrl,
						blockHash: entityId.hash ?? await getBlockHash({
							rpcUrl: zebraRpcUrl,
							height: entityId.height,
						}),
					})
				).tx.map((transaction) => (
					typeof transaction === 'string' ?
						{
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								txId: transaction,
							},
						}
					:
						transactionEntityFromZebraTransaction(
							entityId.$network,
							transaction,
						)
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$inputs',
			resolve: async (entityId) => (
				(await getTransaction(entityId)).vin.map((input, inputIndex) => (
					inputEntityFromZebraInput(
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
					outputEntityFromZebraOutput(
						entityId,
						output,
						outputIndex,
					)
				))
			),
		}),
	],
}
