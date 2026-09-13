// Uniswap v3 IUniswapV3PoolState.slot0 encodes raw token1/token0 as Q64.96.
export const rawSpotPrice = (sqrtPriceX96: bigint) => {
	if (sqrtPriceX96 <= 0n || sqrtPriceX96 >= 2n ** 160n)
		throw new RangeError('Expected a positive uint160 square-root price')

	let numerator = sqrtPriceX96 * sqrtPriceX96
	let denominator = 2n ** 192n
	while (numerator % 2n === 0n && denominator > 1n) {
		numerator /= 2n
		denominator /= 2n
	}
	return { numerator, denominator }
}

export const protocolFeeShares = (feeProtocol: number) => {
	if (!Number.isInteger(feeProtocol) || feeProtocol < 0 || feeProtocol > 255)
		throw new RangeError('Expected a uint8 protocol fee')

	return {
		token0: feeProtocol & 15,
		token1: feeProtocol >> 4,
	}
}
