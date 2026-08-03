import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { MoneroRpcBlock } from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'

const getBlock = vi.hoisted(() => vi.fn())

vi.mock('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts', () => ({
	getBlock,
	moneroMainnetRpcEndpoints: [{
		url: 'https://monero.example',
		transportType: 'Http',
		providerName: 'Monero daemon',
	}],
}))

const { default: moneroDaemonRpc } = await import('$/resolvers/MoneroDaemonRpc-JsonRpc.ts')

const blockResolver = moneroDaemonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MoneroBlock
))

if (blockResolver == null)
	throw new Error('MoneroDaemonRpc-JsonRpc spec missing MoneroBlock resolver')

const block = {
	blob: 'block-blob',
	block_header: {
		block_size: 1_000,
		block_weight: 1_100,
		cumulative_difficulty: 2_000,
		cumulative_difficulty_top64: 0,
		depth: 1,
		difficulty: 2_500,
		difficulty_top64: 0,
		hash: 'block-hash',
		height: 3_400_000,
		long_term_weight: 1_050,
		major_version: 16,
		minor_version: 16,
		nonce: 42,
		num_txes: 2,
		orphan_status: false,
		pow_hash: 'pow-hash',
		prev_hash: 'parent-hash',
		reward: 600_000_000_000,
		timestamp: 1_722_470_400,
	},
	miner_tx_hash: 'miner-transaction-hash',
	tx_hashes: ['transaction-hash'],
} satisfies MoneroRpcBlock

const network = {
	caip2: networkBySlug.monero.caip2,
}
const height = BigInt(block.block_header.height)

describe('Monero daemon block selectors', () => {
	beforeEach(() => {
		getBlock.mockReset()
		getBlock.mockResolvedValue(block)
	})

	it('resolves both selector arms through the same response projection', async () => {
		const byHeight = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height,
		})

		expect(getBlock).toHaveBeenNthCalledWith(1, {
			height,
		})
		expect(await blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height,
			hash: block.block_header.hash,
		})).toEqual(byHeight)
		expect(getBlock).toHaveBeenNthCalledWith(2, {
			height,
		})
		expect(Object.keys(blockResolver.resolve).sort()).toEqual([
			'NetworkHeight',
			'NetworkHeightHash',
		])
		expect(Object.keys(blockResolver.projections).sort()).toEqual([
			'$$transactions',
			'$parent',
			'difficulty',
			'hash',
			'timestampMs',
			'weightBytes',
		])
		expect(blockResolver.projections.hash(byHeight)).toBe(block.block_header.hash)
		expect(blockResolver.projections.$$transactions(byHeight)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: block.miner_tx_hash,
				},
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: block.tx_hashes[0],
				},
			}),
		])
	})

	it('rejects a hash-selector response for a different block', async () => {
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height,
			hash: 'different-block-hash',
		})).rejects.toThrow(
			'MoneroDaemonRpc_JsonRpc: block hash does not match the requested selector'
		)
		expect(getBlock).toHaveBeenCalledOnce()
		expect(getBlock).toHaveBeenCalledWith({
			height,
		})
	})
})
