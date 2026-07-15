import { getJson } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import type {
	NearBlocksAccountResponse,
	NearBlocksBlockResponse,
	NearBlocksTransactionResponse,
} from '$/sources/NearBlocks/Rest/types.ts'

export const nearBlocksMainnetRestEndpoints = [
	{
		url: 'https://api.nearblocks.io',
		transportType: TransportType.Http,
		providerName: 'NearBlocks',
	},
] as const

export const nearBlocksOrigins = [
	{
		origin: 'https://api.nearblocks.io',
		corsEnabled: true,
	},
] as const

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getAccount = ({
	restBaseUrl,
	accountId,
}: {
	restBaseUrl: string
	accountId: string
}) => (
	getJson<NearBlocksAccountResponse>(
		`${base(restBaseUrl)}/v1/account/${encodeURIComponent(accountId)}`,
		{ origins: nearBlocksOrigins }
	)
)

export const getBlock = ({
	restBaseUrl,
	block,
}: {
	restBaseUrl: string
	block: bigint | string
}) => (
	getJson<NearBlocksBlockResponse>(
		`${base(restBaseUrl)}/v1/blocks/${encodeURIComponent(String(block))}`,
		{ origins: nearBlocksOrigins }
	)
)

export const getTransaction = ({
	restBaseUrl,
	transactionHash,
}: {
	restBaseUrl: string
	transactionHash: string
}) => (
	getJson<NearBlocksTransactionResponse>(
		`${base(restBaseUrl)}/v1/txns/${encodeURIComponent(transactionHash)}`,
		{ origins: nearBlocksOrigins }
	)
)
