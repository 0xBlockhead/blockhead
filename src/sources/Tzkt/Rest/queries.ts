import { getJson } from '$/lib/http.ts'
import { tzktBindings } from '$/sources/Tzkt/bindings.ts'
import type {
	TzktBigMap,
	TzktBigMapKey,
	TzktBigMapUpdate,
	TzktBlock,
	TzktContract,
	TzktOperation,
} from '$/sources/Tzkt/Rest/types.ts'

export const tzktRestEndpoints = [
	{
		restBaseUrl: tzktBindings[0].endpoints[0].locator,
	},
] as const

export const tzktOrigins = [
	...new Map(
		tzktBindings
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

const base = (restBaseUrl: string) => (
	restBaseUrl.replace(/\/$/, '')
)

const queryString = (parameters: Record<string, string | number | undefined>) => (
	Object.entries(parameters)
		.flatMap(([key, value]) => (
			value == null ?
				[]
			:
				[[
					key,
					String(value),
				]]
		))
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&')
)

export const getBigMap = ({
	restBaseUrl,
	bigMapId,
	level,
}: {
	restBaseUrl: string
	bigMapId: bigint | number | string
	level?: bigint | number
}) => (
	getJson<TzktBigMap>(
		`${base(restBaseUrl)}/v1/bigmaps/${bigMapId}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`,
		{ origins: tzktOrigins }
	)
)

export const listBigMaps = ({
	restBaseUrl,
	contract,
	limit,
}: {
	restBaseUrl: string
	contract?: string
	limit?: number
}) => (
	getJson<TzktBigMap[]>(
		`${base(restBaseUrl)}/v1/bigmaps?${queryString({
			contract,
			limit,
		})}`,
		{ origins: tzktOrigins }
	)
)

export const getBigMapKey = ({
	restBaseUrl,
	bigMapId,
	keyHash,
	level,
}: {
	restBaseUrl: string
	bigMapId: bigint | number | string
	keyHash: string
	level?: bigint | number
}) => (
	getJson<TzktBigMapKey>(
		`${base(restBaseUrl)}/v1/bigmaps/${bigMapId}/keys/${keyHash}${(
			level == null ?
				''
			:
				`?${queryString({ level: String(level) })}`
		)}`,
		{ origins: tzktOrigins }
	)
)

export const listBigMapKeys = ({
	restBaseUrl,
	bigMapId,
	limit,
}: {
	restBaseUrl: string
	bigMapId: bigint | number | string
	limit?: number
}) => (
	getJson<TzktBigMapKey[]>(
		`${base(restBaseUrl)}/v1/bigmaps/${bigMapId}/keys?${queryString({
			limit,
		})}`,
		{ origins: tzktOrigins }
	)
)

export const listBigMapUpdates = ({
	restBaseUrl,
	bigMapId,
	keyHash,
	level,
	limit,
}: {
	restBaseUrl: string
	bigMapId?: bigint | number | string
	keyHash?: string
	level?: bigint | number
	limit?: number
}) => (
	getJson<TzktBigMapUpdate[]>(
		keyHash == null ?
			`${base(restBaseUrl)}/v1/bigmaps/updates?${queryString({
				bigmap: bigMapId == null ? undefined : String(bigMapId),
				level: level == null ? undefined : String(level),
				limit,
			})}`
		:
			`${base(restBaseUrl)}/v1/bigmaps/${bigMapId}/keys/${keyHash}/updates?${queryString({
				limit,
			})}`,
		{ origins: tzktOrigins }
	)
)

export const getContract = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<TzktContract>(
		`${base(restBaseUrl)}/v1/contracts/${address}`,
		{ origins: tzktOrigins }
	)
)

export const getBlock = ({
	restBaseUrl,
	level,
}: {
	restBaseUrl: string
	level: bigint | number
}) => (
	getJson<TzktBlock>(
		`${base(restBaseUrl)}/v1/blocks/${String(level)}`,
		{ origins: tzktOrigins }
	)
)

export const listOperationsByHash = ({
	restBaseUrl,
	operationHash,
}: {
	restBaseUrl: string
	operationHash: string
}) => (
	getJson<TzktOperation[]>(
		`${base(restBaseUrl)}/v1/operations/${operationHash}`,
		{ origins: tzktOrigins }
	)
)
