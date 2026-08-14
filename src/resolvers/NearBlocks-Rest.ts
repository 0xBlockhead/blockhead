import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { NearBlocksAccount, NearBlocksBlock, NearBlocksTransaction } from '$/sources/NearBlocks/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertNearMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.near.slug)
		throw new Error('NearBlocks_Rest: unsupported network')
}

const nearNanosToMs = (timestampNanos: string) => (
	Number(BigInt(timestampNanos) / 1_000_000n)
)

const accountDeleted = (
	deleted: NearBlocksAccount['deleted']
) => (
	deleted != null
	&& (
		deleted.transaction_hash != null
		|| deleted.block_timestamp != null
	)
)

const nearBlockFields = (
	$network: NetworkId,
	height: bigint,
	block: NearBlocksBlock
) => ({
	hash: block.block_hash,
	...(
		height > 0n
		&& block.prev_block_hash != null
		&& {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network,
					height: height - 1n,
					hash: block.prev_block_hash,
				},
			},
		}
	),
	...(block.epoch_id != null && {
		epochId: block.epoch_id,
	}),
	timestampMs: nearNanosToMs(block.block_timestamp),
})

const nearTransactionFields = (
	$network: NetworkId,
	hash: string,
	transaction: NearBlocksTransaction
) => ({
	signerAccountId: transaction.signer_account_id,
	$signer: {
		[EntityMetaKey.Selector]: {
			$network,
			accountId: transaction.signer_account_id,
		},
	},
	$receiver: {
		[EntityMetaKey.Selector]: {
			$network,
			accountId: transaction.receiver_account_id,
		},
	},
	...(transaction.nonce != null && {
		nonce: BigInt(transaction.nonce),
	}),
	$$actions: transaction.actions.map((action, actionIndex) => ({
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network,
				hash,
				signerAccountId: transaction.signer_account_id,
			},
			actionIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.NearAction, [], 'actionKind')]: action.action,
			...(action.method != null && {
				[entityFieldAddressKey(EntityType.NearAction, [], 'methodName')]: action.method,
			}),
			...(action.deposit != null && {
				[entityFieldAddressKey(EntityType.NearAction, [], 'depositYoctoNear')]: BigInt(action.deposit),
			}),
		},
	})),
	$$executionOutcomes: (
		transaction.outcomes == null ?
			[]
		:
			[
				{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network,
							hash,
							signerAccountId: transaction.signer_account_id,
						},
						outcomeId: hash,
					},
					[EntityMetaKey.Fields]: {
						...(transaction.outcomes.status != null && {
							[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'status')]: (
								transaction.outcomes.status ?
									'SuccessValue'
								:
									'Failure'
							),
						}),
						...(transaction.outcomes_agg?.gas_used != null && {
							[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'gasBurnt')]: (
								BigInt(transaction.outcomes_agg.gas_used)
							),
						}),
					},
				},
			]
	),
})

const nearBlockReferences = async (
	$network: NetworkId,
	limit: number
) => {
	assertNearMainnet($network)
	const { listBlocks } = await import('$/sources/NearBlocks/Rest/queries.ts')
	return (await listBlocks({
		limit,
	}))
		.map((block) => ({
			[EntityMetaKey.Selector]: {
				$network,
				height: BigInt(block.block_height),
				hash: block.block_hash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NearBlock, [], 'timestampMs')]: nearNanosToMs(block.block_timestamp),
				...(block.epoch_id != null && {
					[entityFieldAddressKey(EntityType.NearBlock, [], 'epochId')]: block.epoch_id,
				}),
			},
		}))
}

