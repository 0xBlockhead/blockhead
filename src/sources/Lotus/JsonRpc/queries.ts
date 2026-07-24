import { throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
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
	binding,
	method,
	params,
}: {
	binding: SourceBinding
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
	binding,
	height,
}: {
	binding: SourceBinding
	height: bigint
}) => (
	lotusJsonRpc<LotusTipset>({
		binding,
		method: 'Filecoin.ChainGetTipSetByHeight',
		params: [
			Number(height),
			null,
		],
	})
)

export const getHead = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	lotusJsonRpc<LotusTipset>({
		binding,
		method: 'Filecoin.ChainHead',
		params: [],
	})
)

export const getVersion = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	lotusJsonRpc<LotusVersion>({
		binding,
		method: 'Filecoin.Version',
		params: [],
	})
)

export const getNetworkVersion = ({
	binding,
	tipsetKey,
}: {
	binding: SourceBinding
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<number>({
		binding,
		method: 'Filecoin.StateNetworkVersion',
		params: [
			tipsetKey,
		],
	})
)

export const getMinerPower = ({
	binding,
	minerAddress,
	tipsetKey,
}: {
	binding: SourceBinding
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerPower>({
		binding,
		method: 'Filecoin.StateMinerPower',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMinerInfo = ({
	binding,
	minerAddress,
	tipsetKey,
}: {
	binding: SourceBinding
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerInfo>({
		binding,
		method: 'Filecoin.StateMinerInfo',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMessage = ({
	binding,
	messageCid,
}: {
	binding: SourceBinding
	messageCid: string
}) => (
	lotusJsonRpc<LotusMessage>({
		binding,
		method: 'Filecoin.ChainGetMessage',
		params: [
			{ '/': messageCid },
		],
	})
)

export const getActor = ({
	binding,
	address,
	tipsetKey,
}: {
	binding: SourceBinding
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusActor>({
		binding,
		method: 'Filecoin.StateGetActor',
		params: [
			address,
			tipsetKey,
		],
	})
)

export const getIdAddress = ({
	binding,
	address,
	tipsetKey,
}: {
	binding: SourceBinding
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<string>({
		binding,
		method: 'Filecoin.StateLookupID',
		params: [
			address,
			tipsetKey,
		],
	})
)

export const getMinerSectors = ({
	binding,
	minerAddress,
	tipsetKey,
}: {
	binding: SourceBinding
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		binding,
		method: 'Filecoin.StateMinerSectors',
		params: [
			minerAddress,
			null,
			tipsetKey,
		],
	})
)

export const getMinerActiveSectors = ({
	binding,
	minerAddress,
	tipsetKey,
}: {
	binding: SourceBinding
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusSectorOnChainInfo[]>({
		binding,
		method: 'Filecoin.StateMinerActiveSectors',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)

export const getMinerSectorCount = ({
	binding,
	minerAddress,
	tipsetKey,
}: {
	binding: SourceBinding
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	lotusJsonRpc<LotusMinerSectorCount>({
		binding,
		method: 'Filecoin.StateMinerSectorCount',
		params: [
			minerAddress,
			tipsetKey,
		],
	})
)
