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
		tokenToState: [],
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
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'borrowLendState')]: responseByInfoType.borrowLendUserState,
		})
	})

	it('maps bounded historical orders with exact status observations', async () => {
		corsFetch.mockImplementation(async () => ({
			ok: true,
			json: async () => [
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
			],
		}))

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

		corsFetch.mockImplementation(async () => ({
			ok: true,
			json: async () => [{
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
			}],
		}))
		await expect(ordersResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)).rejects.toThrow('invalid order id')
	})
})

describe('Hyperliquid market catalog resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		corsFetch.mockReset()
	})

	it('materializes spot pairs and HLP vault catalog from public Info snapshots', async () => {
		corsFetch.mockImplementation(async (_url, options) => {
			const body = JSON.parse(options.init.body)
			return {
				ok: true,
				json: async () => (
					body.type === 'meta' ?
						{
							universe: [{
								name: 'ETH',
								szDecimals: 4,
								maxLeverage: 25,
							}],
						}
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
					: body.type === 'vaultDetails' ?
						{
							name: 'Hyperliquidity Provider (HLP)',
							vaultAddress: '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
							leader: '0x677d831aef5328190852e24f13c46cac05f984e7',
							description: 'hlp',
							portfolio: [],
							apr: 0.01,
							followerState: null,
							leaderFraction: 0.001,
							leaderCommission: 0,
							followers: [],
							maxDistributable: 1,
							maxWithdrawable: 0,
							isClosed: false,
							relationship: {
								type: 'parent',
								data: {
									childAddresses: [
										'0x010461c14e146ac35fe42271bdc1134ee31c703a',
									],
								},
							},
							allowDeposits: true,
							alwaysCloseOnWithdraw: false,
						}
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
		expect(networkResolver.projections.$$vaults(snapshot).map((vault) => vault[EntityMetaKey.Selector].vaultAddress)).toEqual([
			'0xdfc24b077bc1425ad1dea75bcb6f8158e10df303',
			'0x010461c14e146ac35fe42271bdc1134ee31c703a',
		])
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
