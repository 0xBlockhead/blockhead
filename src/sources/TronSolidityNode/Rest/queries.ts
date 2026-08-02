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
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import bindings from '$/sources/TronSolidityNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TronSolidityNode_Rest][0]

const tronSolidityNodePost = async <_Result>({
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
	if (!response.ok) await throwHttpError(`TRON SolidityNode ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	height,
}: {
	height: bigint
}) => (
	tronSolidityNodePost<TronNodeBlock>({
		path: 'walletsolidity/getblockbynum',
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
	tronSolidityNodePost<TronNodeTransaction>({
		path: 'walletsolidity/gettransactionbyid',
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
	tronSolidityNodePost<TronNodeTransactionInfo>({
		path: 'walletsolidity/gettransactioninfobyid',
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
	tronSolidityNodePost<TronNodeAccount>({
		path: 'walletsolidity/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)
