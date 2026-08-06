import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Gmx/bindings.ts'
import {
	gmxApiByChainId,
	gmxApiDeployments,
} from '$/sources/Gmx/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getMarketsInfo, getPositionByKey, getPositionsInfo } = await import('$/sources/Gmx/Rest/queries.ts')

const arbitrumBinding = bindings[Source.Gmx_Rest].find((binding) => (
	binding.target.key === '42161'
))
const avalancheBinding = bindings[Source.Gmx_Rest].find((binding) => (
	binding.target.key === '43114'
))
const megaethBinding = bindings[Source.Gmx_Rest].find((binding) => (
	binding.target.key === '4326'
))

const ethMarketTokenAddress = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336'

const ethMarketInfoWire = {
	name: 'ETH/USD [WETH-USDC]',
	marketTokenAddress: ethMarketTokenAddress,
	indexTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
	isSpotOnly: false,
	isDisabled: false,
	longInterestUsd: '11844876917225365753752459368138129000',
	shortInterestUsd: '15383126719457743771450388674116662232',
	longPoolAmount: '11412900167379942479683',
	shortPoolAmount: '20907313850254',
	fundingFactorPerSecond: '5447368087265348055555',
} as const

describe('GMX API REST binding', () => {
	it('targets official GMX API peer hosts per documented chain', () => {
		expect(arbitrumBinding).toBeDefined()
		expect(arbitrumBinding?.source).toBe(Source.Gmx_Rest)
		expect(arbitrumBinding?.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(arbitrumBinding?.apiFamily).toBe(ApiFamily.RestJson)
		expect(arbitrumBinding?.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(arbitrumBinding?.target).toEqual({
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		})
		expect(arbitrumBinding?.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.gmxapi.io/v1',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.gmxapi.ai/v1',
				corsEnabled: true,
			},
		])
	})

	it('catalogs Arbitrum, Avalanche, and MegaETH deployments', () => {
		expect(gmxApiByChainId[42161]?.slug).toBe('arbitrum')
		expect(gmxApiDeployments.map((deployment) => deployment.chainId)).toEqual([
			42161,
			43114,
			4326,
		])
	})
})

describe('GMX markets/info operation', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('reads market snapshots for a supported chain', async () => {
		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.resolves
			.toEqual([
				{
					chainId: 42161,
					name: 'ETH/USD [WETH-USDC]',
					marketTokenAddress: '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
					indexTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					longTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					shortTokenAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
					isSpotOnly: false,
					isDisabled: false,
					longInterestUsd: '11844876917225365753752459368138129000',
					shortInterestUsd: '15383126719457743771450388674116662232',
					longPoolAmount: '11412900167379942479683',
					shortPoolAmount: '20907313850254',
					fundingFactorPerSecond: '5447368087265348055555',
				},
			])

		expect(sourceGetJson).toHaveBeenCalledWith(
			arbitrumBinding,
			httpUrl(arbitrumBinding!, '/markets/info')
		)
	})

	it.each([
		[
			43114,
			avalancheBinding,
		],
		[
			4326,
			megaethBinding,
		],
	])('reads token legs, OI, pools, and funding for chain %i', async (
		chainId,
		binding
	) => {
		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
		])

		await expect(
			getMarketsInfo({
				chainId,
			})
		)
			.resolves
			.toEqual([
				{
					...ethMarketInfoWire,
					chainId,
					marketTokenAddress: '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
					indexTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					longTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					shortTokenAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
				},
			])

		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding!, '/markets/info')
		)
	})

	it('preserves a successful empty market list', async () => {
		sourceGetJson.mockResolvedValueOnce([])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		).resolves.toEqual([])
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(
			getMarketsInfo({
				chainId: 1,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: unsupported chain id 1`)

		.expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('fails closed when markets/info is not an array', async () => {
		sourceGetJson.mockResolvedValueOnce({
			markets: [],
		})

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: markets/info response is not an array`)
	})

	it('fails closed when a market omits a required metric', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				...ethMarketInfoWire,
				longPoolAmount: undefined,
			},
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: market missing longPoolAmount`)
	})

	it('fails closed when a market omits a required token address', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				...ethMarketInfoWire,
				indexTokenAddress: undefined,
			},
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: market missing index token`)
	})

	it('fails closed when a market boolean is malformed', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				...ethMarketInfoWire,
				isDisabled: null,
			},
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: market missing isDisabled`)
	})

	it('fails closed for duplicate market tokens', async () => {
		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
			{
				...ethMarketInfoWire,
				name: 'duplicate',
			},
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: markets/info response contains duplicate market tokens`)
	})
})

