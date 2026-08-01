import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { jsonRpcVersion } from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	NearRpcAccount,
	NearRpcAccessKey,
	NearRpcAccessKeyList,
	NearRpcBlock,
	NearRpcChunk,
	NearRpcGasPrice,
	NearRpcReceipt,
	NearRpcStatus,
	NearRpcTransactionStatus,
	NearRpcValidators,
	NearRpcViewState,
} from '$/sources/NearRpc/JsonRpc/types.ts'
import bindings from '$/sources/NearRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NearRpc_JsonRpc]

export const nearRpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'NEAR',
}))

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

const nearJsonRpc = async <_Result>({
	method,
	params,
}: {
	method: string
	params: JsonValue
}) => {
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 'dontcare',
				method,
				params,
			}),
		}
	)
	if (!response.ok) await throwHttpError(`NEAR ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`NEAR ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`NEAR ${method}: missing result`)
	return json.result
}

export const getBlock = ({
	blockId,
}: {
	blockId: bigint | string | 'final'
}) => (
	nearJsonRpc<NearRpcBlock>({
		method: 'block',
		params: (
			blockId === 'final' ?
				{
					finality: 'final',
				}
			:
				{
					block_id: typeof blockId === 'bigint' ? Number(blockId) : blockId,
				}
		),
	})
)

export const getTx = ({
	txHash,
	senderAccountId,
}: {
	txHash: string
	senderAccountId: string
}) => (
	nearJsonRpc<NearRpcTransactionStatus>({
		method: 'tx',
		params: {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		},
	})
)

export const getTxStatus = ({
	txHash,
	senderAccountId,
}: {
	txHash: string
	senderAccountId: string
}) => (
	nearJsonRpc<NearRpcTransactionStatus>({
		method: 'EXPERIMENTAL_tx_status',
		params: {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		},
	})
)

export const getReceipt = ({
	receiptId,
}: {
	receiptId: string
}) => (
	nearJsonRpc<NearRpcReceipt>({
		method: 'EXPERIMENTAL_receipt',
		params: {
			receipt_id: receiptId,
		},
	})
)

export const getChunk = ({
	chunkHash,
}: {
	chunkHash: string
}) => (
	nearJsonRpc<NearRpcChunk>({
		method: 'chunk',
		params: {
			chunk_id: chunkHash,
		},
	})
)

export const viewAccount = ({
	accountId,
}: {
	accountId: string
}) => (
	nearJsonRpc<NearRpcAccount>({
		method: 'query',
		params: {
			request_type: 'view_account',
			finality: 'final',
			account_id: accountId,
		},
	})
)

export const viewAccessKeyList = ({
	accountId,
}: {
	accountId: string
}) => (
	nearJsonRpc<NearRpcAccessKeyList>({
		method: 'query',
		params: {
			request_type: 'view_access_key_list',
			finality: 'final',
			account_id: accountId,
		},
	})
)

export const viewAccessKey = ({
	accountId,
	publicKey,
}: {
	accountId: string
	publicKey: string
}) => (
	nearJsonRpc<NearRpcAccessKey>({
		method: 'query',
		params: {
			request_type: 'view_access_key',
			finality: 'final',
			account_id: accountId,
			public_key: publicKey,
		},
	})
)

export const viewState = ({
	accountId,
	prefixBase64,
	blockHeight,
}: {
	accountId: string
	prefixBase64: string
	blockHeight: number
}) => (
	nearJsonRpc<NearRpcViewState>({
		method: 'query',
		params: {
			request_type: 'view_state',
			block_id: blockHeight,
			account_id: accountId,
			prefix_base64: prefixBase64,
		},
	})
)

export const getValidators = () => (
	nearJsonRpc<NearRpcValidators>({
		method: 'validators',
		params: [null],
	})
)

export const getGasPrice = () => (
	nearJsonRpc<NearRpcGasPrice>({
		method: 'gas_price',
		params: [null],
	})
)

export const getStatus = () => (
	nearJsonRpc<NearRpcStatus>({
		method: 'status',
		params: [],
	})
)
