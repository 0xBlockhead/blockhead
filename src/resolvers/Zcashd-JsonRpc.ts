import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { Source } from '$/sources/Source.ts'
import { ZcashShieldedPoolSelector } from '$/schema/ZcashShieldedPool.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { ZcashShieldedActionSelector } from '$/schema/ZcashShieldedAction.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

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

export default {
	source: Source.Zcashd_JsonRpc,

	resolvers: [
		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.ZcashShieldedPool,
			resolve: {
				[ZcashShieldedPoolSelector.NetworkPool]: async ({ $network, pool }) => {
					assertZcashMainnet($network)
					return (
						pool === ZcashShieldedPoolKind.Sapling ?
							{
								activationNetworkUpgrade: 'Sapling',
								noteProtocol: 'Sapling',
							}
						:
							{
								activationNetworkUpgrade: 'NU5',
								noteProtocol: 'Orchard',
							}
					)
				}
			},
		})({
				activationNetworkUpgrade: (snapshot) => snapshot.activationNetworkUpgrade,
				noteProtocol: (snapshot) => snapshot.noteProtocol,
			}),

		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertZcashMainnet(network)
					return [
						ZcashShieldedPoolKind.Sapling,
						ZcashShieldedPoolKind.Orchard,
					].map((pool) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							pool,
						},
					}))
				}
			},
		})({
				Zcash: {
					$$shieldedPools: (pools) => pools,
				},
			}),

		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async (entitySelector) => {
					const transaction = await getTransaction(entitySelector)
					return {
						version: transaction.version,
						lockTime: transaction.locktime,
						sizeBytes: transaction.size,
						weightUnits: transaction.weight,
						$shieldedActions: zcashShieldedActionRows(
							entitySelector,
							transaction
					),
					}
				}
			},
		})({
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				$$zcashShieldedActions: (snapshot) => snapshot.$shieldedActions,
			}),

		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.ZcashShieldedAction,
			resolve: {
				[ZcashShieldedActionSelector.TransactionPoolActionKindIndexInTransaction]: async ({ $transaction, pool, actionKind, indexInTransaction }) => {
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
				}
			},
		})({
				$pool: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')],
				actionKind: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')],
				nullifier: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')],
				noteCommitment: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')],
				valueCommitment: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')],
			}),
	],
}
