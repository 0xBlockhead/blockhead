import { networkBySlug } from '$/constants/Network.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { InternetComputerRosettaTransaction } from '$/sources/InternetComputer/RosettaApi/types.ts'
import { Source } from '$/sources/Source.ts'


export const icpLedgerCanisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai'

type IcpNetworkId = EntitySelector<typeof schema, EntityType.IcpNetwork>
type IcpLedgerCanisterId = EntitySelector<typeof schema, EntityType.IcpLedgerCanister>

const icpNetworkApplicability = [{
	$network: {
		slug: networkBySlug.icp.slug,
	},
}] as const

const icpLedgerCanisterApplicability = [{
	$canister: {
		$network: {
			$network: {
				slug: networkBySlug.icp.slug,
			},
		},
		canisterId: icpLedgerCanisterId,
	},
}] as const

const assertIcpNetwork = (
	network: IcpNetworkId
) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug.icp.slug
	)
		return

	throw new Error('InternetComputer_RosettaApi: unsupported network')
}

const assertIcpLedgerCanister = (
	ledger: IcpLedgerCanisterId
) => {
	assertIcpNetwork(ledger.$canister.$network)
	if (ledger.$canister.canisterId !== icpLedgerCanisterId)
		throw new Error('InternetComputer_RosettaApi: unsupported ICP ledger canister')
}

const ownerEqualityFilter = (
	context: ResolverContext
) => {
	const owners = context.filters.flatMap((filter) => (
		filter.fieldPath.length === 1
		&& filter.fieldPath[0] === 'owner'
		&& filter.operator === 'eq'
		&& typeof filter.value === 'string' ?
			[filter.value]
		:
			[]
	))
	if (owners.length > 1)
		throw new Error('InternetComputer_RosettaApi: conflicting owner filters')
	return owners[0]
}

const transactionFields = (
	transaction: InternetComputerRosettaTransaction
) => {
	let fromAccount: string | undefined
	let toAccount: string | undefined
	let spenderAccount: string | undefined
	let amount: bigint | undefined
	let fee: bigint | undefined
	let operationKind: string | undefined

	for (const operation of transaction.operations) {
		if (operation.type === 'FEE' && operation.amount != null) {
			fee = absAmount(operation.amount.value)
			continue
		}
		if (operation.type === 'APPROVE' && operation.account != null) {
			spenderAccount = operation.account.address
			operationKind ??= operation.type
			if (operation.amount != null)
				amount = absAmount(operation.amount.value)
			continue
		}
		if (operation.amount == null || operation.account == null)
			continue
		const signed = BigInt(operation.amount.value)
		operationKind ??= operation.type
		if (signed < 0n) {
			fromAccount = operation.account.address
			amount ??= -signed
		} else if (signed > 0n) {
			toAccount = operation.account.address
			amount ??= signed
		}
	}

	return {
		...(operationKind != null && {
			operationKind,
		}),
		...(fromAccount != null && {
			fromAccount,
		}),
		...(toAccount != null && {
			toAccount,
		}),
		...(spenderAccount != null && {
			spenderAccount,
		}),
		...(amount != null && {
			amount,
		}),
		...(fee != null && {
			fee,
		}),
		...(transaction.metadata?.memo != null && {
			memo: BigInt(transaction.metadata.memo),
		}),
		...(transaction.metadata?.created_at_time != null && {
			createdAtTimeNs: BigInt(transaction.metadata.created_at_time),
		}),
	}
}

const absAmount = (
	value: string
) => {
	const signed = BigInt(value)
	return signed < 0n ? -signed : signed
}

const ledgerBlockFields = (
	block: {
		block_identifier: {
			index: number
			hash: string
		}
		parent_block_identifier: {
			hash: string
		}
		timestamp: number
		transactions: InternetComputerRosettaTransaction[]
	}
) => ({
	blockHash: block.block_identifier.hash,
	parentHash: block.parent_block_identifier.hash,
	timestampNs: BigInt(block.timestamp) * (
		block.timestamp > 1_000_000_000_000_000 ?
			1n
		:
			1_000_000n
	),
	transactionCount: block.transactions.length,
})

