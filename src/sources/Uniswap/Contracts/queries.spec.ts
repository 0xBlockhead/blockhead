import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getFactoryPool,
	getPoolFactory,
	getPoolFee,
	getPoolLiquidity,
	getPoolSlot0,
	getPoolTickSpacing,
	getPosition,
	normalizeUniswapAddress,
} from '$/sources/Uniswap/Contracts/queries.ts'

const word = (value: bigint) => value.toString(16).padStart(64, '0')

const addressWord = (address: `0x${string}`) => (
	address.slice(2).toLowerCase().padStart(64, '0')
)

const hexWords = (values: bigint[]) => (
	`0x${values.map(word).join('')}`
)

describe('Uniswap Contracts eth_call helpers', () => {
	it('normalizes checksummed addresses', () => {
		expect(normalizeUniswapAddress('0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640')).toBe(
			'0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
		)
	})

	it('decodes pool factory / fee / tickSpacing / liquidity', async () => {
		const getCall = vi.fn()
			.mockResolvedValueOnce(`0x${addressWord('0x1f98431c8ad98523631ae4a59f267346ea31f984')}`)
			.mockResolvedValueOnce(hexWords([500n]))
			.mockResolvedValueOnce(hexWords([10n]))
			.mockResolvedValueOnce(hexWords([64n]))

		const poolAddress = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
		await expect(getPoolFactory({ getCall, poolAddress })).resolves.toBe(
			'0x1f98431c8ad98523631ae4a59f267346ea31f984'
		)
		await expect(getPoolFee({ getCall, poolAddress })).resolves.toBe(500)
		await expect(getPoolTickSpacing({ getCall, poolAddress })).resolves.toBe(10)
		await expect(getPoolLiquidity({ getCall, poolAddress })).resolves.toBe(64n)
	})

	it('fail-closes empty eth_call results', async () => {
		const getCall = vi.fn().mockResolvedValue('0x')
		await expect(
			getPoolFactory({
				getCall,
				poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			})
		).rejects.toThrow('UniswapContracts_Evm: empty factory result')
	})

	it('fail-closes zero factory pool addresses', async () => {
		const getCall = vi.fn().mockResolvedValue(`0x${addressWord('0x0000000000000000000000000000000000000000')}`)
		await expect(
			getFactoryPool({
				getCall,
				factoryAddress: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
				token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				fee: 500,
			})
		).rejects.toThrow('UniswapContracts_Evm: zero or invalid')
	})

	it('decodes slot0 and positions tuples', async () => {
		const getCall = vi.fn()
			.mockResolvedValueOnce(hexWords([
				100n,
				12n,
				1n,
				2n,
				3n,
				0n,
				1n,
			]))
			.mockResolvedValueOnce(hexWords([
				0n,
				0n,
				BigInt('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
				BigInt('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
				500n,
				BigInt.asUintN(24, -60n),
				60n,
				9n,
				0xabcn,
				0xdefn,
				3n,
				4n,
			]))

		await expect(
			getPoolSlot0({
				getCall,
				poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
			})
		).resolves.toEqual({
			sqrtPriceX96: 100n,
			tick: 12,
			observationIndex: 1,
			observationCardinality: 2,
			observationCardinalityNext: 3,
			feeProtocol: 0,
			unlocked: true,
		})

		await expect(
			getPosition({
				getCall,
				positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
				tokenId: 7n,
			})
		).resolves.toEqual({
			nonce: 0n,
			operator: '0x0000000000000000000000000000000000000000',
			token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			fee: 500,
			tickLower: -60,
			tickUpper: 60,
			liquidity: 9n,
			feeGrowthInside0LastX128: 0xabcn,
			feeGrowthInside1LastX128: 0xdefn,
			tokensOwed0: 3n,
			tokensOwed1: 4n,
		})
	})
})
