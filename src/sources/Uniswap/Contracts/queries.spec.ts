import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getCcaAuctionConfiguration,
	getCcaAuctionState,
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

	it('reads one checkpointed CCA lens snapshot at the requested chain block', async () => {
		const getCall = vi.fn().mockResolvedValue(hexWords([
			(2n ** 200n) + 1n,
			(2n ** 199n) + 2n,
			(2n ** 198n) + 3n,
			5_000_000n,
			(2n ** 53n) + 4n,
			(2n ** 53n) + 5n,
			(2n ** 197n) + 6n,
			(2n ** 196n) + 7n,
			1n,
		]))

		await expect(getCcaAuctionState({
			getCall,
			lensAddress: '0xc3c65f5453a3674adb693cbda3c842545cd30f53',
			auctionAddress: '0x1234567890abcdef1234567890abcdef12345678',
			blockNumber: 20_000_000n,
		})).resolves.toEqual({
			auctionAddress: '0x1234567890abcdef1234567890abcdef12345678',
			blockNumber: 20_000_000n,
			clearingPriceQ96: (2n ** 200n) + 1n,
			currencyRaisedAtClearingPriceQ96X7: (2n ** 199n) + 2n,
			cumulativeMpsPerPrice: (2n ** 198n) + 3n,
			cumulativeMps: 5_000_000,
			previousCheckpointBlock: (2n ** 53n) + 4n,
			nextCheckpointBlock: (2n ** 53n) + 5n,
			currencyRaised: (2n ** 197n) + 6n,
			totalCleared: (2n ** 196n) + 7n,
			isGraduated: true,
		})
		expect(getCall).toHaveBeenCalledWith({
			to: '0xc3c65f5453a3674adb693cbda3c842545cd30f53',
			input: `0x31e658a5${addressWord('0x1234567890abcdef1234567890abcdef12345678')}`,
			blockTag: '0x1312d00',
		})
	})

	it('reads exact CCA auction configuration at the requested chain block', async () => {
		const getCall = vi.fn()
			.mockResolvedValueOnce(hexWords([0n]))
			.mockResolvedValueOnce(`0x${addressWord('0x1111111111111111111111111111111111111111')}`)
			.mockResolvedValueOnce(hexWords([(2n ** 120n) + 1n]))
			.mockResolvedValueOnce(`0x${addressWord('0x2222222222222222222222222222222222222222')}`)
			.mockResolvedValueOnce(`0x${addressWord('0x3333333333333333333333333333333333333333')}`)
			.mockResolvedValueOnce(hexWords([(2n ** 53n) + 4n]))
			.mockResolvedValueOnce(hexWords([(2n ** 53n) + 5n]))
			.mockResolvedValueOnce(hexWords([(2n ** 53n) + 6n]))
			.mockResolvedValueOnce(hexWords([0n]))
			.mockResolvedValueOnce(hexWords([(2n ** 200n) + 7n]))
			.mockResolvedValueOnce(hexWords([(2n ** 199n) + 8n]))

		await expect(getCcaAuctionConfiguration({
			getCall,
			auctionAddress: '0x1234567890ABCDEF1234567890ABCDEF12345678',
			blockNumber: 20_000_000n,
		})).resolves.toEqual({
			auctionAddress: '0x1234567890abcdef1234567890abcdef12345678',
			blockNumber: 20_000_000n,
			currencyAddress: '0x0000000000000000000000000000000000000000',
			tokenAddress: '0x1111111111111111111111111111111111111111',
			totalSupply: (2n ** 120n) + 1n,
			tokensRecipient: '0x2222222222222222222222222222222222222222',
			fundsRecipient: '0x3333333333333333333333333333333333333333',
			startBlock: (2n ** 53n) + 4n,
			endBlock: (2n ** 53n) + 5n,
			claimBlock: (2n ** 53n) + 6n,
			validationHookAddress: '0x0000000000000000000000000000000000000000',
			floorPriceQ96: (2n ** 200n) + 7n,
			tickSpacingQ96: (2n ** 199n) + 8n,
		})
		expect(getCall.mock.calls.map(([call]) => call)).toEqual([
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0xe5a6b10f',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0xfc0c546a',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x18160ddd',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0xfd637557',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x3b6fd2cf',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x48cd4cb1',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x083c6323',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x37dfbc4b',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x8134f027',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0x9363c812',
				blockTag: '0x1312d00',
			},
			{
				to: '0x1234567890abcdef1234567890abcdef12345678',
				input: '0xd0c93a7c',
				blockTag: '0x1312d00',
			},
		])
	})

	it('fail-closes incomplete CCA configuration without deriving lifecycle status', async () => {
		await expect(getCcaAuctionConfiguration({
			getCall: vi.fn().mockResolvedValue('0x'),
			auctionAddress: '0x1234567890abcdef1234567890abcdef12345678',
			blockNumber: 20_000_000n,
		})).rejects.toThrow('empty CCA currency result')
	})

	it('fail-closes empty CCA lens state without inventing an auction status', async () => {
		await expect(getCcaAuctionState({
			getCall: vi.fn().mockResolvedValue('0x'),
			lensAddress: '0xc3c65f5453a3674adb693cbda3c842545cd30f53',
			auctionAddress: '0x1234567890abcdef1234567890abcdef12345678',
			blockNumber: 20_000_000n,
		})).rejects.toThrow('empty CCA auction state result')
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
