import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { getEvmBlockRangePage, getHeight } from '$/sources/Envio/HyperSync/queries.ts'
import evmBlockPage from '$/sources/Envio/HyperSync/fixtures/evm-block-page.json'
import evmBlockRollback from '$/sources/Envio/HyperSync/fixtures/evm-block-rollback.json'
import { EnvioHyperSyncResolution } from '$/sources/Envio/HyperSync/types.ts'
import { Source } from '$/sources/Source.ts'

const {
	firstHttpUrlForBinding,
	resolverBinding,
	sourceFetch,
} = vi.hoisted(() => ({
	firstHttpUrlForBinding: vi.fn(() => 'https://eth.hypersync.xyz'),
	resolverBinding: {
		source: 'EnvioHyperSync_RawHttp',
		target: {
			kind: 'Eip155Chain',
			key: '1',
		},
		endpoints: [{
			endpointKind: 'HttpUrl',
			locator: 'https://eth.hypersync.xyz',
			corsEnabled: false,
		}],
		wireProtocol: 'RawHttp',
		apiFamily: 'EnvioHyperSyncApi',
		operationGroups: ['GenericRead'],
		delivery: 'HttpProxy',
		credentials: [{
			scope: 'RuntimeSecret',
		}],
		artifacts: [{
			kind: 'HandwrittenTypes',
			path: 'src/sources/Envio/HyperSync/types.ts',
			referenceUrl: 'https://docs.envio.dev/docs/HyperSync/overview',
		}],
	},
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/Source.ts', async (importOriginal) => {
	const sourceModule = await importOriginal<{ Source: object }>()
	return {
		...sourceModule,
		Source: {
			...sourceModule.Source,
			EnvioHyperSync_RawHttp: 'EnvioHyperSync_RawHttp',
		},
	}
})

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding,
	sourceFetch,
}))

const { default: envioHyperSync } = await import('$/resolvers/Envio-HyperSync.ts')

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const context = {
	...createResolverContext(),
	pagination: {
		limit: 3,
	},
}

const resolverFor = (entityType: string) => (
	envioHyperSync.resolvers.find((resolver) => resolver.entityType === entityType)
)

describe('Envio HyperSync query boundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reads fail-closed /height tip', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json({
			height: 19_000_020,
		}))
		await expect(getHeight()).resolves.toEqual({
			height: 19_000_020,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('https://eth.hypersync.xyz/height')
	})

	it('hard-fails malformed /height and /query envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json({
			height: -1,
		}))
		await expect(getHeight()).rejects.toThrow()

		sourceFetch.mockResolvedValueOnce(Response.json({
			next_block: 19_000_001,
			total_execution_time: 1,
			data: {
				blocks: [{
					...evmBlockPage.data.blocks[0],
					hash: 'not-a-hash',
				}],
				transactions: [],
			},
		}))
		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_000n,
			toBlock: 19_000_001n,
		})).rejects.toThrow()
	})

	it('posts an exclusive range with explicit block and transaction fields', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockPage))

		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_000n,
			toBlock: 19_000_001n,
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Complete,
			next_block: 19_000_001,
			archive_height: 19_000_020,
			data: {
				blocks: [{
					number: 19_000_000,
				}],
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			from_block: 19_000_000,
			to_block: 19_000_001,
			include_all_blocks: true,
			field_selection: {
				block: [
					'number',
					'hash',
					'parent_hash',
					'timestamp',
					'miner',
					'gas_used',
					'gas_limit',
					'base_fee_per_gas',
					'blob_gas_used',
					'excess_blob_gas',
				],
				transaction: [
					'block_number',
					'hash',
				],
			},
		})
	})

	it('distinguishes covered empty, partial, and rollback-invalidated pages', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json({
			next_block: 19_000_001,
			total_execution_time: 1,
			data: {
				blocks: [],
				transactions: [],
			},
			rollback_guard: null,
		}))
		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_000n,
			toBlock: 19_000_001n,
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Partial,
		})

		sourceFetch.mockResolvedValueOnce(Response.json({
			archive_height: 19_000_020,
			next_block: 19_000_001,
			total_execution_time: 1,
			data: {
				blocks: [],
				transactions: [],
			},
			rollback_guard: null,
		}))
		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_000n,
			toBlock: 19_000_001n,
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Empty,
		})

		sourceFetch.mockResolvedValueOnce(Response.json({
			archive_height: 19_000_020,
			next_block: 19_000_005,
			total_execution_time: 1,
			data: {
				blocks: evmBlockPage.data.blocks,
				transactions: evmBlockPage.data.transactions,
			},
			rollback_guard: null,
		}))
		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_000n,
			toBlock: 19_000_010n,
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Partial,
			next_block: 19_000_005,
		})

		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockRollback))
		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_001n,
			toBlock: 19_000_002n,
			rollbackGuard: {
				block_number: 19_000_000,
				timestamp: 1_700_000_000,
				hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				first_block_number: 19_000_000,
				first_parent_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
			},
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Reorg,
			rollback_guard: evmBlockRollback.rollback_guard,
		})
	})

	it('hard-fails non-OK HyperSync HTTP', async () => {
		sourceFetch.mockResolvedValueOnce(new Response('upstream unavailable', {
			status: 503,
			statusText: 'Service Unavailable',
		}))
		await expect(getEvmBlockRangePage({
			fromBlock: 19_000_000n,
			toBlock: 19_000_001n,
		})).rejects.toThrow(/Fetch failed \(503/)
	})
})

