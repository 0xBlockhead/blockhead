import { getJson } from '$/lib/http.ts'
import MempoolSpace from '$/sources/MempoolSpace/index.ts'
import type {
	MempoolSpaceBlock,
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
