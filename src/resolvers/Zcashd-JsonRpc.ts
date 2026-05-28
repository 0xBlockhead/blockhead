import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { Source } from '$/sources/$Source.ts'

const zcashdRpcUrl = 'http://127.0.0.1:8232'

const assertZcashMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Zcash || network.reference !== '00040fe8ec8471911baa1db1266ea15') {
		throw new Error(`Zcashd_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const zcashShieldedActionRows = (
	entityId: {
		$network: {
			namespace: string
			reference: string
		}
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
	$network: {
		namespace: string
		reference: string
	}
	txId: string
}) => {
	assertZcashMainnet(entityId.$network)
	const { getRawTransaction } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: zcashdRpcUrl,
		txId: entityId.txId,
	})
}

export default {
	source: Source.Zcashd_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ZcashShieldedPool,
			resolve: async (entityId) => {
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
			},
		}),
		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZcashShieldedAction,
			resolve: async (entityId) => {
				const row = zcashShieldedActionRows(
					entityId.$transaction,
					await getTransaction(entityId.$transaction),
				).find((action) => (
					action[EntityMetaKey.Id].pool === entityId.pool
					&& action[EntityMetaKey.Id].actionKind === entityId.actionKind
					&& action[EntityMetaKey.Id].actionIndex === entityId.actionIndex
				))
				if (row == null) throw new Error(`Zcashd_JsonRpc: shielded action not found for ${entityId.$transaction.txId}`)
				return row
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$zcashShieldedActions',
			resolve: async (entityId) => (
				zcashShieldedActionRows(
					entityId,
					await getTransaction(entityId),
				)
			),
		}),
	],
}
