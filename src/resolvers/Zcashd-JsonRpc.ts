import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	zcashMainnetCaip2,
	zcashdDefaultLocalRpcUrl,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { Source } from '$/sources/Source.ts'
import { ZcashShieldedPoolSelector } from '$/schema/ZcashShieldedPool.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { ZcashShieldedActionSelector } from '$/schema/ZcashShieldedAction.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertZcashMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== zcashMainnetCaip2.namespace
		|| network.caip2.reference !== zcashMainnetCaip2.reference
	) {
		throw new Error('Zcashd_JsonRpc: unsupported network')
	}
}

const zcashShieldedActionRows = (
	entitySelector: {
		$network: NetworkId
		txId: string
	},
	transaction: Awaited<ReturnType<typeof import('$/sources/Zcashd/JsonRpc/queries.ts')['getRawTransaction']>>,
) => [
	...(transaction.vShieldedSpend ?? []).map((spend, actionIndex) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Sapling,
			actionKind: ZcashShieldedActionKind.Spend,
			actionIndex,
		},
		$pool: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				pool: ZcashShieldedPoolKind.Sapling,
			},
		},
		actionKind: ZcashShieldedActionKind.Spend,
		nullifier: spend.nullifier,
		valueCommitment: spend.cv,
	})),
	...(transaction.vShieldedOutput ?? []).map((output, actionIndex) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Sapling,
			actionKind: ZcashShieldedActionKind.Output,
			actionIndex,
		},
		$pool: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				pool: ZcashShieldedPoolKind.Sapling,
			},
		},
		actionKind: ZcashShieldedActionKind.Output,
		noteCommitment: output.cmu,
		valueCommitment: output.cv,
	})),
	...(transaction.orchard?.actions ?? []).map((action, actionIndex) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			pool: ZcashShieldedPoolKind.Orchard,
			actionKind: ZcashShieldedActionKind.Action,
			actionIndex,
		},
		$pool: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				pool: ZcashShieldedPoolKind.Orchard,
			},
		},
		actionKind: ZcashShieldedActionKind.Action,
		nullifier: action.nullifier,
		noteCommitment: action.cmx,
		valueCommitment: action.cv,
	})),
]

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertZcashMainnet($network)
	const { getRawTransaction } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: zcashdDefaultLocalRpcUrl,
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
			}
		})({
				fields: {
			activationNetworkUpgrade: (snapshot) => snapshot.activationNetworkUpgrade,
			noteProtocol: (snapshot) => snapshot.noteProtocol,
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
					$$zcashShieldedActions: zcashShieldedActionRows(
						entitySelector,
						transaction,
					),
				}
			}
			}
		})({
				fields: {
			version: (snapshot) => snapshot.version,
			lockTime: (snapshot) => snapshot.lockTime,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			weightUnits: (snapshot) => snapshot.weightUnits,
			$$zcashShieldedActions: (snapshot) => snapshot.$$zcashShieldedActions,
		},
			}),

		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.ZcashShieldedAction,
			resolve: {
				[ZcashShieldedActionSelector.UtxoTransactionPoolActionKindActionIndex]: async ({ $transaction }) => {
				const shieldedAction = zcashShieldedActionRows(
					$transaction,
					await getTransaction($transaction),
				).find((action) => (
					action[EntityMetaKey.Selector].pool === entitySelector.pool
					&& action[EntityMetaKey.Selector].actionKind === entitySelector.actionKind
					&& action[EntityMetaKey.Selector].actionIndex === entitySelector.actionIndex
				))
				if (shieldedAction == null) throw new Error(`Zcashd_JsonRpc: shielded action not found for ${$transaction.txId}`)
				return shieldedAction
			}
			}
		})({
				fields: {
			$pool: (snapshot) => snapshot.$pool,
			actionKind: (snapshot) => snapshot.actionKind,
			nullifier: (snapshot) => snapshot.nullifier,
			noteCommitment: (snapshot) => snapshot.noteCommitment,
			valueCommitment: (snapshot) => snapshot.valueCommitment,
		},
			}),
	],
}
