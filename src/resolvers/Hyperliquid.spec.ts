import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const { default: hyperliquid } = await import('$/resolvers/Hyperliquid.ts')

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.RestJson
)

if (binding == null)
	throw new Error('Hyperliquid_Rest: Info binding is missing')

const account = {
	$network: {
		slug: 'hyperliquid',
	},
	address: '0x1111111111111111111111111111111111111111',
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const accountResolvers = hyperliquid.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.HyperliquidAccount
))
const [
	vaultEquitiesResolver,
	accountPortfolioResolver,
	ordersResolver,
	fillsResolver,
] = accountResolvers

const responseByInfoType = {
	userRole: {
		role: 'user',
	},
	clearinghouseState: {
		marginSummary: {
			accountValue: '100.5',
			totalNtlPos: '50.25',
			totalRawUsd: '100.5',
			totalMarginUsed: '12.5',
		},
		crossMarginSummary: {
			accountValue: '100.5',
			totalNtlPos: '50.25',
			totalRawUsd: '100.5',
			totalMarginUsed: '12.5',
		},
		assetPositions: [],
		withdrawable: '88',
		crossMaintenanceMarginUsed: '4',
		time: 1_700_000_000_000,
	},
	spotClearinghouseState: {
		balances: [{
			coin: 'USDC',
			token: 0,
			total: '25',
			hold: '2',
			entryNtl: '25',
		}],
	},
	userFees: {
		dailyUserVlm: [],
		feeSchedule: {
			cross: '0.00045',
			add: '0.00015',
		},
		userCrossRate: '0.000315',
		userAddRate: '0.000105',
		userSpotCrossRate: '0.00049',
		userSpotAddRate: '0.00028',
		activeReferralDiscount: '0.0',
		trial: null,
		feeTrialReward: '0.0',
		nextTrialAvailableTimestamp: null,
		stakingLink: null,
		activeStakingDiscount: {
			bpsOfMaxSupply: '0',
			discount: '0',
		},
	},
	delegatorSummary: {
		delegated: '12',
		undelegated: '0',
		totalPendingWithdrawal: '0',
		nPendingWithdrawals: 0,
	},
	userAbstraction: 'default',
	userDexAbstraction: false,
	approvedBuilders: ['0x476fa87b4d3818f437f38f1263bee508d7672d82'],
	borrowLendUserState: {
		tokenToState: [
			[
				0,
				{
					borrow: {
						basis: '0.0',
						value: '0.0',
					},
					supply: {
						basis: '44.69',
						value: '44.70',
					},
				},
			],
			[
				1105,
				{
					borrow: {
						basis: '1.0',
						value: '1.1',
					},
					supply: {
						basis: '0.0',
						value: '0.0',
					},
				},
			],
		],
		health: 'healthy',
		healthFactor: null,
	},
}

