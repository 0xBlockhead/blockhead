import { getJson } from '$/lib/http.ts'
import { mempoolSpaceBindings } from '$/sources/MempoolSpace/bindings.ts'
import type {
	MempoolSpaceAddress,
	MempoolSpaceBlock,
	MempoolSpaceMempoolStats,
	MempoolSpaceRecommendedFees,
	MempoolSpaceTransaction,
} from '$/sources/MempoolSpace/Rest/types.ts'

const mempoolSpaceOrigins = mempoolSpaceBindings[0].endpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getBlock = ({
	restBaseUrl,
	blockHash,
}: {
	restBaseUrl: string
	blockHash: string
}) => (
	getJson<MempoolSpaceBlock>(
		`${base(restBaseUrl)}/block/${blockHash}`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getBlockHashByHeight = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	getJson<string>(
		`${base(restBaseUrl)}/block-height/${height.toString()}`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getBlockTransactionIds = ({
	restBaseUrl,
	blockHash,
}: {
	restBaseUrl: string
	blockHash: string
}) => (
	getJson<string[]>(
		`${base(restBaseUrl)}/block/${blockHash}/txids`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getTransaction = ({
	restBaseUrl,
	txId,
}: {
	restBaseUrl: string
	txId: string
}) => (
	getJson<MempoolSpaceTransaction>(
		`${base(restBaseUrl)}/tx/${txId}`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getBlocks = ({
	restBaseUrl,
	startHeight,
}: {
	restBaseUrl: string
	startHeight?: bigint
}) => (
	getJson<MempoolSpaceBlock[]>(
		startHeight != null ?
			`${base(restBaseUrl)}/v1/blocks/${startHeight.toString()}`
		:
			`${base(restBaseUrl)}/v1/blocks`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getMempoolStats = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<MempoolSpaceMempoolStats>(
		`${base(restBaseUrl)}/mempool`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getMempoolTxids = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<string[]>(
		`${base(restBaseUrl)}/mempool/txids`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getAddress = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<MempoolSpaceAddress>(
		`${base(restBaseUrl)}/address/${address}`,
		{ origins: mempoolSpaceOrigins }
	)
)

export const getRecommendedFees = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<MempoolSpaceRecommendedFees>(
		`${base(restBaseUrl)}/v1/fees/recommended`,
		{ origins: mempoolSpaceOrigins }
	)
)
