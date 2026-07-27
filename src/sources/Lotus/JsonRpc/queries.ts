import { throwHttpError } from '$/lib/http.ts'
import { filecoinNetworkBySlug } from '$/constants/FilecoinNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'
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

const binding = bindings[Source.Lotus_JsonRpc].find(({ target }) => (
	target.key === `${filecoinNetworkBySlug.filecoin.caip2.namespace}:${filecoinNetworkBySlug.filecoin.caip2.reference}`
))
if (binding == null)
	throw new Error('Lotus_JsonRpc: Filecoin mainnet binding is not registered')

export const getRpcEndpoints = () => [{
	url: `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/rpc/v1`,
	transportType: TransportType.Http,
	providerName: 'GLIF',
}]

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
	method,
	params,
}: {
	method: string
	params: JsonValue[]
}) => {
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/rpc/v1`,
		{
			method: 'POST',
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		}
	)
	if (!response.ok) await throwHttpError(`Lotus ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Lotus ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Lotus ${method}: missing result`)
	return json.result
}

export const getTipSetByHeight = ({
	height,
}: {
	height: bigint
}) => (
	lotusJsonRpc<LotusTipset>({
		method: 'Filecoin.ChainGetTipSetByHeight',
		params: [
			Number(height),
			null,
		],
	})
)

export const getHead = () => (
	lotusJsonRpc<LotusTipset>({
		method: 'Filecoin.ChainHead',
		params: [],
	})
)

export const getVersion = () => (
	lotusJsonRpc<LotusVersion>({
		method: 'Filecoin.Version',
		params: [],
	})
)

export const getNetworkVersion = ({
	tipsetKey,
}: {
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<number>({
		method: 'Filecoin.StateNetworkVersion',
		params: [
			tipsetKey,
		],
	})
)

export const getMinerPower = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerPower>({
		method: 'Filecoin.StateMinerPower',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMinerInfo = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerInfo>({
		method: 'Filecoin.StateMinerInfo',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMessage = ({
	messageCid,
}: {
	messageCid: string
}) => (
	lotusJsonRpc<LotusMessage>({
		method: 'Filecoin.ChainGetMessage',
		params: [
			{ '/': messageCid },
		],
	})
)

export const getActor = ({
	address,
	tipsetKey,
}: {
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusActor>({
		method: 'Filecoin.StateGetActor',
		params: [
			address,
			tipsetKey,
		],
	})
)

export const getIdAddress = ({
	address,
	tipsetKey,
}: {
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<string>({
		method: 'Filecoin.StateLookupID',
		params: [
			address,
			tipsetKey,
		],
	})
)

export const getMinerSectors = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		method: 'Filecoin.StateMinerSectors',
		params: [
			minerAddress,
			null,
			tipsetKey,
		],
	})
)

export const getMinerActiveSectors = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		method: 'Filecoin.StateMinerActiveSectors',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMinerSectorCount = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerSectorCount>({
		method: 'Filecoin.StateMinerSectorCount',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)
