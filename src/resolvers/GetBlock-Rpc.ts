import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type Entity,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

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
		throw new Error(`GetBlockRpc_JsonRpc: malformed ${fieldName}`)
	}
}

const safeNumberQuantity = (
	value: string | null,
	fieldName: string
) => {
	if (value == null)
		return undefined

	const parsed = quantity(value, fieldName)
	const number = Number(parsed)
	if (!Number.isSafeInteger(number))
		throw new Error(`GetBlockRpc_JsonRpc: ${fieldName} exceeds safe integer range`)

	return number
}

export default {
	source: Source.GetBlockRpc_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						if (
							$network.caip2.namespace !== 'eip155'
							|| $network.caip2.reference !== networkBySlug.ethereum.caip2.reference
						)
							throw new Error(`GetBlockRpc_JsonRpc: unsupported network ${$network.caip2.namespace}:${$network.caip2.reference}`)

						const {
							getTransactionByHash,
							getTransactionReceipt,
						} = await import('$/sources/GetBlock/Rpc/queries.ts')
						const [transaction, receipt] = await Promise.all([
							getTransactionByHash({ txHash }),
							getTransactionReceipt({ txHash }),
						])
						if (transaction == null)
							throw new Error(`GetBlockRpc_JsonRpc: transaction not found ${txHash}`)
						if (
							transaction.hash.toLowerCase() !== txHash.toLowerCase()
							|| (
								receipt != null
								&& receipt.transactionHash.toLowerCase() !== txHash.toLowerCase()
							)
						)
							throw new Error('GetBlockRpc_JsonRpc: transaction identity mismatch')

						const fromAddress = hexLowerOfByteSize(transaction.from, 20)
						const toAddress = transaction.to == null ? undefined : hexLowerOfByteSize(transaction.to, 20)
						if (fromAddress == null)
							throw new Error('GetBlockRpc_JsonRpc: malformed from address')
						if (transaction.to != null && toAddress == null)
							throw new Error('GetBlockRpc_JsonRpc: malformed to address')

						return {
							...(transaction.blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: BigInt(transaction.blockNumber),
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
							value: quantity(transaction.value, 'value'),
							nonce: safeNumberQuantity(transaction.nonce, 'nonce'),
							indexInBlock: safeNumberQuantity(transaction.transactionIndex, 'transaction index'),
							gas: quantity(transaction.gas, 'gas'),
							gasPrice: transaction.gasPrice == null ? undefined : quantity(transaction.gasPrice, 'gas price'),
							gasUsed: receipt == null ? undefined : quantity(receipt.gasUsed, 'gas used'),
							cumulativeGasUsed: receipt == null ? undefined : quantity(receipt.cumulativeGasUsed, 'cumulative gas used'),
							effectiveGasPrice: receipt?.effectiveGasPrice == null ? undefined : quantity(receipt.effectiveGasPrice, 'effective gas price'),
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
										throw new Error('GetBlockRpc_JsonRpc: malformed receipt status')
									})()
							),
							$$logs: (receipt?.logs ?? []).map((log) => ({
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
			$$logs: {
				select: (transaction) => transaction.$$logs,
				resolveCount: (transaction) => transaction.$$logs.length,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
import { networkBySlug } from '$/constants/Network.ts'
