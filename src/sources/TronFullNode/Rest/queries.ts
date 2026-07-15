import { corsFetch, throwHttpError } from '$/lib/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronNodeAccount,
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'

export const tronFullNodeRestEndpoints = [
	{
		slug: 'full_node_local',
		restBaseUrl: 'http://127.0.0.1:8090',
	},
] as const

export const tronFullNodeOrigins = [
	{
		origin: 'http://127.0.0.1:8090',
		corsEnabled: false,
	},
] as const

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

const tronFullNodePost = async <_Result>({
	restBaseUrl,
	path,
	body,
}: {
	restBaseUrl: string
	path: string
	body: JsonValue
}) => {
	const response = await corsFetch(`${base(restBaseUrl)}/${path}`, {
		origins: tronFullNodeOrigins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	})
	if (!response.ok) await throwHttpError(`TRON FullNode ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	tronFullNodePost<TronNodeBlock>({
		restBaseUrl,
		path: 'wallet/getblockbynum',
		body: {
			num: Number(height),
			visible: true,
		},
	})
)

export const getTransactionById = ({
	restBaseUrl,
	transactionId,
}: {
	restBaseUrl: string
	transactionId: string
}) => (
	tronFullNodePost<TronNodeTransaction>({
		restBaseUrl,
		path: 'wallet/gettransactionbyid',
		body: {
			value: transactionId,
			visible: true,
		},
	})
)

export const getTransactionInfoById = ({
	restBaseUrl,
	transactionId,
}: {
	restBaseUrl: string
	transactionId: string
}) => (
	tronFullNodePost<TronNodeTransactionInfo>({
		restBaseUrl,
		path: 'wallet/gettransactioninfobyid',
		body: {
			value: transactionId,
		},
	})
)

export const getAccount = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	tronFullNodePost<TronNodeAccount>({
		restBaseUrl,
		path: 'wallet/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)
