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
	SourceCredentialScope,
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

const { default: hyperliquid } = await import('$/resolvers/Hyperliquid-Rest.ts')

const binding = bindings[Source.Hyperliquid_Rest]

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
			source: Source.Hyperliquid_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'hyperliquid',
		},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.hyperliquid.xyz/info',
				origin: 'https://api.hyperliquid.xyz',
				corsEnabled: true,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [{
				scope: SourceCredentialScope.None,
			}],
			artifacts: [{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Hyperliquid/Rest/types.ts',
				generated: false,
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
			source: Source.Hyperliquid_Rest,
		})
		expect(timestamps[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'accountValue')]: '100.5',
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'withdrawable')]: '88',
			[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'spotBalances')]: responseByInfoType.spotClearinghouseState.balances,
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
				source: Source.Hyperliquid_Rest,
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
