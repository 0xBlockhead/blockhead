import { getJson } from '$/lib/http.ts'
import { tronScanBindings } from '$/sources/TronScan/bindings.ts'
import type {
	TronScanAccount,
	TronScanAccountTokens,
	TronScanBlocks,
	TronScanContractDetail,
	TronScanTokenOverview,
	TronScanTransactionDetail,
	TronScanTrc10Tokens,
	TronScanTrc20Transfers,
} from '$/sources/TronScan/Rest/types.ts'

export const tronScanRestEndpoints = [
	{
		slug: 'tronscan',
		restBaseUrl: tronScanBindings[0].endpoints[0].locator,
	},
] as const

export const tronScanOrigins = [
	...new Map(
		tronScanBindings
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

export const getBlock = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	getJson<TronScanBlocks>(
		`${base(restBaseUrl)}/api/block?number=${height.toString()}&limit=1`,
		{ origins: tronScanOrigins }
	)
)

export const getAccount = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<TronScanAccount>(
		`${base(restBaseUrl)}/api/accountv2?address=${address}`,
		{ origins: tronScanOrigins }
	)
)

export const getAccountTokens = ({
	restBaseUrl,
	address,
	limit,
}: {
	restBaseUrl: string
	address: string
	limit: number
}) => (
	getJson<TronScanAccountTokens>(
		`${base(restBaseUrl)}/api/account/tokens?address=${address}&start=0&limit=${limit.toString()}&hidden=1&show=3`,
		{ origins: tronScanOrigins }
	)
)

export const getTransaction = ({
	restBaseUrl,
	transactionId,
}: {
	restBaseUrl: string
	transactionId: string
}) => (
	getJson<TronScanTransactionDetail>(
		`${base(restBaseUrl)}/api/transaction-info?hash=${transactionId}`,
		{ origins: tronScanOrigins }
	)
)

export const getContract = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<TronScanContractDetail>(
		`${base(restBaseUrl)}/api/contract?contract=${address}`,
		{ origins: tronScanOrigins }
	)
)

export const getTokenOverview = ({
	restBaseUrl,
	tokenId,
}: {
	restBaseUrl: string
	tokenId: string
}) => (
	getJson<TronScanTokenOverview>(
		`${base(restBaseUrl)}/api/tokens/overview?start=0&limit=1&verifier=all&showAll=1&field=&token=${tokenId}`,
		{ origins: tronScanOrigins }
	)
)

export const getTrc10Token = ({
	restBaseUrl,
	tokenId,
}: {
	restBaseUrl: string
	tokenId: string
}) => (
	getJson<TronScanTrc10Tokens>(
		`${base(restBaseUrl)}/api/token?id=${tokenId}&showAll=1&limit=1`,
		{ origins: tronScanOrigins }
	)
)

export const getTrc20Transfers = ({
	restBaseUrl,
	transactionId,
	limit,
}: {
	restBaseUrl: string
	transactionId: string
	limit: number
}) => (
	getJson<TronScanTrc20Transfers>(
		`${base(restBaseUrl)}/api/token_trc20/transfers?hash=${transactionId}&limit=${limit.toString()}&start=0`,
		{ origins: tronScanOrigins }
	)
)
