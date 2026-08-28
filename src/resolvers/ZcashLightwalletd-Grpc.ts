import { networkBySlug, NetworkLedgerModel } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'

const networkApplicability = [
	{ caip2: networkBySlug.zcash.caip2 },
	{ slug: networkBySlug.zcash.slug },
] as const
const applicability = [
	{ $network: networkApplicability[0] },
	{ $network: networkApplicability[1] },
] as const
const hex = (bytes: Uint8Array) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')

const blockSnapshot = async ($network: { caip2?: { namespace: string; reference: string }; slug?: string }, height: bigint, expectedHash?: string) => {
	const { getBlock } = await import('$/sources/ZcashLightwalletd/Grpc/queries.ts')
	const block = await getBlock({ height })
	const hash = hex(block.hash)
	if (expectedHash != null && expectedHash !== hash)
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: block hash does not match requested selector`)
	return {
		hash,
		...(height > 0n && { $parent: {
			[EntityMetaKey.Selector]: {
				$network,
				height: height - 1n,
				hash: hex(block.prevHash),
			},
		} }),
		timestampMs: block.time * 1000,
		transactionCount: block.vtx.length,
		$$transactions: block.vtx.map((transaction) => transactionFields($network, transaction)),
	}
}

const transactionFields = (network: object, transaction: {
	txid: Uint8Array
	spends: { nf: Uint8Array }[]
	outputs: { cmu: Uint8Array }[]
	actions: { nullifier: Uint8Array; cmx: Uint8Array }[]
}) => {
	const $transaction = { $network: network, txId: hex(transaction.txid) }
	const action = (pool: ZcashShieldedPoolKind, actionKind: ZcashShieldedActionKind, indexInTransaction: number, fields: Record<string, string>) => ({
		[EntityMetaKey.Selector]: { $transaction, pool, actionKind, indexInTransaction },
		[EntityMetaKey.Fields]: Object.fromEntries(Object.entries({
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: { [EntityMetaKey.Selector]: { $network: network, pool } },
			[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: actionKind,
			...Object.fromEntries(Object.entries(fields).map(([field, value]) => [entityFieldAddressKey(EntityType.ZcashShieldedAction, [], field), value])),
		})),
	})
	return {
		[EntityMetaKey.Selector]: $transaction,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$shieldedActions')]: [
				...transaction.spends.map((spend, index) => action(ZcashShieldedPoolKind.Sapling, ZcashShieldedActionKind.Spend, index, { nullifier: hex(spend.nf) })),
				...transaction.outputs.map((output, index) => action(ZcashShieldedPoolKind.Sapling, ZcashShieldedActionKind.Output, index, { noteCommitment: hex(output.cmu) })),
				...transaction.actions.map((actionValue, index) => action(ZcashShieldedPoolKind.Orchard, ZcashShieldedActionKind.Action, index, { nullifier: hex(actionValue.nullifier), noteCommitment: hex(actionValue.cmx) })),
			],
		},
	}
}

export default {
	source: Source.ZcashLightwalletd_Grpc,
	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [networkApplicability[0]],
					resolve: async ({ caip2 }) => {
						const $network = { caip2 }
						const { getLatestBlock, getLightdInfo } = await import('$/sources/ZcashLightwalletd/Grpc/queries.ts')
						const [latest, info] = await Promise.all([getLatestBlock(), getLightdInfo()])
						const timestampMs = Date.now()
						return [{
							[EntityMetaKey.Selector]: { $network, timestampMs, source: Source.ZcashLightwalletd_Grpc },
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Utxo],
								[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'executionModels')]: [],
								[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: latest.height,
								[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: hex(latest.hash),
								[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: info.blockHeight + 1n,
							},
						}]
					},
				},
			},
		})({ $$timestamps: (rows) => rows }),
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: applicability,
					resolve: ({ $network, height }) => blockSnapshot($network, height),
				},
				NetworkHeightHash: {
					appliesTo: applicability,
					resolve: ({ $network, height, hash }) => blockSnapshot($network, height, hash),
				},
			},
		})({
			hash: (snapshot) => snapshot.hash,
			$parent: (snapshot) => snapshot.$parent,
			timestampMs: (snapshot) => snapshot.timestampMs,
			transactionCount: (snapshot) => snapshot.transactionCount,
			$$transactions: (snapshot) => snapshot.$$transactions,
		}),
		defineResolver({
			entityType: EntityType.ZcashShieldedPoolBlockState,
			resolve: {
				BlockPool: {
					appliesTo: [
						{
							$block: { $network: networkApplicability[0] },
							$pool: { $network: networkApplicability[0] },
						},
						{
							$block: { $network: networkApplicability[1] },
							$pool: { $network: networkApplicability[1] },
						},
					] as const,
					resolve: async ({ $block, $pool }) => {
						if (!('height' in $block))
							throw new Error(`${Source.ZcashLightwalletd_Grpc}: block hash selector is not supported`)
						if ($pool.pool === ZcashShieldedPoolKind.Sprout)
							throw new Error(`${Source.ZcashLightwalletd_Grpc}: tree state is unsupported for sprout`)
						const { getTreeState } = await import('$/sources/ZcashLightwalletd/Grpc/queries.ts')
						const state = await getTreeState({ height: $block.height })
						return {
							$block: { [EntityMetaKey.Selector]: $block },
							$pool: { [EntityMetaKey.Selector]: $pool },
							...($pool.pool === ZcashShieldedPoolKind.Sapling
								? { saplingTree: { finalRoot: state.hash, finalState: state.saplingTree } }
								: { orchardTree: { finalRoot: state.hash, finalState: state.orchardTree } }),
						}
					},
				},
			},
		})({
			saplingTree: (state) => state.saplingTree,
			orchardTree: (state) => state.orchardTree,
		}),
	],
} satisfies RegisteredSourceResolverModule
