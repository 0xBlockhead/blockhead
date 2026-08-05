import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { toBytes } from '@tevm/voltaire/Hex'

import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'


const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const ADDRESS_OUTPUT = [{ type: 'address' as const, name: '' }] as const
const UINT24_OUTPUT = [{ type: 'uint24' as const, name: '' }] as const
const INT24_OUTPUT = [{ type: 'int24' as const, name: '' }] as const
const UINT128_OUTPUT = [{ type: 'uint128' as const, name: '' }] as const
const UINT256_OUTPUT = [{ type: 'uint256' as const, name: '' }] as const
const PROTOCOL_FEES_OUTPUT = [
	{ type: 'uint128' as const, name: 'token0' },
	{ type: 'uint128' as const, name: 'token1' },
] as const

const POOL_ABI = new Abi([
	{
		type: 'function',
		name: 'factory',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'address', name: '' }],
	},
	{
		type: 'function',
		name: 'token0',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'address', name: '' }],
	},
	{
		type: 'function',
		name: 'token1',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'address', name: '' }],
	},
	{
		type: 'function',
		name: 'fee',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint24', name: '' }],
	},
	{
		type: 'function',
		name: 'tickSpacing',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'int24', name: '' }],
	},
	{
		type: 'function',
		name: 'liquidity',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint128', name: '' }],
	},
	{
		type: 'function',
		name: 'feeGrowthGlobal0X128',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256', name: '' }],
	},
	{
		type: 'function',
		name: 'feeGrowthGlobal1X128',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256', name: '' }],
	},
	{
		type: 'function',
		name: 'protocolFees',
		stateMutability: 'view',
		inputs: [],
		outputs: [
			{ type: 'uint128', name: 'token0' },
			{ type: 'uint128', name: 'token1' },
		],
	},
	{
		type: 'function',
		name: 'slot0',
		stateMutability: 'view',
		inputs: [],
		outputs: [
			{ type: 'uint160', name: 'sqrtPriceX96' },
			{ type: 'int24', name: 'tick' },
			{ type: 'uint16', name: 'observationIndex' },
			{ type: 'uint16', name: 'observationCardinality' },
			{ type: 'uint16', name: 'observationCardinalityNext' },
			{ type: 'uint8', name: 'feeProtocol' },
			{ type: 'bool', name: 'unlocked' },
		],
	},
])

const FACTORY_ABI = new Abi([
	{
		type: 'function',
		name: 'getPool',
		stateMutability: 'view',
		inputs: [
			{ type: 'address', name: 'tokenA' },
			{ type: 'address', name: 'tokenB' },
			{ type: 'uint24', name: 'fee' },
		],
		outputs: [{ type: 'address', name: 'pool' }],
	},
])

const NONFUNGIBLE_POSITION_MANAGER_ABI = new Abi([
	{
		type: 'function',
		name: 'ownerOf',
		stateMutability: 'view',
		inputs: [{ type: 'uint256', name: 'tokenId' }],
		outputs: [{ type: 'address', name: '' }],
	},
	{
		type: 'function',
		name: 'positions',
		stateMutability: 'view',
		inputs: [{ type: 'uint256', name: 'tokenId' }],
		outputs: [
			{ type: 'uint96', name: 'nonce' },
			{ type: 'address', name: 'operator' },
			{ type: 'address', name: 'token0' },
			{ type: 'address', name: 'token1' },
			{ type: 'uint24', name: 'fee' },
			{ type: 'int24', name: 'tickLower' },
			{ type: 'int24', name: 'tickUpper' },
			{ type: 'uint128', name: 'liquidity' },
			{ type: 'uint256', name: 'feeGrowthInside0LastX128' },
			{ type: 'uint256', name: 'feeGrowthInside1LastX128' },
			{ type: 'uint128', name: 'tokensOwed0' },
			{ type: 'uint128', name: 'tokensOwed1' },
		],
	},
])

const SLOT0_OUTPUT = [
	{ type: 'uint160' as const, name: 'sqrtPriceX96' },
	{ type: 'int24' as const, name: 'tick' },
	{ type: 'uint16' as const, name: 'observationIndex' },
	{ type: 'uint16' as const, name: 'observationCardinality' },
	{ type: 'uint16' as const, name: 'observationCardinalityNext' },
	{ type: 'uint8' as const, name: 'feeProtocol' },
	{ type: 'bool' as const, name: 'unlocked' },
] as const

