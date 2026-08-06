import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { toBytes } from '@tevm/voltaire/Hex'

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Compound/bindings.ts'
import type { CompoundAccountPositions } from '$/sources/Compound/Contracts/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'


const COMET_ABI = new Abi([
	{
		type: 'function',
		name: 'balanceOf',
		stateMutability: 'view',
		inputs: [
			{ type: 'address', name: 'account' },
		],
		outputs: [
			{ type: 'uint256', name: '' },
		],
	},
	{
		type: 'function',
		name: 'borrowBalanceOf',
		stateMutability: 'view',
		inputs: [
			{ type: 'address', name: 'account' },
		],
		outputs: [
			{ type: 'uint256', name: '' },
		],
	},
	{
		type: 'function',
		name: 'collateralBalanceOf',
		stateMutability: 'view',
		inputs: [
			{ type: 'address', name: 'account' },
			{ type: 'address', name: 'asset' },
		],
		outputs: [
			{ type: 'uint128', name: '' },
		],
	},
])

const UINT256_OUTPUT = [
	{ type: 'uint256' as const, name: '' },
] as const
const UINT128_OUTPUT = [
	{ type: 'uint128' as const, name: '' },
] as const

const decodeBalance = (
	response: `0x${string}`,
	output: typeof UINT256_OUTPUT | typeof UINT128_OUTPUT,
	method: string
) => {
	if (response === '0x')
		throw new Error(`${Source.Compound_Rest}: empty ${method} result`)

	try {
		return decodeParameters(output, toBytes(response))[0]
	} catch (cause) {
		throw new Error(`${Source.Compound_Rest}: malformed ${method} result`, { cause })
	}
}

export const getAccountPositions = async ({
	chainId,
	account,
}: {
	chainId: number
	account: string
}): Promise<CompoundAccountPositions> => {
	const accountAddress = hexLowerOfByteSize(account, 20)
	if (accountAddress == null)
		throw new Error(`${Source.Compound_Rest}: invalid account ${account}`)

	const binding = bindings[Source.Compound_Rest].find(({ apiFamily, target }) => (
		apiFamily === ApiFamily.EvmExecutionJsonRpc
		&& target.kind === SourceTargetKind.Eip155Chain
		&& target.key === String(chainId)
	))
	if (binding == null)
		throw new Error(`${Source.Compound_Rest}: no EVM execution binding for chain ${String(chainId)}`)

	const {
		compoundCometsByChainId,
	} = await import('$/sources/Compound/Rest/constants.ts')
	const deployments = compoundCometsByChainId[chainId]
	if (deployments == null)
		throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

	const {
		getBlockNumber,
		getCall,
	} = evmExecutionJsonRpc({ binding })
	const blockNumber = await getBlockNumber()
	const blockTag = `0x${blockNumber.toString(16)}` as const
	const { getConfiguration } = await import('$/sources/Compound/Rest/queries.ts')

	return {
		blockNumber,
		positions: (await Promise.all(deployments.map(async (deployment) => {
			const configuration = await getConfiguration({
				networkSlug: deployment.networkSlug,
				marketSlug: deployment.marketSlug,
			})
			const [
				suppliedBalance,
				borrowedBalance,
				collateral,
			] = await Promise.all([
				getCall({
					to: deployment.cometAddress,
					input: encodeFunction(COMET_ABI, 'balanceOf', [accountAddress]),
					blockTag,
				}).then((response) => decodeBalance(response, UINT256_OUTPUT, 'balanceOf')),
				getCall({
					to: deployment.cometAddress,
					input: encodeFunction(COMET_ABI, 'borrowBalanceOf', [accountAddress]),
					blockTag,
				}).then((response) => decodeBalance(response, UINT256_OUTPUT, 'borrowBalanceOf')),
				Promise.all(configuration.assets.map(async (asset) => ({
					symbol: asset.symbol,
					address: asset.tokenAddress,
					balance: decodeBalance(
						await getCall({
							to: deployment.cometAddress,
							input: encodeFunction(COMET_ABI, 'collateralBalanceOf', [
								accountAddress,
								asset.tokenAddress,
							]),
							blockTag,
						}),
						UINT128_OUTPUT,
						'collateralBalanceOf'
					).toString(),
				}))),
			])
			const activeCollateral = collateral.filter(({ balance }) => balance !== '0')
			if (suppliedBalance === 0n && borrowedBalance === 0n && activeCollateral.length === 0)
				return null

			return {
				protocol: 'Compound III' as const,
				chainId,
				marketSlug: deployment.marketSlug,
				cometAddress: deployment.cometAddress,
				baseToken: {
					symbol: configuration.baseTokenSymbol,
					address: configuration.baseTokenAddress,
					suppliedBalance: suppliedBalance.toString(),
					borrowedBalance: borrowedBalance.toString(),
				},
				collateral: activeCollateral,
			}
		}))).filter((position) => position != null),
	}
}
