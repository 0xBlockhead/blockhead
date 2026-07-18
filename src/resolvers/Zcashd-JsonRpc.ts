import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	type EntitySelector,
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { ZcashShieldedPoolBlockStateSelector } from '$/schema/ZcashShieldedPoolBlockState.ts'
import { Source } from '$/sources/Source.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { ZcashShieldedActionSelector } from '$/schema/ZcashShieldedAction.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertZcashMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== bitcoinNetworkBySlug.zcash.caip2.namespace
				|| network.caip2.reference !== bitcoinNetworkBySlug.zcash.caip2.reference
			)
		:
			network.slug !== networkBySlug.zcash.slug
	) {
		throw new Error('Zcashd_JsonRpc: unsupported network')
	}
}

const zcashShieldedActionRows = (
	entitySelector: {
		$network: NetworkId
		txId: string
	},
	transaction: Awaited<ReturnType<typeof import('$/sources/Zcashd/JsonRpc/queries.ts')['getRawTransaction']>>
) => [
	...(transaction.vjoinsplit ?? []).map((joinSplit, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Sprout,
			actionKind: ZcashShieldedActionKind.JoinSplit,
			indexInTransaction,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					pool: ZcashShieldedPoolKind.Sprout,
				},
			},
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.JoinSplit,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: joinSplit.nullifiers[0],
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: joinSplit.commitments[0],
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')]: undefined,
		},
	})),
	...(transaction.vShieldedSpend ?? []).map((spend, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Sapling,
			actionKind: ZcashShieldedActionKind.Spend,
			indexInTransaction,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					pool: ZcashShieldedPoolKind.Sapling,
				},
			},
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.Spend,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: spend.nullifier,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: undefined,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')]: spend.cv,
		},
	})),
	...(transaction.vShieldedOutput ?? []).map((output, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Sapling,
			actionKind: ZcashShieldedActionKind.Output,
			indexInTransaction,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					pool: ZcashShieldedPoolKind.Sapling,
				},
			},
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.Output,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: undefined,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: output.cmu,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')]: output.cv,
		},
	})),
	...(transaction.orchard?.actions ?? []).map((action, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Orchard,
			actionKind: ZcashShieldedActionKind.Action,
			indexInTransaction,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					pool: ZcashShieldedPoolKind.Orchard,
				},
			},
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.Action,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: action.nullifier,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: action.cmx,
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')]: action.cv,
		},
	})),
]

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertZcashMainnet($network)
	const { getRawTransaction } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: bitcoinNetworkBySlug.zcash.zcashdRpcUrl,
		txId: txId,
	})
}

const validActionKindsByPool = {
	[ZcashShieldedPoolKind.Sprout]: [ZcashShieldedActionKind.JoinSplit],
	[ZcashShieldedPoolKind.Sapling]: [
		ZcashShieldedActionKind.Spend,
		ZcashShieldedActionKind.Output,
	],
	[ZcashShieldedPoolKind.Orchard]: [ZcashShieldedActionKind.Action],
} as const

const zcashNetworkApplicability = [
	{
		$network: {
			caip2: bitcoinNetworkBySlug.zcash.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.zcash.slug,
		},
	},
] as const

const zcashPoolStateRows = async ($block: {
	$network: NetworkId
	height: bigint
	hash?: string
}) => {
	assertZcashMainnet($block.$network)
	const { getTreeState } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	const treeState = await getTreeState({
		rpcUrl: bitcoinNetworkBySlug.zcash.zcashdRpcUrl,
		block: $block.hash ?? Number($block.height),
	})
	if (
		treeState.height !== Number($block.height)
		|| ($block.hash != null && treeState.hash !== $block.hash)
	)
		throw new Error('Zcashd_JsonRpc: z_gettreestate returned a different block')

	return [
		{
			pool: ZcashShieldedPoolKind.Sapling,
			tree: treeState.sapling?.commitments,
		},
		{
			pool: ZcashShieldedPoolKind.Orchard,
			tree: treeState.orchard?.commitments,
		},
	].map(({ pool, tree }) => ({
		[EntityMetaKey.Selector]: {
			$block,
			$pool: {
				$network: $block.$network,
				pool,
			},
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(
				EntityType.ZcashShieldedPoolBlockState,
				[],
				pool === ZcashShieldedPoolKind.Sapling ? 'saplingTree' : 'orchardTree'
			)]: tree,
		},
	}))
}

