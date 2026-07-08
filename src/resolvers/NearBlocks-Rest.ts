import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { NearAccountSelector } from '$/schema/NearAccount.ts'
import { NearBlockSelector } from '$/schema/NearBlock.ts'
import { NearTransactionSelector } from '$/schema/NearTransaction.ts'

const assertNearMainnet = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	if (!('slug' in network) || network.slug !== networkBySlug.near.slug)
		throw new Error('NearBlocks_Rest: unsupported network')
}

const nearBlocksMainnetRestBaseUrl = async () =>
	(await import('$/sources/NearBlocks/Rest/queries.ts')).nearBlocksMainnetRestEndpoints[0].url

export default {
	source: Source.NearBlocks_Rest,

	resolvers: [
		defineResolver(Source.NearBlocks_Rest, {
			entityType: EntityType.NearAccount,
			resolve: {
				[NearAccountSelector.NetworkAccountId]: async ({ $network, accountId }) => {
					assertNearMainnet($network)
					const { getAccount } = await import('$/sources/NearBlocks/Rest/queries.ts')
					const account = (await getAccount({
						restBaseUrl: await nearBlocksMainnetRestBaseUrl(),
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
				}
			},
		})({
				amountYoctoNear: (snapshot) => snapshot.amountYoctoNear,
				storageUsageBytes: (snapshot) => snapshot.storageUsageBytes,
			}),

		defineResolver(Source.NearBlocks_Rest, {
			entityType: EntityType.NearBlock,
			resolve: {
				[NearBlockSelector.NetworkHeightHash]: async ({ $network, hash, height }) => {
					assertNearMainnet($network)
					const { getBlock } = await import('$/sources/NearBlocks/Rest/queries.ts')
					const block = (await getBlock({
						restBaseUrl: await nearBlocksMainnetRestBaseUrl(),
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
				}
			},
		})({
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				epochId: (snapshot) => snapshot.epochId,
				timestampMs: (snapshot) => snapshot.timestampMs,
			}),

		defineResolver(Source.NearBlocks_Rest, {
			entityType: EntityType.NearTransaction,
			resolve: {
				[NearTransactionSelector.NetworkHashSignerAccountId]: async ({ $network, hash }) => {
					assertNearMainnet($network)
					const { getTransaction } = await import('$/sources/NearBlocks/Rest/queries.ts')
					const transaction = (await getTransaction({
						restBaseUrl: await nearBlocksMainnetRestBaseUrl(),
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
							actionKind: action.action ?? 'Unknown',
							...(action.method != null && {
								methodName: action.method,
							}),
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
									...(transaction.outcomes.status != null && {
										status: transaction.outcomes.status ? 'SuccessValue' : 'Failure',
									}),
								},
							],
						}),
					}
				}
			},
		})({
				$signer: (snapshot) => snapshot.$signer,
				$receiver: (snapshot) => snapshot.$receiver,
				nonce: (snapshot) => snapshot.nonce,
				$$actions: (snapshot) => snapshot.$$actions,
				$$executionOutcomes: (snapshot) => snapshot.$$executionOutcomes ?? [],
			}),
	],
}
