import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getFills,
	getOrders,
	getPerpetualMarkets,
	getPerpetualPositions,
	getSubaccount,
	getValidatorLatestBlock,
} = await import('$/sources/Dydx/Rest/queries.ts')

const binding = {
	provider: SourceProvider.Dydx,
	source: Source.DydxIndexer_Rest,
	target: {
		kind: SourceTargetKind.NetworkSlug,
		key: 'dydx',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://indexer.dydx.test',
		origin: 'https://indexer.dydx.test',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.DydxIndexerRest,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.RemoteQuery,
	credentials: [{ scope: SourceCredentialScope.None }],
} as const satisfies SourceBinding

const validatorBinding = {
	...binding,
	source: Source.DydxValidator_Rest,
	apiFamily: ApiFamily.CosmosLcdApi,
} as const satisfies SourceBinding

const address = `dydx1${'q'.repeat(38)}`
const height = {
	height: '9007199254740993',
	time: '2026-07-22T00:00:00.000Z',
}

describe('dYdX v4 read-only public transport', () => {
	beforeEach(() => {
		getJson.mockReset()
		getJson.mockImplementation((_binding, path) => (
			path === '/v4/height' ?
				Promise.resolve(height)
				:
				Promise.reject(new Error(`Unexpected path ${path}`))
		))
	})

	it('preserves market decimals and attaches indexer observation provenance', async () => {
		getJson.mockImplementation((_binding, path) => Promise.resolve(
			path === '/v4/height' ?
				height
				:
				{
					markets: {
						'BTC-USD': {
							clobPairId: '0',
							ticker: 'BTC-USD',
							status: 'ACTIVE',
							oraclePrice: '65554.247690000000000001',
							priceChange24H: '-746.07211',
							volume24H: '42428295.3917',
							trades24H: 6131,
							nextFundingRate: '-0.0000000000001',
							initialMarginFraction: '0.02',
							maintenanceMarginFraction: '0.012',
							openInterest: '308.7674',
							atomicResolution: -10,
							quantumConversionExponent: -9,
							tickSize: '1',
							stepSize: '0.0001',
							stepBaseQuantums: 1_000_000,
							subticksPerTick: 100_000,
							marketType: 'CROSS',
							openInterestLowerCap: '0',
							openInterestUpperCap: '0',
							baseOpenInterest: '782.0931',
							defaultFundingRate1H: '0',
						},
					},
				}
		))

		await expect(getPerpetualMarkets({
			binding,
			ticker: 'BTC-USD',
		})).resolves.toMatchObject({
			value: {
				markets: {
					'BTC-USD': {
						oraclePrice: '65554.247690000000000001',
						nextFundingRate: '-0.0000000000001',
					},
				},
			},
			indexedAtHeight: '9007199254740993',
			indexedAtTime: '2026-07-22T00:00:00.000Z',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v4/perpetualMarkets?market=BTC-USD'
		)
	})

	it('keeps public subaccount identity independent of signing state', async () => {
		getJson.mockImplementation((_binding, path) => Promise.resolve(
			path === '/v4/height' ?
				height
				:
				{
					subaccount: {
						address,
						subaccountNumber: 128_000,
						equity: '-0.000000000000000001',
						freeCollateral: '9007199254740993.000000000000000001',
						openPerpetualPositions: {},
						assetPositions: {},
						marginEnabled: true,
						updatedAtHeight: '9007199254740992',
						latestProcessedBlockHeight: '9007199254740993',
					},
				}
		))

		await expect(getSubaccount({
			binding,
			address,
			subaccountNumber: 128_000,
		})).resolves.toMatchObject({
			value: {
				address,
				subaccountNumber: 128_000,
				freeCollateral: '9007199254740993.000000000000000001',
			},
		})
	})

	it.each([
		{
			query: getOrders,
			path: '/v4/orders',
			response: [{
				id: 'order-1',
				subaccountNumber: 7,
				price: '0.000000000000000001',
				size: '9007199254740993.1',
				totalFilled: '0.1',
			}],
		},
		{
			query: getFills,
			path: '/v4/fills',
			response: {
				fills: [{
					id: 'fill-1',
					subaccountNumber: 7,
					price: '1.000000000000000001',
					size: '0.1',
					fee: '-0.00001',
					affiliateRevShare: '0',
					createdAtHeight: '9007199254740993',
				}],
			},
		},
		{
			query: getPerpetualPositions,
			path: '/v4/perpetualPositions',
			response: {
				positions: [{
					market: 'BTC-USD',
					subaccountNumber: 7,
					size: '-0.0001',
					maxSize: '1.5',
					entryPrice: '65554.24769',
					realizedPnl: '-0.01',
					unrealizedPnl: '0.02',
					sumOpen: '1',
					sumClose: '0',
					netFunding: '-0.000001',
				}],
			},
		},
	])('bounds and preserves $path rows', async ({ query, path, response }) => {
		getJson.mockImplementation((_binding, requestPath) => Promise.resolve(
			requestPath === '/v4/height' ? height : response
		))

		await expect(query({
			binding,
			address,
			subaccountNumber: 7,
			limit: 1,
		})).resolves.toMatchObject({
			value: [expect.objectContaining({
				subaccountNumber: 7,
			})],
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			expect.stringContaining(`${path}?address=${address}&subaccountNumber=7&limit=1`)
		)
	})

	it('rejects malformed inputs, foreign subjects, and write-shaped arbitrary paths', async () => {
		await expect(getOrders({
			binding,
			address: 'cosmos1foreign',
			subaccountNumber: 0,
		})).rejects.toThrow('invalid dYdX address')
		await expect(getFills({
			binding,
			address,
			subaccountNumber: 128_001,
		})).rejects.toThrow('invalid subaccount number')
		await expect(getPerpetualPositions({
			binding,
			address,
			subaccountNumber: 0,
			limit: 101,
		})).rejects.toThrow('invalid page limit')

		getJson.mockImplementation((_binding, path) => Promise.resolve(
			path === '/v4/height' ?
				height
				:
				[{
					subaccountNumber: 1,
					price: '1',
					size: '1',
					totalFilled: '0',
				}]
		))
		await expect(getOrders({
			binding,
			address,
			subaccountNumber: 0,
		})).rejects.toThrow('foreign subaccount order')

		expect('query' in await import('$/sources/Dydx/Rest/queries.ts')).toBe(false)
	})

	it('rejects validator responses from another consensus chain', async () => {
		getJson.mockResolvedValue({
			block: {
				header: {
					chain_id: 'foreign-1',
					height: '1',
					time: '2026-07-22T00:00:00.000Z',
				},
			},
		})

		await expect(getValidatorLatestBlock(validatorBinding))
			.rejects.toThrow('foreign chain')
	})
})
