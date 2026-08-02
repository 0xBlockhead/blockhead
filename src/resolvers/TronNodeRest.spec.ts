import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const fullNodeQueries = vi.hoisted(() => ({
	getAccount: vi.fn(),
	getBlockById: vi.fn(),
	getTransactionById: vi.fn(),
	getTransactionInfoById: vi.fn(),
}))

const solidityNodeQueries = vi.hoisted(() => ({
	getAccount: vi.fn(),
	getBlockById: vi.fn(),
	getTransactionById: vi.fn(),
	getTransactionInfoById: vi.fn(),
}))

vi.mock('$/sources/TronFullNode/Rest/queries.ts', () => fullNodeQueries)
vi.mock('$/sources/TronSolidityNode/Rest/queries.ts', () => solidityNodeQueries)

const [
	{ default: fullNodeResolvers },
	{ default: solidityNodeResolvers },
] = await Promise.all([
	import('$/resolvers/TronFullNode-Rest.ts'),
	import('$/resolvers/TronSolidityNode-Rest.ts'),
])

const tronSlugNetwork = {
	slug: networkBySlug.tron.slug,
}

const block = {
	blockID: 'tron-block',
	block_header: {
		raw_data: {
			number: 7,
			parentHash: 'parent-block',
			timestamp: 1_750_000_000_000,
			txTrieRoot: 'transaction-root',
			version: 29,
			witness_address: 'witness',
		},
	},
	transactions: [{
		txID: 'transaction',
		raw_data: {
			timestamp: 1_750_000_000_000,
		},
	}],
}

describe.each([
	{
		name: 'FullNode',
		queries: fullNodeQueries,
		resolvers: fullNodeResolvers,
		source: Source.TronFullNode_Rest,
	},
	{
		name: 'SolidityNode',
		queries: solidityNodeQueries,
		resolvers: solidityNodeResolvers,
		source: Source.TronSolidityNode_Rest,
	},
])('TRON $name REST resolvers', ({ queries, resolvers, source }) => {
	beforeEach(() => {
		vi.clearAllMocks()
		queries.getAccount.mockResolvedValue({
			account_name: 'Alice',
			balance: 10,
			create_time: 1_700_000_000_000,
			latest_opration_time: 1_750_000_000_000,
		})
		queries.getBlockById.mockResolvedValue(block)
		queries.getTransactionById.mockResolvedValue(block.transactions[0])
		queries.getTransactionInfoById.mockResolvedValue({
			blockNumber: 7,
			blockTimeStamp: 1_750_000_000_000,
		})
	})

	it('exposes the same five source capabilities', () => {
		expect(resolvers.source).toBe(source)
		expect(resolvers.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.TronBlock,
			EntityType.TronTransaction,
			EntityType.TronAccount,
			EntityType.TronAccount_Timestamp,
			EntityType.TronTransactionReceipt,
		])
	})

	it('resolves the complete hash selector and prefetches canonical transaction fields', async () => {
		const blockResolver = resolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TronBlock
		))
		if (blockResolver == null)
			throw new Error('TRON block resolver is missing')

		const resolved = await blockResolver.resolve.NetworkHeightHash.resolve({
			$network: tronSlugNetwork,
			height: 7n,
			hash: block.blockID,
		})
		expect(queries.getBlockById).toHaveBeenCalledWith({
			hash: block.blockID,
		})
		expect(resolved.$$transactions[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TronTransaction, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network: tronSlugNetwork,
					height: 7n,
				},
			},
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'signatures')]: [],
		})
	})

	it('rejects selector mismatches and unrelated networks', async () => {
		const blockResolver = resolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TronBlock
		))
		if (blockResolver == null)
			throw new Error('TRON block resolver is missing')

		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: tronSlugNetwork,
			height: 8n,
			hash: block.blockID,
		})).rejects.toThrow('block height does not match 8')
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: tronSlugNetwork,
			height: 7n,
			hash: 'another-block',
		})).rejects.toThrow('block hash does not match another-block')
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: {
				slug: networkBySlug.ethereum.slug,
			},
			height: 7n,
			hash: block.blockID,
		})).rejects.toThrow(`${source}: unsupported network`)
	})

	it('uses the upstream account clock for the source-owned observation', async () => {
		const accountResolver = resolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TronAccount
		))
		if (accountResolver == null)
			throw new Error('TRON account resolver is missing')

		const resolved = await accountResolver.resolve.NetworkAddress.resolve({
			$network: {
				caip2: networkBySlug.tron.caip2,
			},
			address: 'account',
		})
		expect(resolved).toMatchObject({
			name: 'Alice',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					timestampMs: 1_750_000_000_000,
					source,
				},
			}],
		})
	})

	it('pins timestamp applicability to the owning source', () => {
		const timestampResolver = resolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TronAccount_Timestamp
		))
		if (timestampResolver == null)
			throw new Error('TRON account timestamp resolver is missing')

		expect(timestampResolver.resolve.AccountTimestampMsSource.appliesTo).toEqual([
			{
				$account: {
					$network: {
						caip2: networkBySlug.tron.caip2,
					},
				},
				source,
			},
			{
				$account: {
					$network: tronSlugNetwork,
				},
				source,
			},
		])
	})
})