describe('Envio HyperSync resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps the approved EVM block fields and transaction selectors', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockPage))
		const resolver = resolverFor(EntityType.EvmBlock)
		const block = await resolver.resolve['EvmNetworkBlockNumber'].resolve({
			$network: network,
			blockNumber: 19_000_000n,
		}, context)

		expect(block).toMatchObject({
			hash: evmBlockPage.data.blocks[0].hash,
			parentHash: evmBlockPage.data.blocks[0].parent_hash,
			timestamp: 1_700_000_000_000,
			gasUsed: 21_000n,
			gasLimit: 30_000_000n,
			transactionCount: 1,
			$miner: {
				[EntityMetaKey.Selector]: {
					address: evmBlockPage.data.blocks[0].miner,
				},
			},
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 18_999_999n,
				},
			},
			transactions: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: evmBlockPage.data.transactions[0].hash,
				},
			}],
		})
		expect(firstHttpUrlForBinding).toHaveBeenCalledWith(resolverBinding)
	})

	it('preserves a Slug network selector through transaction references', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockPage))
		const slugNetwork = {
			slug: 'ethereum',
		}
		const resolved = await resolverFor(EntityType.EvmBlock).resolve['EvmNetworkBlockNumber'].resolve({
			$network: slugNetwork,
			blockNumber: 19_000_000n,
		}, context)

		expect(resolved.transactions).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: slugNetwork,
			},
		}])
	})

	it('projects Network.Evm tip $$blocks / resolveCount / $$timestamps from /height', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json({
			height: 19_000_020,
		}))
		const blocksResolver = resolverFor(EntityType.Network)
		const blocks = await blocksResolver.resolve.Caip2.resolve(network, {
			...context,
			pagination: {
				limit: 3,
				offset: 2,
			},
		})
		expect(blocksResolver.projections.Evm.$$blocks.select(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_000_018n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_000_017n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_000_016n,
				},
			},
		])
		expect(blocksResolver.projections.Evm.$$blocks.continuation(blocks).token).toBe('19000015')

		sourceFetch.mockResolvedValueOnce(Response.json({
			height: 19_000_022,
		}))
		const continuedBlocks = await blocksResolver.resolve.Caip2.resolve(network, {
			...context,
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '19000015',
		})
		expect(blocksResolver.projections.Evm.$$blocks.select(continuedBlocks)[0][EntityMetaKey.Selector].blockNumber).toBe(19_000_015n)
		expect(blocksResolver.projections.Evm.$$blocks.continuation(continuedBlocks).token).toBe('19000014')

		sourceFetch.mockResolvedValueOnce(Response.json({
			height: 19_000_020,
		}))
		const countResolver = envioHyperSync.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.projections.Evm?.$$blocks != null
			&& typeof resolver.projections.Evm.$$blocks === 'object'
			&& 'resolveCount' in resolver.projections.Evm.$$blocks
		))
		await expect(countResolver.resolve.Caip2.resolve(network, context)).resolves.toBe(19_000_021)

		sourceFetch
			.mockResolvedValueOnce(Response.json({
				height: 19_000_020,
			}))
			.mockResolvedValueOnce(Response.json({
				...evmBlockPage,
				next_block: 19_000_021,
				data: {
					blocks: [{
						...evmBlockPage.data.blocks[0],
						number: 19_000_020,
					}],
					transactions: [],
				},
			}))
		const timestamps = await envioHyperSync.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.projections.Evm?.$$timestamps != null
		)).resolve.Caip2.resolve(network, context)
		expect(timestamps).toHaveLength(1)
		expect(timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_700_000_000_000,
				source: Source.EnvioHyperSync_RawHttp,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: 19_000_020n,
			},
		})

		expect(resolverFor(EntityType.EvmNetwork_Timestamp)).toBeUndefined()
	})

	it('hard-fails unsupported networks and non-Complete HyperSync pages', async () => {
		await expect(resolverFor(EntityType.EvmBlock).resolve['EvmNetworkBlockNumber'].resolve({
			$network: {
				slug: 'polygon',
			},
			blockNumber: 19_000_000n,
		}, context)).rejects.toThrow('unsupported network')

		sourceFetch.mockResolvedValueOnce(Response.json({
			archive_height: 19_000_020,
			next_block: 19_000_001,
			total_execution_time: 1,
			data: {
				blocks: [],
				transactions: [],
			},
			rollback_guard: null,
		}))
		await expect(resolverFor(EntityType.EvmBlock).resolve['EvmNetworkBlockNumber'].resolve({
			$network: network,
			blockNumber: 19_000_000n,
		}, context)).rejects.toThrow('Empty block')
	})
})
