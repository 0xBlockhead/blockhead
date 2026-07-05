import {
	corsFetch,
	getJson,
	throwHttpError,
} from '$/lib/http.ts'
import { tronGridBindings } from '$/sources/TronGrid/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronGridAccountTransactions,
	TronGridTrc20Transfers,
	TronNodeAccount,
	TronNodeAccountResource,
	TronNodeBlock,
	TronNodeChainParameters,
	TronNodeInfo,
	TronNodeTransaction,
	TronNodeTransactionInfo,
	TronNodeWitnesses,
} from '$/sources/TronGrid/Rest/types.ts'

export const tronGridRestEndpoints = [
	{
		slug: 'trongrid',
		restBaseUrl: tronGridBindings[0].endpoints[0].locator,
	},
] as const

export const tronGridOrigins = [
	...new Map(
		tronGridBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

const tronGridPost = async <_Result>({
	restBaseUrl,
	path,
	body,
}: {
	restBaseUrl: string
	path: string
	body: JsonValue
}) => {
	const response = await corsFetch(`${base(restBaseUrl)}/${path}`, {
		origins: tronGridOrigins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	})
	if (!response.ok) await throwHttpError(`TronGrid ${path}`, response)
	return response.json<_Result>()
}

export const getBlockByNumber = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	tronGridPost<TronNodeBlock>({
		restBaseUrl,
		path: 'wallet/getblockbynum',
		body: {
			num: Number(height),
			visible: true,
		},
	})
)

export const getNowBlock = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	tronGridPost<TronNodeBlock>({
		restBaseUrl,
		path: 'wallet/getnowblock',
		body: {
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
	tronGridPost<TronNodeTransaction>({
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
	tronGridPost<TronNodeTransactionInfo>({
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
	tronGridPost<TronNodeAccount>({
		restBaseUrl,
		path: 'wallet/getaccount',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountResource = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	tronGridPost<TronNodeAccountResource>({
		restBaseUrl,
		path: 'wallet/getaccountresource',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountTransactions = ({
	restBaseUrl,
	address,
	limit,
}: {
	restBaseUrl: string
	address: string
	limit: number
}) => (
	getJson<TronGridAccountTransactions>(
		`${base(restBaseUrl)}/v1/accounts/${address}/transactions?limit=${limit.toString()}`,
		{ origins: tronGridOrigins }
	)
)

export const listWitnesses = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	tronGridPost<TronNodeWitnesses>({
		restBaseUrl,
		path: 'wallet/listwitnesses',
		body: {
			visible: true,
		},
	})
)

export const getChainParameters = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	tronGridPost<TronNodeChainParameters>({
		restBaseUrl,
		path: 'wallet/getchainparameters',
		body: {},
	})
)

export const getNodeInfo = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	tronGridPost<TronNodeInfo>({
		restBaseUrl,
		path: 'wallet/getnodeinfo',
		body: {},
	})
)

export const getAccountTrc20Transfers = ({
	restBaseUrl,
	address,
	limit,
}: {
	restBaseUrl: string
	address: string
	limit: number
}) => (
	getJson<TronGridTrc20Transfers>(
		`${base(restBaseUrl)}/v1/accounts/${address}/transactions/trc20?limit=${limit.toString()}`,
		{ origins: tronGridOrigins }
	)
)
