import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import NearRpc from '$/sources/NearRpc/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	NearRpcAccount,
	NearRpcAccessKey,
	NearRpcAccessKeyList,
	NearRpcBlock,
	NearRpcChunk,
	NearRpcGasPrice,
	NearRpcStatus,
	NearRpcTransactionStatus,
	NearRpcValidators,
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
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: NearRpc.origins ?? [],
		init: {
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
		},
	})
	if (!response.ok) await throwHttpError(`NEAR ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`NEAR ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`NEAR ${method}: missing result`)
	return json.result
}

export const getBlock = ({
	rpcUrl,
	blockId,
}: {
	rpcUrl: string
	blockId: bigint | string | 'final'
}) => (
	nearJsonRpc<NearRpcBlock>({
		rpcUrl,
		method: 'block',
		params: (
			blockId === 'final' ?
				{
					finality: 'final',
				}
			:
				{
					block_id: typeof blockId === 'bigint' ? Number(blockId)
					:
						blockId,
				}
		),
	})
)

export const getTx = ({
	rpcUrl,
	txHash,
	senderAccountId,
}: {
	rpcUrl: string
	txHash: string
	senderAccountId: string
}) => (
	nearJsonRpc<NearRpcTransactionStatus>({
		rpcUrl,
		method: 'tx',
		params: {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		},
	})
)

export const getTxStatus = ({
	rpcUrl,
	txHash,
	senderAccountId,
}: {
	rpcUrl: string
	txHash: string
	senderAccountId: string
}) => (
	nearJsonRpc<NearRpcTransactionStatus>({
		rpcUrl,
		method: 'EXPERIMENTAL_tx_status',
		params: {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		},
	})
)

export const getChunk = ({
	rpcUrl,
	chunkHash,
}: {
	rpcUrl: string
	chunkHash: string
}) => (
	nearJsonRpc<NearRpcChunk>({
		rpcUrl,
		method: 'chunk',
		params: {
			chunk_id: chunkHash,
		},
	})
)

export const viewAccount = ({
	rpcUrl,
	accountId,
}: {
	rpcUrl: string
	accountId: string
}) => (
	nearJsonRpc<NearRpcAccount>({
		rpcUrl,
		method: 'query',
		params: {
			request_type: 'view_account',
			finality: 'final',
			account_id: accountId,
		},
	})
)

export const viewAccessKeyList = ({
	rpcUrl,
	accountId,
}: {
	rpcUrl: string
	accountId: string
}) => (
	nearJsonRpc<NearRpcAccessKeyList>({
		rpcUrl,
		method: 'query',
		params: {
			request_type: 'view_access_key_list',
			finality: 'final',
			account_id: accountId,
		},
	})
)

export const viewAccessKey = ({
	rpcUrl,
	accountId,
	publicKey,
}: {
	rpcUrl: string
	accountId: string
	publicKey: string
}) => (
	nearJsonRpc<NearRpcAccessKey>({
		rpcUrl,
		method: 'query',
		params: {
			request_type: 'view_access_key',
			finality: 'final',
			account_id: accountId,
			public_key: publicKey,
		},
	})
)

export const getValidators = ({ rpcUrl }: { rpcUrl: string }) => (
	nearJsonRpc<NearRpcValidators>({
		rpcUrl,
		method: 'validators',
		params: [null],
	})
)

export const getGasPrice = ({ rpcUrl }: { rpcUrl: string }) => (
	nearJsonRpc<NearRpcGasPrice>({
		rpcUrl,
		method: 'gas_price',
		params: [null],
	})
)

export const getStatus = ({ rpcUrl }: { rpcUrl: string }) => (
	nearJsonRpc<NearRpcStatus>({
		rpcUrl,
		method: 'status',
		params: [],
	})
)