describe('Hyperliquid public account resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		corsFetch.mockReset()
		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => responseByInfoType[body.type],
			}
		})
	})

	it('selects the exact canonical Hyperliquid mainnet REST binding', () => {
		expect(binding).toEqual(expect.objectContaining({
			source: Source.Hyperliquid,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'hyperliquid',
		},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.hyperliquid.xyz/info',
				corsEnabled: true,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [],
			artifacts: [{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Hyperliquid/Rest/types.ts',
			}],
		}))
	})

	it('materializes one source-timestamped perp and spot portfolio observation', async () => {
		expect(accountResolvers).toHaveLength(4)
		const snapshot = await accountPortfolioResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)
		const timestamps = accountPortfolioResolver.projections.$$timestamps(snapshot)

		expect(timestamps).toHaveLength(1)
		expect(timestamps[0]?.[EntityMetaKey.Selector]).toEqual({
			$account: account,
			timestampMs: 1_700_000_000_000,
			source: Source.Hyperliquid,
		})
		expect(timestamps[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'accountValue')]: '100.5',
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'withdrawable')]: '88',
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'spotBalances')]: responseByInfoType.spotClearinghouseState.balances,
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'feeSchedule')]: responseByInfoType.userFees,
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'stakingSummary')]: responseByInfoType.delegatorSummary,
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'userAbstraction')]: 'default',
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'userDexAbstraction')]: false,
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'approvedBuilders')]: responseByInfoType.approvedBuilders,
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'borrowLendHealth')]: 'healthy',
		})
		expect(timestamps[0]?.[EntityMetaKey.Fields]).not.toHaveProperty(
			entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'borrowLendHealthFactor')
		)
		expect(accountPortfolioResolver.projections.$$borrowLendPositions(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: account,
					tokenIndex: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], '$reserve')]: {
						[EntityMetaKey.Selector]: {
							$network: account.$network,
							tokenIndex: 0,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], '$asset')]: {
						[EntityMetaKey.Selector]: {
							$network: account.$network,
							assetId: 0,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'borrowBasis')]: '0.0',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'borrowValue')]: '0.0',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'supplyBasis')]: '44.69',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'supplyValue')]: '44.70',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$account: account,
					tokenIndex: 1105,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], '$reserve')]: {
						[EntityMetaKey.Selector]: {
							$network: account.$network,
							tokenIndex: 1105,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], '$asset')]: {
						[EntityMetaKey.Selector]: {
							$network: account.$network,
							assetId: 1105,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'borrowBasis')]: '1.0',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'borrowValue')]: '1.1',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'supplyBasis')]: '0.0',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'supplyValue')]: '0.0',
				},
			},
		])
	})

	it('maps bounded historical orders with exact status observations', async () => {
		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'historicalOrders' ?
						[
							{
								order: {
									coin: 'ETH',
									side: 'A',
									limitPx: '2412.7',
									sz: '0',
									oid: 2,
									timestamp: 1_700_000_000_000,
									triggerCondition: 'N/A',
									isTrigger: false,
									triggerPx: '0',
									children: [],
									isPositionTpsl: false,
									reduceOnly: true,
									orderType: 'Market',
									origSz: '0.0076',
									tif: 'FrontendMarket',
									cloid: null,
								},
								status: 'filled',
								statusTimestamp: 1_700_000_000_001,
							},
						]
					: body.type === 'frontendOpenOrders' ?
						[]
					:
						null
				),
			}
		})

		const page = await ordersResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)
		const orders = ordersResolver.projections.$$orders.select(page, account, context)

		expect(orders[0]?.[EntityMetaKey.Selector]).toEqual({
			$account: account,
			oid: 2n,
		})
		expect(orders[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'coin')]: 'ETH',
			[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'orderType')]: 'Market',
		})
		expect(ordersResolver.projections.$$orders.continuation(page, account, context).terminal).toBe(true)
	})

	it('merges frontend open orders into $$orders when historical omits them', async () => {
		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'historicalOrders' ?
						[
							{
								order: {
									coin: 'ETH',
									side: 'A',
									limitPx: '2412.7',
									sz: '0',
									oid: 2,
									timestamp: 1_700_000_000_000,
									triggerCondition: 'N/A',
									isTrigger: false,
									triggerPx: '0',
									children: [],
									isPositionTpsl: false,
									reduceOnly: true,
									orderType: 'Market',
									origSz: '0.0076',
									tif: 'FrontendMarket',
									cloid: null,
								},
								status: 'filled',
								statusTimestamp: 1_700_000_000_001,
							},
						]
					: body.type === 'frontendOpenOrders' ?
						[
							{
								coin: 'BTC',
								side: 'B',
								limitPx: '65000',
								sz: '0.1',
								oid: 9,
								timestamp: 1_700_000_000_500,
								triggerCondition: 'N/A',
								isTrigger: false,
								triggerPx: '0',
								children: [],
								isPositionTpsl: false,
								reduceOnly: false,
								orderType: 'Limit',
								origSz: '0.1',
								tif: 'Gtc',
								cloid: null,
							},
						]
					:
						null
				),
			}
		})

		const page = await ordersResolver.resolve[
			'NetworkAddress'
		].resolve(account, {
			...context,
			pagination: {
				limit: 10,
			},
		})
		const orders = ordersResolver.projections.$$orders.select(page, account, context)

		expect(orders.map((order) => order[EntityMetaKey.Selector].oid)).toEqual([9n, 2n])
		expect(orders[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'coin')]: 'BTC',
			[entityFieldAddressKey(EntityType.HyperliquidOrder, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$order: {
						$account: account,
						oid: 9n,
					},
					timestampMs: 1_700_000_000_500,
					source: Source.Hyperliquid,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'status')]: 'open',
					[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'statusTimestampMs')]: 1_700_000_000_500,
					[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'size')]: '0.1',
					[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'children')]: [],
				},
			}],
		})
	})

	it('does not duplicate an open order already present in historicalOrders', async () => {
		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			const openOrder = {
				coin: 'ETH',
				side: 'B',
				limitPx: '2000',
				sz: '1',
				oid: 7,
				timestamp: 1_700_000_000_100,
				triggerCondition: 'N/A',
				isTrigger: false,
				triggerPx: '0',
				children: [],
				isPositionTpsl: false,
				reduceOnly: false,
				orderType: 'Limit',
				origSz: '1',
				tif: 'Gtc',
				cloid: null,
			}
			return {
				ok: true,
				json: async () => (
					body.type === 'historicalOrders' ?
						[{
							order: openOrder,
							status: 'open',
							statusTimestamp: 1_700_000_000_100,
						}]
					: body.type === 'frontendOpenOrders' ?
						[openOrder]
					:
						null
				),
			}
		})

		const page = await ordersResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)
		const orders = ordersResolver.projections.$$orders.select(page, account, context)

		expect(orders).toHaveLength(1)
		expect(orders[0]?.[EntityMetaKey.Selector].oid).toBe(7n)
	})

	it('uses an inclusive time and trade-id cursor without replaying fills', async () => {
		corsFetch.mockImplementation(async () => ({
			ok: true,
			json: async () => [
				{
					closedPnl: '0',
					coin: 'ETH',
					crossed: true,
					dir: 'Open Long',
					hash: `0x${'1'.repeat(64)}`,
					oid: 3,
					px: '2000',
					side: 'B',
					startPosition: '0',
					sz: '1',
					time: 1_700_000_000_000,
					fee: '0.1',
					feeToken: 'USDC',
					tid: 4,
				},
				{
					closedPnl: '0',
					coin: 'ETH',
					crossed: true,
					dir: 'Open Long',
					hash: `0x${'2'.repeat(64)}`,
					oid: 5,
					px: '2001',
					side: 'B',
					startPosition: '1',
					sz: '1',
					time: 1_700_000_000_001,
					fee: '0.1',
					feeToken: 'USDC',
					tid: 6,
				},
			],
		}))

		const page = await fillsResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)
		const fills = fillsResolver.projections.$$fills.select(page, account, context)

		expect(fills.map((fill) => fill[EntityMetaKey.Selector].tid)).toEqual([4n, 6n])
		expect(fillsResolver.projections.$$fills.continuation(
			{
				...page,
				terminal: false,
			},
			account,
			context
		)).toMatchObject({
			terminal: false,
			token: '1700000000001:6',
		})
	})

	it('materializes bounded vault equity observations under exact public vault identities', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_123)
		corsFetch.mockImplementation(async () => ({
			ok: true,
			json: async () => [{
				vaultAddress: '0x2222222222222222222222222222222222222222',
				equity: '742500.082809',
			}],
		}))

		const snapshot = await vaultEquitiesResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)
		const equities = vaultEquitiesResolver.projections.$$vaultEquities(snapshot, account, context)

		expect(equities).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				$vault: {
					$network: account.$network,
					vaultAddress: '0x2222222222222222222222222222222222222222',
				},
				timestampMs: 1_700_000_000_123,
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'equity')]: '742500.082809',
			},
		}])
	})

	it('rejects invalid addresses and lossy public identifiers before materialization', async () => {
		await expect(accountPortfolioResolver.resolve[
			'NetworkAddress'
		].resolve({
			...account,
			address: 'not-an-address',
		}, context)).rejects.toThrow('invalid account address')
		expect(corsFetch).not.toHaveBeenCalled()

		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'historicalOrders' ?
						[{
							order: {
								coin: 'ETH',
								side: 'A',
								limitPx: '1',
								sz: '0',
								oid: Number.MAX_SAFE_INTEGER + 1,
								timestamp: 1,
								triggerCondition: 'N/A',
								isTrigger: false,
								triggerPx: '0',
								children: [],
								isPositionTpsl: false,
								reduceOnly: false,
								orderType: 'Limit',
								origSz: '1',
							},
							status: 'open',
							statusTimestamp: 1,
						}]
					: body.type === 'frontendOpenOrders' ?
						[]
					:
						null
				),
			}
		})
		await expect(ordersResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)).rejects.toThrow('invalid order id')
	})
})