const accountAddress = '0xD2C66B256Eb277Cba30b6FcCf4aB5F871452dA77'
const positionContractKey = '0x28c600b71a4a047cf2b2d8aae918d030bc2ecdf380ffd0794e492a8ff1e540fe'

const hypePositionInfoWire = {
	key: `${accountAddress}:0xBcb8FE13d02b023e8f94f6881Cc0192fd918A5C0:0xaf88d065e77c8cC2239327C5EDb3A432268e5831:false`,
	contractKey: positionContractKey,
	account: accountAddress,
	marketAddress: '0xBcb8FE13d02b023e8f94f6881Cc0192fd918A5C0',
	collateralTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
	sizeInUsd: '192117260450461080669733736500000000',
	sizeInTokens: '342165315190',
	collateralAmount: '3845775280',
	pendingBorrowingFeesUsd: '538567792752741562519309192234',
	increasedAtTime: '1786038798',
	decreasedAtTime: '0',
	isLong: false,
	fundingFeeAmount: '0',
	claimableLongTokenAmount: '198',
	claimableShortTokenAmount: '447096',
	pnl: '-233788809952387203706983875000000',
	positionFeeAmount: '115286017',
	traderDiscountAmount: '0',
	uiFeeAmount: '0',
	pendingImpactAmount: '-15993617',
	positionValueInUsd: '3481934038682740360650319202736789',
	data: '',
	indexName: 'HYPE/USD',
	poolName: 'BTC-USDC',
	markPrice: '56215823381631596250000000000000',
	entryPrice: '56147497107876301303295094075721',
	liquidationPrice: '56675975955704991845031000000000',
	collateralUsd: '3845252843953159660042196000000000',
	remainingCollateralUsd: '3844714276160406918479676690807766',
	remainingCollateralAmount: '3845236639',
	hasLowCollateral: true,
	leverage: '532044',
	leverageWithPnl: '532044',
	leverageWithoutPnl: '499691',
	pnlPercentage: '-607',
	pnlAfterFees: '-234327377745139945269503184192234',
	pnlAfterFeesPercentage: '-609',
	netValueAfterAllFees: '3481250135511046248670946767469291',
	pnlAfterAllFees: '-364002708442113411371249232530709',
	pnlAfterAllFeesPercentage: '-946',
	netValue: '3610925466208019714772692815807766',
	netPriceImapctDeltaUsd: '-14404974426696817699905806438475',
	priceImpactDiffUsd: '0',
	pendingImpactUsd: '-8990943485054605855211362500000',
	closePriceImpactDeltaUsd: '-5414030941642211844694443938475',
	closingFeeUsd: '115270356270276648401840241900000',
	uiFeeUsd: '0',
	pendingFundingFeesUsd: '0',
	pendingClaimableFundingFeesUsd: '574766621831242719967200000000',
} as const

const normalizedHypePosition = {
	chainId: 42161,
	key: hypePositionInfoWire.key,
	contractKey: '0x28c600b71a4a047cf2b2d8aae918d030bc2ecdf380ffd0794e492a8ff1e540fe',
	account: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
	marketAddress: '0xbcb8fe13d02b023e8f94f6881cc0192fd918a5c0',
	collateralTokenAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
	sizeInUsd: '192117260450461080669733736500000000',
	sizeInTokens: '342165315190',
	collateralAmount: '3845775280',
	pendingBorrowingFeesUsd: '538567792752741562519309192234',
	increasedAtTime: '1786038798',
	decreasedAtTime: '0',
	isLong: false,
	fundingFeeAmount: '0',
	claimableLongTokenAmount: '198',
	claimableShortTokenAmount: '447096',
	pnl: '-233788809952387203706983875000000',
	positionFeeAmount: '115286017',
	traderDiscountAmount: '0',
	uiFeeAmount: '0',
	pendingImpactAmount: '-15993617',
	positionValueInUsd: '3481934038682740360650319202736789',
	indexName: 'HYPE/USD',
	poolName: 'BTC-USDC',
	markPrice: '56215823381631596250000000000000',
	entryPrice: '56147497107876301303295094075721',
	liquidationPrice: '56675975955704991845031000000000',
	collateralUsd: '3845252843953159660042196000000000',
	remainingCollateralUsd: '3844714276160406918479676690807766',
	remainingCollateralAmount: '3845236639',
	hasLowCollateral: true,
	leverage: '532044',
	leverageWithPnl: '532044',
	leverageWithoutPnl: '499691',
	pnlPercentage: '-607',
	pnlAfterFees: '-234327377745139945269503184192234',
	pnlAfterFeesPercentage: '-609',
	netValueAfterAllFees: '3481250135511046248670946767469291',
	pnlAfterAllFees: '-364002708442113411371249232530709',
	pnlAfterAllFeesPercentage: '-946',
	netValue: '3610925466208019714772692815807766',
	netPriceImapctDeltaUsd: '-14404974426696817699905806438475',
	priceImpactDiffUsd: '0',
	pendingImpactUsd: '-8990943485054605855211362500000',
	closePriceImpactDeltaUsd: '-5414030941642211844694443938475',
	closingFeeUsd: '115270356270276648401840241900000',
	uiFeeUsd: '0',
	pendingFundingFeesUsd: '0',
	pendingClaimableFundingFeesUsd: '574766621831242719967200000000',
} as const

