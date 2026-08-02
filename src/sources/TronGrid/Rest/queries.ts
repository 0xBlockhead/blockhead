import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronNodeAccount,
	TronNodeAccountResource,
	TronNodeBlock,
	TronNodeChainParameters,
	TronNodeInfo,
	TronNodeTransaction,
	TronNodeTransactionInfo,
	TronNodeWitnesses,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import bindings from '$/sources/TronGrid/bindings.ts'
import type { TronGridAccountTransactions } from '$/sources/TronGrid/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TronGrid_Rest][0]

export const getRestEndpoints = () => [{
	url: firstHttpUrlForBinding(binding),
	transportType: TransportType.Http,
	providerName: 'TronGrid',
}]

const tronGridPost = async <_Result>({
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
	if (!response.ok) await throwHttpError(`TronGrid ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	height,
}: {
	height: bigint
}) => (
	tronGridPost<TronNodeBlock>({
		path: 'wallet/getblockbynum',
		body: {
			num: Number(height),
			visible: true,
		},
	})
)

export const getNowBlock = () => (
	tronGridPost<TronNodeBlock>({
		path: 'wallet/getnowblock',
		body: {
			visible: true,
		},
	})
)

export const getTransactionById = ({
	transactionId,
}: {
	transactionId: string
}) => (
	tronGridPost<TronNodeTransaction>({
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
	tronGridPost<TronNodeTransactionInfo>({
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
	tronGridPost<TronNodeAccount>({
		path: 'wallet/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountResource = ({
	address,
}: {
	address: string
}) => (
	tronGridPost<TronNodeAccountResource>({
		path: 'wallet/getaccountresource',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountTransactions = ({
	address,
	limit,
}: {
	address: string
	limit: number
}) => (
	sourceGetJson<TronGridAccountTransactions>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/v1/accounts/${address}/transactions?limit=${limit.toString()}`
	)
)

export const listWitnesses = () => (
	tronGridPost<TronNodeWitnesses>({
		path: 'wallet/listwitnesses',
		body: {
			visible: true,
		},
	})
)

export const getChainParameters = () => (
	tronGridPost<TronNodeChainParameters>({
		path: 'wallet/getchainparameters',
		body: {},
	})
)

export const getNodeInfo = () => (
	tronGridPost<TronNodeInfo>({
		path: 'wallet/getnodeinfo',
		body: {},
	})
)
