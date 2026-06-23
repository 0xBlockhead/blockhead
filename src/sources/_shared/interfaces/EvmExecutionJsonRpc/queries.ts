import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

export const getBlockNumber = async (
	binding: SourceBinding
): Promise<number> => Number.parseInt(
	await jsonRpc2<`0x${string}`>(binding, 'eth_blockNumber'),
	16
)

export const getGasPrice = (
	binding: SourceBinding
): Promise<`0x${string}`> => (
	jsonRpc2<`0x${string}`>(binding, 'eth_gasPrice')
)

export const getMaxPriorityFeePerGas = (
	binding: SourceBinding
): Promise<`0x${string}`> => (
	jsonRpc2<`0x${string}`>(binding, 'eth_maxPriorityFeePerGas')
)
