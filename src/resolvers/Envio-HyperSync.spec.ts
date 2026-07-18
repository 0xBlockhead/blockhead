import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EvmBlockSelector } from '$/schema/EvmBlock.ts'
import { getEvmBlockRangePage } from '$/sources/Envio/HyperSync/queries.ts'
import evmBlockPage from '$/sources/Envio/HyperSync/fixtures/evm-block-page.json'
import evmBlockRollback from '$/sources/Envio/HyperSync/fixtures/evm-block-rollback.json'
import { EnvioHyperSyncResolution } from '$/sources/Envio/HyperSync/types.ts'

const { sourceFetch } = vi.hoisted(() => ({
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
	firstHttpUrlForBinding: () => 'https://eth.hypersync.xyz',
	sourceFetch,
}))

vi.mock('$/sources/$sourceProviders.ts', () => ({
	sourceProviderDefinitions: [{
		bindings: [{
			source: 'EnvioHyperSync_RawHttp',
			target: {
				key: '1',
			},
		}],
	}],
}))

const { default: envioHyperSync } = await import('$/resolvers/Envio-HyperSync.ts')

const binding = {
	source: 'EnvioHyperSync_RawHttp',
	endpoints: [],
}
const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Envio HyperSync query boundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('posts an exclusive range with explicit block and transaction fields', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockPage))

		await expect(getEvmBlockRangePage({
			binding,
			fromBlock: 19_000_000n,
			toBlock: 19_000_001n,
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Complete,
			nextBlock: 19_000_001,
			archiveHeight: 19_000_020,
			blocks: [{
				number: 19_000_000,
			}],
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
			binding,
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
			binding,
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
			binding,
			fromBlock: 19_000_000n,
			toBlock: 19_000_010n,
		})).resolves.toMatchObject({
			resolution: EnvioHyperSyncResolution.Partial,
			nextBlock: 19_000_005,
		})

		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockRollback))
		await expect(getEvmBlockRangePage({
			binding,
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
		})
	})
})

describe('Envio HyperSync resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps the approved EVM block fields and transaction selectors', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(evmBlockPage))
		const resolver = envioHyperSync.resolvers[0]
		const block = await resolver.resolve[EvmBlockSelector.EvmNetworkBlockNumber].resolve({
			$network: network,
			blockNumber: 19_000_000n,
		}, context)

		expect(Object.keys(resolver.projections).sort()).toEqual([
			'$$transactions',
			'baseFeePerGas',
			'blobGasUsed',
			'excessBlobGas',
			'gasLimit',
			'gasUsed',
			'hash',
			'parentHash',
			'timestamp',
			'transactionCount',
		].sort())
		expect(block).toMatchObject({
			hash: evmBlockPage.data.blocks[0].hash,
			parentHash: evmBlockPage.data.blocks[0].parent_hash,
			timestamp: 1_700_000_000_000,
			gasUsed: 21_000n,
			gasLimit: 30_000_000n,
			transactionCount: 1,
			transactions: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: evmBlockPage.data.transactions[0].hash,
				},
			}],
		})
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(envioHyperSync.resolvers[0].resolve[EvmBlockSelector.EvmNetworkBlockNumber].resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '137',
				},
			},
			blockNumber: 19_000_000n,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
