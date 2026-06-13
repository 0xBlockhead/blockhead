import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	zcashMainnetCaip2,
	zcashdDefaultLocalRpcUrl,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { Source } from '$/sources/Source.ts'

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
	entityId: {
		$network: NetworkId
		txId: string
	},
	transaction: Awaited<ReturnType<typeof import('$/sources/Zcashd/JsonRpc/queries.ts')['getRawTransaction']>>,
) => [
	...(transaction.vShieldedSpend ?? []).map((spend, actionIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: entityId,
			pool: ZcashShieldedPoolKind.Sapling,
			actionKind: ZcashShieldedActionKind.Spend,
			actionIndex,
		},
		$pool: {
			[EntityMetaKey.Id]: {
				$network: entityId.$network,
				pool: ZcashShieldedPoolKind.Sapling,
			},
		},
		actionKind: ZcashShieldedActionKind.Spend,
		nullifier: spend.nullifier,
		valueCommitment: spend.cv,
	})),
	...(transaction.vShieldedOutput ?? []).map((output, actionIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: entityId,
			pool: ZcashShieldedPoolKind.Sapling,
			actionKind: ZcashShieldedActionKind.Output,
			actionIndex,
		},
		$pool: {
			[EntityMetaKey.Id]: {
				$network: entityId.$network,
				pool: ZcashShieldedPoolKind.Sapling,
			},
		},
		actionKind: ZcashShieldedActionKind.Output,
		noteCommitment: output.cmu,
		valueCommitment: output.cv,
	})),
	...(transaction.orchard?.actions ?? []).map((action, actionIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: entityId,
			pool: ZcashShieldedPoolKind.Orchard,
			actionKind: ZcashShieldedActionKind.Action,
			actionIndex,
		},
		$pool: {
			[EntityMetaKey.Id]: {
				$network: entityId.$network,
				pool: ZcashShieldedPoolKind.Orchard,
			},
		},
		actionKind: ZcashShieldedActionKind.Action,
		nullifier: action.nullifier,
		noteCommitment: action.cmx,
		valueCommitment: action.cv,
	})),
]

const getTransaction = async (entityId: {
	$network: NetworkId
	txId: string
}) => {
	assertZcashMainnet(entityId.$network)
	const { getRawTransaction } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: zcashdDefaultLocalRpcUrl,
		txId: entityId.txId,
	})
}

export default {
	source: Source.Zcashd_JsonRpc,

	resolvers: [
		defineResolver(Source.Zcashd_JsonRpc, {
			entityType: EntityType.ZcashShieldedPool,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZcashMainnet(entityId.$network)
				return (
					entityId.pool === ZcashShieldedPoolKind.Sapling ?
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const transaction = await getTransaction(entityId)
				return {
					version: transaction.version,
					lockTime: transaction.locktime,
					sizeBytes: transaction.size,
					weightUnits: transaction.weight,
					$$zcashShieldedActions: zcashShieldedActionRows(
						entityId,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const shieldedAction = zcashShieldedActionRows(
					entityId.$transaction,
					await getTransaction(entityId.$transaction),
				).find((action) => (
					action[EntityMetaKey.Id].pool === entityId.pool
					&& action[EntityMetaKey.Id].actionKind === entityId.actionKind
					&& action[EntityMetaKey.Id].actionIndex === entityId.actionIndex
				))
				if (shieldedAction == null) throw new Error(`Zcashd_JsonRpc: shielded action not found for ${entityId.$transaction.txId}`)
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
