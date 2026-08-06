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
	getAllBorrowLendReserveStates,
	getBorrowLendUserState,
	getClearinghouseState,
	getCandleSnapshot,
	getDelegatorSummary,
	getFrontendOpenOrders,
	getHistoricalOrders,
	getL2Book,
	getMetaAndAssetCtxs,
	getOrderStatus,
	getSpotMeta,
	getSpotClearinghouseState,
	getUserAbstraction,
	getUserDexAbstraction,
	getUserFees,
	getUserFillsByTime,
	getUserVaultEquities,
	getValidatorSummaries,
	getVaultDetails,
	getVaultSummaries,
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
			json: async () => {
				const body = JSON.parse(options.init.body)
				return (
					body.type === 'metaAndAssetCtxs' ?
						[{
							universe: [],
						}, []]
					: body.type === 'vaultDetails' ?
						vaultDetails
					: body.type === 'borrowLendUserState' ?
						{
							tokenToState: [],
							health: 'healthy',
							healthFactor: null,
						}
					: body.type === 'clearinghouseState' ?
						{
							marginSummary: {
								accountValue: '0',
								totalNtlPos: '0',
								totalRawUsd: '0',
								totalMarginUsed: '0',
							},
							crossMarginSummary: {
								accountValue: '0',
								totalNtlPos: '0',
								totalRawUsd: '0',
								totalMarginUsed: '0',
							},
							assetPositions: [],
							withdrawable: '0',
							crossMaintenanceMarginUsed: '0',
							time: 1,
						}
					: body.type === 'spotClearinghouseState' ?
						{
							balances: [],
						}
					: body.type === 'userFees' ?
						{
							dailyUserVlm: [],
							feeSchedule: {},
							userCrossRate: '0',
							userAddRate: '0',
							userSpotCrossRate: '0',
							userSpotAddRate: '0',
							activeReferralDiscount: '0',
							trial: null,
							feeTrialReward: '0',
							nextTrialAvailableTimestamp: null,
							stakingLink: null,
							activeStakingDiscount: {},
						}
					: body.type === 'delegatorSummary' ?
						{
							delegated: '0',
							undelegated: '0',
							totalPendingWithdrawal: '0',
							nPendingWithdrawals: 0,
						}
					: body.type === 'userAbstraction' ?
						'default'
					: body.type === 'userDexAbstraction' ?
						false
					: body.type === 'l2Book' ?
						{
							coin: 'ETH',
							time: 1,
							levels: [
								[],
								[],
							],
						}
					:
						[]
				)
			},
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
		{
			query: () => getAllBorrowLendReserveStates(),
			body: {
				type: 'allBorrowLendReserveStates',
			},
		},
		{
			query: () => getVaultSummaries(),
			body: {
				type: 'vaultSummaries',
			},
		},
		{
			query: () => getFrontendOpenOrders({
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'frontendOpenOrders',
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

	it('posts orderStatus and validates the status envelope', async () => {
		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				status: 'unknownOid',
			}),
		})
		await expect(getOrderStatus({
			user: '0x1111111111111111111111111111111111111111',
			oid: 42,
		})).resolves.toEqual({
			status: 'unknownOid',
		})
		expect(corsFetch).toHaveBeenCalledWith(
			'https://api.hyperliquid.xyz/info',
			expect.objectContaining({
				init: expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({
						type: 'orderStatus',
						user: '0x1111111111111111111111111111111111111111',
						oid: 42,
					}),
				}),
			})
		)
	})

	it('rejects invalid orderStatus selectors before transport', async () => {
		await expect(getOrderStatus({
			user: 'not-an-address',
			oid: 1,
		})).rejects.toThrow('invalid account address')
		await expect(getOrderStatus({
			user: '0x1111111111111111111111111111111111111111',
			oid: -1,
		})).rejects.toThrow('invalid order id')
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it.each([
		{ startTime: -1 },
		{ startTime: 1.5 },
		{ startTime: 10, endTime: 9 },
		{ startTime: 10, endTime: Number.MAX_SAFE_INTEGER + 1 },
	])('rejects invalid fill windows before transport', async ({ startTime, endTime }) => {
		await expect(getUserFillsByTime({
			user: '0x1111111111111111111111111111111111111111',
			startTime,
			...(endTime != null && { endTime }),
		})).rejects.toThrow('Hyperliquid_Rest: invalid fill')
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it('rejects invalid candle, book, and vault requests before transport', async () => {
		await expect(getL2Book({
			coin: '',
		})).rejects.toThrow('invalid book coin')
		await expect(getCandleSnapshot({
			coin: 'ETH',
			interval: '7h',
			startTime: 1,
		})).rejects.toThrow('invalid candle interval')
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

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				tokenToState: 'not-rows',
				health: 'healthy',
				healthFactor: null,
			}),
		})
		await expect(getBorrowLendUserState({
			user: '0x1111111111111111111111111111111111111111',
		})).rejects.toThrow('Hyperliquid_Rest: invalid borrowLendUserState response envelope')
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
					premium: '0.0001',
					oraclePx: '1',
					markPx: '1',
					midPx: '1',
					impactPxs: [
						'0.9',
						'1.1',
					],
					dayBaseVlm: '0.5',
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
				dayBaseVlm: '0.5',
			}],
		])
	})

	it('accepts null premium/impactPxs asset contexts and optional fill builderFee', async () => {
		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [
				{
					universe: [{
						name: 'ETH',
						szDecimals: 4,
						maxLeverage: 50,
					}],
				},
				[{
					funding: '0.0',
					openInterest: '12.208',
					prevDayPx: '447.49',
					dayNtlVlm: '0.0',
					premium: null,
					oraclePx: '450.78',
					markPx: '465.13',
					midPx: '464.92',
					impactPxs: null,
					dayBaseVlm: '0.0',
				}],
			],
		})
		await expect(getMetaAndAssetCtxs()).resolves.toMatchObject([
			{
				universe: [{
					name: 'ETH',
				}],
			},
			[{
				premium: null,
				impactPxs: null,
			}],
		])

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [{
				closedPnl: '0.0',
				coin: 'AVAX',
				crossed: false,
				dir: 'Open Long',
				hash: '0xa166e3fa63c25663024b03f2e0da011a00307e4017465df020210d3d432e7cb8',
				oid: 90542681,
				px: '18.435',
				side: 'B',
				startPosition: '26.86',
				sz: '93.53',
				time: 1681222254710,
				fee: '0.01',
				feeToken: 'USDC',
				builderFee: '0.01',
				tid: 118906512037719,
				twapId: null,
			}],
		})
		await expect(getUserFillsByTime({
			user: '0x1111111111111111111111111111111111111111',
			startTime: 1,
		})).resolves.toEqual([{
			closedPnl: '0.0',
			coin: 'AVAX',
			crossed: false,
			dir: 'Open Long',
			hash: '0xa166e3fa63c25663024b03f2e0da011a00307e4017465df020210d3d432e7cb8',
			oid: 90542681,
			px: '18.435',
			side: 'B',
			startPosition: '26.86',
			sz: '93.53',
			time: 1681222254710,
			fee: '0.01',
			feeToken: 'USDC',
			builderFee: '0.01',
			tid: 118906512037719,
			twapId: null,
		}])
	})

	it('fails closed for malformed clearinghouse, fills, open orders, and fees envelopes', async () => {
		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				marginSummary: {
					accountValue: '1',
				},
			}),
		})
		await expect(getClearinghouseState({
			user: '0x1111111111111111111111111111111111111111',
		})).rejects.toThrow('Hyperliquid_Rest: invalid clearinghouseState response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [{
				coin: 'ETH',
				oid: 1,
			}],
		})
		await expect(getUserFillsByTime({
			user: '0x1111111111111111111111111111111111111111',
			startTime: 1,
		})).rejects.toThrow('Hyperliquid_Rest: invalid userFillsByTime response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [{
				coin: 'ETH',
			}],
		})
		await expect(getFrontendOpenOrders({
			user: '0x1111111111111111111111111111111111111111',
		})).rejects.toThrow('Hyperliquid_Rest: invalid frontendOpenOrders response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				userCrossRate: '0',
			}),
		})
		await expect(getUserFees({
			user: '0x1111111111111111111111111111111111111111',
		})).rejects.toThrow('Hyperliquid_Rest: invalid userFees response envelope')

		corsFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => [
				{
					universe: [{
						name: 'BTC',
						szDecimals: 5,
						maxLeverage: 40,
					}],
				},
				[{
					funding: '0.0001',
					markPx: '1',
				}],
			],
		})
		await expect(getMetaAndAssetCtxs()).rejects.toThrow('Hyperliquid_Rest: invalid metaAndAssetCtxs response envelope')
	})
})