export default {
	source: Source.NearBlocks_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.NearAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						assertNearMainnet($network)
						const { getAccountBalance } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const balance = await getAccountBalance(accountId)
						return {
							amountYoctoNear: BigInt(balance.amount),
							storageUsageBytes: BigInt(balance.storage_usage),
						}
					},
				}
			},
		})({
			amountYoctoNear: (snapshot) => snapshot.amountYoctoNear,
			storageUsageBytes: (snapshot) => snapshot.storageUsageBytes,
		}),

		defineResolver({
			entityType: EntityType.NearAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account, source }) => {
						assertNearMainnet($account.$network)
						if (source !== Source.NearBlocks_Rest)
							throw new Error(`NearBlocks_Rest: unsupported source ${source}`)
						const { getAccount } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const account = await getAccount({
							accountId: $account.accountId,
						})
						return {
							amountYoctoNear: BigInt(account.amount),
							...(account.locked != null && {
								lockedYoctoNear: BigInt(account.locked),
							}),
							...(account.storage_usage != null && {
								storageUsageBytes: BigInt(account.storage_usage),
							}),
							blockHeight: BigInt(account.block_height),
							blockHash: account.block_hash,
							deleted: accountDeleted(account.deleted),
						}
					},
				},
			},
		})({
			amountYoctoNear: (timestamp) => timestamp.amountYoctoNear,
			lockedYoctoNear: (timestamp) => timestamp.lockedYoctoNear,
			storageUsageBytes: (timestamp) => timestamp.storageUsageBytes,
			blockHeight: (timestamp) => timestamp.blockHeight,
			blockHash: (timestamp) => timestamp.blockHash,
			deleted: (timestamp) => timestamp.deleted,
		}),

		defineResolver({
			entityType: EntityType.NearAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }, context) => {
						assertNearMainnet($network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const { getAccountTransactions } = await import('$/sources/NearBlocks/Rest/queries.ts')
						return {
							limit,
							page: await getAccountTransactions({
								accountId,
								limit,
								...(context.providerContinuationToken != null && {
									next: context.providerContinuationToken,
								}),
							}),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, { $network }) => (
					page.transactions.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network,
							hash: transaction.transaction_hash,
							signerAccountId: transaction.signer_account_id,
						},
					}))
				),
				continuation: ({ limit, page }, { accountId }) => (
					limit === 0 || page.continuationToken == null ?
						{
							operation: 'account-transactions',
							target: accountId,
							terminal: true,
						}
					:
						{
							operation: 'account-transactions',
							target: accountId,
							terminal: false,
							token: page.continuationToken,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.NearBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertNearMainnet($network)
						const { getBlock } = await import('$/sources/NearBlocks/Rest/queries.ts')
						return nearBlockFields(
							$network,
							height,
							await getBlock({
								block: height,
							})
						)
					},
				},
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						assertNearMainnet($network)
						const { getBlock } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const block = await getBlock({
							block: hash,
						})
						if (BigInt(block.block_height) !== height)
							throw new Error(`NearBlocks_Rest: block ${hash} height does not match selector`)
						return nearBlockFields($network, height, block)
					},
				},
			},
		})({
			hash: (snapshot) => snapshot.hash,
			$parent: (snapshot) => snapshot.$parent,
			epochId: (snapshot) => snapshot.epochId,
			timestampMs: (snapshot) => snapshot.timestampMs,
		}),

		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				Slug: {
					resolve: async ({ slug }, context) => (
						nearBlockReferences(
							{
								slug,
							},
							Math.min(resolverContextRowLimit(context), 100)
						)
					),
				},
			},
		})({
			$$blocks: (blocks) => blocks,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => (
						nearBlockReferences(
							network,
							Math.min(resolverContextRowLimit(context), 100)
						)
					),
				},
			},
		})({
			Near: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.NearTransaction,
			resolve: {
				NetworkHash: {
					resolve: async ({ $network, hash }) => {
						assertNearMainnet($network)
						const { getTransaction } = await import('$/sources/NearBlocks/Rest/queries.ts')
						return nearTransactionFields(
							$network,
							hash,
							await getTransaction({
								transactionHash: hash,
							})
						)
					},
				},
				NetworkHashSignerAccountId: {
					resolve: async ({ $network, hash, signerAccountId }) => {
						assertNearMainnet($network)
						const { getTransaction } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const transaction = await getTransaction({
							transactionHash: hash,
						})
						if (transaction.signer_account_id !== signerAccountId)
							throw new Error(`NearBlocks_Rest: transaction ${hash} signer does not match selector`)
						return nearTransactionFields($network, hash, transaction)
					},
				},
			},
		})({
			signerAccountId: (snapshot) => snapshot.signerAccountId,
			$signer: (snapshot) => snapshot.$signer,
			$receiver: (snapshot) => snapshot.$receiver,
			nonce: (snapshot) => snapshot.nonce,
			$$actions: {
				select: (snapshot) => snapshot.$$actions,
				resolveCount: (snapshot) => snapshot.$$actions.length,
			},
			$$executionOutcomes: {
				select: (snapshot) => snapshot.$$executionOutcomes,
				resolveCount: (snapshot) => snapshot.$$executionOutcomes.length,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
