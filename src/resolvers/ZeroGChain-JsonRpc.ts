import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const zeroGChainId = 16661

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const zeroGNetworkApplicability = [{
	caip2: {
		namespace: 'eip155',
		reference: String(zeroGChainId),
	},
}] as const

const zeroGNetworkReferenceApplicability = [{
	$network: zeroGNetworkApplicability[0],
}] as const

const assertZeroGMainnetChain = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== zeroGNetworkApplicability[0].caip2.namespace
		|| network.caip2.reference !== zeroGNetworkApplicability[0].caip2.reference
	)
		throw new Error('ZeroGChain_JsonRpc: unsupported chain')
}

const quantityToBigInt = (value: string | undefined) => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const quantityToNumber = (value: string | undefined) => (
	((number) => (
		Number.isFinite(number) ? number : undefined
	))(Number(quantityToBigInt(value)))
)

const transactionEnvelopeTypeFromRpcType = (value: string | undefined) => (
	value == null ?
		EvmTransactionEnvelopeType.Legacy
	: Number.parseInt(value, 16) === 1 ?
		EvmTransactionEnvelopeType.AccessList
	: Number.parseInt(value, 16) === 2 ?
		EvmTransactionEnvelopeType.FeeMarket
	: Number.parseInt(value, 16) === 3 ?
		EvmTransactionEnvelopeType.Blob
	: Number.parseInt(value, 16) === 4 ?
		EvmTransactionEnvelopeType.SetCode
	: Number.parseInt(value, 16) === 0 ?
		EvmTransactionEnvelopeType.Legacy
	:
		EvmTransactionEnvelopeType.Unknown
)

const transactionKind = ({
	value,
	to,
	input,
	contractAddress,
}: {
	value: bigint
	to?: string | null
	input?: string
	contractAddress?: string | null
}) => (
	contractAddress != null || to == null ?
		EvmTransactionKind.ContractCreation
	: input != null && input !== '0x' && input.length > 2 ?
		value > 0n ?
			EvmTransactionKind.NativeTransferAndCall
		:
			EvmTransactionKind.ContractCall
	: value > 0n ?
		EvmTransactionKind.NativeTransfer
	:
		EvmTransactionKind.ContractCall
)