const POSITIONS_OUTPUT = [
	{ type: 'uint96' as const, name: 'nonce' },
	{ type: 'address' as const, name: 'operator' },
	{ type: 'address' as const, name: 'token0' },
	{ type: 'address' as const, name: 'token1' },
	{ type: 'uint24' as const, name: 'fee' },
	{ type: 'int24' as const, name: 'tickLower' },
	{ type: 'int24' as const, name: 'tickUpper' },
	{ type: 'uint128' as const, name: 'liquidity' },
	{ type: 'uint256' as const, name: 'feeGrowthInside0LastX128' },
	{ type: 'uint256' as const, name: 'feeGrowthInside1LastX128' },
	{ type: 'uint128' as const, name: 'tokensOwed0' },
	{ type: 'uint128' as const, name: 'tokensOwed1' },
] as const


type EthCall = (call: {
	to: `0x${string}`
	input: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => Promise<`0x${string}`>


const decodeResponse = <Result>(
	decode: () => Result,
	label: string
) => {
	try {
		return decode()
	} catch {
		throw new Error(`UniswapContracts_Evm: invalid ${label} response envelope`)
	}
}


const assertAddress = (
	value: string,
	label: string
): `0x${string}` => {
	const address = hexLowerOfByteSize(value, 20)
	if (address == null)
		throw new Error(`UniswapContracts_Evm: invalid ${label}`)
	return address
}


const decodeAddressResult = (
	response: string,
	label: string
) => {
	if (typeof response !== 'string' || response === '0x' || response.length < 66)
		throw new Error(`UniswapContracts_Evm: empty ${label} result`)

	const [address] = decodeResponse(
		() => decodeParameters(ADDRESS_OUTPUT, toBytes(response)),
		label
	)
	if (typeof address !== 'string')
		throw new Error(`UniswapContracts_Evm: malformed ${label} address`)

	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null || normalized === ZERO_ADDRESS)
		throw new Error(`UniswapContracts_Evm: zero or invalid ${label}`)

	return normalized
}


const decodeUintAsNumber = (
	response: string,
	label: string,
	maximum: number
) => {
	if (typeof response !== 'string' || response === '0x' || response.length < 66)
		throw new Error(`UniswapContracts_Evm: empty ${label} result`)

	const [value] = decodeResponse(
		() => decodeParameters(
			label === 'tickSpacing' ? INT24_OUTPUT : UINT24_OUTPUT,
			toBytes(response)
		),
		label
	)
	const asBigInt = typeof value === 'bigint' ? value : BigInt(String(value))
	if (asBigInt > BigInt(maximum) || asBigInt < BigInt(-maximum))
		throw new Error(`UniswapContracts_Evm: ${label} out of range`)

	const asNumber = Number(asBigInt)
	if (!Number.isSafeInteger(asNumber))
		throw new Error(`UniswapContracts_Evm: ${label} not safe integer`)

	return asNumber
}


const decodeUint128 = (
	response: string,
	label: string
) => {
	if (typeof response !== 'string' || response === '0x' || response.length < 66)
		throw new Error(`UniswapContracts_Evm: empty ${label} result`)

	const [value] = decodeResponse(
		() => decodeParameters(UINT128_OUTPUT, toBytes(response)),
		label
	)
	if (typeof value === 'bigint')
		return value

	return BigInt(String(value))
}


const decodeUint256 = (
	response: string,
	label: string
) => {
	if (typeof response !== 'string' || response === '0x' || response.length < 66)
		throw new Error(`UniswapContracts_Evm: empty ${label} result`)

	const [value] = decodeResponse(
		() => decodeParameters(UINT256_OUTPUT, toBytes(response)),
		label
	)
	if (typeof value === 'bigint')
		return value

	return BigInt(String(value))
}


const toSignedInt24Number = (
	value: bigint | number | string
) => {
	const asBigInt = typeof value === 'bigint' ? value : BigInt(String(value))
	const signed = BigInt.asIntN(24, asBigInt)
	const asNumber = Number(signed)
	if (!Number.isSafeInteger(asNumber) || asNumber < -8388608 || asNumber > 8388607)
		throw new Error('UniswapContracts_Evm: int24 out of range')

	return asNumber
}


const assertUint256 = (
	value: bigint,
	label: string
) => {
	if (value < 0n || value > (2n ** 256n) - 1n)
		throw new Error(`UniswapContracts_Evm: invalid ${label}`)

	return value
}


const blockTagFor = (
	blockNumber: bigint | 'latest'
) => (
	blockNumber === 'latest' ?
		'latest' as const
	:
		`0x${assertUint256(blockNumber, 'block number').toString(16)}` as const
)


export const getPoolFactory = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeAddressResult(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'factory', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'factory'
	)
)


