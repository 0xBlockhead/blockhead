import { getJson } from '$/lib/http.ts'
import MempoolSpace from '$/sources/MempoolSpace/index.ts'
import type {
	MempoolSpaceAddress,
	MempoolSpaceBlock,
	MempoolSpaceMempoolStats,
	MempoolSpaceRecommendedFees,
	MempoolSpaceTransaction,
} from '$/sources/MempoolSpace/Rest/types.ts'

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
		{ origins: MempoolSpace.origins ?? [] },
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
		{ origins: MempoolSpace.origins ?? [] },
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
		{ origins: MempoolSpace.origins ?? [] },
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
		{ origins: MempoolSpace.origins ?? [] },
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
		startHeight != null
			? `${base(restBaseUrl)}/v1/blocks/${startHeight.toString()}`
			:
				`${base(restBaseUrl)}/v1/blocks`,
		{ origins: MempoolSpace.origins ?? [] },
	)
)

export const getMempoolStats = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<MempoolSpaceMempoolStats>(
		`${base(restBaseUrl)}/mempool`,
		{ origins: MempoolSpace.origins ?? [] },
	)
)

export const getMempoolTxids = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<string[]>(
		`${base(restBaseUrl)}/mempool/txids`,
		{ origins: MempoolSpace.origins ?? [] },
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
		{ origins: MempoolSpace.origins ?? [] },
	)
)

export const getRecommendedFees = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<MempoolSpaceRecommendedFees>(
		`${base(restBaseUrl)}/v1/fees/recommended`,
		{ origins: MempoolSpace.origins ?? [] },
	)
)
