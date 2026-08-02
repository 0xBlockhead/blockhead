import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertNearMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.near.slug)
		throw new Error('NearBlocks_Rest: unsupported network')
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
						const { getAccount } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const account = (await getAccount({
							accountId: accountId,
						})).account?.[0]
						if (account == null) throw new Error(`NearBlocks_Rest: account ${accountId} not found`)
						return {
							...(account.amount != null && {
								amountYoctoNear: BigInt(account.amount),
							}),
							...(account.storage_usage != null && {
								storageUsageBytes: BigInt(account.storage_usage),
							}),
						}
					},
				}
			},
		})({
				amountYoctoNear: (snapshot) => snapshot.amountYoctoNear,
				storageUsageBytes: (snapshot) => snapshot.storageUsageBytes,
			}),

		defineResolver({
			entityType: EntityType.NearBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						assertNearMainnet($network)
						const { getBlock } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const block = (await getBlock({
							block: hash,
						})).blocks?.[0]
						if (block == null) throw new Error(`NearBlocks_Rest: block ${hash} not found`)
						if (block.block_hash == null) throw new Error(`NearBlocks_Rest: block ${hash} missing block hash`)
						return {
							hash: block.block_hash,
							...(block.prev_block_hash != null && height > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										height: height - 1n,
										hash: block.prev_block_hash,
									},
								},
							}),
							epochId: block.epoch_id,
							...(block.block_timestamp != null && {
								timestampMs: Number(BigInt(block.block_timestamp) / 1_000_000n),
							}),
						}
					},
				}
			},
		})({
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				epochId: (snapshot) => snapshot.epochId,
				timestampMs: (snapshot) => snapshot.timestampMs,
			}),

		defineResolver({
			entityType: EntityType.NearTransaction,
			resolve: {
				NetworkHashSignerAccountId: {
					resolve: async ({ $network, hash }) => {
						assertNearMainnet($network)
						const { getTransaction } = await import('$/sources/NearBlocks/Rest/queries.ts')
						const transaction = (await getTransaction({
							transactionHash: hash,
						})).txns?.[0]
						if (transaction == null) throw new Error(`NearBlocks_Rest: transaction ${hash} not found`)
						return {
							...(transaction.signer_account_id != null && {
								$signer: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										accountId: transaction.signer_account_id,
									},
								},
							}),
							...(transaction.receiver_account_id != null && {
								$receiver: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										accountId: transaction.receiver_account_id,
									},
								},
							}),
							...(transaction.nonce != null && {
								nonce: BigInt(transaction.nonce),
							}),
							$$actions: transaction.actions?.map((action, actionIndex) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network,
										hash,
										...(transaction.signer_account_id != null && {
											signerAccountId: transaction.signer_account_id,
										}),
									},
									actionIndex,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.NearAction, [], 'actionKind')]: action.action ?? 'Unknown',
									...(action.method != null && {
										[entityFieldAddressKey(EntityType.NearAction, [], 'methodName')]: action.method,
									}),
								},
							})) ?? [],
							...(transaction.outcomes != null && {
								$$executionOutcomes: [
									{
										[EntityMetaKey.Selector]: {
											$transaction: {
												$network: $network,
												hash: hash,
												...(transaction.signer_account_id != null && {
													signerAccountId: transaction.signer_account_id,
												}),
											},
											outcomeId: hash,
										},
										[EntityMetaKey.Fields]: {
											...(transaction.outcomes.status != null && {
												[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'status')]: transaction.outcomes.status ? 'SuccessValue' : 'Failure',
											}),
										},
									},
								],
							}),
						}
					},
				}
			},
		})({
			$signer: (snapshot) => snapshot.$signer,
			$receiver: (snapshot) => snapshot.$receiver,
			nonce: (snapshot) => snapshot.nonce,
			$$actions: (snapshot) => snapshot.$$actions,
			$$executionOutcomes: (snapshot) => snapshot.$$executionOutcomes,
		}),
	],
} satisfies RegisteredSourceResolverModule