export const getPoolToken0 = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeAddressResult(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'token0', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'token0'
	)
)


export const getPoolToken1 = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeAddressResult(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'token1', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'token1'
	)
)


export const getPoolFee = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeUintAsNumber(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'fee', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'fee',
		0xffffff
	)
)


export const getPoolTickSpacing = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeUintAsNumber(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'tickSpacing', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'tickSpacing',
		0x7fffff
	)
)


export const getPoolLiquidity = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeUint128(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'liquidity', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'liquidity'
	)
)


export const getPoolFeeGrowthGlobal0X128 = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeUint256(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'feeGrowthGlobal0X128', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'feeGrowthGlobal0X128'
	)
)


export const getPoolFeeGrowthGlobal1X128 = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => (
	decodeUint256(
		await getCall({
			to: assertAddress(poolAddress, 'pool address'),
			input: encodeFunction(POOL_ABI, 'feeGrowthGlobal1X128', []),
			blockTag: blockTagFor(blockNumber),
		}),
		'feeGrowthGlobal1X128'
	)
)


export const getPoolProtocolFees = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => {
	const response = await getCall({
		to: assertAddress(poolAddress, 'pool address'),
		input: encodeFunction(POOL_ABI, 'protocolFees', []),
		blockTag: blockTagFor(blockNumber),
	})
	if (typeof response !== 'string' || response === '0x' || response.length < 2 + 2 * 64)
		throw new Error('UniswapContracts_Evm: empty protocolFees result')

	const [
		token0,
		token1,
	] = decodeResponse(
		() => decodeParameters(PROTOCOL_FEES_OUTPUT, toBytes(response)),
		'protocolFees'
	)

	return {
		token0: typeof token0 === 'bigint' ? token0 : BigInt(String(token0)),
		token1: typeof token1 === 'bigint' ? token1 : BigInt(String(token1)),
	}
}


export const getPoolSlot0 = async ({
	getCall,
	poolAddress,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	poolAddress: string
	blockNumber?: bigint | 'latest'
}) => {
	const response = await getCall({
		to: assertAddress(poolAddress, 'pool address'),
		input: encodeFunction(POOL_ABI, 'slot0', []),
		blockTag: blockTagFor(blockNumber),
	})
	if (typeof response !== 'string' || response === '0x' || response.length < 2 + 7 * 64)
		throw new Error('UniswapContracts_Evm: empty slot0 result')

	const [
		sqrtPriceX96,
		tick,
		observationIndex,
		observationCardinality,
		observationCardinalityNext,
		feeProtocol,
		unlocked,
	] = decodeResponse(
		() => decodeParameters(SLOT0_OUTPUT, toBytes(response)),
		'slot0'
	)

	return {
		sqrtPriceX96: typeof sqrtPriceX96 === 'bigint' ? sqrtPriceX96 : BigInt(String(sqrtPriceX96)),
		tick: toSignedInt24Number(tick),
		observationIndex: Number(observationIndex),
		observationCardinality: Number(observationCardinality),
		observationCardinalityNext: Number(observationCardinalityNext),
		feeProtocol: Number(feeProtocol),
		unlocked: (
			unlocked === true ?
				true
			: unlocked === false ?
				false
			:
				(() => {
					throw new Error('UniswapContracts_Evm: malformed slot0 unlocked')
				})()
		),
	}
}


export const getFactoryPool = async ({
	getCall,
	factoryAddress,
	token0,
	token1,
	fee,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	factoryAddress: string
	token0: string
	token1: string
	fee: number
	blockNumber?: bigint | 'latest'
}) => {
	return decodeAddressResult(
		await getCall({
			to: assertAddress(factoryAddress, 'factory address'),
			input: encodeFunction(FACTORY_ABI, 'getPool', [
				assertAddress(token0, 'token0'),
				assertAddress(token1, 'token1'),
				fee,
			]),
			blockTag: blockTagFor(blockNumber),
		}),
		'getPool'
	)
}