describe('GMX positions operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('reads account positions for a supported chain', async () => {
		sourceGetJson.mockResolvedValueOnce([
			hypePositionInfoWire,
		])

		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: accountAddress,
				includeRelatedOrders: true,
			})
		)
			.resolves
			.toEqual([
				normalizedHypePosition,
			])

		expect(sourceGetJson).toHaveBeenCalledWith(
			arbitrumBinding,
			httpUrl(arbitrumBinding!, '/positions', {
				address: '0xd2c66b256eb277cba30b6fccf4ab5f871452da77',
				includeRelatedOrders: true,
			})
		)
	})

	it('reads a single position by contractKey', async () => {
		sourceGetJson.mockResolvedValueOnce(hypePositionInfoWire)

		await expect(
			getPositionByKey({
				chainId: 42161,
				contractKey: positionContractKey,
			})
		)
			.resolves
			.toEqual(normalizedHypePosition)

		expect(sourceGetJson).toHaveBeenCalledWith(
			arbitrumBinding,
			httpUrl(arbitrumBinding!, `/positions/${normalizedHypePosition.contractKey}`)
		)
	})

	it('preserves a successful empty positions list', async () => {
		sourceGetJson.mockResolvedValueOnce([])

		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: accountAddress,
			})
		).resolves.toEqual([])
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(
			getPositionsInfo({
				chainId: 1,
				address: accountAddress,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: unsupported chain id 1`)

		await expect(
			getPositionByKey({
				chainId: 1,
				contractKey: positionContractKey,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: unsupported chain id 1`)

		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects invalid account addresses before transport', async () => {
		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: 'not-an-address',
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: invalid account not-an-address`)

		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects invalid contract keys before transport', async () => {
		await expect(
			getPositionByKey({
				chainId: 42161,
				contractKey: '0x1234',
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: invalid contractKey 0x1234`)

		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('fails closed when positions is not an array', async () => {
		sourceGetJson.mockResolvedValueOnce({
			positions: [],
		})

		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: accountAddress,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: positions response is not an array`)
	})

	it('fails closed when a position omits positionValueInUsd', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				...hypePositionInfoWire,
				positionValueInUsd: undefined,
			},
		])

		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: accountAddress,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: position missing positionValueInUsd`)
	})

	it('fails closed when a position account mismatches the request', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				...hypePositionInfoWire,
				account: '0x0000000000000000000000000000000000000001',
			},
		])

		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: accountAddress,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: positions response account mismatch`)
	})

	it('fails closed for duplicate contract keys', async () => {
		sourceGetJson.mockResolvedValueOnce([
			hypePositionInfoWire,
			{
				...hypePositionInfoWire,
				key: `${accountAddress}:duplicate`,
			},
		])

		await expect(
			getPositionsInfo({
				chainId: 42161,
				address: accountAddress,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: positions response contains duplicate contract keys`)
	})

	it('fails closed when positions/{key} returns an array', async () => {
		sourceGetJson.mockResolvedValueOnce([
			hypePositionInfoWire,
		])

		await expect(
			getPositionByKey({
				chainId: 42161,
				contractKey: positionContractKey,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: positions/{key} response is not an object`)
	})
})
