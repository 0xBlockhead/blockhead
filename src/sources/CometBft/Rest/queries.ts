import { getJson } from '$/lib/http.ts'
import CometBft from '$/sources/CometBft/index.ts'
import type {
	CometBftBlockResponse,
	CometBftTxResponse,
} from '$/sources/CometBft/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getBlock = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	getJson<CometBftBlockResponse>(
		`${base(restBaseUrl)}/block?height=${height.toString()}`,
		{ origins: CometBft.origins ?? [] },
	)
)

export const getTx = ({
	restBaseUrl,
	txHash,
}: {
	restBaseUrl: string
	txHash: string
}) => (
	getJson<CometBftTxResponse>(
		`${base(restBaseUrl)}/tx?hash=0x${txHash.replace(/^0x/i, '')}`,
		{ origins: CometBft.origins ?? [] },
	)
)
