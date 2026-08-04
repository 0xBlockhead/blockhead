import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	evmChainIdFromNetworkSelector,
	evmNetworkSelectorFromChainId,
} from '$/resolvers/evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	requireSafeTransactionServiceBinding,
	safeTransactionServiceChainIds,
} from '$/sources/SafeTransactionService/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const assertSupportedSafeChain = (
	chainId: number
) => {
	requireSafeTransactionServiceBinding(chainId)
	return chainId
}

export default {
	source: Source.SafeTransactionService_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({
						$network,
						address: addressSelector,
					}) => {
						const chainId = assertSupportedSafeChain(evmChainIdFromNetworkSelector($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeStatus,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						const status = await getSafeStatus({
							chainId,
							safeAddress: address,
						})
						const masterCopy = hexLowerOfByteSize(status.masterCopy, 20)
						if (masterCopy == null)
							throw new Error('SafeTransactionService_Rest: masterCopy not normalized')

						return {
							$implementation: {
								[EntityMetaKey.Selector]: {
									$network: evmNetworkSelectorFromChainId(chainId),
									address: masterCopy,
								},
							},
						}
					},
				},
			},
		})({
			$implementation: (contract) => contract.$implementation,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({
						$actor,
						$network,
					}, context) => {
						const chainId = assertSupportedSafeChain(evmChainIdFromNetworkSelector($network))
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeMultisigTransactions,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						const page = await getSafeMultisigTransactions({
							chainId,
							safeAddress: address,
							limit: Math.min(100, Math.max(1, resolverContextRowLimit(context))),
							offset: context.pagination.offset ?? 0,
							executed: true,
						})
						return page.count
					},
				},
			},
		})({
			$$transactions: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({
						$actor,
						$network,
					}, context) => {
						const chainId = assertSupportedSafeChain(evmChainIdFromNetworkSelector($network))
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeMultisigTransactions,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						const page = await getSafeMultisigTransactions({
							chainId,
							safeAddress: address,
							limit: Math.min(100, Math.max(1, resolverContextRowLimit(context))),
							offset: context.pagination.offset ?? 0,
							executed: true,
						})
						return (
							page.results.map((transaction) => {
								const txHash = hexLowerOfByteSize(transaction.transactionHash ?? '', 32)
								if (txHash == null)
									throw new Error('SafeTransactionService_Rest: executed transaction missing execution hash')

								return {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkSelectorFromChainId(chainId),
										txHash,
									},
								}
							})
						)
					},
				},
			},
		})({
			$$transactions: (transactions) => transactions,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.SafeTransactionService_Rest>

export const safeTransactionServiceSupportedChainIds = safeTransactionServiceChainIds