export const getPositionOwner = async ({
	getCall,
	positionManager,
	tokenId,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	positionManager: string
	tokenId: bigint
	blockNumber?: bigint | 'latest'
}) => (
	decodeAddressResult(
		await getCall({
			to: assertAddress(positionManager, 'position manager'),
			input: encodeFunction(NONFUNGIBLE_POSITION_MANAGER_ABI, 'ownerOf', [assertUint256(tokenId, 'token id')]),
			blockTag: blockTagFor(blockNumber),
		}),
		'ownerOf'
	)
)


export const getPosition = async ({
	getCall,
	positionManager,
	tokenId,
	blockNumber = 'latest',
}: {
	getCall: EthCall
	positionManager: string
	tokenId: bigint
	blockNumber?: bigint | 'latest'
}) => {
	const response = await getCall({
		to: assertAddress(positionManager, 'position manager'),
		input: encodeFunction(NONFUNGIBLE_POSITION_MANAGER_ABI, 'positions', [assertUint256(tokenId, 'token id')]),
		blockTag: blockTagFor(blockNumber),
	})
	if (typeof response !== 'string' || response === '0x' || response.length < 2 + 12 * 64)
		throw new Error('UniswapContracts_Evm: empty positions result')

	const [
		_nonce,
		_operator,
		token0,
		token1,
		fee,
		tickLower,
		tickUpper,
		liquidity,
		feeGrowthInside0LastX128,
		feeGrowthInside1LastX128,
		tokensOwed0,
		tokensOwed1,
	] = decodeResponse(
		() => decodeParameters(POSITIONS_OUTPUT, toBytes(response)),
		'positions'
	)

	if (typeof token0 !== 'string' || typeof token1 !== 'string')
		throw new Error('UniswapContracts_Evm: malformed positions tokens')

	const token0Address = hexLowerOfByteSize(token0, 20)
	const token1Address = hexLowerOfByteSize(token1, 20)
	if (
		token0Address == null
		|| token1Address == null
		|| token0Address === ZERO_ADDRESS
		|| token1Address === ZERO_ADDRESS
		|| token0Address >= token1Address
	)
		throw new Error('UniswapContracts_Evm: invalid positions token addresses')

	if (typeof _operator !== 'string')
		throw new Error('UniswapContracts_Evm: malformed positions operator')

	const operator = hexLowerOfByteSize(_operator, 20)
	if (operator == null)
		throw new Error('UniswapContracts_Evm: invalid positions operator address')

	const feeNumber = Number(fee)
	if (!Number.isSafeInteger(feeNumber) || feeNumber < 0 || feeNumber > 0xffffff)
		throw new Error('UniswapContracts_Evm: positions fee out of range')

	const tickLowerNumber = toSignedInt24Number(tickLower)
	const tickUpperNumber = toSignedInt24Number(tickUpper)
	if (tickLowerNumber >= tickUpperNumber)
		throw new Error('UniswapContracts_Evm: positions ticks out of order')

	return {
		nonce: typeof _nonce === 'bigint' ? _nonce : BigInt(String(_nonce)),
		operator,
		token0: token0Address,
		token1: token1Address,
		fee: feeNumber,
		tickLower: tickLowerNumber,
		tickUpper: tickUpperNumber,
		liquidity: typeof liquidity === 'bigint' ? liquidity : BigInt(String(liquidity)),
		feeGrowthInside0LastX128: (
			typeof feeGrowthInside0LastX128 === 'bigint' ?
				feeGrowthInside0LastX128
			:
				BigInt(String(feeGrowthInside0LastX128))
		),
		feeGrowthInside1LastX128: (
			typeof feeGrowthInside1LastX128 === 'bigint' ?
				feeGrowthInside1LastX128
			:
				BigInt(String(feeGrowthInside1LastX128))
		),
		tokensOwed0: typeof tokensOwed0 === 'bigint' ? tokensOwed0 : BigInt(String(tokensOwed0)),
		tokensOwed1: typeof tokensOwed1 === 'bigint' ? tokensOwed1 : BigInt(String(tokensOwed1)),
	}
}


export const normalizeUniswapAddress = (
	value: string
) => (
	zeroExLowerCase(assertAddress(value, 'address'))
)
