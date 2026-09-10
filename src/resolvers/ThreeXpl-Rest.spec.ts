import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const fetchBlock = vi.fn()
const fetchBlocks = vi.fn()
const fetchChainStats = vi.fn()
const fetchTransaction = vi.fn()
const threeXplListLimit = vi.fn((limit: number) => (
	limit <= 1 ? 1
	: limit <= 10 ? 10
	: limit <= 100 ? 100
	: 1000
))

vi.mock('$/sources/ThreeXpl/Rest/queries.ts', () => ({
	fetchBlock,
	fetchBlocks,
	fetchChainStats,
	fetchTransaction,
	threeXplListLimit,
}))

const { default: threeXplResolvers } = await import('$/resolvers/ThreeXpl-Rest.ts')

const moneroBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroBlock
))
const moneroNetworkBlocksResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroNetwork
	&& '$$blocks' in resolver.projections
))
const networkMoneroBlocksResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Monero' in resolver.projections
	&& '$$blocks' in resolver.projections.Monero
))
const solanaBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SolanaBlock
))
const tronBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TronBlock
))
const tronTransactionResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TronTransaction
))
const utxoBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
))
const nearBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearBlock
))

if (moneroBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing MoneroBlock resolver')
if (moneroNetworkBlocksResolver == null)
	throw new Error('ThreeXpl-Rest spec missing MoneroNetwork.$$blocks resolver')
if (networkMoneroBlocksResolver == null)
	throw new Error('ThreeXpl-Rest spec missing Network.Monero.$$blocks resolver')
if (solanaBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing SolanaBlock resolver')
if (tronBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing TronBlock resolver')
if (tronTransactionResolver == null)
	throw new Error('ThreeXpl-Rest spec missing TronTransaction resolver')
if (utxoBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing UtxoBlock resolver')
if (nearBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing NearBlock resolver')

const resolverContext = {
	...createResolverContext(),
	pagination: {
		limit: 2,
	},
}
const timestamp = '2026-07-30T12:00:00.000Z'
const timestampMs = Date.parse(timestamp)

describe('ThreeXpl block response ownership', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		fetchBlock.mockResolvedValue({
			data: {
				block: {
					block: 3_400_000,
					hash: 'wire-block-hash',
					time: timestamp,
					events: {
						'monero-main': 1,
					},
				},
				events: {
					'monero-main': [{
						transaction: 'wire-transaction',
					}],
				},
			},
		})
	})

	it('projects Monero block fields and transactions from one response', async () => {
		const entitySelector = {
			$network: {
				caip2: networkBySlug.monero.caip2,
			},
			height: 3_400_000n,
			hash: 'wire-block-hash',
		}
		const snapshot = await moneroBlockResolver.resolve.NetworkHeightHash.resolve(
			entitySelector,
			resolverContext
		)

		expect(fetchBlock).toHaveBeenCalledOnce()
		expect(fetchBlock).toHaveBeenCalledWith({
			blockchain: 'monero',
			block: entitySelector.height.toString(),
		})
		expect(moneroBlockResolver.projections.hash(snapshot)).toBe(entitySelector.hash)
		expect(moneroBlockResolver.projections.timestampMs(snapshot)).toBe(timestampMs)
		expect(moneroBlockResolver.projections.$$transactions(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				txHash: 'wire-transaction',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.MoneroTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: entitySelector,
				},
			},
		}])
	})

	it('projects MoneroNetwork.$$blocks tip walk with authoritative resolveCount', async () => {
		const tipStats = {
			data: {
				blockchains: {
					monero: {
						best_block: 3_400_001,
					},
				},
			},
		}
		const tipBlocks = {
			data: {
				blocks: {
					'3400001': {
						hash: 'tip-hash',
						time: timestamp,
						events: {
							'monero-main': 3,
						},
					},
					'3400000': {
						hash: 'prev-hash',
						time: timestamp,
						events: {
							'monero-main': 1,
						},
					},
				},
			},
		}
		fetchChainStats
			.mockResolvedValueOnce(tipStats)
			.mockResolvedValueOnce(tipStats)
		fetchBlocks
			.mockResolvedValueOnce(tipBlocks)
			.mockResolvedValueOnce(tipBlocks)

		const $network = {
			caip2: networkBySlug.monero.caip2,
		}
		const snapshot = await moneroNetworkBlocksResolver.resolve.Network.resolve(
			{
				$network,
			},
			resolverContext
		)

		expect(threeXplListLimit).toHaveBeenCalledWith(2)
		expect(fetchBlocks).toHaveBeenCalledWith({
			blockchain: 'monero',
			limit: 10,
		})
		expect(moneroNetworkBlocksResolver.projections.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network,
					height: 3_400_001n,
					hash: 'tip-hash',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.MoneroBlock, [], 'timestampMs')]: timestampMs,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network,
					height: 3_400_000n,
					hash: 'prev-hash',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.MoneroBlock, [], 'timestampMs')]: timestampMs,
				},
			},
		])
		expect(moneroNetworkBlocksResolver.projections.$$blocks.resolveCount(snapshot)).toBe(3_400_002)

		const networkSnapshot = await networkMoneroBlocksResolver.resolve.Slug.resolve(
			$network,
			resolverContext
		)
		expect(networkMoneroBlocksResolver.projections.Monero.$$blocks.select(networkSnapshot)).toHaveLength(2)
		expect(networkMoneroBlocksResolver.projections.Monero.$$blocks.resolveCount(networkSnapshot)).toBe(3_400_002)
	})

	it('projects Solana block fields and transactions from module event counts', async () => {
		fetchBlock.mockResolvedValueOnce({
			data: {
				block: {
					block: 350_000_000,
					hash: 'wire-block-hash',
					time: timestamp,
					events: {
						'solana-main': 1,
					},
				},
				events: {
					'solana-main': [{
						transaction: 'wire-transaction',
					}],
				},
			},
		})
		const entitySelector = {
			$network: {
				caip2: networkBySlug.solana.caip2,
			},
			slot: 350_000_000n,
		}
		const snapshot = await solanaBlockResolver.resolve.Slot.resolve(
			entitySelector,
			resolverContext
		)

		expect(fetchBlock).toHaveBeenCalledWith({
			blockchain: 'solana',
			block: entitySelector.slot.toString(),
		})
		expect(solanaBlockResolver.projections.blockHash(snapshot)).toBe('wire-block-hash')
		expect(solanaBlockResolver.projections.timestampMs(snapshot)).toBe(timestampMs)
		expect(solanaBlockResolver.projections.transactionCount(snapshot)).toBe(1)
		expect(solanaBlockResolver.projections.$$transactions(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				signature: 'wire-transaction',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SolanaTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: entitySelector,
				},
				[entityFieldAddressKey(EntityType.SolanaTransaction, [], 'slot')]: entitySelector.slot,
			},
		}])
	})

	it('projects Tron block fields and enrolled transaction blockHeight', async () => {
		fetchBlock.mockResolvedValueOnce({
			data: {
				block: {
					block: 72_000_000,
					hash: 'tron-block-hash',
					time: timestamp,
					events: {
						'tron-main': 1,
					},
				},
				events: {
					'tron-main': [{
						transaction: 'wire-transaction',
					}],
				},
			},
		})
		const entitySelector = {
			$network: {
				slug: 'tron',
			},
			height: 72_000_000n,
			hash: 'tron-block-hash',
		}
		const snapshot = await tronBlockResolver.resolve.NetworkHeightHash.resolve(
			entitySelector,
			resolverContext
		)

		expect(fetchBlock).toHaveBeenCalledWith({
			blockchain: 'tron',
			block: entitySelector.hash,
		})
		expect(tronBlockResolver.projections.hash(snapshot)).toBe(entitySelector.hash)
		expect(tronBlockResolver.projections.timestampMs(snapshot)).toBe(timestampMs)
		expect(tronBlockResolver.projections.transactionCount(snapshot)).toBe(1)
		expect(tronBlockResolver.projections.$$transactions(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				transactionId: 'wire-transaction',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: entitySelector,
				},
				[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: entitySelector.height,
			},
		}])

		fetchTransaction.mockResolvedValueOnce({
			data: {
				transaction: {
					block: 72_000_000,
					transaction: 'wire-transaction',
					time: timestamp,
				},
			},
		})
		const transactionSnapshot = await tronTransactionResolver.resolve.NetworkTransactionId.resolve(
			{
				$network: entitySelector.$network,
				transactionId: 'wire-transaction',
			},
			resolverContext
		)
		expect(tronTransactionResolver.projections.blockHeight(transactionSnapshot)).toBe(72_000_000n)
		expect(tronTransactionResolver.projections.timestampMs(transactionSnapshot)).toBe(timestampMs)
	})

	it('projects UTXO block fields and transactions from one response', async () => {
		fetchBlock.mockResolvedValueOnce({
			data: {
				block: {
					block: 900_000,
					hash: 'bitcoin-block-hash',
					time: timestamp,
					events: {
						'bitcoin-main': 1,
					},
				},
				events: {
					'bitcoin-main': [{
						transaction: 'wire-transaction',
					}],
				},
			},
		})
		const entitySelector = {
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			height: 900_000n,
			hash: 'bitcoin-block-hash',
		}
		const snapshot = await utxoBlockResolver.resolve.NetworkHeightHash.resolve(
			entitySelector,
			resolverContext
		)

		expect(fetchBlock).toHaveBeenCalledWith({
			blockchain: 'bitcoin',
			block: entitySelector.hash,
		})
		expect(utxoBlockResolver.projections.hash(snapshot)).toBe(entitySelector.hash)
		expect(utxoBlockResolver.projections.timestampMs(snapshot)).toBe(timestampMs)
		expect(utxoBlockResolver.projections.transactionCount(snapshot)).toBe(1)
		expect(utxoBlockResolver.projections.$$transactions(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				txId: 'wire-transaction',
			},
		}])
	})

	it('fail-closes Near which 3xpl does not index', async () => {
		await expect(nearBlockResolver.resolve.NetworkHeightHash.resolve(
			{
				$network: {
					slug: 'near',
				},
				height: 1n,
				hash: 'near-hash',
			},
			resolverContext
		)).rejects.toThrow('ThreeXpl_Rest: Near is not indexed by 3xpl')
		expect(fetchBlock).not.toHaveBeenCalled()
	})

	it('fail-closes Monero hash mismatches', async () => {
		await expect(moneroBlockResolver.resolve.NetworkHeightHash.resolve(
			{
				$network: {
					caip2: networkBySlug.monero.caip2,
				},
				height: 3_400_000n,
				hash: 'other-hash',
			},
			resolverContext
		)).rejects.toThrow('ThreeXpl_Rest: block hash wire-block-hash does not match selector other-hash')
	})
})
