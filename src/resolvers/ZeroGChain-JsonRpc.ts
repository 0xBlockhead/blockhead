import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { zeroGChainId } from '$/constants/ZeroGNetwork.ts'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { RpcBlockHeader } from '$/sources/Evm/JsonRpc/types.ts'

const assertZeroGMainnetChain = (network: { caip2: { namespace: string; reference: string } }) => {
	if (network.caip2.namespace !== 'eip155' || network.caip2.reference !== String(zeroGChainId)) {
		throw new Error('ZeroGChain_JsonRpc: unsupported chain')
	}
}

const assertZeroGMainnet = (network: { networkSlug: string }) => {
	if (network.networkSlug !== '0g') {
		throw new Error('ZeroGChain_JsonRpc: unsupported network')
	}
}

const zeroGEvmNetworkId = {
	caip2: {
		namespace: 'eip155',
		reference: String(zeroGChainId),
	},
} as const

const quantityToBigInt = (value: string | undefined): bigint | undefined => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const quantityToNumber = (value: string | undefined): number | undefined => (
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
		defineResolver(Source.ZeroGChain_JsonRpc, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnet(entityId)
				return {}
			}
			}
		})({
				fields: {},
			}),

		defineResolver(Source.ZeroGChain_JsonRpc, {
			entityType: EntityType.EvmBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnetChain(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					blockNumber: entityId.blockNumber,
					txObjects: false,
				})
				if (block == null) throw new Error(`ZeroGChain_JsonRpc: block not found ${entityId.blockNumber.toString()}`)
				const minerAddress = hexLowerOfByteSize(block.miner ?? '', 20)
				const parentHash = hexLowerOfByteSize(block.parentHash ?? '', 32)
				return {
					number: quantityToBigInt(block.number) ?? entityId.blockNumber,
					...(parentHash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: entityId.blockNumber - 1n,
								hash: parentHash,
							},
						},
					}),
						...((timestamp) => (
							timestamp != null && { timestamp: timestamp * 1000 }
						))(quantityToNumber(block.timestamp)),
					...(minerAddress != null && {
						$miner: {
							[EntityMetaKey.Id]: {
								address: minerAddress,
							},
						},
					}),
					...(quantityToBigInt(block.gasUsed) != null && { gasUsed: quantityToBigInt(block.gasUsed) }),
					...(quantityToBigInt(block.gasLimit) != null && { gasLimit: quantityToBigInt(block.gasLimit) }),
					...(quantityToBigInt(block.baseFeePerGas) != null && { baseFeePerGas: quantityToBigInt(block.baseFeePerGas) }),
					...(quantityToBigInt(block.blobGasUsed) != null && { blobGasUsed: quantityToBigInt(block.blobGasUsed) }),
					...(quantityToBigInt(block.excessBlobGas) != null && { excessBlobGas: quantityToBigInt(block.excessBlobGas) }),
					...(block.transactions != null && { transactionCount: block.transactions.length }),
				}
			}
			}
		})({
				fields: {
			number: (block) => block.number,
			$parent: (block) => block.$parent,
			timestamp: (block) => block.timestamp,
			$miner: (block) => block.$miner,
			gasUsed: (block) => block.gasUsed,
			gasLimit: (block) => block.gasLimit,
			baseFeePerGas: (block) => block.baseFeePerGas,
			blobGasUsed: (block) => block.blobGasUsed,
			excessBlobGas: (block) => block.excessBlobGas,
			transactionCount: (block) => block.transactionCount,
		},
			}),

		defineResolver(Source.ZeroGChain_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnetChain(entityId.$network)
				const {
					getTransactionByHash,
					getTransactionReceipt,
				} = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
				const transaction = await getTransactionByHash({ txHash: entityId.txHash })
				if (transaction == null) throw new Error(`ZeroGChain_JsonRpc: transaction not found ${entityId.txHash}`)
				const receipt = await getTransactionReceipt({ txHash: entityId.txHash })
				const value = quantityToBigInt(transaction.value) ?? 0n
				const fromAddress = hexLowerOfByteSize(transaction.from ?? '', 20)
				const toAddress = hexLowerOfByteSize(transaction.to ?? '', 20)
				const contractAddress = hexLowerOfByteSize(receipt?.contractAddress ?? '', 20)
				const blockNumber = quantityToBigInt(transaction.blockNumber)
				const blockHash = hexLowerOfByteSize(transaction.blockHash ?? '', 32)
				const envelopeType = transactionEnvelopeTypeFromRpcType(transaction.type)
				if (fromAddress == null) throw new Error(`ZeroGChain_JsonRpc: transaction has invalid from address ${entityId.txHash}`)
				return {
					...(blockNumber != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber,
								...(blockHash != null && { hash: blockHash }),
							},
						},
					}),
					$from: {
						[EntityMetaKey.Id]: {
							address: fromAddress,
						},
					},
					...(toAddress != null && {
						$to: {
							[EntityMetaKey.Id]: {
								address: toAddress,
							},
						},
					}),
					...(contractAddress != null && {
						$contract: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: contractAddress,
							},
						},
					}),
					...(quantityToNumber(transaction.transactionIndex) != null && { transactionIndex: quantityToNumber(transaction.transactionIndex) }),
					value,
					...(quantityToNumber(transaction.nonce) != null && { nonce: quantityToNumber(transaction.nonce) }),
					...(transaction.input != null && { input: with0xHex(transaction.input) }),
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
			}
			}
		})({
				fields: {
			$block: (transaction) => transaction.$block,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			$contract: (transaction) => transaction.$contract,
			transactionIndex: (transaction) => transaction.transactionIndex,
			value: (transaction) => transaction.value,
			nonce: (transaction) => transaction.nonce,
			input: (transaction) => transaction.input,
			gas: (transaction) => transaction.gas,
			kind: (transaction) => transaction.kind,
			envelopeType: (transaction) => transaction.envelopeType,
			executionStatus: (transaction) => transaction.executionStatus,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			cumulativeGasUsed: (transaction) => transaction.cumulativeGasUsed,
			effectiveGasPrice: (transaction) => transaction.effectiveGasPrice,
			maxFeePerGas: (transaction) => transaction.maxFeePerGas,
			maxPriorityFeePerGas: (transaction) => transaction.maxPriorityFeePerGas,
			blobGasUsed: (transaction) => transaction.blobGasUsed,
			maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
		},
			}),

		defineResolver(Source.ZeroGChain_JsonRpc, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnet(entityId)
				const { getBlockByNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					blockNumber: 'latest',
					txObjects: false,
				})
				if (block == null) throw new Error('ZeroGChain_JsonRpc: latest block not found')
				const headBlockNumber = quantityToBigInt(block.number)
				const headTimestamp = quantityToNumber(block.timestamp)
				const gasUsed = quantityToBigInt(block.gasUsed)
				const gasLimit = quantityToBigInt(block.gasLimit)
				const baseFeePerGas = quantityToBigInt(block.baseFeePerGas)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: headTimestamp == null ? Date.now() : headTimestamp * 1000,
						},
						...(headBlockNumber != null && { headBlockNumber }),
						...(block.hash != null && { headBlockHash: block.hash }),
						...(headTimestamp != null && { headTimestampMs: headTimestamp * 1000 }),
						...(block.transactions != null && { transactionCount: block.transactions.length }),
						...(gasUsed != null && { gasUsed }),
						...(gasLimit != null && { gasLimit }),
						...(baseFeePerGas != null && { baseFeePerGas }),
					},
				]
			}
			}
		})({
				fields: {
			$$timestamps: (timestamps) => timestamps,
		},
			}),

		defineResolver(Source.ZeroGChain_JsonRpc, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertZeroGMainnet(entityId)
				const { getBlockNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
				const headBlockNumber = BigInt(await getBlockNumber())
				return Array.from({
					length: Math.min(
						Number(headBlockNumber + 1n),
						resolverContextRowLimit(context),
					),
				}, (_value, blockOffset) => ({
					[EntityMetaKey.Id]: {
						$network: zeroGEvmNetworkId,
						blockNumber: headBlockNumber - BigInt(blockOffset),
					},
				}))
			}
			}
		})({
				fields: {
			$$blocks: (blocks) => blocks,
		},
			}),

		defineResolver(Source.ZeroGChain_JsonRpc, {
			entityType: EntityType.EvmBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnetChain(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					blockNumber: entityId.blockNumber,
					txObjects: true,
				})
				if (block == null) throw new Error(`ZeroGChain_JsonRpc: block not found ${entityId.blockNumber.toString()}`)
				return (block.transactions ?? []).flatMap((transaction) => {
					if (typeof transaction === 'string') return []
					const txHash = hexLowerOfByteSize(transaction.hash ?? '', 32)
					return txHash == null ?
						[]
					:
						[{
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								txHash,
							},
						}]
				})
			}
			}
		})({
				fields: {
			$$transactions: (transactions) => transactions,
		},
			}),
	],
}
