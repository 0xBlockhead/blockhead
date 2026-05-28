import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const nearBlocksMainnetRestUrl = 'https://api.nearblocks.io'

const assertNearMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'near') {
		throw new Error('NearBlocks_Rest: unsupported network')
	}
}

export default {
	source: Source.NearBlocks_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NearAccount,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getAccount } = await import('$/sources/NearBlocks/Rest/queries.ts')
				const account = (await getAccount({
					restBaseUrl: nearBlocksMainnetRestUrl,
					accountId: entityId.accountId,
				})).account?.[0]
				if (account == null) throw new Error(`NearBlocks_Rest: account ${entityId.accountId} not found`)
				return {
					...(account.amount != null && {
						amountYoctoNear: BigInt(account.amount),
					}),
					...(account.storage_usage != null && {
						storageUsageBytes: BigInt(account.storage_usage),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearBlock,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/NearBlocks/Rest/queries.ts')
				const block = (await getBlock({
					restBaseUrl: nearBlocksMainnetRestUrl,
					block: entityId.hash ?? entityId.height,
				})).blocks?.[0]
				if (block == null) throw new Error(`NearBlocks_Rest: block ${entityId.hash ?? entityId.height.toString()} not found`)
				return {
					hash: block.block_hash,
					...(block.prev_block_hash != null && entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
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
		}),

		defineEntityResolver({
			entityType: EntityType.NearTransaction,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getTransaction } = await import('$/sources/NearBlocks/Rest/queries.ts')
				const transaction = (await getTransaction({
					restBaseUrl: nearBlocksMainnetRestUrl,
					transactionHash: entityId.hash,
				})).txns?.[0]
				if (transaction == null) throw new Error(`NearBlocks_Rest: transaction ${entityId.hash} not found`)
				return {
					...(transaction.signer_account_id != null && {
						$signer: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								accountId: transaction.signer_account_id,
							},
						},
					}),
					...(transaction.receiver_account_id != null && {
						$receiver: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								accountId: transaction.receiver_account_id,
							},
						},
					}),
					...(transaction.nonce != null && {
						nonce: BigInt(transaction.nonce),
					}),
					$$actions: transaction.actions?.map((action, actionIndex) => ({
						[EntityMetaKey.Id]: {
							$transaction: {
								$network: entityId.$network,
								hash: entityId.hash,
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
								[EntityMetaKey.Id]: {
									$transaction: {
										$network: entityId.$network,
										hash: entityId.hash,
										...(transaction.signer_account_id != null && {
											signerAccountId: transaction.signer_account_id,
										}),
									},
									outcomeId: entityId.hash,
								},
								...(transaction.outcomes.status != null && {
									status: transaction.outcomes.status ? 'SuccessValue' : 'Failure',
								}),
							},
						],
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
