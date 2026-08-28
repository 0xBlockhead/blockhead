import { beforeEach, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'

const getLatestBlock = vi.hoisted(() => vi.fn())
const getLightdInfo = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())

vi.mock('$/sources/ZcashLightwalletd/Grpc/queries.ts', () => ({ getLatestBlock, getLightdInfo, getBlock }))

const resolverModule = (await import('$/resolvers/ZcashLightwalletd-Grpc.ts')).default
const networkResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.Network)
const blockResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.UtxoBlock)
if (networkResolver == null || blockResolver == null)
	throw new Error('lightwalletd public resolvers are not registered')

beforeEach(() => {
	vi.clearAllMocks()
	vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
})

it('registers applicability against each canonical selector field set', () => {
	expect(() => indexResolvers(schema, [resolverModule], new Set([Source.ZcashLightwalletd_Grpc])))
		.not.toThrow()
})

it('materializes the latest public chain observation from lightwalletd', async () => {
	getLatestBlock.mockResolvedValue({ height: 100n, hash: new Uint8Array(32).fill(10) })
	getLightdInfo.mockResolvedValue({ version: 'v1', chainName: 'main', blockHeight: 100n, estimatedHeight: 100n })

	const rows = await networkResolver.resolve.Caip2.resolve({ caip2: networkBySlug.zcash.caip2 })
	const fields = rows[0][EntityMetaKey.Fields]
	expect(rows[0][EntityMetaKey.Selector]).toEqual({ $network: { caip2: networkBySlug.zcash.caip2 }, timestampMs: 1_700_000_000_000, source: Source.ZcashLightwalletd_Grpc })
	expect(fields[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]).toBe(100n)
	expect(fields[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]).toBe('0a'.repeat(32))
})

it('maps compact block claims without inventing transaction payload fields', async () => {
	getBlock.mockResolvedValue({ height: 5n, hash: new Uint8Array(32).fill(1), prevHash: new Uint8Array(32).fill(2), time: 1_700_000_000, vtx: [{ index: 0, txid: new Uint8Array(32).fill(3), spends: [], outputs: [], actions: [] }] })

	await expect(blockResolver.resolve.NetworkHeight.resolve({ $network: { caip2: networkBySlug.zcash.caip2 }, height: 5n })).resolves.toEqual({
		hash: '01'.repeat(32),
		$parent: { [EntityMetaKey.Selector]: { $network: { caip2: networkBySlug.zcash.caip2 }, height: 4n, hash: '02'.repeat(32) } },
		timestampMs: 1_700_000_000_000,
		transactionCount: 1,
		$$transactions: [{
			[EntityMetaKey.Selector]: { $network: { caip2: networkBySlug.zcash.caip2 }, txId: '03'.repeat(32) },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$shieldedActions')]: [],
			},
		}],
	})
})

it('preserves compact shielded actions in the single block snapshot for a slug selector', async () => {
	const $network = { slug: networkBySlug.zcash.slug }
	const $transaction = { $network, txId: '03'.repeat(32) }
	getBlock.mockResolvedValue({
		height: 5n,
		hash: new Uint8Array(32).fill(1),
		prevHash: new Uint8Array(32).fill(2),
		time: 1_700_000_000,
		vtx: [{
			txid: new Uint8Array(32).fill(3),
			spends: [{ nf: new Uint8Array(32).fill(4) }],
			outputs: [{ cmu: new Uint8Array(32).fill(5) }],
			actions: [{ nullifier: new Uint8Array(32).fill(6), cmx: new Uint8Array(32).fill(7) }],
		}],
	})
	const snapshot = await blockResolver.resolve.NetworkHeightHash.resolve({
		$network,
		height: 5n,
		hash: '01'.repeat(32),
	})
	expect(getBlock).toHaveBeenCalledOnce()
	expect(getBlock).toHaveBeenCalledWith({ height: 5n })
	expect(blockResolver.projections.$$transactions(snapshot)).toEqual([{
		[EntityMetaKey.Selector]: $transaction,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$shieldedActions')]: [{
				[EntityMetaKey.Selector]: { $transaction, pool: ZcashShieldedPoolKind.Sapling, actionKind: ZcashShieldedActionKind.Spend, indexInTransaction: 0 },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: { [EntityMetaKey.Selector]: { $network, pool: ZcashShieldedPoolKind.Sapling } },
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.Spend,
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: '04'.repeat(32),
				},
			}, {
				[EntityMetaKey.Selector]: { $transaction, pool: ZcashShieldedPoolKind.Sapling, actionKind: ZcashShieldedActionKind.Output, indexInTransaction: 0 },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: { [EntityMetaKey.Selector]: { $network, pool: ZcashShieldedPoolKind.Sapling } },
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.Output,
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: '05'.repeat(32),
				},
			}, {
				[EntityMetaKey.Selector]: { $transaction, pool: ZcashShieldedPoolKind.Orchard, actionKind: ZcashShieldedActionKind.Action, indexInTransaction: 0 },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: { [EntityMetaKey.Selector]: { $network, pool: ZcashShieldedPoolKind.Orchard } },
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: ZcashShieldedActionKind.Action,
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: '06'.repeat(32),
					[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: '07'.repeat(32),
				},
			}],
		},
	}])
})

it('rejects a mismatched block hash before materializing transaction fields', async () => {
	getBlock.mockResolvedValue({ hash: new Uint8Array(32).fill(1) })
	await expect(blockResolver.resolve.NetworkHeightHash.resolve({
		$network: { caip2: networkBySlug.zcash.caip2 },
		height: 5n,
		hash: '02'.repeat(32),
	})).rejects.toThrow('block hash does not match requested selector')
})
