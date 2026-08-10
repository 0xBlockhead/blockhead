import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { toBytes } from '@tevm/voltaire/Hex'

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'


const ADDRESS_OUTPUT = [{ type: 'address' as const, name: '' }] as const
const UINT256_OUTPUT = [{ type: 'uint256' as const, name: '' }] as const

const ERC4626_ABI = new Abi([
	{
		type: 'function',
		name: 'asset',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'address', name: '' }],
	},
	{
		type: 'function',
		name: 'totalAssets',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256', name: '' }],
	},
	{
		type: 'function',
		name: 'totalSupply',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256', name: '' }],
	},
])

type EthCall = (call: {
	to: `0x${string}`
	input: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => Promise<`0x${string}`>

const normalizedAddress = (
	value: string,
	label: string
) => {
	const address = hexLowerOfByteSize(value, 20)
	if (address == null || address === '0x0000000000000000000000000000000000000000')
		throw new Error(`ERC-4626 contracts: invalid ${label}`)

	return address
}

const decodedAddress = (
	response: `0x${string}`,
	label: string
) => {
	if (response === '0x' || response.length < 66)
		throw new Error(`ERC-4626 contracts: empty ${label} result`)

	return normalizedAddress(
		String(decodeParameters(ADDRESS_OUTPUT, toBytes(response))[0]),
		label
	)
}

const decodedUint256 = (
	response: `0x${string}`,
	label: string
) => {
	if (response === '0x' || response.length < 66)
		throw new Error(`ERC-4626 contracts: empty ${label} result`)

	try {
		return BigInt(String(decodeParameters(UINT256_OUTPUT, toBytes(response))[0]))
	} catch {
		throw new Error(`ERC-4626 contracts: invalid ${label} result`)
	}
}

export const getErc4626VaultIdentity = async ({
	getCall,
	vaultAddress,
}: {
	getCall: EthCall
	vaultAddress: string
}) => {
	const normalizedVaultAddress = normalizedAddress(vaultAddress, 'vault address')
	return {
		vaultAddress: normalizedVaultAddress,
		assetAddress: decodedAddress(
			await getCall({
				to: normalizedVaultAddress,
				input: encodeFunction(ERC4626_ABI, 'asset', []),
				blockTag: 'latest',
			}),
			'asset'
		),
	}
}

export const getErc4626VaultBlockState = async ({
	getCall,
	vaultAddress,
	blockNumber,
}: {
	getCall: EthCall
	vaultAddress: string
	blockNumber: bigint
}) => {
	if (blockNumber < 0n)
		throw new Error('ERC-4626 contracts: invalid block number')

	const normalizedVaultAddress = normalizedAddress(vaultAddress, 'vault address')
	const blockTag = `0x${blockNumber.toString(16)}` as const
	const [totalAssets, totalSupply] = await Promise.all([
		getCall({
			to: normalizedVaultAddress,
			input: encodeFunction(ERC4626_ABI, 'totalAssets', []),
			blockTag,
		}).then((response) => decodedUint256(response, 'totalAssets')),
		getCall({
			to: normalizedVaultAddress,
			input: encodeFunction(ERC4626_ABI, 'totalSupply', []),
			blockTag,
		}).then((response) => decodedUint256(response, 'totalSupply')),
	])

	return {
		vaultAddress: normalizedVaultAddress,
		blockNumber,
		totalAssets,
		totalSupply,
	}
}
