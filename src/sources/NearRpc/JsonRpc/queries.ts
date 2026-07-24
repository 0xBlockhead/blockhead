import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
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
	binding,
	method,
	params,
}: {
	binding: SourceBinding
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
	binding,
	blockId,
}: {
	binding: SourceBinding
	blockId: bigint | string | 'final'
}) => (
	nearJsonRpc<NearRpcBlock>({
		binding,
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
	binding,
	txHash,
	senderAccountId,
}: {
	binding: SourceBinding
	txHash: string
	senderAccountId: string
}) => (
	nearJsonRpc<NearRpcTransactionStatus>({
		binding,
		method: 'tx',
		params: {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		},
	})
)

export const getTxStatus = ({
	binding,
	txHash,
	senderAccountId,
}: {
	binding: SourceBinding
	txHash: string
	senderAccountId: string
}) => (
	nearJsonRpc<NearRpcTransactionStatus>({
		binding,
		method: 'EXPERIMENTAL_tx_status',
		params: {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		},
	})
)

export const getReceipt = ({
	binding,
	receiptId,
}: {
	binding: SourceBinding
	receiptId: string
}) => (
	nearJsonRpc<NearRpcReceipt>({
		binding,
		method: 'EXPERIMENTAL_receipt',
		params: {
			receipt_id: receiptId,
		},
	})
)

export const getChunk = ({
	binding,
	chunkHash,
}: {
	binding: SourceBinding
	chunkHash: string
}) => (
	nearJsonRpc<NearRpcChunk>({
		binding,
		method: 'chunk',
		params: {
			chunk_id: chunkHash,
		},
	})
)

export const viewAccount = ({
	binding,
	accountId,
}: {
	binding: SourceBinding
	accountId: string
}) => (
	nearJsonRpc<NearRpcAccount>({
		binding,
		method: 'query',
		params: {
			request_type: 'view_account',
			finality: 'final',
			account_id: accountId,
		},
	})
)

export const viewAccessKeyList = ({
	binding,
	accountId,
}: {
	binding: SourceBinding
	accountId: string
}) => (
	nearJsonRpc<NearRpcAccessKeyList>({
		binding,
		method: 'query',
		params: {
			request_type: 'view_access_key_list',
			finality: 'final',
			account_id: accountId,
		},
	})
)

export const viewAccessKey = ({
	binding,
	accountId,
	publicKey,
}: {
	binding: SourceBinding
	accountId: string
	publicKey: string
}) => (
	nearJsonRpc<NearRpcAccessKey>({
		binding,
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
	binding,
	accountId,
	prefixBase64,
	blockHeight,
}: {
	binding: SourceBinding
	accountId: string
	prefixBase64: string
	blockHeight: number
}) => (
	nearJsonRpc<NearRpcViewState>({
		binding,
		method: 'query',
		params: {
			request_type: 'view_state',
			block_id: blockHeight,
			account_id: accountId,
			prefix_base64: prefixBase64,
		},
	})
)

export const getValidators = ({ binding }: { binding: SourceBinding }) => (
	nearJsonRpc<NearRpcValidators>({
		binding,
		method: 'validators',
		params: [null],
	})
)

export const getGasPrice = ({ binding }: { binding: SourceBinding }) => (
	nearJsonRpc<NearRpcGasPrice>({
		binding,
		method: 'gas_price',
		params: [null],
	})
)

export const getStatus = ({ binding }: { binding: SourceBinding }) => (
	nearJsonRpc<NearRpcStatus>({
		binding,
		method: 'status',
		params: [],
	})
)
