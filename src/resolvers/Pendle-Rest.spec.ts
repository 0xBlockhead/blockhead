import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Pendle/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())
const getAccountPositions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))
vi.mock('$/sources/Pendle/Contracts/queries.ts', () => ({
	getAccountPositions,
}))

const { default: pendleRest } = await import('$/resolvers/Pendle-Rest.ts')

const baseNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
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

const pendleMarketResolver = pendleRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.PendleMarket
))
const evmNetworkAccountResolver = pendleRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$pendlePositions' in resolver.projections
))
const pendlePositionResolver = pendleRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.PendlePosition
))

const baseMarketAddress = '0x00b321d89a8c36b3929f20b7955080baed706d1b'

const baseMarketWire = {
	name: 'USD0++',
	protocol: 'Usual',
	icon: 'https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3c9a13b5-2552-4c85-9e70-922aa4277398.svg',
	address: baseMarketAddress,
	expiry: '2024-10-31T00:00:00.000Z',
	pt: '1-0x270d664d2fc7d962012a787aec8661ca83df24eb',
	yt: '1-0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
	sy: '1-0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
	underlyingAsset: '1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
	accountingAsset: '1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
	details: {
		liquidity: 7075.869756555831,
		totalTvl: 7075.869756555831,
		tradingVolume: 0,
		underlyingApy: 0,
		swapFeeApy: 0,
		pendleApy: 0,
		ytFloatingApy: 0,
		impliedApy: 0.7088987080424998,
		feeRate: 0.000999999999916401,
		totalPt: 178401.28677910106,
		totalSy: 7462.289393383086,
		totalSupply: 93250.65624517394,
		totalActiveSupply: 38076.7840071317,
		aggregatedApy: 0,
		maxBoostedApy: 0,
	},
	isNew: false,
	isPrime: false,
	timestamp: '2024-08-06T08:47:11.000Z',
	categoryIds: [
		'stables',
	],
	chainId: 1,
} as const

