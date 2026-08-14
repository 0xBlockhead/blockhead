import { SafeMultisigOperation } from '$/constants/Safe.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	evmChainIdFromNetworkSelector,
	evmNetworkSelectorFromChainId,
} from '$/resolvers/evm.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { SafeMultisigTransaction } from '$/sources/SafeTransactionService/Rest/types.ts'

const zeroAddress = `0x${'0'.repeat(40)}`

const safeTransactionPaginationOffset = (
	context: ResolverContext
) => {
	const offset = context.providerContinuationToken == null ?
		context.pagination.offset ?? 0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('SafeTransactionService_Rest: invalid transaction pagination offset')

	return offset
}

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

const timestampMsFromIso = (
	iso: string,
	label: string
) => {
	const timestampMs = Date.parse(iso)
	if (Number.isNaN(timestampMs))
		throw new Error(`SafeTransactionService_Rest: ${label} is not a timestamp`)

	return timestampMs
}

const optionalTimestampMsFromIso = (
	iso: string | null,
	label: string
) => (
	iso == null ?
		undefined
	:
		timestampMsFromIso(iso, label)
)

const safeMultisigOperationFromWire = (
	operation: 0 | 1
) => (
	operation === 0 ?
		SafeMultisigOperation.Call
	:
		SafeMultisigOperation.DelegateCall
)

const safeMultisigSnapshotFromWire = ({
	chainId,
	transaction,
}: {
	chainId: number
	transaction: SafeMultisigTransaction
}) => {
	const $network = evmNetworkSelectorFromChainId(chainId)
	const safeTxHash = hexLowerOfByteSize(transaction.safeTxHash, 32)
	const gasToken = hexLowerOfByteSize(transaction.gasToken, 20)
	if (safeTxHash == null)
		throw new Error('SafeTransactionService_Rest: Safe tx hash not normalized')
	if (gasToken == null)
		throw new Error('SafeTransactionService_Rest: gas token not normalized')

	const executionHash = (
		transaction.transactionHash == null ?
			undefined
		:
			hexLowerOfByteSize(transaction.transactionHash, 32)
	)
	if (transaction.transactionHash != null && executionHash == null)
		throw new Error('SafeTransactionService_Rest: execution hash not normalized')

	const executedAtMs = optionalTimestampMsFromIso(transaction.executionDate, 'executionDate')
	const data = (
		transaction.data == null || transaction.data === '0x' ?
			undefined
		:
			transaction.data.toLowerCase()
	)

	return {
		[EntityMetaKey.Selector]: {
			$network,
			safeTxHash,
		},
		$safe: contractRef(chainId, transaction.safe),
		$to: accountRef(transaction.to),
		value: BigInt(transaction.value),
		...(data != null && { data }),
		operation: safeMultisigOperationFromWire(transaction.operation),
		nonce: BigInt(transaction.nonce),
		safeTxGas: BigInt(transaction.safeTxGas),
		baseGas: BigInt(transaction.baseGas),
		gasPrice: BigInt(transaction.gasPrice),
		gasToken,
		$refundReceiver: accountRef(transaction.refundReceiver),
		...(transaction.proposer != null && {
			$proposer: accountRef(transaction.proposer),
		}),
		...(transaction.executor != null && {
			$executor: accountRef(transaction.executor),
		}),
		isExecuted: transaction.isExecuted,
		...(transaction.isSuccessful != null && {
			isSuccessful: transaction.isSuccessful,
		}),
		confirmationsRequired: transaction.confirmationsRequired,
		submittedAtMs: timestampMsFromIso(transaction.submissionDate, 'submissionDate'),
		...(executedAtMs != null && { executedAtMs }),
		modifiedAtMs: timestampMsFromIso(transaction.modified, 'modified'),
		...(executionHash != null && {
			$executionTransaction: {
				[EntityMetaKey.Selector]: {
					$network,
					txHash: executionHash,
				},
			},
		}),
	}
}

