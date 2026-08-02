import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	type EntitySelector,
	type EntitySelectorForSelectorName,
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'

type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>
type TransactionSelector = EntitySelector<typeof schema, EntityType.UtxoTransaction>
type UtxoBlockHeightSelector = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.UtxoBlock,
	'NetworkHeight'
>
type UtxoBlockHeightHashSelector = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.UtxoBlock,
	'NetworkHeightHash'
>

const assertZcashMainnet = (network: NetworkSelector) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug.zcash.caip2.namespace
				|| network.caip2.reference !== networkBySlug.zcash.caip2.reference
			)
		:
			network.slug !== networkBySlug.zcash.slug
	)
		throw new Error('Zcashd_JsonRpc: unsupported network')
}

const zcashShieldedPoolReference = (
	network: NetworkSelector,
	pool: ZcashShieldedPoolKind
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		pool,
	},
})

const zcashShieldedActionSnapshots = (
	entitySelector: TransactionSelector,
	transaction: Awaited<ReturnType<typeof import('$/sources/Zcashd/JsonRpc/queries.ts')['getRawTransaction']>>
) => [
	...(transaction.vjoinsplit ?? []).map((joinSplit, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Sprout,
		actionKind: ZcashShieldedActionKind.JoinSplit,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Sprout),
		nullifier: joinSplit.nullifiers[0],
		noteCommitment: joinSplit.commitments[0],
	})),
	...(transaction.vShieldedSpend ?? []).map((spend, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Sapling,
		actionKind: ZcashShieldedActionKind.Spend,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Sapling),
		nullifier: spend.nullifier,
		valueCommitment: spend.cv,
	})),
	...(transaction.vShieldedOutput ?? []).map((output, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Sapling,
		actionKind: ZcashShieldedActionKind.Output,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Sapling),
		noteCommitment: output.cmu,
		valueCommitment: output.cv,
	})),
	...(transaction.orchard?.actions ?? []).map((action, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Orchard,
		actionKind: ZcashShieldedActionKind.Action,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Orchard),
		nullifier: action.nullifier,
		noteCommitment: action.cmx,
		valueCommitment: action.cv,
	})),
]

const getTransaction = async ({ $network, txId }: TransactionSelector) => {
	assertZcashMainnet($network)
	const { getRawTransaction } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	return getRawTransaction({
		txId,
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
			caip2: networkBySlug.zcash.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.zcash.slug,
		},
	},
] as const

const zcashPoolStateSnapshots = async (
	$block: UtxoBlockHeightSelector | UtxoBlockHeightHashSelector,
	block: number | string
) => {
	assertZcashMainnet($block.$network)
	const { getTreeState } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	const treeState = await getTreeState({
		block,
	})
	if (
		treeState.height !== Number($block.height)
		|| ('hash' in $block && treeState.hash !== $block.hash)
	)
		throw new Error('Zcashd_JsonRpc: z_gettreestate returned a different block')

	return [
		{
			$block,
			$pool: {
				$network: $block.$network,
				pool: ZcashShieldedPoolKind.Sapling,
			},
			saplingTree: treeState.sapling?.commitments,
		},
		{
			$block,
			$pool: {
				$network: $block.$network,
				pool: ZcashShieldedPoolKind.Orchard,
			},
			orchardTree: treeState.orchard?.commitments,
		},
	]
}

export default {
	source: Source.Zcashd_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: zcashNetworkApplicability,
					resolve: ($block) => zcashPoolStateSnapshots(
						$block,
						Number($block.height)
					),
				},
				NetworkHeightHash: {
					appliesTo: zcashNetworkApplicability,
					resolve: ($block) => zcashPoolStateSnapshots(
						$block,
						$block.hash
					),
				},
			},
		})({
			$$zcashShieldedPoolStates: (states) => states.map((state) => ({
				[EntityMetaKey.Selector]: {
					$block: state.$block,
					$pool: state.$pool,
				},
				[EntityMetaKey.Fields]: {
					...(state.saplingTree != null && {
						[entityFieldAddressKey(EntityType.ZcashShieldedPoolBlockState, [], 'saplingTree')]: state.saplingTree,
					}),
					...(state.orchardTree != null && {
						[entityFieldAddressKey(EntityType.ZcashShieldedPoolBlockState, [], 'orchardTree')]: state.orchardTree,
					}),
				},
			})),
		}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					appliesTo: zcashNetworkApplicability,
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						return {
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							$$shieldedActions: zcashShieldedActionSnapshots(
								entitySelector,
								transaction
							).map((action) => ({
								[EntityMetaKey.Selector]: {
									$transaction: action.$transaction,
									pool: action.pool,
									actionKind: action.actionKind,
									indexInTransaction: action.indexInTransaction,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: action.$pool,
									[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: action.actionKind,
									...('nullifier' in action && {
										[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: action.nullifier,
									}),
									...('noteCommitment' in action && {
										[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: action.noteCommitment,
									}),
									...('valueCommitment' in action && {
										[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')]: action.valueCommitment,
									}),
								},
							})),
						}
					},
				}
			},
		})({
			version: (snapshot) => snapshot.version,
			lockTime: (snapshot) => snapshot.lockTime,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			$$zcashShieldedActions: (snapshot) => snapshot.$$shieldedActions,
		}),

		defineResolver({
			entityType: EntityType.ZcashShieldedAction,
			resolve: {
				TransactionPoolActionKindIndexInTransaction: {
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

						const shieldedAction = zcashShieldedActionSnapshots(
							$transaction,
							await getTransaction($transaction)
						).find((action) => (
							action.pool === pool
							&& action.actionKind === actionKind
							&& action.indexInTransaction === indexInTransaction
						))
						if (shieldedAction == null) throw new Error(`Zcashd_JsonRpc: shielded action not found for ${$transaction.txId}`)
						return shieldedAction
					},
				}
			}
		})({
			$pool: (snapshot) => snapshot.$pool,
			actionKind: (snapshot) => snapshot.actionKind,
			nullifier: (snapshot) => snapshot.nullifier,
			noteCommitment: (snapshot) => snapshot.noteCommitment,
			valueCommitment: (snapshot) => snapshot.valueCommitment,
		}),

		defineResolver({
			entityType: EntityType.ZcashShieldedPoolBlockState,
			resolve: {
				BlockPool: {
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
						const state = (await zcashPoolStateSnapshots(
							$block,
							'hash' in $block ? $block.hash : Number($block.height)
						))
							.find((state) => state.$pool.pool === $pool.pool)
						if (state == null)
							throw new Error(`Zcashd_JsonRpc: tree state is unsupported for ${$pool.pool}`)

						return state
					},
				},
			},
		})({
			saplingTree: (snapshot) => snapshot.saplingTree,
			orchardTree: (snapshot) => snapshot.orchardTree,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Zcashd_JsonRpc>