describe('Hyperliquid order status resolver', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		corsFetch.mockReset()
	})

	it('materializes a singular order from orderStatus', async () => {
		const orderResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidOrder
		))
		expect(orderResolver).toBeTruthy()

		corsFetch.mockImplementation(async () => ({
			ok: true,
			json: async () => ({
				status: 'order',
				order: {
					order: {
						coin: 'ETH',
						side: 'B',
						limitPx: '2000',
						sz: '1',
						oid: 42,
						timestamp: 1_700_000_000_000,
						triggerCondition: 'N/A',
						isTrigger: false,
						triggerPx: '0',
						children: [],
						isPositionTpsl: false,
						reduceOnly: false,
						orderType: 'Limit',
						origSz: '1',
						tif: 'Gtc',
						cloid: null,
					},
					status: 'open',
					statusTimestamp: 1_700_000_000_000,
				},
			}),
		}))

		const snapshot = await orderResolver.resolve.AccountOid.resolve({
			$account: account,
			oid: 42n,
		}, context)
		expect(orderResolver.projections.coin(snapshot)).toBe('ETH')
		expect(orderResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$order: {
					$account: account,
					oid: 42n,
				},
				timestampMs: 1_700_000_000_000,
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'status')]: 'open',
				[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'statusTimestampMs')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'size')]: '1',
				[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'children')]: [],
			},
		}])
	})
})

