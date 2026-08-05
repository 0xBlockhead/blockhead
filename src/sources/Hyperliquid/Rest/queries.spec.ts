import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const {
	getApprovedBuilders,
	getBorrowLendUserState,
	getClearinghouseState,
	getCandleSnapshot,
	getDelegatorSummary,
	getHistoricalOrders,
	getL2Book,
	getMetaAndAssetCtxs,
	getSpotMeta,
	getSpotClearinghouseState,
	getUserAbstraction,
	getUserDexAbstraction,
	getUserFees,
	getUserFillsByTime,
	getUserVaultEquities,
	getValidatorSummaries,
	getVaultDetails,
} = await import('$/sources/Hyperliquid/Rest/queries.ts')

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.RestJson
)

if (binding == null)
	throw new Error('Hyperliquid_Rest: Info binding is missing')

const vaultDetails = {
	name: 'Hyperliquidity Provider',
	vaultAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
	leader: '0x1111111111111111111111111111111111111111',
	description: 'market making vault',
	portfolio: [],
	apr: 0.1,
	followerState: null,
	leaderFraction: 0.1,
	leaderCommission: 0.1,
	followers: [],
	maxDistributable: 1,
	maxWithdrawable: 1,
	isClosed: false,
	relationship: null,
	allowDeposits: true,
	alwaysCloseOnWithdraw: false,
}

describe('Hyperliquid public account Info transport', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockImplementation(async (_url, options) => ({
			ok: true,
			json: async () => (
				JSON.parse(options.init.body).type === 'metaAndAssetCtxs' ?
					[{
						universe: [],
					}, []]
				: JSON.parse(options.init.body).type === 'vaultDetails' ?
					vaultDetails
				:
					[]
			),
		})
	)
	})

	it.each([
		{
			query: () => getMetaAndAssetCtxs(),
			body: {
				type: 'metaAndAssetCtxs',
			},
		},
		{
			query: () => getClearinghouseState({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'clearinghouseState',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getSpotClearinghouseState({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'spotClearinghouseState',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getHistoricalOrders({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'historicalOrders',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getUserFillsByTime({
				user: '0x1111111111111111111111111111111111111111',
				startTime: 1_700_000_000_000,
				endTime: 1_700_086_400_000,
			}),
			body: {
				type: 'userFillsByTime',
				user: '0x1111111111111111111111111111111111111111',
				startTime: 1_700_000_000_000,
				endTime: 1_700_086_400_000,
				aggregateByTime: false,
			},
		},
		{
			query: () => getUserVaultEquities({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'userVaultEquities',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getL2Book({
				coin: 'ETH',
			}),
			body: {
				type: 'l2Book',
				coin: 'ETH',
			},
		},
		{
			query: () => getCandleSnapshot({
				coin: 'ETH',
				interval: '1h',
				startTime: 1_700_000_000_000,
				endTime: 1_700_003_600_000,
			}),
			body: {
				type: 'candleSnapshot',
				req: {
					coin: 'ETH',
					interval: '1h',
					startTime: 1_700_000_000_000,
					endTime: 1_700_003_600_000,
				},
			},
		},
		{
			query: () => getVaultDetails({
				vaultAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
			}),
			body: {
				type: 'vaultDetails',
				vaultAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
			},
		},
		{
			query: () => getUserFees({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'userFees',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getDelegatorSummary({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'delegatorSummary',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getUserAbstraction({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'userAbstraction',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getUserDexAbstraction({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'userDexAbstraction',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getApprovedBuilders({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'approvedBuilders',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getBorrowLendUserState({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'borrowLendUserState',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
	])('posts the exact read-only Info request body', async ({ query, body }) => {
		await query()

		expect(corsFetch).toHaveBeenCalledWith(
			'https://api.hyperliquid.xyz/info',
			expect.objectContaining({
				init: expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(body),
				}),
			})
		)
	})

	it.each([
		{ startTime: -1 },
		{ startTime: 1.5 },
		{ startTime: 10, endTime: 9 },
		{ startTime: 10, endTime: Number.MAX_SAFE_INTEGER + 1 },
	])('rejects invalid fill windows before transport', ({ startTime, endTime }) => {
		expect(() => getUserFillsByTime({
			user: '0x1111111111111111111111111111111111111111',
			startTime,
			...(endTime != null && { endTime }),
		})).toThrow('Hyperliquid_Rest: invalid fill')
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it('rejects invalid candle, book, and vault requests before transport', async () => {
		expect(() => getL2Book({
			coin: '',
		})).toThrow('invalid book coin')
		expect(() => getCandleSnapshot({
			coin: 'ETH',
			interval: '7h',
			startTime: 1,
		})).toThrow('invalid candle interval')
		await expect(getVaultDetails({
			vaultAddress: 'not-a-vault',
		})).rejects.toThrow('invalid vault address')
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it('fails closed for malformed perp catalog, network, and vault envelopes', async () => {
		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [{
				universe: [],
			}],
		})
		await expect(getMetaAndAssetCtxs()).rejects.toThrow('Hyperliquid_Rest: invalid metaAndAssetCtxs response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				tokens: [],
				universe: [{
					name: 'PURR/USDC',
					tokens: [1],
					index: 0,
				}],
			}),
		})
		await expect(getSpotMeta()).rejects.toThrow('Hyperliquid_Rest: invalid spotMeta response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [{
				validator: '0x1111111111111111111111111111111111111111',
			}],
		})
		await expect(getValidatorSummaries()).rejects.toThrow('Hyperliquid_Rest: invalid validatorSummaries response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				...vaultDetails,
				followers: [{
					user: '0x1111111111111111111111111111111111111111',
				}],
			}),
		})
		await expect(getVaultDetails({
			vaultAddress: vaultDetails.vaultAddress,
		})).rejects.toThrow('Hyperliquid_Rest: invalid vaultDetails response envelope')
	})

	it('accepts documented metaAndAssetCtxs marginTables and marginTableId fields', async () => {
		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [
				{
					universe: [{
						name: 'BTC',
						szDecimals: 5,
						maxLeverage: 40,
						marginTableId: 56,
					}],
					marginTables: [
						[
							56,
							{
								description: '',
								marginTiers: [{
									lowerBound: '0.0',
									maxLeverage: 40,
								}],
							},
						],
					],
					collateralToken: 0,
				},
				[{
					funding: '0.0001',
					openInterest: '1',
					prevDayPx: '1',
					dayNtlVlm: '1',
					markPx: '1',
					midPx: '1',
				}],
			],
		})

		await expect(getMetaAndAssetCtxs()).resolves.toMatchObject([
			{
				universe: [{
					name: 'BTC',
					marginTableId: 56,
				}],
				collateralToken: 0,
			},
			[{
				markPx: '1',
			}],
		])
	})
})
