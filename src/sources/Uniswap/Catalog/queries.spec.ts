import { describe, expect, it } from 'vitest'

import {
	chainIdsForUniswapV3NonfungiblePositionManager,
	getUniswapV3FactoryAddress,
	getUniswapV3NonfungiblePositionManagerAddress,
	getUniswapV3PoolCatalogEntry,
	getUniswapV3TickSpacingForFee,
	uniswapV3Deployments,
	uniswapV3FeeTiers,
	uniswapV3Pools,
} from '$/sources/Uniswap/Catalog/queries.ts'
import {
	getFactoryPool,
	getPoolFee,
	getPoolFeeGrowthGlobal0X128,
	getPoolProtocolFees,
	getPoolSlot0,
	getPosition,
	normalizeUniswapAddress,
} from '$/sources/Uniswap/Contracts/queries.ts'


describe('Uniswap Catalog', () => {
	it('exposes factory and NFPM for mainnet', () => {
		expect(getUniswapV3FactoryAddress(1)).toBe('0x1f98431c8ad98523631ae4a59f267346ea31f984')
		expect(getUniswapV3NonfungiblePositionManagerAddress(1)).toBe('0xc36442b4a4522e871399cd717abdd847ab11fe88')
		expect(uniswapV3Deployments.length).toBeGreaterThan(0)
	})

	it('maps NFPM address back to supported chain ids', () => {
		expect(chainIdsForUniswapV3NonfungiblePositionManager('0xC36442b4a4522E871399CD717aBDD847Ab11FE88')).toContain(1)
		expect(chainIdsForUniswapV3NonfungiblePositionManager('0xC36442b4a4522E871399CD717aBDD847Ab11FE88')).toContain(8453)
	})

	it('seeds hub pools with known token pairs and fee tiers', () => {
		expect(uniswapV3Pools.length).toBeGreaterThanOrEqual(8)
		expect(getUniswapV3PoolCatalogEntry(1, '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640')).toEqual({
			chainId: 1,
			poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			fee: 500,
			tickSpacing: 10,
		})
		expect(getUniswapV3TickSpacingForFee(3000)).toBe(60)
		expect(uniswapV3FeeTiers.map((tier) => tier.fee)).toEqual([
			100,
			500,
			3000,
			10000,
		])
	})

	it('keeps token0 < token1 for every seeded pool', () => {
		for (const pool of uniswapV3Pools)
			expect(pool.token0 < pool.token1).toBe(true)
	})
})


describe('Uniswap Contracts queries', () => {
	it('normalizes pool addresses', () => {
		expect(normalizeUniswapAddress('0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640')).toBe('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640')
	})

	it('decodes a packed slot0 eth_call result', async () => {
		const word = (hex: string) => hex.padStart(64, '0')
		const signedWord = (value: number) => (
			BigInt.asUintN(256, BigInt(value)).toString(16).padStart(64, '0')
		)
		const response = (
			'0x'
			+ word('100')
			+ signedWord(-60)
			+ word('1')
			+ word('2')
			+ word('3')
			+ word('4')
			+ word('1')
		) as `0x${string}`

		const slot0 = await getPoolSlot0({
			getCall: async () => response,
			poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		})

		expect(slot0.sqrtPriceX96).toBe(0x100n)
		expect(slot0.tick).toBe(-60)
		expect(slot0.observationIndex).toBe(1)
		expect(slot0.observationCardinality).toBe(2)
		expect(slot0.observationCardinalityNext).toBe(3)
		expect(slot0.feeProtocol).toBe(4)
		expect(slot0.unlocked).toBe(true)
	})

	it('decodes pool fee growth globals and protocol fees', async () => {
		const word = (hex: string) => hex.padStart(64, '0')
		const feeGrowthResponse = (`0x${word('abc')}`) as `0x${string}`
		const protocolFeesResponse = (
			'0x'
			+ word('11')
			+ word('22')
		) as `0x${string}`

		expect(await getPoolFeeGrowthGlobal0X128({
			getCall: async () => feeGrowthResponse,
			poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		})).toBe(0xabcn)

		expect(await getPoolProtocolFees({
			getCall: async () => protocolFeesResponse,
			poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		})).toEqual({
			token0: 0x11n,
			token1: 0x22n,
		})
	})

	it('decodes pool fee and factory getPool', async () => {
		const word = (hex: string) => hex.padStart(64, '0')
		const feeResponse = (`0x${word((500).toString(16))}`) as `0x${string}`
		const poolResponse = (
			`0x${word('88e6a0c2ddd26feeb64f039a2c41296fcb3f5640')}`
		) as `0x${string}`

		expect(await getPoolFee({
			getCall: async () => feeResponse,
			poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
		})).toBe(500)

		expect(await getFactoryPool({
			getCall: async () => poolResponse,
			factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
			token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			fee: 500,
		})).toBe('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640')
	})

	it('decodes a packed positions eth_call result', async () => {
		const word = (hex: string) => hex.padStart(64, '0')
		const signedWord = (value: number) => (
			BigInt.asUintN(256, BigInt(value)).toString(16).padStart(64, '0')
		)
		const response = (
			'0x'
			+ word('0')
			+ word('0')
			+ word('a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
			+ word('c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
			+ word((500).toString(16))
			+ signedWord(-60)
			+ signedWord(60)
			+ word('64')
			+ word('abc')
			+ word('def')
			+ word('1')
			+ word('2')
		) as `0x${string}`

		const position = await getPosition({
			getCall: async () => response,
			positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
			tokenId: 1n,
		})

		expect(position.token0).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
		expect(position.token1).toBe('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
		expect(position.fee).toBe(500)
		expect(position.tickLower).toBe(-60)
		expect(position.tickUpper).toBe(60)
		expect(position.liquidity).toBe(0x64n)
		expect(position.feeGrowthInside0LastX128).toBe(0xabcn)
		expect(position.feeGrowthInside1LastX128).toBe(0xdefn)
		expect(position.tokensOwed0).toBe(1n)
		expect(position.tokensOwed1).toBe(2n)
	})
})