export default {
	source: Source.Zcashd_JsonRpc,

	resolvers: [
		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeight]: {
					appliesTo: zcashNetworkApplicability,
					resolve: zcashPoolStateRows,
				},
				[UtxoBlockSelector.NetworkHeightHash]: {
					appliesTo: zcashNetworkApplicability,
					resolve: zcashPoolStateRows,
				},
			},
		})({
				$$zcashShieldedPoolStates: (states) => states,
			}),

		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: {
					appliesTo: zcashNetworkApplicability,
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
							return {
								version: transaction.version,
								lockTime: transaction.locktime,
								sizeBytes: transaction.size,
								$shieldedActions: zcashShieldedActionRows(
								entitySelector,
								transaction
						),
						}
					},
				}
			},
		})({
					version: (snapshot) => snapshot.version,
					lockTime: (snapshot) => snapshot.lockTime,
					sizeBytes: (snapshot) => snapshot.sizeBytes,
					$$zcashShieldedActions: (snapshot) => snapshot.$shieldedActions,
			}),

		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.ZcashShieldedAction,
				resolve: {
					[ZcashShieldedActionSelector.TransactionPoolActionKindIndexInTransaction]: {
						appliesTo: [
							{
								$transaction: {
									$network: zcashNetworkApplicability[0].$network,
								},
							},
							{
								$transaction: {
									$network: zcashNetworkApplicability[1].$network,
								},
							},
						],
						resolve: async ({ $transaction, pool, actionKind, indexInTransaction }) => {
							if (!validActionKindsByPool[pool].some((validActionKind) => validActionKind === actionKind))
								throw new Error(`Zcashd_JsonRpc: invalid ${pool}/${actionKind} shielded action`)

							const shieldedAction = zcashShieldedActionRows(
							$transaction,
							await getTransaction($transaction)
						).find((action) => (
							action[EntityMetaKey.Selector].pool === pool
						&& action[EntityMetaKey.Selector].actionKind === actionKind
						&& action[EntityMetaKey.Selector].indexInTransaction === indexInTransaction
							))
						if (shieldedAction == null) throw new Error(`Zcashd_JsonRpc: shielded action not found for ${$transaction.txId}`)
						return shieldedAction
					},
				}
			},
		})({
				$pool: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')],
				actionKind: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')],
				nullifier: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')],
				noteCommitment: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')],
					valueCommitment: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')],
				}),

			defineResolver(Source.Zcashd_JsonRpc, {
				entityType: EntityType.ZcashShieldedPoolBlockState,
				resolve: {
					[ZcashShieldedPoolBlockStateSelector.BlockPool]: {
						appliesTo: [
							{
								$block: {
									$network: zcashNetworkApplicability[0].$network,
								},
								$pool: {
									$network: zcashNetworkApplicability[0].$network,
								},
							},
							{
								$block: {
									$network: zcashNetworkApplicability[1].$network,
								},
								$pool: {
									$network: zcashNetworkApplicability[1].$network,
								},
							},
						],
						resolve: async ({ $block, $pool }) => {
							assertZcashMainnet($block.$network)
							assertZcashMainnet($pool.$network)
							const state = (await zcashPoolStateRows({
								...$block,
								hash: 'hash' in $block ? $block.hash : undefined,
							})).find((row) => row[EntityMetaKey.Selector].$pool.pool === $pool.pool)
							if (state == null)
								throw new Error(`Zcashd_JsonRpc: tree state is unsupported for ${$pool.pool}`)

							return state
						},
					},
				},
			})({
					saplingTree: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedPoolBlockState, [], 'saplingTree')],
					orchardTree: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedPoolBlockState, [], 'orchardTree')],
				}),
		],
}
