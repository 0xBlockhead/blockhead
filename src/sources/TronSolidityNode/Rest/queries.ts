import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { tronSolidityNodeBindings } from '$/sources/TronSolidityNode/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	TronNodeAccount,
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'

export const tronSolidityNodeRestEndpoints = [
	{
		slug: 'solidity_node_local',
		restBaseUrl: tronSolidityNodeBindings[0].endpoints[0].locator,
	},
] as const

export const tronSolidityNodeOrigins = [
	...new Map(
		tronSolidityNodeBindings
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
		origins: tronSolidityNodeOrigins,
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
