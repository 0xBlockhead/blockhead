import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	evmChainIdFromNetworkSelector,
	evmNetworkSelectorFromChainId,
} from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { SafeMultisigTransaction } from '$/sources/SafeTransactionService/Rest/types.ts'

const zeroAddress = `0x${'0'.repeat(40)}`

const contractRef = (
	chainId: number,
	address: string
) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('SafeTransactionService_Rest: contract address not normalized')

	return {
		[EntityMetaKey.Selector]: {
			$network: evmNetworkSelectorFromChainId(chainId),
			address: normalized,
		},
	}
}

const accountRef = (
	address: string
) => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('SafeTransactionService_Rest: account address not normalized')

	return {
		[EntityMetaKey.Selector]: {
			address: normalized,
		},
	}
}

const evmTransactionKindFromSafeMultisig = (
	transaction: SafeMultisigTransaction
) => {
	const value = BigInt(transaction.value)
	const hasCalldata = transaction.data != null && transaction.data !== '0x'
	return (
		hasCalldata ?
			value > 0n ?
				EvmTransactionKind.NativeTransferAndCall
			:
				EvmTransactionKind.ContractCall
		:
			value > 0n ?
				EvmTransactionKind.NativeTransfer
			:
				EvmTransactionKind.ContractCall
	)
}

const evmTransactionSnapshotFromSafeMultisig = ({
	chainId,
	txHash,
	transaction,
}: {
	chainId: number
	txHash: string
	transaction: SafeMultisigTransaction
}) => {
	const $network = evmNetworkSelectorFromChainId(chainId)
	const safe = hexLowerOfByteSize(transaction.safe, 20)
	const to = hexLowerOfByteSize(transaction.to, 20)
	if (safe == null)
		throw new Error('SafeTransactionService_Rest: Safe address not normalized')
	if (to == null)
		throw new Error('SafeTransactionService_Rest: destination address not normalized')

	const executionStatus = (
		!transaction.isExecuted ?
			EvmTransactionExecutionStatus.Pending
		: transaction.isSuccessful === true ?
			EvmTransactionExecutionStatus.Success
		: transaction.isSuccessful === false ?
			EvmTransactionExecutionStatus.Failed
		:
			undefined
	)
	const blockNumber = (
		transaction.blockNumber == null ?
			undefined
		:
			BigInt(transaction.blockNumber)
	)

	return {
		[EntityMetaKey.Selector]: {
			$network,
			txHash,
		},
		envelopeType: EvmTransactionEnvelopeType.Unknown,
		kind: evmTransactionKindFromSafeMultisig(transaction),
		$from: accountRef(safe),
		$to: accountRef(to),
		value: BigInt(transaction.value),
		...(transaction.data != null && transaction.data !== '0x' && {
			input: transaction.data.toLowerCase(),
		}),
		...(executionStatus != null && { executionStatus }),
		...(blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network,
					blockNumber,
				},
			},
		}),
	}
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
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeStatus,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
						const status = await getSafeStatus({
							chainId,
							safeAddress: address,
						})
						const fallbackHandler = hexLowerOfByteSize(status.fallbackHandler, 20)
						if (fallbackHandler == null)
							throw new Error('SafeTransactionService_Rest: fallbackHandler not normalized')
						const guard = hexLowerOfByteSize(status.guard, 20)
						if (guard == null)
							throw new Error('SafeTransactionService_Rest: guard not normalized')

						return {
							$implementation: contractRef(chainId, status.masterCopy),
							threshold: status.threshold,
							nonce: status.nonce,
							...(status.version != null && {
								version: status.version,
							}),
							$$owners: status.owners.map(accountRef),
							$$modules: status.modules.map((moduleAddress) => (
								contractRef(chainId, moduleAddress)
							)),
							...(fallbackHandler !== zeroAddress && {
								$fallbackHandler: contractRef(chainId, fallbackHandler),
							}),
							...(guard !== zeroAddress && {
								$guard: contractRef(chainId, guard),
							}),
						}
					},
				},
			},
		})({
			$implementation: (contract) => contract.$implementation,
			threshold: (contract) => contract.threshold,
			nonce: (contract) => contract.nonce,
			version: (contract) => contract.version,
			$$owners: (contract) => contract.$$owners,
			$$modules: (contract) => contract.$$modules,
			$fallbackHandler: (contract) => contract.$fallbackHandler,
			$guard: (contract) => contract.$guard,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({
						$network,
						address: addressSelector,
					}) => {
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeCreation,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
						const creation = await getSafeCreation({
							chainId,
							safeAddress: address,
						})
						const txHash = hexLowerOfByteSize(creation.transactionHash, 32)
						if (txHash == null)
							throw new Error('SafeTransactionService_Rest: creation transaction hash not normalized')
						const creator = hexLowerOfByteSize(creation.creator, 20)
						if (creator == null)
							throw new Error('SafeTransactionService_Rest: creation creator not normalized')

						return {
							$creationTransaction: {
								[EntityMetaKey.Selector]: {
									$network: evmNetworkSelectorFromChainId(chainId),
									txHash,
								},
							},
							$deployer: {
								[EntityMetaKey.Selector]: {
									address: creator,
								},
							},
						}
					},
				},
			},
		})({
			$creationTransaction: (creation) => creation.$creationTransaction,
			$deployer: (creation) => creation.$deployer,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({
						$actor,
						$network,
					}, context) => {
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeMultisigTransactions,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
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
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeMultisigTransactions,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
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

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({
						$actor,
						$network,
					}, context) => {
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeMultisigTransactions,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
						const page = await getSafeMultisigTransactions({
							chainId,
							safeAddress: address,
							limit: Math.min(100, Math.max(1, resolverContextRowLimit(context))),
							offset: context.pagination.offset ?? 0,
							executed: false,
						})
						return page.count
					},
				},
			},
		})({
			$$queuedTransactions: {
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
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('SafeTransactionService_Rest: Safe address not normalized')

						const {
							getSafeMultisigTransactions,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
						const page = await getSafeMultisigTransactions({
							chainId,
							safeAddress: address,
							limit: Math.min(100, Math.max(1, resolverContextRowLimit(context))),
							offset: context.pagination.offset ?? 0,
							executed: false,
						})
						return (
							page.results.map((transaction) => {
								const txHash = hexLowerOfByteSize(transaction.safeTxHash, 32)
								if (txHash == null)
									throw new Error('SafeTransactionService_Rest: queued transaction missing Safe tx hash')

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
			$$queuedTransactions: (transactions) => transactions,
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({
						$network,
						txHash: txHashSelector,
					}) => {
						const chainId = evmChainIdFromNetworkSelector($network)
						const txHash = hexLowerOfByteSize(txHashSelector, 32)
						if (txHash == null)
							throw new Error('SafeTransactionService_Rest: transaction hash not normalized')

						const {
							getSafeMultisigTransaction,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
						const transaction = await getSafeMultisigTransaction({
							chainId,
							safeTxHash: txHash,
						})
						return evmTransactionSnapshotFromSafeMultisig({
							chainId,
							txHash,
							transaction,
						})
					},
				},
			},
		})({
			envelopeType: (transaction) => transaction.envelopeType,
			kind: (transaction) => transaction.kind,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			value: (transaction) => transaction.value,
			input: (transaction) => transaction.input,
			executionStatus: (transaction) => transaction.executionStatus,
			$block: (transaction) => transaction.$block,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.SafeTransactionService_Rest>
