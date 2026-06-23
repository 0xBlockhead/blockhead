import { getJson } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { nearBlocksBindings } from '$/sources/NearBlocks/bindings.ts'
import type {
	NearBlocksAccountResponse,
	NearBlocksBlockResponse,
	NearBlocksTransactionResponse,
} from '$/sources/NearBlocks/Rest/types.ts'

export const nearBlocksMainnetRestEndpoints = [
	{
		url: nearBlocksBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'NearBlocks',
	},
] as const

export const nearBlocksOrigins = [
	...new Map(
		nearBlocksBindings
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
