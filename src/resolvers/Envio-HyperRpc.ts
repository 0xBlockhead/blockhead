import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type Entity,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { envioHyperRpcBinding } from '$/sources/Envio/HyperRpc/transport.ts'

const quantity = (
	value: string,
	fieldName: string
) => {
	try {
		const parsed = BigInt(value)
		if (parsed < 0n)
			throw new Error()

		return parsed
	} catch {
		throw new Error(`EnvioHyperRpc_JsonRpc: malformed ${fieldName}`)
	}
}

const safeNumberQuantity = (
	value: string | null | undefined,
	fieldName: string
) => {
	if (value == null)
		return undefined

	const parsed = quantity(value, fieldName)
	const number = Number(parsed)
	if (!Number.isSafeInteger(number))
		throw new Error(`EnvioHyperRpc_JsonRpc: ${fieldName} exceeds safe integer range`)

	return number
}
export default {
	source: Source.EnvioHyperRpc_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const {
							getTransactionByHash,
							getTransactionReceipt,
						} = await import('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts')
						const [transaction, receipt] = await Promise.all([
							getTransactionByHash({
								binding: envioHyperRpcBinding,
								txHash,
							}),
							getTransactionReceipt({
								binding: envioHyperRpcBinding,
								txHash,
							}),
						])
						if (transaction == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: transaction ${txHash} not found`)

						const fromAddress = hexLowerOfByteSize(transaction.from, 20)
						const toAddress = transaction.to == null ? undefined : hexLowerOfByteSize(transaction.to, 20)
						if (fromAddress == null)
							throw new Error('EnvioHyperRpc_JsonRpc: malformed from address')
						if (transaction.to != null && toAddress == null)
							throw new Error('EnvioHyperRpc_JsonRpc: malformed to address')

						const value = quantity(transaction.value, 'value')

						const envelopeType = (
							transaction.type == null || transaction.type === '0x0' ?
								EvmTransactionEnvelopeType.Legacy
							: transaction.type === '0x1' ?
								EvmTransactionEnvelopeType.AccessList
							: transaction.type === '0x2' ?
								EvmTransactionEnvelopeType.FeeMarket
							: transaction.type === '0x3' ?
								EvmTransactionEnvelopeType.Blob
							: transaction.type === '0x4' ?
								EvmTransactionEnvelopeType.SetCode
							:
								EvmTransactionEnvelopeType.Unknown
						)
						const contractAddress = receipt?.contractAddress == null ? undefined : hexLowerOfByteSize(receipt.contractAddress, 20)
						if (receipt?.contractAddress != null && contractAddress == null)
							throw new Error('EnvioHyperRpc_JsonRpc: malformed created contract address')

						return {
							...(transaction.blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: quantity(transaction.blockNumber, 'block number'),
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							$from: {
								[EntityMetaKey.Selector]: {
									address: fromAddress,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							...(toAddress != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: toAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							value,
							nonce: safeNumberQuantity(transaction.nonce, 'nonce'),
							indexInBlock: safeNumberQuantity(transaction.transactionIndex, 'transaction index'),
							gas: quantity(transaction.gas, 'gas'),
							gasPrice: transaction.gasPrice == null ? undefined : quantity(transaction.gasPrice, 'gas price'),
							gasUsed: receipt == null ? undefined : quantity(receipt.gasUsed, 'gas used'),
							cumulativeGasUsed: receipt == null ? undefined : quantity(receipt.cumulativeGasUsed, 'cumulative gas used'),
							effectiveGasPrice: receipt == null ? undefined : quantity(receipt.effectiveGasPrice, 'effective gas price'),
							input: with0xHex(transaction.input),
							r: with0xHex(transaction.r),
							s: with0xHex(transaction.s),
							v: transaction.v,
							executionStatus: (
								receipt == null ?
									EvmTransactionExecutionStatus.Pending
								: receipt.status === '0x1' ?
									EvmTransactionExecutionStatus.Success
								: receipt.status === '0x0' ?
									EvmTransactionExecutionStatus.Failed
								:
									(() => {
										throw new Error('EnvioHyperRpc_JsonRpc: malformed receipt status')
									})()
							),
							envelopeType,
							kind: (
								contractAddress != null || transaction.to == null ?
									EvmTransactionKind.ContractCreation
								: transaction.input !== '0x' && value > 0n ?
									EvmTransactionKind.NativeTransferAndCall
								: transaction.input !== '0x' ?
									EvmTransactionKind.ContractCall
								: value > 0n ?
									EvmTransactionKind.NativeTransfer
								:
									EvmTransactionKind.ContractCall
							),
							maxFeePerGas: transaction.maxFeePerGas == null ? undefined : quantity(transaction.maxFeePerGas, 'max fee per gas'),
							maxPriorityFeePerGas: transaction.maxPriorityFeePerGas == null ? undefined : quantity(transaction.maxPriorityFeePerGas, 'max priority fee per gas'),
							maxFeePerBlobGas: transaction.maxFeePerBlobGas == null ? undefined : quantity(transaction.maxFeePerBlobGas, 'max fee per blob gas'),
							blobGasUsed: receipt?.blobGasUsed == null ? undefined : quantity(receipt.blobGasUsed, 'blob gas used'),
							logs: (receipt?.logs ?? []).map((log) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network,
										txHash,
									},
									indexInTransaction: safeNumberQuantity(log.logIndex, 'log index'),
								},
							} satisfies Entity<typeof schema, EntityType.EvmLog>)),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			value: (transaction) => transaction.value,
			nonce: (transaction) => transaction.nonce,
			indexInBlock: (transaction) => transaction.indexInBlock,
			gas: (transaction) => transaction.gas,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			cumulativeGasUsed: (transaction) => transaction.cumulativeGasUsed,
			effectiveGasPrice: (transaction) => transaction.effectiveGasPrice,
			input: (transaction) => transaction.input,
			r: (transaction) => transaction.r,
			s: (transaction) => transaction.s,
			v: (transaction) => transaction.v,
			executionStatus: (transaction) => transaction.executionStatus,
			envelopeType: (transaction) => transaction.envelopeType,
			kind: (transaction) => transaction.kind,
			FeeMarket: {
				maxFeePerGas: (transaction) => transaction.maxFeePerGas,
				maxPriorityFeePerGas: (transaction) => transaction.maxPriorityFeePerGas,
			},
			Blob: {
				maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
				blobGasUsed: (transaction) => transaction.blobGasUsed,
			},
			$$logs: (transaction) => transaction.logs,
		}),
	],
} satisfies RegisteredSourceResolverModule
import { networkBySlug } from '$/constants/Network.ts'
