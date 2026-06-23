import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { lotusOrigins } from '$/sources/Lotus/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	LotusActor,
	LotusMinerPower,
	LotusMessage,
	LotusSectorOnChainInfo,
	LotusTipset,
	LotusVersion,
} from '$/sources/Lotus/JsonRpc/types.ts'

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

const lotusJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: lotusOrigins,
		init: {
			method: 'POST',
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		},
	})
	if (!response.ok) await throwHttpError(`Lotus ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Lotus ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Lotus ${method}: missing result`)
	return json.result
}

export const getTipSetByHeight = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	lotusJsonRpc<LotusTipset>({
		rpcUrl,
		method: 'Filecoin.ChainGetTipSetByHeight',
		params: [
			Number(height),
			null,
		],
	})
)

export const getHead = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	lotusJsonRpc<LotusTipset>({
		rpcUrl,
		method: 'Filecoin.ChainHead',
		params: [],
	})
)

export const getVersion = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	lotusJsonRpc<LotusVersion>({
		rpcUrl,
		method: 'Filecoin.Version',
		params: [],
	})
)

export const getNetworkVersion = ({
	rpcUrl,
	tipsetKey,
}: {
	rpcUrl: string
	tipsetKey: { '/': string }[]
}) => (
	lotusJsonRpc<number>({
		rpcUrl,
		method: 'Filecoin.StateNetworkVersion',
		params: [
			tipsetKey,
		],
	})
)

export const getMinerPower = ({
	rpcUrl,
	minerAddress,
	tipsetKey,
}: {
	rpcUrl: string
	minerAddress: string
	tipsetKey: { '/': string }[]
}) => (
	lotusJsonRpc<LotusMinerPower>({
		rpcUrl,
		method: 'Filecoin.StateMinerPower',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMessage = ({
	rpcUrl,
	messageCid,
}: {
	rpcUrl: string
	messageCid: string
}) => (
	lotusJsonRpc<LotusMessage>({
		rpcUrl,
		method: 'Filecoin.ChainGetMessage',
		params: [
			{ '/': messageCid },
		],
	})
)

export const getActor = ({
	rpcUrl,
	address,
}: {
	rpcUrl: string
	address: string
}) => (
	lotusJsonRpc<LotusActor>({
		rpcUrl,
		method: 'Filecoin.StateGetActor',
		params: [
			address,
			null,
		],
	})
)

export const getMinerSectors = ({
	rpcUrl,
	minerAddress,
}: {
	rpcUrl: string
	minerAddress: string
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		rpcUrl,
		method: 'Filecoin.StateMinerSectors',
		params: [
			minerAddress,
			null,
			null,
		],
	})
)
