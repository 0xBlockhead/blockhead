import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronGridAccountTransactions,
	TronNodeAccount,
	TronNodeAccountResource,
	TronNodeBlock,
	TronNodeChainParameters,
	TronNodeInfo,
	TronNodeTransaction,
	TronNodeTransactionInfo,
	TronNodeWitnesses,
} from '$/sources/TronGrid/Rest/types.ts'

const tronGridPost = async <_Result>({
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
	if (!response.ok) await throwHttpError(`TronGrid ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	binding,
	height,
}: {
	binding: SourceBinding
	height: bigint
}) => (
	tronGridPost<TronNodeBlock>({
		binding,
		path: 'wallet/getblockbynum',
		body: {
			num: Number(height),
			visible: true,
		},
	})
)

export const getNowBlock = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	tronGridPost<TronNodeBlock>({
		binding,
		path: 'wallet/getnowblock',
		body: {
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
	tronGridPost<TronNodeTransaction>({
		binding,
		path: 'wallet/gettransactionbyid',
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
	tronGridPost<TronNodeTransactionInfo>({
		binding,
		path: 'wallet/gettransactioninfobyid',
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
	tronGridPost<TronNodeAccount>({
		binding,
		path: 'wallet/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountResource = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: string
}) => (
	tronGridPost<TronNodeAccountResource>({
		binding,
		path: 'wallet/getaccountresource',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountTransactions = ({
	binding,
	address,
	limit,
}: {
	binding: SourceBinding
	address: string
	limit: number
}) => (
	sourceGetJson<TronGridAccountTransactions>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/v1/accounts/${address}/transactions?limit=${limit.toString()}`
	)
)

export const listWitnesses = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	tronGridPost<TronNodeWitnesses>({
		binding,
		path: 'wallet/listwitnesses',
		body: {
			visible: true,
		},
	})
)

export const getChainParameters = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	tronGridPost<TronNodeChainParameters>({
		binding,
		path: 'wallet/getchainparameters',
		body: {},
	})
)

export const getNodeInfo = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	tronGridPost<TronNodeInfo>({
		binding,
		path: 'wallet/getnodeinfo',
		body: {},
	})
)
