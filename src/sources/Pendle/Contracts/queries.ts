import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { toBytes } from '@tevm/voltaire/Hex'

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Pendle/bindings.ts'
import type { PendleAccountPositions } from '$/sources/Pendle/Contracts/types.ts'
import { pendleMarketsAllMaxLimit } from '$/sources/Pendle/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'


const ERC20_ABI = new Abi([
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
])

const UINT256_OUTPUT = [
	{ type: 'uint256' as const, name: '' },
] as const

const decodeBalance = (
	response: `0x${string}`,
	tokenKind: 'PT' | 'YT' | 'SY' | 'LP'
) => {
	if (response === '0x')
		throw new Error(`${Source.Pendle_Rest}: empty ${tokenKind} balanceOf result`)

	try {
		return decodeParameters(UINT256_OUTPUT, toBytes(response))[0]
	} catch (cause) {
		throw new Error(`${Source.Pendle_Rest}: malformed ${tokenKind} balanceOf result`, { cause })
	}
}

/**
 * Reads PT, YT, SY, and market-LP ERC-20 balances for every Pendle market on one chain.
 * Market discovery and token addresses come from Pendle's markets catalog; balances
 * are pinned to one EVM block so the returned account snapshot is internally coherent.
 */
export const getAccountPositions = async ({
	chainId,
	account,
}: {
	chainId: number
	account: string
}): Promise<PendleAccountPositions> => {
	const accountAddress = hexLowerOfByteSize(account, 20)
	if (accountAddress == null)
		throw new Error(`${Source.Pendle_Rest}: invalid account ${account}`)

	const binding = bindings[Source.Pendle_Rest].find(({ apiFamily, target }) => (
		apiFamily === ApiFamily.EvmExecutionJsonRpc
		&& target.key === String(chainId)
	))
	if (binding == null)
		throw new Error(`${Source.Pendle_Rest}: no EVM execution binding for chain ${String(chainId)}`)

	const { listMarkets } = await import('$/sources/Pendle/Rest/queries.ts')
	let marketPage = await listMarkets({
		chainId,
		limit: pendleMarketsAllMaxLimit,
	})
	const markets = [...marketPage.markets]
	while (markets.length < marketPage.total) {
		marketPage = await listMarkets({
			chainId,
			skip: markets.length,
			limit: pendleMarketsAllMaxLimit,
		})
		if (marketPage.markets.length === 0)
			throw new Error(`${Source.Pendle_Rest}: incomplete markets catalog for chain ${String(chainId)}`)

		markets.push(...marketPage.markets)
	}

	const {
		getBlockNumber,
		getCall,
	} = evmExecutionJsonRpc({ binding })
	const blockNumber = await getBlockNumber()
	const blockTag = `0x${blockNumber.toString(16)}` as const

	return {
		blockNumber,
		positions: (await Promise.all(markets.map(async (market) => {
			const balances = (await Promise.all([
				{
					kind: 'PT' as const,
					address: market.ptAddress,
				},
				{
					kind: 'YT' as const,
					address: market.ytAddress,
				},
				{
					kind: 'SY' as const,
					address: market.syAddress,
				},
				{
					kind: 'LP' as const,
					address: market.marketAddress,
				},
			].map(async ({ kind, address }) => ({
				kind,
				address,
				balance: decodeBalance(
					await getCall({
						to: address,
						input: encodeFunction(ERC20_ABI, 'balanceOf', [accountAddress]),
						blockTag,
					}),
					kind
				).toString(),
			})))).filter(({ balance }) => balance !== '0')
			if (balances.length === 0)
				return null

			return {
				protocol: 'Pendle V2' as const,
				chainId,
				marketAddress: market.marketAddress,
				marketName: market.name,
				expiryTimestampMs: market.expiryTimestampMs,
				balances,
			}
		}))).filter((position) => position != null),
	}
}
