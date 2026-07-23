import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	LotusActor,
	LotusMinerInfo,
	LotusMinerPower,
	LotusMinerSectorCount,
	LotusMessage,
	LotusSectorOnChainInfo,
	LotusTipset,
	LotusTipsetKey,
	LotusVersion,
} from '$/sources/Lotus/JsonRpc/types.ts'

const lotusOrigins = [
	{
		origin: 'https://api.node.glif.io',
		corsEnabled: true,
	},
	{
		origin: 'http://127.0.0.1:1234',
		corsEnabled: false,
	},
] as const

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
	tipsetKey: LotusTipsetKey
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
	tipsetKey: LotusTipsetKey
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

export const getMinerInfo = ({
	rpcUrl,
	minerAddress,
	tipsetKey,
}: {
	rpcUrl: string
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerInfo>({
		rpcUrl,
		method: 'Filecoin.StateMinerInfo',
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
	tipsetKey,
}: {
	rpcUrl: string
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusActor>({
		rpcUrl,
		method: 'Filecoin.StateGetActor',
		params: [
			address,
			tipsetKey,
		],
	})
)

export const getIdAddress = ({
	rpcUrl,
	address,
	tipsetKey,
}: {
	rpcUrl: string
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<string>({
		rpcUrl,
		method: 'Filecoin.StateLookupID',
		params: [
			address,
			tipsetKey,
		],
	})
)

export const getMinerSectors = ({
	rpcUrl,
	minerAddress,
	tipsetKey,
}: {
	rpcUrl: string
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		rpcUrl,
		method: 'Filecoin.StateMinerSectors',
		params: [
			minerAddress,
			null,
			tipsetKey,
		],
	})
)

export const getMinerActiveSectors = ({
	rpcUrl,
	minerAddress,
	tipsetKey,
}: {
	rpcUrl: string
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		rpcUrl,
		method: 'Filecoin.StateMinerActiveSectors',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMinerSectorCount = ({
	rpcUrl,
	minerAddress,
	tipsetKey,
}: {
	rpcUrl: string
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerSectorCount>({
		rpcUrl,
		method: 'Filecoin.StateMinerSectorCount',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)