describe('Hyperliquid market catalog resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		corsFetch.mockReset()
	})

	it('materializes spot pairs and vault catalog from public Info snapshots', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_999)
		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'metaAndAssetCtxs' ?
						[{
							universe: [{
								name: 'ETH',
								szDecimals: 4,
								maxLeverage: 25,
							}],
						}, [
							{
								markPx: '2000',
							},
						]]
					: body.type === 'spotMeta' ?
						{
							tokens: [{
								name: 'USDC',
								szDecimals: 8,
								weiDecimals: 8,
								index: 0,
								tokenId: '0xusdc',
							}, {
								name: 'PURR',
								szDecimals: 0,
								weiDecimals: 5,
								index: 1,
								tokenId: '0xpurr',
							}],
							universe: [{
								name: 'PURR/USDC',
								tokens: [1, 0],
								index: 0,
								isCanonical: true,
							}],
						}
					: body.type === 'validatorSummaries' ?
						[{
							validator: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
							signer: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
							name: 'v',
							description: '',
							nRecentBlocks: 1,
							stake: 2,
							isJailed: false,
							isActive: true,
							commission: '0.01',
						}]
					: body.type === 'vaultSummaries' ?
						[{
							name: 'Hyperliquidity Provider (HLP)',
							vaultAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
							leader: '0x677d831aef5328190852e24f13c46cac05f984e7',
							tvl: '1000',
							isClosed: false,
							createTimeMillis: 1_700_000_000_000,
							relationship: {
								type: 'parent',
								data: {
									childAddresses: [
										'0x010461c14e146ac35fe42271bdc1134ee31c703a',
									],
								},
							},
						}, {
							name: 'HLP child',
							vaultAddress: '0x010461c14e146ac35fe42271bdc1134ee31c703a',
							leader: '0x677d831aef5328190852e24f13c46cac05f984e7',
							tvl: '100',
							isClosed: false,
							createTimeMillis: 1_700_000_000_100,
							relationship: {
								type: 'child',
								data: {
									parentAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
								},
							},
						}, {
							name: 'Extra vault',
							vaultAddress: '0xcccccccccccccccccccccccccccccccccccccccc',
							leader: '0xdddddddddddddddddddddddddddddddddddddddd',
							tvl: '50',
							isClosed: true,
							createTimeMillis: 1_700_000_000_200,
							relationship: {
								type: 'normal',
							},
						}]
					: body.type === 'allBorrowLendReserveStates' ?
						[
							[0, {
								borrowYearlyRate: '0.01',
								supplyYearlyRate: '0.005',
								balance: '1',
								utilization: '0.5',
								oraclePx: '1',
								ltv: '0.8',
								totalSupplied: '10',
								totalBorrowed: '5',
							}],
							[1, {
								borrowYearlyRate: '0.02',
								supplyYearlyRate: '0.01',
								balance: '2',
								utilization: '0.4',
								oraclePx: '2',
								ltv: '0.7',
								totalSupplied: '20',
								totalBorrowed: '8',
							}],
						]
					:
						null
				),
			}
		})

		const networkResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidNetwork
			&& '$$spotPairs' in resolver.projections
		))
		expect(networkResolver).toBeTruthy()
		const snapshot = await networkResolver.resolve.Network.resolve({
			$network: account.$network,
		}, context)
		expect(networkResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				timestampMs: 1_700_000_000_999,
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'perpMarketCount')]: 1,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'spotAssetCount')]: 2,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'spotPairCount')]: 1,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'validatorCount')]: 1,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'activeValidatorCount')]: 1,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'jailedValidatorCount')]: 0,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'totalStake')]: 2n,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'vaultCount')]: 3,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'borrowLendReserveCount')]: 2,
			},
		}])
		expect(networkResolver.projections.$$perpMarkets(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				coin: 'ETH',
			},
		}])
		expect(networkResolver.projections.$$spotPairs(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				pairIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidSpotPair, [], '$baseAsset')]: {
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						assetId: 1,
					},
				},
				[entityFieldAddressKey(EntityType.HyperliquidSpotPair, [], '$quoteAsset')]: {
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						assetId: 0,
					},
				},
			},
		}])
		expect(networkResolver.projections.$$vaults.resolveCount(snapshot)).toBe(3)
		expect(networkResolver.projections.$$vaults.select(snapshot).map((vault) => vault[EntityMetaKey.Selector].vaultAddress)).toEqual([
			'0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
			'0x010461c14e146ac35fe42271bdc1134ee31c703a',
		])
		expect(networkResolver.projections.$$vaults.select(snapshot)[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HyperliquidVault, [], '$leader')]: {
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					address: '0x677d831aef5328190852e24f13c46cac05f984e7',
				},
			},
			[entityFieldAddressKey(EntityType.HyperliquidVault, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$vault: {
						$network: account.$network,
						vaultAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
					},
					timestampMs: 1_700_000_000_999,
					source: Source.Hyperliquid,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'name')]: 'Hyperliquidity Provider (HLP)',
					[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'tvl')]: '1000',
					[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'createTimeMillis')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'isClosed')]: false,
				},
			}],
		})
		expect(networkResolver.projections.$$borrowLendReserves.resolveCount(snapshot)).toBe(2)
		expect(networkResolver.projections.$$borrowLendReserves.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					tokenIndex: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], '$asset')]: {
						[EntityMetaKey.Selector]: {
							$network: account.$network,
							assetId: 0,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'borrowYearlyRate')]: '0.01',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'supplyYearlyRate')]: '0.005',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'balance')]: '1',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'utilization')]: '0.5',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'oraclePx')]: '1',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'ltv')]: '0.8',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'totalSupplied')]: '10',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'totalBorrowed')]: '5',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					tokenIndex: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], '$asset')]: {
						[EntityMetaKey.Selector]: {
							$network: account.$network,
							assetId: 1,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'borrowYearlyRate')]: '0.02',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'supplyYearlyRate')]: '0.01',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'balance')]: '2',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'utilization')]: '0.4',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'oraclePx')]: '2',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'ltv')]: '0.7',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'totalSupplied')]: '20',
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'totalBorrowed')]: '8',
				},
			},
		])

		const parentNetworkResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Hyperliquid' in resolver.projections
			&& '$$spotPairs' in resolver.projections.Hyperliquid
		))
		expect(parentNetworkResolver).toBeTruthy()
		const parentSnapshot = await parentNetworkResolver.resolve.Slug.resolve(account.$network, context)
		expect(parentNetworkResolver.projections.Hyperliquid.$$spotPairs(parentSnapshot)).toEqual(
			networkResolver.projections.$$spotPairs(snapshot)
		)
		expect(parentNetworkResolver.projections.Hyperliquid.$$vaults.select(parentSnapshot)).toEqual(
			networkResolver.projections.$$vaults.select(snapshot)
		)
		expect(parentNetworkResolver.projections.Hyperliquid.$$vaults.resolveCount(parentSnapshot)).toBe(3)
		expect(parentNetworkResolver.projections.Hyperliquid.$$borrowLendReserves.select(parentSnapshot)).toEqual(
			networkResolver.projections.$$borrowLendReserves.select(snapshot)
		)
		expect(parentNetworkResolver.projections.Hyperliquid.$$borrowLendReserves.resolveCount(parentSnapshot)).toBe(2)
	})

	it('fills vault summary fields when vaultDetails is absent', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_888)
		const vaultResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidVault
		))
		expect(vaultResolver).toBeTruthy()

		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'vaultDetails' ?
						null
					: body.type === 'vaultSummaries' ?
						[{
							name: 'Summary only vault',
							vaultAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
							leader: '0xffffffffffffffffffffffffffffffffffffffff',
							tvl: '12',
							isClosed: false,
							createTimeMillis: 1_700_000_000_000,
							relationship: {
								type: 'normal',
							},
						}]
					:
						null
				),
			}
		})

		const snapshot = await vaultResolver.resolve.NetworkVaultAddress.resolve({
			$network: account.$network,
			vaultAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		}, context)
		expect(vaultResolver.projections.$leader(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				address: '0xffffffffffffffffffffffffffffffffffffffff',
			},
		})
		expect(vaultResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$vault: {
					$network: account.$network,
					vaultAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				},
				timestampMs: 1_700_000_000_888,
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'name')]: 'Summary only vault',
				[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'tvl')]: '12',
				[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'createTimeMillis')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'isClosed')]: false,
				[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'relationship')]: {
					type: 'normal',
				},
			},
		}])
		expect(vaultResolver.projections.$$equities(snapshot)).toEqual([])
	})

	it('projects a borrow/lend reserve by token index from allBorrowLendReserveStates', async () => {
		const reserveResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidBorrowLendReserve
		))
		expect(reserveResolver).toBeTruthy()

		corsFetch.mockResolvedValue({
			ok: true,
			json: async () => [
				[0, {
					borrowYearlyRate: '0.01',
					supplyYearlyRate: '0.005',
					balance: '1',
					utilization: '0.5',
					oraclePx: '1',
					ltv: '0.8',
					totalSupplied: '10',
					totalBorrowed: '5',
				}],
			],
		})

		const snapshot = await reserveResolver.resolve.NetworkTokenIndex.resolve({
			$network: account.$network,
			tokenIndex: 0,
		}, context)
		expect(reserveResolver.projections.$asset(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				assetId: 0,
			},
		})
		expect(reserveResolver.projections.borrowYearlyRate(snapshot)).toBe('0.01')
		expect(reserveResolver.projections.totalBorrowed(snapshot)).toBe('5')
	})

	it('projects a borrow/lend position by account token index from borrowLendUserState', async () => {
		const positionResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidBorrowLendPosition
		))
		expect(positionResolver).toBeTruthy()

		corsFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				tokenToState: [
					[
						1105,
						{
							borrow: {
								basis: '1.0',
								value: '1.1',
							},
							supply: {
								basis: '0.0',
								value: '0.0',
							},
						},
					],
				],
				health: 'healthy',
				healthFactor: '1.5',
			}),
		})

		const snapshot = await positionResolver.resolve.AccountTokenIndex.resolve({
			$account: account,
			tokenIndex: 1105,
		}, context)
		expect(positionResolver.projections.$reserve(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				tokenIndex: 1105,
			},
		})
		expect(positionResolver.projections.borrowBasis(snapshot)).toBe('1.0')
		expect(positionResolver.projections.borrowValue(snapshot)).toBe('1.1')
		expect(positionResolver.projections.supplyValue(snapshot)).toBe('0.0')
	})

	it('rejects a perp market snapshot without a context for every market', async () => {
		const perpMarketTimestampResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidPerpMarket_Timestamp
		))
		expect(perpMarketTimestampResolver).toBeTruthy()

		corsFetch.mockResolvedValue({
			ok: true,
			json: async () => [{
				universe: [{
					name: 'ETH',
					szDecimals: 4,
					maxLeverage: 25,
				}],
			}, []],
		})

		await expect(perpMarketTimestampResolver.resolve[
			'PerpMarketTimestampMsSource'
		].resolve({
			$perpMarket: {
				$network: account.$network,
				coin: 'ETH',
			},
			timestampMs: 1_700_000_000_000,
			source: Source.Hyperliquid,
		}, context)).rejects.toThrow('perp universe and asset context count differ')
	})

	it('maps L2 book and candle snapshots onto market observation fields', async () => {
		const orderbookResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidOrderbook_Timestamp
		))
		const candleResolver = hyperliquid.resolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidMarket_TimeInterval_Timestamp
		))
		expect(orderbookResolver).toBeTruthy()
		expect(candleResolver).toBeTruthy()

		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'l2Book' ?
						{
							coin: 'ETH',
							time: 1_700_000_000_000,
							levels: [
								[{
									px: '2000',
									sz: '1',
									n: 1,
								}],
								[{
									px: '2001',
									sz: '2',
									n: 1,
								}],
							],
						}
					:
						[{
							t: 1_700_000_000_000,
							T: 1_700_003_599_999,
							s: 'ETH',
							i: '1h',
							o: '2000.0',
							c: '2010.5',
							h: '2011.0',
							l: '1999.0',
							v: '12.5',
							n: 9,
						}]
				),
			}
		})

		const book = await orderbookResolver.resolve.NetworkBookKeyTimestampMsSource.resolve({
			$network: account.$network,
			bookKey: 'ETH',
			timestampMs: 1_700_000_000_000,
			source: Source.Hyperliquid,
		}, context)
		expect(orderbookResolver.projections.bids(book)).toEqual([{
			px: '2000',
			sz: '1',
			n: 1,
		}])
		expect(orderbookResolver.projections.$perpMarket(book)?.[EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			coin: 'ETH',
		})

		const candle = await candleResolver.resolve.NetworkMarketKeyTimeIntervalTimestampMs.resolve({
			$network: account.$network,
			marketKey: 'ETH',
			timeInterval: {
				unit: 'h',
				value: 1,
			},
			timestampMs: 1_700_000_000_000,
		}, context)
		expect(candleResolver.projections.open(candle)).toBe(200000000000n)
		expect(candleResolver.projections.tradeCount(candle)).toBe(9)
	})
})