describe('Pendle Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		getAccountPositions.mockReset()
	})

	it('publishes Pendle account positions onto $$pendlePositions', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Pendle account resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}
		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [
				{
					protocol: 'Pendle V2',
					chainId: 1,
					marketAddress: baseMarketAddress,
					marketName: 'USD0++',
					expiryTimestampMs: Date.parse(baseMarketWire.expiry),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					balances: [
						{
							kind: 'YT',
							address: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
							balance: '1000000',
						},
					],
				},
			],
		})

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)

		expect(evmNetworkAccountResolver.projections.$$pendlePositions.select(account)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$market: {
						$network: baseNetwork,
						marketAddress: baseMarketAddress,
					},
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$pendlePositions.resolveCount(account)).toBe(1)
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 1,
			account: accountSelector.$actor.address,
		})
	})

	it('resolves a Pendle position by account + market', async () => {
		if (pendlePositionResolver == null)
			throw new Error('missing PendlePosition resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}
		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [
				{
					protocol: 'Pendle V2',
					chainId: 1,
					marketAddress: baseMarketAddress,
					marketName: 'USD0++',
					expiryTimestampMs: Date.parse(baseMarketWire.expiry),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					balances: [
						{
							kind: 'YT',
							address: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
							balance: '1000000',
						},
						{
							kind: 'PT',
							address: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
							balance: '2',
						},
					],
				},
			],
		})

		const snapshot = await pendlePositionResolver.resolve.AccountMarket.resolve({
			$account: accountSelector,
			$market: {
				$network: baseNetwork,
				marketAddress: baseMarketAddress,
			},
		}, context)

		expect(pendlePositionResolver.projections.ytBalance(snapshot)).toBe('1000000')
		expect(pendlePositionResolver.projections.ptBalance(snapshot)).toBe('2')
		expect(pendlePositionResolver.projections.syBalance(snapshot)).toBe(undefined)
		expect(pendlePositionResolver.projections.lpBalance(snapshot)).toBe(undefined)
		expect(pendlePositionResolver.projections.$account(snapshot)).toEqual({
			[EntityMetaKey.Selector]: accountSelector,
		})
		expect(pendlePositionResolver.projections.$market(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: baseNetwork,
				marketAddress: baseMarketAddress,
			},
		})
	})

	it('projects every enrolled PendlePosition balance when present', async () => {
		if (pendlePositionResolver == null)
			throw new Error('missing PendlePosition resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}
		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [
				{
					protocol: 'Pendle V2',
					chainId: 1,
					marketAddress: baseMarketAddress,
					marketName: 'USD0++',
					expiryTimestampMs: Date.parse(baseMarketWire.expiry),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					balances: [
						{
							kind: 'PT',
							address: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
							balance: '11',
						},
						{
							kind: 'YT',
							address: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
							balance: '22',
						},
						{
							kind: 'SY',
							address: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
							balance: '33',
						},
						{
							kind: 'LP',
							address: baseMarketAddress,
							balance: '44',
						},
					],
				},
			],
		})

		const snapshot = await pendlePositionResolver.resolve.AccountMarket.resolve({
			$account: accountSelector,
			$market: {
				$network: baseNetwork,
				marketAddress: baseMarketAddress,
			},
		}, context)

		expect(pendlePositionResolver.projections.ptBalance(snapshot)).toBe('11')
		expect(pendlePositionResolver.projections.ytBalance(snapshot)).toBe('22')
		expect(pendlePositionResolver.projections.syBalance(snapshot)).toBe('33')
		expect(pendlePositionResolver.projections.lpBalance(snapshot)).toBe('44')
	})

	it('keeps authoritative $$pendlePositions resolveCount when the row limit windows the list', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Pendle account resolver')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}
		const secondMarketAddress = '0x1111111111111111111111111111111111111111'
		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [
				{
					protocol: 'Pendle V2',
					chainId: 1,
					marketAddress: baseMarketAddress,
					marketName: 'USD0++',
					expiryTimestampMs: Date.parse(baseMarketWire.expiry),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					balances: [
						{
							kind: 'YT',
							address: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
							balance: '1',
						},
					],
				},
				{
					protocol: 'Pendle V2',
					chainId: 1,
					marketAddress: secondMarketAddress,
					marketName: 'Other',
					expiryTimestampMs: Date.parse(baseMarketWire.expiry),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					balances: [
						{
							kind: 'LP',
							address: secondMarketAddress,
							balance: '2',
						},
					],
				},
			],
		})

		const snapshot = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			{
				...context,
				pagination: {
					limit: 1,
				},
			}
		)

		expect(evmNetworkAccountResolver.projections.$$pendlePositions.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$market: {
						$network: baseNetwork,
						marketAddress: baseMarketAddress,
					},
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$pendlePositions.resolveCount(snapshot)).toBe(2)
		expect(evmNetworkAccountResolver.projections.$$pendlePositions.continuation(snapshot)).toEqual({
			operation: 'account-pendle-positions',
			target: 'pendle',
			terminal: false,
			token: '1',
		})
	})

	it('rejects non-eip155 networks on account positions before transport', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Pendle account resolver')

		await expect(
			evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				$actor: {
					address: '0x0000000000000000000000000000000000000001',
				},
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(getAccountPositions).not.toHaveBeenCalled()
	})

	it('rejects unsupported Pendle chains on account positions before transport', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Pendle account resolver')

		await expect(
			evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				$actor: {
					address: '0x0000000000000000000000000000000000000001',
				},
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: unsupported chain id 999999`)
		expect(getAccountPositions).not.toHaveBeenCalled()
	})

	it('preserves an empty Pendle positions list on $$pendlePositions', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing Pendle account resolver')

		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [],
		})

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}, context)

		expect(evmNetworkAccountResolver.projections.$$pendlePositions.select(account)).toEqual([])
		expect(evmNetworkAccountResolver.projections.$$pendlePositions.resolveCount(account)).toBe(0)
	})

	it('registers under Pendle_Rest for PendleMarket', () => {
		expect(pendleRest.source).toBe(Source.Pendle_Rest)
		expect(pendleMarketResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		await expect(
			pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				marketAddress: baseMarketAddress,
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported Pendle chains before transport', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		await expect(
			pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				marketAddress: baseMarketAddress,
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: unsupported chain id 999999`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves a Pendle market snapshot by network and market address', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [baseMarketWire],
		})

		const snapshot = await pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
			$network: baseNetwork,
			marketAddress: baseMarketAddress,
		}, context)

		expect(pendleMarketResolver.projections.marketAddress(snapshot)).toBe(baseMarketAddress)
		expect(pendleMarketResolver.projections.name(snapshot)).toBe('USD0++')
		expect(pendleMarketResolver.projections.protocol(snapshot)).toBe('Usual')
		expect(pendleMarketResolver.projections.icon(snapshot)).toBe(baseMarketWire.icon)
		expect(pendleMarketResolver.projections.$icon(snapshot)).toMatchObject({
			[EntityMetaKey.Selector]: {
				url: baseMarketWire.icon,
			},
		})
		expect(pendleMarketResolver.projections.expiryTimestampMs(snapshot)).toBe(
			Date.parse(baseMarketWire.expiry)
		)
		expect(pendleMarketResolver.projections.ptAddress(snapshot)).toBe(
			'0x270d664d2fc7d962012a787aec8661ca83df24eb'
		)
		expect(pendleMarketResolver.projections.ytAddress(snapshot)).toBe(
			'0x4f0b4e6512630480b868e62a8a1d3451b0e9192d'
		)
		expect(pendleMarketResolver.projections.syAddress(snapshot)).toBe(
			'0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3'
		)
		expect(pendleMarketResolver.projections.underlyingAssetAddress(snapshot)).toBe(
			'0x35d8949372d46b7a3d5a56006ae77b215fc69bc0'
		)
		expect(pendleMarketResolver.projections.impliedApy(snapshot)).toBe(0.7088987080424998)
		expect(pendleMarketResolver.projections.underlyingApy(snapshot)).toBe(0)
		expect(pendleMarketResolver.projections.totalTvlUsd(snapshot)).toBe(7075.869756555831)
		expect(pendleMarketResolver.projections.liquidityUsd(snapshot)).toBe(7075.869756555831)
		expect(pendleMarketResolver.projections.tradingVolumeUsd(snapshot)).toBe(0)
		expect(pendleMarketResolver.projections.feeRate(snapshot)).toBe(0.000999999999916401)
		expect(pendleMarketResolver.projections.totalPt(snapshot)).toBe(178401.28677910106)
		expect(pendleMarketResolver.projections.totalSy(snapshot)).toBe(7462.289393383086)
		expect(pendleMarketResolver.projections.totalSupply(snapshot)).toBe(93250.65624517394)
		expect(pendleMarketResolver.projections.isPrime(snapshot)).toBe(false)
		expect(pendleMarketResolver.projections.isNew(snapshot)).toBe(false)
		expect(pendleMarketResolver.projections.observedAtTimestampMs(snapshot)).toBe(
			Date.parse(baseMarketWire.timestamp)
		)
		expect(JSON.stringify(snapshot)).not.toContain('accountingAsset')
		expect(JSON.stringify(snapshot)).not.toContain('swapFeeApy')
		expect(JSON.stringify(snapshot)).not.toContain('aggregatedApy')
		expect(JSON.stringify(snapshot)).not.toContain('totalActiveSupply')
		expect(JSON.stringify(snapshot)).not.toContain('categoryIds')
		expect(pendleMarketResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			bindings[Source.Pendle_Rest][0],
			httpUrl(bindings[Source.Pendle_Rest][0], `/v2/markets/all?chainId=1&ids=1-${baseMarketAddress}&skip=0&limit=1`)
		)
	})

	it('omits empty Pendle market icon (ZeroOrOne)', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [
				{
					...baseMarketWire,
					icon: '',
				},
			],
		})

		const snapshot = await pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
			$network: baseNetwork,
			marketAddress: baseMarketAddress,
		}, context)

		expect(pendleMarketResolver.projections.icon(snapshot)).toBe(undefined)
		expect(pendleMarketResolver.projections.$icon(snapshot)).toBe(undefined)
	})

	it('fails closed when markets/all omits enrolled details fields', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		const {
			details: {
				impliedApy: _impliedApy,
				...detailsWithoutImpliedApy
			},
			...marketWithoutImpliedApy
		} = baseMarketWire
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [
				{
					...marketWithoutImpliedApy,
					details: detailsWithoutImpliedApy,
				},
			],
		})

		await expect(
			pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
				$network: baseNetwork,
				marketAddress: baseMarketAddress,
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: invalid markets/all response envelope`)
	})

	it('throws when the market is absent from markets/all', async () => {
		if (pendleMarketResolver == null)
			throw new Error('missing PendleMarket resolver')

		sourceGetJson.mockResolvedValueOnce({
			total: 0,
			limit: 100,
			skip: 0,
			results: [],
		})

		await expect(
			pendleMarketResolver.resolve.NetworkMarketAddress.resolve({
				$network: baseNetwork,
				marketAddress: baseMarketAddress,
			}, context)
		).rejects.toThrow(`${Source.Pendle_Rest}: market not found`)
	})

	it('lists Network.Evm.$$pendleMarkets with authoritative resolveCount from markets/all total', async () => {
		const networkResolver = pendleRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Evm' in resolver.projections
			&& '$$pendleMarkets' in resolver.projections.Evm
		))
		if (networkResolver == null)
			throw new Error('missing Network.$$pendleMarkets resolver')

		sourceGetJson.mockResolvedValueOnce({
			total: 42,
			limit: 16,
			skip: 0,
			results: [baseMarketWire],
		})

		const snapshot = await networkResolver.resolve.Caip2.resolve(baseNetwork, context)

		expect(networkResolver.projections.Evm.$$pendleMarkets.select(snapshot)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: baseNetwork,
					marketAddress: baseMarketAddress,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.PendleMarket, [], 'name')]: 'USD0++',
					[entityFieldAddressKey(EntityType.PendleMarket, [], 'protocol')]: 'Usual',
					[entityFieldAddressKey(EntityType.PendleMarket, [], 'expiryTimestampMs')]: Date.parse(baseMarketWire.expiry),
				},
			},
		])
		expect(networkResolver.projections.Evm.$$pendleMarkets.resolveCount(snapshot)).toBe(42)
		expect(networkResolver.projections.Evm.$$pendleMarkets.continuation(snapshot)).toEqual({
			operation: 'network-pendle-markets',
			target: 'pendle',
			terminal: false,
			token: '1',
		})
	})
})
