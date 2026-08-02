import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type Entity,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { getTransaction } from '$/sources/Covalent/GoldRush/Rest/queries.ts'

const nonnegativeBigInt = (
	value: string
): bigint => {
	const parsed = BigInt(value)
	if (parsed < 0n)
		throw new Error(`GoldRushFoundational_Rest: expected nonnegative integer, received ${String(value)}`)

	return parsed
}

const nonnegativeSafeBigInt = (
	value: number
): bigint => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`GoldRushFoundational_Rest: expected nonnegative safe integer, received ${String(value)}`)

	return BigInt(value)
}

export default {
	source: Source.GoldRushFoundational_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						if ($network.caip2.namespace !== 'eip155')
							throw new Error('GoldRushFoundational_Rest: unsupported chain')

						const chainName = (
							$network.caip2.reference === '1' ?
								'eth-mainnet'
							:
								undefined
						)
						if (chainName == null)
							throw new Error(`GoldRushFoundational_Rest: unsupported chain ${$network.caip2.reference}`)

						const transaction = (await getTransaction({
							chainId: 1,
							chainName,
							txHash,
						})).items[0]
						const fromAddress = hexLowerOfByteSize(transaction.from_address, 20)
						const toAddress = transaction.to_address == null ? undefined : hexLowerOfByteSize(transaction.to_address, 20)
						if (fromAddress == null)
							throw new Error('GoldRushFoundational_Rest: transaction has an invalid from address')
						if (transaction.to_address != null && toAddress == null)
							throw new Error('GoldRushFoundational_Rest: transaction has an invalid to address')

						return {
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									blockNumber: BigInt(transaction.block_height),
								},
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							indexInBlock: transaction.tx_offset,
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
							value: nonnegativeBigInt(transaction.value),
							gas: nonnegativeSafeBigInt(transaction.gas_offered),
							gasPrice: nonnegativeSafeBigInt(transaction.gas_price),
							gasUsed: nonnegativeSafeBigInt(transaction.gas_spent),
							executionStatus: transaction.successful ?
								EvmTransactionExecutionStatus.Success
							:
								EvmTransactionExecutionStatus.Failed,
							$$logs: transaction.log_events.map((log) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network,
										txHash,
									},
									indexInTransaction: log.log_offset,
								},
							} satisfies Entity<typeof schema, EntityType.EvmLog>)),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
			indexInBlock: (transaction) => transaction.indexInBlock,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			value: (transaction) => transaction.value,
			gas: (transaction) => transaction.gas,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			executionStatus: (transaction) => transaction.executionStatus,
			$$logs: (transaction) => transaction.$$logs,
		}),
	],
} satisfies RegisteredSourceResolverModule
