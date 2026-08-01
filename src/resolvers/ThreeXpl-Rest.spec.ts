import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const fetchBlock = vi.fn()

vi.mock('$/sources/ThreeXpl/Rest/queries.ts', () => ({
	fetchBlock,
}))

const { default: threeXplResolvers } = await import('$/resolvers/ThreeXpl-Rest.ts')

const moneroBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroBlock
))
const solanaBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SolanaBlock
))
const tronBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TronBlock
))
const utxoBlockResolver = threeXplResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
))

if (moneroBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing MoneroBlock resolver')
if (solanaBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing SolanaBlock resolver')
if (tronBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing TronBlock resolver')
if (utxoBlockResolver == null)
	throw new Error('ThreeXpl-Rest spec missing UtxoBlock resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const timestamp = '2026-07-30T12:00:00.000Z'
const timestampMs = Date.parse(timestamp)

describe('ThreeXpl block response ownership', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		fetchBlock.mockResolvedValue({
			data: {
				block: {
					hash: 'wire-block-hash',
					time: timestamp,
					events: {
						transactions: 1,
					},
				},
				events: {
					transactions: [{
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
			hash: 'monero-block-hash',
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

	it('projects Solana block fields and transactions from one response', async () => {
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

		expect(fetchBlock).toHaveBeenCalledOnce()
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

	it('projects Tron block fields and transactions from one response', async () => {
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

		expect(fetchBlock).toHaveBeenCalledOnce()
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
	})

	it('projects UTXO block fields and transactions from one response', async () => {
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

		expect(fetchBlock).toHaveBeenCalledOnce()
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
})