const ledgerTransactionProjection = (
	ledger: IcpLedgerCanisterId,
	blockIdentifier: {
		index: number
		hash: string
	},
	transaction: InternetComputerRosettaTransaction,
	transactionIndex: number
) => {
	const fields = transactionFields(transaction)
	return {
		[EntityMetaKey.Selector]: {
			$block: {
				$ledger: ledger,
				blockIndex: BigInt(blockIdentifier.index),
			},
			transactionIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'transactionHash')]: transaction.transaction_identifier.hash,
			...(fields.operationKind != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'operationKind')]: fields.operationKind,
			}),
			...(fields.fromAccount != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'fromAccount')]: fields.fromAccount,
			}),
			...(fields.toAccount != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'toAccount')]: fields.toAccount,
			}),
			...(fields.spenderAccount != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'spenderAccount')]: fields.spenderAccount,
			}),
			...(fields.amount != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'amount')]: fields.amount,
			}),
			...(fields.fee != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'fee')]: fields.fee,
			}),
			...(fields.memo != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'memo')]: fields.memo,
			}),
			...(fields.createdAtTimeNs != null && {
				[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'createdAtTimeNs')]: fields.createdAtTimeNs,
			}),
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], '$ledger')]: {
				[EntityMetaKey.Selector]: ledger,
			},
		},
	}
}

const ledgerBlockProjection = (
	ledger: IcpLedgerCanisterId,
	block: {
		block_identifier: {
			index: number
			hash: string
		}
		parent_block_identifier: {
			hash: string
		}
		timestamp: number
		transactions: InternetComputerRosettaTransaction[]
	}
) => {
	const fields = ledgerBlockFields(block)
	return {
		[EntityMetaKey.Selector]: {
			$ledger: ledger,
			blockIndex: BigInt(block.block_identifier.index),
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'blockHash')]: fields.blockHash,
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'parentHash')]: fields.parentHash,
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'timestampNs')]: fields.timestampNs,
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'transactionCount')]: fields.transactionCount,
		},
	}
}

