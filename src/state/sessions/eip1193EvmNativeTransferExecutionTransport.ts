import { type } from 'arktype'

import type { RpcBlockWire } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import type { EvmNativeTransferExecutionTransport } from '$/state/sessions/evmNativeTransferPreparation.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type Eip1193RequestArguments = {
	method: string
	params?: readonly JsonValue[]
}

export type Eip1193Provider = {
	request(args: Eip1193RequestArguments): Promise<JsonValue>
}

export type EvmNativeTransferExecutionOperations = Pick<
	EvmNativeTransferExecutionTransport,
	'getBlockByNumber' | 'getCall' | 'estimateGas'
>

type ExecutionCall = Parameters<EvmNativeTransferExecutionOperations['getCall']>[0]
type LatestBlockRequest = Parameters<EvmNativeTransferExecutionOperations['getBlockByNumber']>[0]

const Eip1193BlockResult = type({
	number: ZeroExHex,
})

const rpcTransactionFromCall = ({
	from,
	to,
	input,
	value,
}: ExecutionCall) => ({
	from,
	to,
	data: input,
	value: `0x${value.toString(16)}`,
})

const narrowBlockResult = (result: JsonValue): Pick<RpcBlockWire, 'number'> | null => (
	result == null ? null : Eip1193BlockResult.assert(result)
)

export const createEip1193EvmNativeTransferExecutionTransport = (
	provider: Eip1193Provider
): EvmNativeTransferExecutionOperations => {
	const request = provider.request.bind(provider)

	return {
		getBlockByNumber: async ({
			blockNumber,
			txObjects,
		}: LatestBlockRequest) => narrowBlockResult(await request({
			method: 'eth_getBlockByNumber',
			params: [blockNumber, txObjects],
		})),
		getCall: async (call) => ZeroExHex.assert(await request({
			method: 'eth_call',
			params: [rpcTransactionFromCall(call), call.blockTag],
		})),
		estimateGas: async (call) => BigInt(ZeroExHex.assert(await request({
			method: 'eth_estimateGas',
			params: [rpcTransactionFromCall(call), call.blockTag],
		}))),
	}
}