export default {
	source: Source.ZeroGChain_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					appliesTo: zeroGNetworkReferenceApplicability,
					resolve: async ({ $network, blockNumber }) => {
						assertZeroGMainnetChain($network)
						const { getBlockByNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
						const block = await getBlockByNumber(blockNumber)
						if (block == null) throw new Error(`ZeroGChain_JsonRpc: block not found ${blockNumber.toString()}`)
						const minerAddress = hexLowerOfByteSize(block.miner, 20)
						const parentHash = hexLowerOfByteSize(block.parentHash, 32)
						return {
							blockNumber: quantityToBigInt(block.number) ?? blockNumber,
							...(parentHash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber: blockNumber - 1n,
									},
								},
							}),
							...((timestamp) => (
								timestamp != null && { timestamp: timestamp * 1000 }
							))(quantityToNumber(block.timestamp)),
							...(minerAddress != null && {
								$miner: {
									[EntityMetaKey.Selector]: {
										address: minerAddress,
									},
								},
							}),
							...(quantityToBigInt(block.gasUsed) != null && { gasUsed: quantityToBigInt(block.gasUsed) }),
							...(quantityToBigInt(block.gasLimit) != null && { gasLimit: quantityToBigInt(block.gasLimit) }),
							...(quantityToBigInt(block.baseFeePerGas) != null && { baseFeePerGas: quantityToBigInt(block.baseFeePerGas) }),
							...(quantityToBigInt(block.blobGasUsed) != null && { blobGasUsed: quantityToBigInt(block.blobGasUsed) }),
							...(quantityToBigInt(block.excessBlobGas) != null && { excessBlobGas: quantityToBigInt(block.excessBlobGas) }),
							transactionCount: block.transactions.length,
						}
					},
				},
			},
		})({
			blockNumber: (block) => block.blockNumber,
			$parent: (block) => block.$parent,
			timestamp: (block) => block.timestamp,
			$miner: (block) => block.$miner,
			gasUsed: (block) => block.gasUsed,
			gasLimit: (block) => block.gasLimit,
			baseFeePerGas: (block) => block.baseFeePerGas,
			blobGasUsed: (block) => block.blobGasUsed,
			excessBlobGas: (block) => block.excessBlobGas,
			transactionCount: (block) => block.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					appliesTo: zeroGNetworkReferenceApplicability,
					resolve: async ({ $actor, $network }) => {
						assertZeroGMainnetChain($network)
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											$actor,
										},
										timestampMs: Date.now(),
										source: Source.ZeroGChain_JsonRpc,
									},
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					appliesTo: zeroGNetworkReferenceApplicability,
					resolve: async ({ $network, txHash }) => {
						assertZeroGMainnetChain($network)
						const {
							getTransactionByHash,
							getTransactionReceipt,
						} = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
						const transaction = await getTransactionByHash({ txHash })
						if (transaction == null) throw new Error(`ZeroGChain_JsonRpc: transaction not found ${txHash}`)
						const receipt = await getTransactionReceipt({ txHash })
						const value = quantityToBigInt(transaction.value) ?? 0n
						const fromAddress = hexLowerOfByteSize(transaction.from, 20)
						const toAddress = (
							transaction.to == null ?
								undefined
							:
								hexLowerOfByteSize(transaction.to, 20)
						)
						const contractAddress = (
							receipt?.contractAddress == null ?
								undefined
							:
								hexLowerOfByteSize(receipt.contractAddress, 20)
						)
						const blockNumber = quantityToBigInt(transaction.blockNumber)
						const envelopeType = transactionEnvelopeTypeFromRpcType(transaction.type)
						if (fromAddress == null) throw new Error(`ZeroGChain_JsonRpc: transaction has invalid from address ${txHash}`)
						if (transaction.to != null && toAddress == null)
							throw new Error(`ZeroGChain_JsonRpc: transaction has invalid to address ${txHash}`)
						if (receipt?.contractAddress != null && contractAddress == null)
							throw new Error(`ZeroGChain_JsonRpc: transaction has invalid contract address ${txHash}`)
						return {
							...(blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber,
									},
								},
							}),
							$from: {
								[EntityMetaKey.Selector]: {
									address: fromAddress,
								},
							},
							...(toAddress != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: toAddress,
									},
								},
							}),
							...(contractAddress != null && {
								$contract: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: contractAddress,
									},
								},
							}),
							...(quantityToNumber(transaction.transactionIndex) != null && { indexInBlock: quantityToNumber(transaction.transactionIndex) }),
							value,
							...(quantityToNumber(transaction.nonce) != null && { nonce: quantityToNumber(transaction.nonce) }),
							input: with0xHex(transaction.input),
							r: with0xHex(transaction.r),
							s: with0xHex(transaction.s),
							...(transaction.v != null && { v: transaction.v }),
							...(quantityToBigInt(transaction.gas) != null && { gas: quantityToBigInt(transaction.gas) }),
							kind: transactionKind({
								value,
								to: transaction.to,
								input: transaction.input,
								contractAddress: receipt?.contractAddress,
							}),
							envelopeType,
							...(receipt?.status === '0x1' && { executionStatus: EvmTransactionExecutionStatus.Success }),
							...(receipt?.status === '0x0' && { executionStatus: EvmTransactionExecutionStatus.Failed }),
							...(quantityToBigInt(transaction.gasPrice) != null && { gasPrice: quantityToBigInt(transaction.gasPrice) }),
							...(quantityToBigInt(receipt?.gasUsed) != null && { gasUsed: quantityToBigInt(receipt?.gasUsed) }),
							...(quantityToBigInt(receipt?.cumulativeGasUsed) != null && { cumulativeGasUsed: quantityToBigInt(receipt?.cumulativeGasUsed) }),
							...(quantityToBigInt(receipt?.effectiveGasPrice) != null && { effectiveGasPrice: quantityToBigInt(receipt?.effectiveGasPrice) }),
							...(
								(
									envelopeType === EvmTransactionEnvelopeType.FeeMarket
									|| envelopeType === EvmTransactionEnvelopeType.Blob
									|| envelopeType === EvmTransactionEnvelopeType.SetCode
								) && {
									...(quantityToBigInt(transaction.maxFeePerGas) != null && { maxFeePerGas: quantityToBigInt(transaction.maxFeePerGas) }),
									...(quantityToBigInt(transaction.maxPriorityFeePerGas) != null && { maxPriorityFeePerGas: quantityToBigInt(transaction.maxPriorityFeePerGas) }),
								}
							),
							...(envelopeType === EvmTransactionEnvelopeType.Blob && {
								...(quantityToBigInt(receipt?.blobGasUsed) != null && { blobGasUsed: quantityToBigInt(receipt?.blobGasUsed) }),
								...(quantityToBigInt(transaction.maxFeePerBlobGas) != null && { maxFeePerBlobGas: quantityToBigInt(transaction.maxFeePerBlobGas) }),
							}),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			ContractCreation: {
				$contract: (transaction) => transaction.$contract,
			},
			indexInBlock: (transaction) => transaction.indexInBlock,
			value: (transaction) => transaction.value,
			nonce: (transaction) => transaction.nonce,
			input: (transaction) => transaction.input,
			r: (transaction) => transaction.r,
			s: (transaction) => transaction.s,
			v: (transaction) => transaction.v,
			gas: (transaction) => transaction.gas,
			kind: (transaction) => transaction.kind,
			envelopeType: (transaction) => transaction.envelopeType,
			executionStatus: (transaction) => transaction.executionStatus,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			cumulativeGasUsed: (transaction) => transaction.cumulativeGasUsed,
			effectiveGasPrice: (transaction) => transaction.effectiveGasPrice,
			FeeMarket: {
				maxFeePerGas: (transaction) => transaction.maxFeePerGas,
				maxPriorityFeePerGas: (transaction) => transaction.maxPriorityFeePerGas,
			},
			Blob: {
				blobGasUsed: (transaction) => transaction.blobGasUsed,
				maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					appliesTo: zeroGNetworkReferenceApplicability,
					resolve: async ({ $network, blockNumber }, context) => {
						assertZeroGMainnetChain($network)
						const { getBlockWithTransactionsByNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
						const block = await getBlockWithTransactionsByNumber(blockNumber)
						if (block == null) throw new Error(`ZeroGChain_JsonRpc: block not found ${blockNumber.toString()}`)
						const rowLimit = resolverContextRowLimit(context)
						return block.transactions
							.slice(0, rowLimit)
							.flatMap((transaction) => {
								const txHash = hexLowerOfByteSize(transaction.hash, 32)
								return txHash == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network,
											txHash,
										},
									}]
							})
					},
				},
			},
		})({
			$$transactions: (transactions) => transactions,
		}),
	],
} satisfies RegisteredSourceResolverModule
