import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
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
const networkIbcChannelsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$ibcChannels' in resolver.projections.Cosmos
))
const networkIbcClientsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$ibcClients' in resolver.projections.Cosmos
))
const networkIbcConnectionsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$ibcConnections' in resolver.projections.Cosmos
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
const osmosisPositionResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OsmosisPosition
))
const cosmosAccountOsmosisPositionsResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosAccount
	&& '$$osmosisPositions' in resolver.projections
))
const osmosisPoolAssetResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OsmosisPoolAsset
))
const osmosisPoolTimestampResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.OsmosisPool_Timestamp
))
const ibcClientResolver = osmosisRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcClient
	&& 'clientType' in resolver.projections
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
			EntityType.OsmosisPosition,
			EntityType.CosmosAccount,
			EntityType.OsmosisPoolAsset,
			EntityType.OsmosisPool_Timestamp,
			EntityType.CosmosDenom,
			EntityType.Network,
			EntityType.Network,
			EntityType.Network,
			EntityType.Network,
			EntityType.Network,
			EntityType.Network,
			EntityType.IbcChannel,
			EntityType.IbcConnection,
			EntityType.IbcConnection,
			EntityType.IbcClient,
			EntityType.IbcClient,
			EntityType.IbcClient,
		])
		expect(networkRestEndpointsResolver).toBeDefined()
		expect(timestampResolver).toBeDefined()
		expect(blockResolver).toBeDefined()
		expect(denomTraceResolver).toBeDefined()
		expect(osmosisPoolResolver).toBeDefined()
		expect(osmosisPositionResolver).toBeDefined()
		expect(cosmosAccountOsmosisPositionsResolver).toBeDefined()
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
		expect(denomTraceResolver.projections.$channel(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: osmosisNetwork,
				portId: 'transfer',
				channelId: 'channel-0',
			},
		})
		expect(denomTraceResolver.projections.$cosmosDenom(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: osmosisNetwork,
				denom: `ibc/${hash.toUpperCase()}`,
			},
		})
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
		expect(networkBlocksResolver.projections.Cosmos.$$blocks.select(snapshot)).toEqual([
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
		expect(networkBlocksResolver.projections.Cosmos.$$blocks.resolveCount(snapshot)).toBe(4n)
		expect(networkBlocksResolver.projections.Cosmos.$$blocks.continuation(snapshot)).toEqual({
			operation: 'network-blocks',
			terminal: true,
		})
	})

	it('walks disjoint Cosmos block pages and stops at genesis', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				block: {
					header: {
						height: '3',
					},
				},
			})
			.mockResolvedValueOnce({
				block: {
					header: {
						height: '3',
					},
				},
			})
			.mockResolvedValueOnce({
				block: {
					header: {
						height: '3',
					},
				},
			})

		if (networkBlocksResolver == null)
			throw new Error('missing Network $$blocks resolver')

		expect(networkBlocksResolver.projections.Cosmos.$$blocks.select(
			await networkBlocksResolver.resolve.Caip2.resolve(osmosisNetwork, {
				...context,
				pagination: {
					limit: 2,
					offset: 2,
				},
			})
		)).toEqual([
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
		expect(networkBlocksResolver.projections.Cosmos.$$blocks.select(
			await networkBlocksResolver.resolve.Caip2.resolve(osmosisNetwork, {
				...context,
				pagination: {
					limit: 2,
					offset: 4,
				},
			})
		)).toEqual([])
		const continuedPage = await networkBlocksResolver.resolve.Caip2.resolve(osmosisNetwork, {
			...context,
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '2',
		})
		expect(networkBlocksResolver.projections.Cosmos.$$blocks.select(continuedPage)[0][EntityMetaKey.Selector].height).toBe(2n)
		expect(networkBlocksResolver.projections.Cosmos.$$blocks.continuation(continuedPage)).toEqual({
			operation: 'network-blocks',
			terminal: false,
			token: '1',
		})
	})

	it('lists all OsmosisPool kinds from poolmanager all-pools with nested fields', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [
				{
					id: '1',
					'@type': '/osmosis.gamm.v1beta1.Pool',
					address: 'osmo1balancer',
					pool_params: {
						swap_fee: '0.003',
					},
					pool_assets: [
						{
							token: {
								denom: 'uosmo',
								amount: '100',
							},
						},
						{
							token: {
								denom: 'uion',
								amount: '100',
							},
						},
					],
				},
				{
					id: '1066',
					'@type': '/osmosis.concentratedliquidity.v1beta1.Pool',
					token0: 'uosmo',
					token1: 'uion',
					current_tick: '1',
					current_tick_liquidity: '2',
					spread_factor: '0.002',
				},
			],
		})

		if (networkOsmosisPoolsResolver == null)
			throw new Error('missing Network $$osmosisPools resolver')

		const snapshot = await networkOsmosisPoolsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkOsmosisPoolsResolver.projections.Cosmos.$$osmosisPools.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					poolId: '1',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'typeUrl')]: '/osmosis.gamm.v1beta1.Pool',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'liquidityKind')]: 'Balancer',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'address')]: 'osmo1balancer',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'swapFee')]: '0.003',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					poolId: '1066',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'typeUrl')]: '/osmosis.concentratedliquidity.v1beta1.Pool',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'liquidityKind')]: 'Concentrated liquidity',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'token0Denom')]: 'uosmo',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'token1Denom')]: 'uion',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'currentTick')]: '1',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'currentTickLiquidity')]: '2',
					[entityFieldAddressKey(EntityType.OsmosisPool, [], 'spreadFactor')]: '0.002',
				},
			},
		])
		expect(networkOsmosisPoolsResolver.projections.Cosmos.$$osmosisPools.resolveCount(snapshot)).toBe(2)
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

	it('slices the complete all-pools catalog for a bounded hub window', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: Array.from({
				length: 17,
			}, (_value, index) => ({
				id: String(index + 1),
				'@type': '/osmosis.gamm.v1beta1.Pool',
			})),
		})

		if (networkOsmosisPoolsResolver == null)
			throw new Error('missing Network $$osmosisPools resolver')

		const snapshot = await networkOsmosisPoolsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		expect(networkOsmosisPoolsResolver.projections.Cosmos.$$osmosisPools.select(snapshot)).toHaveLength(16)
		expect(networkOsmosisPoolsResolver.projections.Cosmos.$$osmosisPools.resolveCount(snapshot)).toBe(17)
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
		expect(osmosisPoolResolver.projections.positionCount).toEqual(expect.objectContaining({
			resolve: expect.any(Function),
		}))
	})

	it('projects OsmosisPool.positionCount from getNumPoolPositions', async () => {
		sourceGetJson.mockResolvedValueOnce({
			position_count: '42',
		})

		if (osmosisPoolResolver == null)
			throw new Error('missing OsmosisPool resolver')

		const positionCount = osmosisPoolResolver.projections.positionCount
		if (typeof positionCount === 'function' || positionCount?.resolve == null)
			throw new Error('missing OsmosisPool.positionCount field resolve')

		await expect(positionCount.resolve({
			$network: osmosisNetwork,
			poolId: '1066',
		}, context)).resolves.toBe(42n)
		expect(sourceGetJson).toHaveBeenCalledWith(
			expect.anything(),
			expect.stringContaining('/osmosis/concentratedliquidity/v1beta1/num_pool_positions/1066')
		)
		expect(osmosisPoolResolver.projections).not.toHaveProperty('$$positions')
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

	it('resolves OsmosisPosition by network + position id', async () => {
		if (osmosisPositionResolver == null)
			throw new Error('missing OsmosisPosition resolver')

		sourceGetJson.mockResolvedValueOnce({
			position: {
				position: {
					position_id: '12',
					address: 'osmo1pnw2u5yn26vhhr2t32r8x54zegxfe0q9zr247t',
					pool_id: '1066',
					lower_tick: '1',
					upper_tick: '2',
					join_time: '2023-07-13T15:49:04.609471378Z',
					liquidity: '10',
				},
				asset0: {
					denom: 'uosmo',
					amount: '5',
				},
				asset1: {
					denom: 'uion',
					amount: '0',
				},
				claimable_spread_rewards: [
					{
						denom: 'uosmo',
						amount: '1',
					},
				],
			},
		})

		const snapshot = await osmosisPositionResolver.resolve.NetworkPositionId.resolve({
			$network: osmosisNetwork,
			positionId: '12',
		}, context)

		expect(osmosisPositionResolver.projections.positionId(snapshot)).toBe('12')
		expect(osmosisPositionResolver.projections.liquidity(snapshot)).toBe('10')
		expect(osmosisPositionResolver.projections.tickLower(snapshot)).toBe('1')
		expect(osmosisPositionResolver.projections.$pool(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: osmosisNetwork,
				poolId: '1066',
			},
		})
		expect(osmosisPositionResolver.projections.claimableSpreadRewards(snapshot)).toBe('1uosmo')
	})

	it('publishes owner CL positions onto CosmosAccount.$$osmosisPositions', async () => {
		if (cosmosAccountOsmosisPositionsResolver == null)
			throw new Error('missing CosmosAccount $$osmosisPositions resolver')

		const address = 'osmo1pnw2u5yn26vhhr2t32r8x54zegxfe0q9zr247t'
		sourceGetJson.mockResolvedValueOnce({
			positions: [
				{
					position: {
						position_id: '12',
						address,
						pool_id: '1066',
						lower_tick: '1',
						upper_tick: '2',
						liquidity: '10',
					},
				},
			],
			pagination: {
				total: '1',
			},
		})

		const snapshot = await cosmosAccountOsmosisPositionsResolver.resolve.NetworkAddress.resolve({
			$network: osmosisNetwork,
			address,
		}, context)

		expect(cosmosAccountOsmosisPositionsResolver.projections.$$osmosisPositions.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: osmosisNetwork,
					positionId: '12',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.OsmosisPosition, [], '$pool')]: {
						[EntityMetaKey.Selector]: {
							$network: osmosisNetwork,
							poolId: '1066',
						},
					},
					[entityFieldAddressKey(EntityType.OsmosisPosition, [], '$account')]: {
						[EntityMetaKey.Selector]: {
							$network: osmosisNetwork,
							address,
						},
					},
					[entityFieldAddressKey(EntityType.OsmosisPosition, [], 'tickLower')]: '1',
					[entityFieldAddressKey(EntityType.OsmosisPosition, [], 'tickUpper')]: '2',
					[entityFieldAddressKey(EntityType.OsmosisPosition, [], 'liquidity')]: '10',
				},
			},
		])
		expect(cosmosAccountOsmosisPositionsResolver.projections.$$osmosisPositions.resolveCount(snapshot)).toBe(1)
	})

	it('preserves an empty CosmosAccount $$osmosisPositions list', async () => {
		if (cosmosAccountOsmosisPositionsResolver == null)
			throw new Error('missing CosmosAccount $$osmosisPositions resolver')

		const address = 'osmo1pnw2u5yn26vhhr2t32r8x54zegxfe0q9zr247t'
		sourceGetJson.mockResolvedValueOnce({
			positions: [],
		})

		const snapshot = await cosmosAccountOsmosisPositionsResolver.resolve.NetworkAddress.resolve({
			$network: osmosisNetwork,
			address,
		}, context)

		expect(cosmosAccountOsmosisPositionsResolver.projections.$$osmosisPositions.select(snapshot)).toEqual([])
	})

	it('projects OsmosisPool.$$timestamps spot pairs when token0/token1 are known', async () => {
		if (osmosisPoolResolver == null)
			throw new Error('missing OsmosisPool resolver')

		const $$timestamps = osmosisPoolResolver.projections.$$timestamps
		if (typeof $$timestamps === 'function' || $$timestamps?.resolve == null)
			throw new Error('missing OsmosisPool.$$timestamps field resolve')

		sourceGetJson
			.mockResolvedValueOnce({
				pool: {
					id: '1066',
					'@type': '/osmosis.concentratedliquidity.v1beta1.Pool',
					token0: 'uosmo',
					token1: 'uion',
				},
			})
			.mockResolvedValueOnce({
				spot_price: '1.5',
			})
			.mockResolvedValueOnce({
				spot_price: '0.666666666666666667',
			})

		const rows = await $$timestamps.resolve({
			$network: osmosisNetwork,
			poolId: '1066',
		}, context)

		expect(rows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: osmosisNetwork,
						poolId: '1066',
					},
					timestampMs: expect.any(Number),
					baseAssetDenom: 'uosmo',
					quoteAssetDenom: 'uion',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'source')]: Source.Osmosis_LCD_Rest,
					[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'spotPrice')]: '1.5',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: osmosisNetwork,
						poolId: '1066',
					},
					timestampMs: expect.any(Number),
					baseAssetDenom: 'uion',
					quoteAssetDenom: 'uosmo',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'source')]: Source.Osmosis_LCD_Rest,
					[entityFieldAddressKey(EntityType.OsmosisPool_Timestamp, [], 'spotPrice')]: '0.666666666666666667',
				},
			},
		])
	})

	it('omits OsmosisPool.$$timestamps when the pool pair is ambiguous', async () => {
		if (osmosisPoolResolver == null)
			throw new Error('missing OsmosisPool resolver')

		const $$timestamps = osmosisPoolResolver.projections.$$timestamps
		if (typeof $$timestamps === 'function' || $$timestamps?.resolve == null)
			throw new Error('missing OsmosisPool.$$timestamps field resolve')

		sourceGetJson.mockResolvedValueOnce({
			pool: {
				id: '99',
				'@type': '/osmosis.gamm.v1beta1.Pool',
				pool_assets: [
					{
						token: {
							denom: 'uosmo',
							amount: '1',
						},
					},
				],
			},
		})

		await expect($$timestamps.resolve({
			$network: osmosisNetwork,
			poolId: '99',
		}, context)).resolves.toBeUndefined()
	})

	it('projects whole-second IBC client durations from LCD', async () => {
		if (ibcClientResolver == null)
			throw new Error('missing IBC client resolver')

		sourceGetJson.mockResolvedValueOnce({
			client_state: {
				'@type': '/ibc.lightclients.tendermint.v1.ClientState',
				chain_id: 'cosmoshub-4',
				trust_level: {
					numerator: '1',
					denominator: '3',
				},
				trusting_period: '1209600s',
				unbonding_period: '1814400s',
				max_clock_drift: '600s',
				frozen_height: {
					revision_number: '0',
					revision_height: '0',
				},
				latest_height: {
					revision_number: '1',
					revision_height: '9',
				},
			},
		})

		const snapshot = await ibcClientResolver.resolve.NetworkClientId.resolve({
			$network: osmosisNetwork,
			clientId: '07-tendermint-0',
		}, context)

		expect(ibcClientResolver.projections.trustingPeriodNs(snapshot)).toBe(1209600n * 1_000_000_000n)
		expect(ibcClientResolver.projections.unbondingPeriodNs(snapshot)).toBe(1814400n * 1_000_000_000n)
		expect(ibcClientResolver.projections.maxClockDriftNs(snapshot)).toBe(600n * 1_000_000_000n)
	})

	it('materializes stable IBC hierarchy and configuration from network lists', async () => {
		if (
			networkIbcChannelsResolver == null
			|| networkIbcClientsResolver == null
			|| networkIbcConnectionsResolver == null
		)
			throw new Error('missing network IBC list resolvers')

		sourceGetJson
			.mockResolvedValueOnce({
				channels: [{
					state: 'STATE_OPEN',
					ordering: 'ORDER_UNORDERED',
					counterparty: {
						port_id: 'transfer',
						channel_id: 'channel-141',
					},
					connection_hops: ['connection-0'],
					version: 'ics20-1',
					port_id: 'transfer',
					channel_id: 'channel-0',
				}],
				pagination: {
					total: '1',
				},
			})
			.mockResolvedValueOnce({
				client_states: [{
					client_id: '07-tendermint-0',
					client_state: {
						'@type': '/ibc.lightclients.tendermint.v1.ClientState',
						chain_id: 'cosmoshub-4',
						trust_level: {
							numerator: '1',
							denominator: '3',
						},
						trusting_period: '1209600s',
						unbonding_period: '1814400s',
						max_clock_drift: '600s',
						frozen_height: {
							revision_number: '0',
							revision_height: '0',
						},
						latest_height: {
							revision_number: '1',
							revision_height: '9',
						},
					},
				}],
				pagination: {
					total: '1',
				},
			})
			.mockResolvedValueOnce({
				connections: [{
					id: 'connection-0',
					client_id: '07-tendermint-0',
					state: 'STATE_OPEN',
					counterparty: {
						client_id: '07-tendermint-1',
						connection_id: 'connection-141',
					},
					delay_period: '0',
				}],
				pagination: {
					total: '1',
				},
			})

		const channelPage = await networkIbcChannelsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		const clientPage = await networkIbcClientsResolver.resolve.Caip2.resolve(osmosisNetwork, context)
		const connectionPage = await networkIbcConnectionsResolver.resolve.Caip2.resolve(osmosisNetwork, context)

		expect(networkIbcChannelsResolver.projections.Cosmos.$$ibcChannels.select(channelPage)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: osmosisNetwork,
				portId: 'transfer',
				channelId: 'channel-0',
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.IbcChannel, [], '$connection')]: {
					[EntityMetaKey.Selector]: {
						$network: osmosisNetwork,
						connectionId: 'connection-0',
					},
				},
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyChannelId')]: 'channel-141',
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'version')]: 'ics20-1',
			}),
		}])
		expect(networkIbcClientsResolver.projections.Cosmos.$$ibcClients.select(clientPage)[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.IbcClient, [], 'clientType')]: '07-tendermint',
			[entityFieldAddressKey(EntityType.IbcClient, [], 'counterpartyChainId')]: 'cosmoshub-4',
			[entityFieldAddressKey(EntityType.IbcClient, [], 'trustingPeriodNs')]: 1209600n * 1_000_000_000n,
		})
		expect(networkIbcConnectionsResolver.projections.Cosmos.$$ibcConnections.select(connectionPage)[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.IbcConnection, [], 'clientId')]: '07-tendermint-0',
			[entityFieldAddressKey(EntityType.IbcConnection, [], 'counterpartyConnectionId')]: 'connection-141',
			[entityFieldAddressKey(EntityType.IbcConnection, [], 'delayPeriodNs')]: 0n,
		})
	})

})
