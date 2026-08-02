import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronNodeAccount,
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'
import bindings from '$/sources/TronFullNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TronFullNode_Rest][0]

const tronFullNodePost = async <_Result>({
	path,
	body,
}: {
	path: string
	body: JsonValue
}) => {
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/${path}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}
	)
	if (!response.ok) await throwHttpError(`TRON FullNode ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	height,
}: {
	height: bigint
}) => (
	tronFullNodePost<TronNodeBlock>({
		path: 'wallet/getblockbynum',
		body: {
			num: Number(height),
			visible: true,
		},
	})
)

export const getTransactionById = ({
	transactionId,
}: {
	transactionId: string
}) => (
	tronFullNodePost<TronNodeTransaction>({
		path: 'wallet/gettransactionbyid',
		body: {
			value: transactionId,
			visible: true,
		},
	})
)

export const getTransactionInfoById = ({
	transactionId,
}: {
	transactionId: string
}) => (
	tronFullNodePost<TronNodeTransactionInfo>({
		path: 'wallet/gettransactioninfobyid',
		body: {
			value: transactionId,
		},
	})
)

export const getAccount = ({
	address,
}: {
	address: string
}) => (
	tronFullNodePost<TronNodeAccount>({
		path: 'wallet/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)
