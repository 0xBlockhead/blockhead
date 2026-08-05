import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
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

const networkRestEndpointsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& 'restEndpoints' in resolver.projections.Cosmos
))
const networkTimestampsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))
const networkBlocksResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$blocks' in resolver.projections.Cosmos
))
const networkOsmosisPoolsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$osmosisPools' in resolver.projections.Cosmos
))
const timestampResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))
const blockResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosBlock
))
const denomTraceResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcDenomTrace
))
const osmosisPoolResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OsmosisPool
))
const osmosisPoolAssetResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OsmosisPoolAsset
))
const osmosisPoolTimestampResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OsmosisPool_Timestamp
))

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
			EntityType.CosmosBlock,
			EntityType.IbcDenomTrace,
			EntityType.OsmosisPool,
			EntityType.OsmosisPoolAsset,
			EntityType.OsmosisPool_Timestamp,
			EntityType.Network,
			EntityType.Network,
			EntityType.Network,
		])
		expect(networkRestEndpointsResolver).toBeDefined()
		expect(timestampResolver).toBeDefined()
		expect(blockResolver).toBeDefined()
		expect(denomTraceResolver).toBeDefined()
		expect(osmosisPoolResolver).toBeDefined()
		expect(osmosisPoolAssetResolver).toBeDefined()
		expect(osmosisPoolTimestampResolver).toBeDefined()
		expect(networkTimestampsResolver).toBeDefined()
		expect(networkBlocksResolver).toBeDefined()
		expect(networkOsmosisPoolsResolver).toBeDefined()
	})

	it('rejects non-Osmosis networks', async () => {
		if (networkRestEndpointsResolver == null)
			throw new Error('missing Network restEndpoints resolver')

		await expect(
			networkRestEndpointsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
				},
			}, context)
		).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: unsupported network`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves Osmosis LCD rest endpoints for the network', async () => {
		if (networkRestEndpointsResolver == null)
			throw new Error('missing Network restEndpoints resolver')

		const snapshot = await networkRestEndpointsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkRestEndpointsResolver.projections.Cosmos.restEndpoints(snapshot)).toEqual([
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
					data: {
						txs: [
							'tx0',
							'tx1',
						],
					},
				},
			})
			.mockResolvedValueOnce({
				syncing: false,
			})
			.mockResolvedValueOnce({
				validators: [],
				pagination: {
					total: '150',
				},
			})
			.mockResolvedValueOnce({
				pool: {
					bonded_tokens: '1000',
					not_bonded_tokens: '200',
				},
			})

		if (timestampResolver == null)
			throw new Error('missing Network_Timestamp resolver')

		const snapshot = await timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: osmosisNetwork,
			timestampMs: 1,
			source: Source.Osmosis_LCD_Rest,
		}, context)

		expect(timestampResolver.projections.Cosmos.latestBlockHeight(snapshot)).toBe(42n)
		expect(timestampResolver.projections.Cosmos.latestBlockTransactionCount(snapshot)).toBe(2)
		expect(timestampResolver.projections.Cosmos.chainId(snapshot)).toBe('osmosis-1')
		expect(timestampResolver.projections.Cosmos.nodeNetwork(snapshot)).toBe('osmosis-1')
		expect(timestampResolver.projections.Cosmos.isSyncing(snapshot)).toBe(false)
		expect(timestampResolver.projections.Cosmos.bondedValidatorCount(snapshot)).toBe(150)
		expect(timestampResolver.projections.Cosmos.bondedTokens(snapshot)).toBe(1000n)
		expect(timestampResolver.projections.Cosmos.notBondedTokens(snapshot)).toBe(200n)
		expect(sourceGetJson).toHaveBeenCalledTimes(5)
	})

	it('resolves a Cosmos block by height', async () => {
		sourceGetJson.mockResolvedValueOnce({
			block_id: {
				hash: 'blockhash',
			},
			block: {
				header: {
					height: '41',
					time: '2026-08-04T00:59:00.000Z',
					proposer_address: 'proposer41',
					chain_id: 'osmosis-1',
				},
				data: {
					txs: [
						'tx',
					],
				},
			},
		})

		if (blockResolver == null)
			throw new Error('missing CosmosBlock resolver')

		const snapshot = await blockResolver.resolve.NetworkHeight.resolve({
			$network: osmosisNetwork,
			height: 41n,
		}, context)

		expect(blockResolver.projections.hash(snapshot)).toBe('blockhash')
		expect(blockResolver.projections.proposerConsensusAddress(snapshot)).toBe('proposer41')
		expect(blockResolver.projections.timestampMs(snapshot)).toBe(Date.parse('2026-08-04T00:59:00.000Z'))
		expect(blockResolver.projections.transactionCount(snapshot)).toBe(1)
	})

	it('resolves an IBC denom trace on Osmosis', async () => {
		const hash = 'b'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			denom_trace: {
				path: 'transfer/channel-0',
				base_denom: 'uatom',
			},
		})

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

	it('exposes a Network $$timestamps handle for Osmosis LCD', async () => {
		if (networkTimestampsResolver == null)
			throw new Error('missing Network $$timestamps resolver')

		const snapshot = await networkTimestampsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkTimestampsResolver.projections.$$timestamps(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					timestampMs: expect.any(Number),
					source: Source.Osmosis_LCD_Rest,
				},
			},
		])
	})

	it('lists recent Cosmos block refs from latest height', async () => {
		sourceGetJson.mockResolvedValueOnce({
			block_id: {
				hash: 'tip',
			},
			block: {
				header: {
					height: '3',
					time: '2026-08-04T01:00:00.000Z',
					proposer_address: 'proposer',
					chain_id: 'osmosis-1',
				},
				data: {
					txs: [],
				},
			},
		})

		if (networkBlocksResolver == null)
			throw new Error('missing Network $$blocks resolver')

		const snapshot = await networkBlocksResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkBlocksResolver.projections.Cosmos.$$blocks(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					height: 3n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					height: 2n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					height: 1n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					height: 0n,
				},
			},
		])
	})

	it('lists OsmosisPool refs from poolmanager getPools', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [
				{
					id: '1',
				},
				{
					id: '678',
				},
			],
		})

		if (networkOsmosisPoolsResolver == null)
			throw new Error('missing Network $$osmosisPools resolver')

		const snapshot = await networkOsmosisPoolsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkOsmosisPoolsResolver.projections.Cosmos.$$osmosisPools(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					poolId: '1',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					poolId: '678',
				},
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			expect.anything(),
			expect.stringContaining('/osmosis/poolmanager/v1beta1/all-pools')
		)
	})

	it('rejects an invalid Osmosis pool list envelope', async () => {
		sourceGetJson.mockResolvedValueOnce({})

		if (networkOsmosisPoolsResolver == null)
			throw new Error('missing Network $$osmosisPools resolver')

		await expect(
			networkOsmosisPoolsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		).rejects.toThrow()
	})

	it('rejects $$osmosisPools for non-Osmosis networks without transport', async () => {
		if (networkOsmosisPoolsResolver == null)
			throw new Error('missing Network $$osmosisPools resolver')

		await expect(
			networkOsmosisPoolsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
				},
			}, context)
		).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: unsupported network`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves a native OsmosisPool from poolmanager getPool', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				'@type': '/osmosis.gamm.v1beta1.Pool',
				address: 'osmo1pool',
				id: '1',
				pool_params: {
					swap_fee: '0.002',
					exit_fee: '0',
				},
				total_weight: '100',
				total_shares: {
					denom: 'gamm/pool/1',
					amount: '1000',
				},
				pool_assets: [
					{
						token: {
							denom: 'uosmo',
							amount: '500',
						},
						weight: '50',
					},
					{
						token: {
							denom: 'uion',
							amount: '500',
						},
						weight: '50',
					},
				],
			},
		})

		if (osmosisPoolResolver == null)
			throw new Error('missing OsmosisPool resolver')

		const poolSelector = {
			$network: osmosisNetwork,
			poolId: '1',
		}
		const snapshot = await osmosisPoolResolver.resolve.NetworkPoolId.resolve(poolSelector, context)
		expect(osmosisPoolResolver.projections.poolId(snapshot)).toBe('1')
		expect(osmosisPoolResolver.projections.typeUrl(snapshot)).toBe('/osmosis.gamm.v1beta1.Pool')
		expect(osmosisPoolResolver.projections.address(snapshot)).toBe('osmo1pool')
		expect(osmosisPoolResolver.projections.swapFee(snapshot)).toBe('0.002')
		expect(osmosisPoolResolver.projections.totalSharesDenom(snapshot)).toBe('gamm/pool/1')
		expect(osmosisPoolResolver.projections.$$assets(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$pool: poolSelector,
					denom: 'uosmo',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$pool: poolSelector,
					denom: 'uion',
				},
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			expect.anything(),
			expect.stringContaining('/osmosis/poolmanager/v1beta1/pools/1')
		)
	})

	it('resolves OsmosisPoolAsset balances from the parent pool snapshot', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				id: '1',
				pool_assets: [
					{
						token: {
							denom: 'uosmo',
							amount: '500',
						},
						weight: '50',
					},
				],
			},
		})

		if (osmosisPoolAssetResolver == null)
			throw new Error('missing OsmosisPoolAsset resolver')

		const snapshot = await osmosisPoolAssetResolver.resolve.PoolDenom.resolve({
			$pool: {
				$network: osmosisNetwork,
				poolId: '1',
			},
			denom: 'uosmo',
		}, context)

		expect(osmosisPoolAssetResolver.projections.denom(snapshot)).toBe('uosmo')
		expect(osmosisPoolAssetResolver.projections.amount(snapshot)).toBe('500')
		expect(osmosisPoolAssetResolver.projections.weight(snapshot)).toBe('50')
		expect(osmosisPoolAssetResolver.projections.$cosmosDenom(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: osmosisNetwork,
				denom: 'uosmo',
			},
		})
	})

	it('resolves OsmosisPool_Timestamp spot price from getSpotPrice', async () => {
		sourceGetJson.mockResolvedValueOnce({
			spot_price: '1.25',
		})

		if (osmosisPoolTimestampResolver == null)
			throw new Error('missing OsmosisPool_Timestamp resolver')

		const snapshot = await osmosisPoolTimestampResolver.resolve.PoolTimestampMsBaseQuote.resolve({
			$pool: {
				$network: osmosisNetwork,
				poolId: '1',
			},
			timestampMs: 1_700_000_000_000,
			baseAssetDenom: 'uosmo',
			quoteAssetDenom: 'uion',
		}, context)

		expect(osmosisPoolTimestampResolver.projections.spotPrice(snapshot)).toBe('1.25')
		expect(osmosisPoolTimestampResolver.projections.source(snapshot)).toBe(Source.Osmosis_LCD_Rest)
		expect(osmosisPoolTimestampResolver.projections.baseAssetDenom(snapshot)).toBe('uosmo')
		expect(osmosisPoolTimestampResolver.projections.quoteAssetDenom(snapshot)).toBe('uion')
		expect(sourceGetJson).toHaveBeenCalledWith(
			expect.anything(),
			expect.stringMatching(/\/osmosis\/poolmanager\/v1beta1\/pools\/1\/prices\?/)
		)
	})
})
