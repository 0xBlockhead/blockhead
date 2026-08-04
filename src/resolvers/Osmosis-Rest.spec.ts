import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Osmosis/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { default: osmosisRest } = await import('$/resolvers/Osmosis-Rest.ts')

const osmosisNetwork = {
	caip2: {
		namespace: 'cosmos',
		reference: 'osmosis-1',
	},
}

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Osmosis LCD resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under Osmosis_LCD_Rest against cosmos:osmosis-1', () => {
		expect(osmosisRest.source).toBe(Source.Osmosis_LCD_Rest)
		expect(bindings[Source.Osmosis_LCD_Rest][0].target.key).toBe('cosmos:osmosis-1')
		expect(osmosisRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.Network,
			EntityType.Network_Timestamp,
			EntityType.IbcDenomTrace,
		])
	})

	it('rejects non-Osmosis networks', async () => {
		const networkResolver = osmosisRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
		))
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		await expect(
			networkResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
				},
			}, context)
		).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: unsupported network`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves Osmosis LCD rest endpoints for the network', async () => {
		const networkResolver = osmosisRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
		))
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		const snapshot = await networkResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkResolver.projections.Cosmos.restEndpoints(snapshot)).toEqual([
			{
				url: 'https://lcd.osmosis.zone',
				transportType: 'Http',
				providerName: 'Osmosis LCD',
			},
		])
	})

	it('resolves Osmosis network timestamp observations from LCD', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				default_node_info: {
					network: 'osmosis-1',
				},
				application_version: {
					app_name: 'osmosis',
					version: '1.0.0',
					cosmos_sdk_version: 'v0.50.0',
				},
			})
			.mockResolvedValueOnce({
				block_id: {
					hash: 'abcd',
				},
				block: {
					header: {
						height: '42',
						time: '2026-08-04T01:00:00.000Z',
						proposer_address: 'proposer',
						chain_id: 'osmosis-1',
					},
				},
			})

		const timestampResolver = osmosisRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network_Timestamp
		))
		if (timestampResolver == null)
			throw new Error('missing Network_Timestamp resolver')

		const snapshot = await timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: osmosisNetwork,
			timestampMs: 1,
			source: Source.Osmosis_LCD_Rest,
		}, context)

		expect(timestampResolver.projections.Cosmos.latestBlockHeight(snapshot)).toBe(42n)
		expect(timestampResolver.projections.Cosmos.chainId(snapshot)).toBe('osmosis-1')
		expect(timestampResolver.projections.Cosmos.nodeNetwork(snapshot)).toBe('osmosis-1')
	})

	it('resolves an IBC denom trace on Osmosis', async () => {
		const hash = 'b'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			denom_trace: {
				path: 'transfer/channel-0',
				base_denom: 'uatom',
			},
		})

		const denomTraceResolver = osmosisRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.IbcDenomTrace
		))
		if (denomTraceResolver == null)
			throw new Error('missing IbcDenomTrace resolver')

		const snapshot = await denomTraceResolver.resolve.NetworkTraceKey.resolve({
			$network: osmosisNetwork,
			traceKey: hash,
		}, context)

		expect(denomTraceResolver.projections.path(snapshot)).toBe('transfer/channel-0')
		expect(denomTraceResolver.projections.baseDenom(snapshot)).toBe('uatom')
		expect(denomTraceResolver.projections.displayDenom(snapshot)).toBe('uatom')
		expect(denomTraceResolver.projections.denomHash(snapshot)).toBe(hash)
		expect(denomTraceResolver.projections.sourcePort(snapshot)).toBe('transfer')
		expect(denomTraceResolver.projections.sourceChannel(snapshot)).toBe('channel-0')
	})
})
