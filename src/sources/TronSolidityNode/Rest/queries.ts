import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
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

const tronSolidityNodePost = async <_Result>({
	binding,
	path,
	body,
}: {
	binding: SourceBinding
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
	binding,
	height,
}: {
	binding: SourceBinding
	height: bigint
}) => (
	tronSolidityNodePost<TronNodeBlock>({
		binding,
		path: 'walletsolidity/getblockbynum',
		body: {
			num: Number(height),
			visible: true,
		},
	})
)

export const getTransactionById = ({
	binding,
	transactionId,
}: {
	binding: SourceBinding
	transactionId: string
}) => (
	tronSolidityNodePost<TronNodeTransaction>({
		binding,
		path: 'walletsolidity/gettransactionbyid',
		body: {
			value: transactionId,
			visible: true,
		},
	})
)

export const getTransactionInfoById = ({
	binding,
	transactionId,
}: {
	binding: SourceBinding
	transactionId: string
}) => (
	tronSolidityNodePost<TronNodeTransactionInfo>({
		binding,
		path: 'walletsolidity/gettransactioninfobyid',
		body: {
			value: transactionId,
		},
	})
)

export const getAccount = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => (
	tronSolidityNodePost<TronNodeAccount>({
		binding,
		path: 'walletsolidity/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)