const safeMultisigReferenceFromWire = (
	chainId: number,
	transaction: SafeMultisigTransaction
) => {
	const snapshot = safeMultisigSnapshotFromWire({
		chainId,
		transaction,
	})
	const field = (
		name: Parameters<typeof entityFieldAddressKey>[2]
	) => entityFieldAddressKey(EntityType.SafeMultisigTransaction, [], name)

	return {
		[EntityMetaKey.Selector]: snapshot[EntityMetaKey.Selector],
		[EntityMetaKey.Fields]: {
			[field('$safe')]: snapshot.$safe,
			[field('$to')]: snapshot.$to,
			[field('value')]: snapshot.value,
			...(snapshot.data != null && {
				[field('data')]: snapshot.data,
			}),
			[field('operation')]: snapshot.operation,
			[field('nonce')]: snapshot.nonce,
			[field('safeTxGas')]: snapshot.safeTxGas,
			[field('baseGas')]: snapshot.baseGas,
			[field('gasPrice')]: snapshot.gasPrice,
			[field('gasToken')]: snapshot.gasToken,
			[field('$refundReceiver')]: snapshot.$refundReceiver,
			...(snapshot.$proposer != null && {
				[field('$proposer')]: snapshot.$proposer,
			}),
			...(snapshot.$executor != null && {
				[field('$executor')]: snapshot.$executor,
			}),
			[field('isExecuted')]: snapshot.isExecuted,
			...(snapshot.isSuccessful != null && {
				[field('isSuccessful')]: snapshot.isSuccessful,
			}),
			[field('confirmationsRequired')]: snapshot.confirmationsRequired,
			[field('submittedAtMs')]: snapshot.submittedAtMs,
			...(snapshot.executedAtMs != null && {
				[field('executedAtMs')]: snapshot.executedAtMs,
			}),
			[field('modifiedAtMs')]: snapshot.modifiedAtMs,
			...(snapshot.$executionTransaction != null && {
				[field('$executionTransaction')]: snapshot.$executionTransaction,
			}),
		},
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
							offset: safeTransactionPaginationOffset(context),
							executed: true,
						})
						return page.count
					},
				},
			},
		})({
			$$safeMultisigTransactions: {
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
							offset: safeTransactionPaginationOffset(context),
							executed: true,
						})
						return {
							nextOffset: page.nextOffset,
							transactions: page.results.map((transaction) => (
								safeMultisigReferenceFromWire(chainId, transaction)
							)),
						}
					},
				},
			},
		})({
			$$safeMultisigTransactions: {
				select: (snapshot) => snapshot.transactions,
				continuation: (snapshot) => ({
					operation: 'safe-executed-transactions',
					target: 'safe-transaction-service',
					terminal: snapshot.nextOffset == null,
					...(snapshot.nextOffset != null && {
						token: String(snapshot.nextOffset),
					}),
				}),
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
							offset: safeTransactionPaginationOffset(context),
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
							offset: safeTransactionPaginationOffset(context),
							executed: false,
						})
						return {
							nextOffset: page.nextOffset,
							transactions: page.results.map((transaction) => (
								safeMultisigReferenceFromWire(chainId, transaction)
							)),
						}
					},
				},
			},
		})({
			$$queuedTransactions: {
				select: (snapshot) => snapshot.transactions,
				continuation: (snapshot) => ({
					operation: 'safe-queued-transactions',
					target: 'safe-transaction-service',
					terminal: snapshot.nextOffset == null,
					...(snapshot.nextOffset != null && {
						token: String(snapshot.nextOffset),
					}),
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.SafeMultisigTransaction,
			resolve: {
				EvmNetworkSafeTxHash: {
					resolve: async ({
						$network,
						safeTxHash: safeTxHashSelector,
					}) => {
						const chainId = evmChainIdFromNetworkSelector($network)
						const safeTxHash = hexLowerOfByteSize(safeTxHashSelector, 32)
						if (safeTxHash == null)
							throw new Error('SafeTransactionService_Rest: Safe tx hash not normalized')

						const {
							getSafeMultisigTransaction,
							requireSafeTransactionServiceBinding,
						} = await import('$/sources/SafeTransactionService/Rest/queries.ts')
						requireSafeTransactionServiceBinding(chainId)
						const transaction = await getSafeMultisigTransaction({
							chainId,
							safeTxHash,
						})
						return safeMultisigSnapshotFromWire({
							chainId,
							transaction,
						})
					},
				},
			},
		})({
			$safe: (transaction) => transaction.$safe,
			$to: (transaction) => transaction.$to,
			value: (transaction) => transaction.value,
			data: (transaction) => transaction.data,
			operation: (transaction) => transaction.operation,
			nonce: (transaction) => transaction.nonce,
			safeTxGas: (transaction) => transaction.safeTxGas,
			baseGas: (transaction) => transaction.baseGas,
			gasPrice: (transaction) => transaction.gasPrice,
			gasToken: (transaction) => transaction.gasToken,
			$refundReceiver: (transaction) => transaction.$refundReceiver,
			$proposer: (transaction) => transaction.$proposer,
			$executor: (transaction) => transaction.$executor,
			isExecuted: (transaction) => transaction.isExecuted,
			isSuccessful: (transaction) => transaction.isSuccessful,
			confirmationsRequired: (transaction) => transaction.confirmationsRequired,
			submittedAtMs: (transaction) => transaction.submittedAtMs,
			executedAtMs: (transaction) => transaction.executedAtMs,
			modifiedAtMs: (transaction) => transaction.modifiedAtMs,
			$executionTransaction: (transaction) => transaction.$executionTransaction,
		}),
	],
} satisfies RegisteredSourceResolverModule