export default {
	source: Source.InternetComputer_RosettaApi,

	resolvers: [
		defineResolver({
			entityType: EntityType.IcpNetwork,
			resolve: {
				Network: {
					appliesTo: icpNetworkApplicability,
					resolve: async ($network) => {
						assertIcpNetwork($network)
						return [{
							[EntityMetaKey.Selector]: {
								$canister: {
									$network,
									canisterId: icpLedgerCanisterId,
								},
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.IcpLedgerCanister, [], 'ledgerStandard')]: 'icp',
							},
						}]
					},
				},
			},
		})({
			$$ledgerCanisters: (ledgerCanisters) => ledgerCanisters,
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerCanister,
			resolve: {
				Canister: {
					appliesTo: icpLedgerCanisterApplicability,
					resolve: async (ledger) => {
						assertIcpLedgerCanister(ledger)
						return {
							ledgerStandard: 'icp',
						}
					},
				},
			},
		})({
			ledgerStandard: (ledger) => ledger.ledgerStandard,
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerCanister,
			resolve: {
				Canister: {
					appliesTo: icpLedgerCanisterApplicability,
					resolve: async (ledger) => {
						assertIcpLedgerCanister(ledger)
						const {
							getNetworkOptions,
							getNetworkStatus,
						} = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const [
							status,
							options,
						] = await Promise.all([
							getNetworkStatus(),
							getNetworkOptions(),
						])
						const timestampMs = Date.now()
						return [{
							[EntityMetaKey.Selector]: {
								$ledger: ledger,
								timestampMs,
								source: Source.InternetComputer_RosettaApi,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'symbol')]: 'ICP',
								[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'name')]: 'Internet Computer',
								[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'decimals')]: 8,
								[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'latestBlockIndex')]: BigInt(status.current_block_identifier.index),
								[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'supportedStandards')]: (
									options.allow.operation_types.includes('APPROVE') ?
										['icrc-1', 'icrc-2']
									:
										['icp']
								),
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerCanister,
			resolve: {
				Canister: {
					appliesTo: icpLedgerCanisterApplicability,
					resolve: async (ledger, context) => {
						assertIcpLedgerCanister(ledger)
						const owner = ownerEqualityFilter(context)
						if (owner == null || resolverContextRowLimit(context) === 0)
							return []

						const { getAccountBalance } = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const balance = await getAccountBalance(owner)
						const timestampMs = Date.now()
						return [{
							[EntityMetaKey.Selector]: {
								$ledger: ledger,
								owner,
								timestampMs,
								source: Source.InternetComputer_RosettaApi,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.IcpLedgerAccount_Timestamp, [], 'balance')]: BigInt(balance.balances[0].value),
							},
						}]
					},
				},
			},
		})({
			$$accountTimestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerCanister,
			resolve: {
				Canister: {
					appliesTo: icpLedgerCanisterApplicability,
					resolve: async (ledger, context) => {
						assertIcpLedgerCanister(ledger)
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return {
								maxBlock: undefined,
								limit,
								blocks: [],
							}

						const maxBlock = (
							context.providerContinuationToken == null ?
								undefined
							:
								Number(context.providerContinuationToken)
						)
						if (
							context.providerContinuationToken != null
							&& (
								!Number.isSafeInteger(maxBlock)
								|| maxBlock < 0
								|| maxBlock.toString() !== context.providerContinuationToken
							)
						)
							throw new Error('InternetComputer_RosettaApi: invalid block continuation')

						const {
							getBlock,
							getNetworkStatus,
						} = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const tipIndex = maxBlock ?? (
							await getNetworkStatus()
						).current_block_identifier.index
						const blocks = await Promise.all(
							Array.from(
								{
									length: Math.min(limit, tipIndex + 1),
								},
								(_, offset) => getBlock({
									index: tipIndex - offset,
								})
							)
						)
						return {
							maxBlock: tipIndex,
							limit,
							blocks: blocks.map((response) => response.block),
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (page, ledger) => page.blocks.map((block) => ledgerBlockProjection(ledger, block)),
				continuation: (page) => {
					if (page.limit === 0 || page.blocks.length === 0 || page.maxBlock == null)
						return {
							operation: 'ledger-blocks',
							terminal: true,
						}

					const nextMaxBlock = page.maxBlock - page.blocks.length
					if (nextMaxBlock < 0)
						return {
							operation: 'ledger-blocks',
							terminal: true,
						}

					return {
						operation: 'ledger-blocks',
						terminal: false,
						token: nextMaxBlock.toString(),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerCanister,
			resolve: {
				Canister: {
					appliesTo: icpLedgerCanisterApplicability,
					resolve: async (ledger, context) => {
						assertIcpLedgerCanister(ledger)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						if (limit === 0)
							return {
								owner: undefined,
								offset: undefined,
								limit,
								next_offset: undefined,
								transactions: [],
							}

						const owner = ownerEqualityFilter(context)
						const offset = (
							context.providerContinuationToken == null ?
								undefined
							:
								Number(context.providerContinuationToken)
						)
						if (
							context.providerContinuationToken != null
							&& (
								!Number.isSafeInteger(offset)
								|| offset < 0
								|| offset.toString() !== context.providerContinuationToken
							)
						)
							throw new Error('InternetComputer_RosettaApi: invalid transaction continuation')

						const {
							getAccountTransactions,
							searchTransactions,
						} = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const page = owner == null ?
							await searchTransactions({
								limit,
								offset,
							})
						:
							await getAccountTransactions({
								accountIdentifier: owner,
								limit,
								offset,
							})
						return {
							owner,
							offset,
							limit,
							...page,
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page, ledger) => page.transactions.map((blockTransaction) => (
					ledgerTransactionProjection(
						ledger,
						blockTransaction.block_identifier,
						blockTransaction.transaction,
						0
					)
				)),
				continuation: (page) => {
					if (page.limit === 0 || page.next_offset == null)
						return {
							operation: 'ledger-transactions',
							terminal: true,
						}

					if (page.next_offset === page.offset)
						throw new Error('InternetComputer_RosettaApi: transaction continuation did not advance')
					return {
						operation: 'ledger-transactions',
						terminal: false,
						token: page.next_offset.toString(),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerBlock,
			resolve: {
				LedgerBlockIndex: {
					appliesTo: [{
						$ledger: icpLedgerCanisterApplicability[0],
					}],
					resolve: async ({ $ledger, blockIndex }) => {
						assertIcpLedgerCanister($ledger)
						if (blockIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('InternetComputer_RosettaApi: block index exceeds lossless JSON integer range')
						const { getBlock } = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const response = await getBlock({
							index: Number(blockIndex),
						})
						return ledgerBlockFields(response.block)
					},
				},
			},
		})({
			blockHash: (block) => block.blockHash,
			parentHash: (block) => block.parentHash,
			timestampNs: (block) => block.timestampNs,
			transactionCount: (block) => block.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerBlock,
			resolve: {
				LedgerBlockIndex: {
					appliesTo: [{
						$ledger: icpLedgerCanisterApplicability[0],
					}],
					resolve: async ({ $ledger, blockIndex }, context) => {
						assertIcpLedgerCanister($ledger)
						if (resolverContextRowLimit(context) === 0)
							return []
						if (blockIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('InternetComputer_RosettaApi: block index exceeds lossless JSON integer range')
						const { getBlock } = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const response = await getBlock({
							index: Number(blockIndex),
						})
						return response.block.transactions.map((transaction, transactionIndex) => (
							ledgerTransactionProjection(
								$ledger,
								response.block.block_identifier,
								transaction,
								transactionIndex
							)
						))
					},
				},
			},
		})({
			$$transactions: (transactions) => transactions,
		}),

		defineResolver({
			entityType: EntityType.IcpLedgerTransaction,
			resolve: {
				BlockTransactionIndex: {
					appliesTo: [{
						$block: {
							$ledger: icpLedgerCanisterApplicability[0],
						},
					}],
					resolve: async ({ $block, transactionIndex }) => {
						assertIcpLedgerCanister($block.$ledger)
						if ($block.blockIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('InternetComputer_RosettaApi: block index exceeds lossless JSON integer range')
						const { getBlock } = await import('$/sources/InternetComputer/RosettaApi/queries.ts')
						const response = await getBlock({
							index: Number($block.blockIndex),
						})
						const transaction = response.block.transactions[transactionIndex]
						if (transaction == null)
							throw new Error('InternetComputer_RosettaApi: transaction index out of range for ICP ledger block')
						return {
							transactionHash: transaction.transaction_identifier.hash,
							...transactionFields(transaction),
							$ledger: {
								[EntityMetaKey.Selector]: $block.$ledger,
							},
						}
					},
				},
			},
		})({
			transactionHash: (transaction) => transaction.transactionHash,
			operationKind: (transaction) => transaction.operationKind,
			fromAccount: (transaction) => transaction.fromAccount,
			toAccount: (transaction) => transaction.toAccount,
			spenderAccount: (transaction) => transaction.spenderAccount,
			amount: (transaction) => transaction.amount,
			fee: (transaction) => transaction.fee,
			memo: (transaction) => transaction.memo,
			createdAtTimeNs: (transaction) => transaction.createdAtTimeNs,
			$ledger: (transaction) => transaction.$ledger,
		}),
	],
} satisfies RegisteredSourceResolverModule
