import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import Polkadot from '$/sources/Polkadot/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	PolkadotRpcBlock,
	PolkadotRpcHeader,
} from '$/sources/Polkadot/JsonRpc/types.ts'

type JsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const polkadotJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: Polkadot.origins ?? [],
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		},
	})
	if (!response.ok) await throwHttpError(`Polkadot ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Polkadot ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Polkadot ${method}: missing result`)
	return json.result
}

export const getBlockHash = ({
	rpcUrl,
	blockNumber,
}: {
	rpcUrl: string
	blockNumber: bigint
}) => (
	polkadotJsonRpc<string>({
		rpcUrl,
		method: 'chain_getBlockHash',
		params: [
			`0x${blockNumber.toString(16)}`,
		],
	})
)

export const getFinalizedHead = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	polkadotJsonRpc<string>({
		rpcUrl,
		method: 'chain_getFinalizedHead',
		params: [],
	})
)

export const getBlock = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}) => (
	polkadotJsonRpc<PolkadotRpcBlock>({
		rpcUrl,
		method: 'chain_getBlock',
		params: [blockHash],
	})
)

export const getHeader = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}) => (
	polkadotJsonRpc<PolkadotRpcHeader>({
		rpcUrl,
		method: 'chain_getHeader',
		params: [blockHash],
	})
)
