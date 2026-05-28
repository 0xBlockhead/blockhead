import { corsFetch, throwHttpError } from '$/lib/http.ts'
import TronSolidityNode from '$/sources/TronSolidityNode/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronNodeAccount,
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

const tronSolidityNodePost = async <_Result>({
	restBaseUrl,
	path,
	body,
}: {
	restBaseUrl: string
	path: string
	body: JsonValue
}) => {
	const response = await corsFetch(`${base(restBaseUrl)}/${path}`, {
		origins: TronSolidityNode.origins ?? [],
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	})
	if (!response.ok) await throwHttpError(`TRON SolidityNode ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	tronSolidityNodePost<TronNodeBlock>({
		restBaseUrl,
		path: 'walletsolidity/getblockbynum',
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
	tronSolidityNodePost<TronNodeTransaction>({
		restBaseUrl,
		path: 'walletsolidity/gettransactionbyid',
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
	tronSolidityNodePost<TronNodeTransactionInfo>({
		restBaseUrl,
		path: 'walletsolidity/gettransactioninfobyid',
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
	tronSolidityNodePost<TronNodeAccount>({
		restBaseUrl,
		path: 'walletsolidity/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)
