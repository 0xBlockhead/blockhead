import { getJson } from '$/lib/http.ts'
import type {
	CometBftBlockResponse,
	CometBftTxResponse,
} from '$/sources/CometBft/Rest/types.ts'

const cometBftOrigins = [
	{
		origin: 'https://cosmos-rpc.publicnode.com',
		corsEnabled: true,
	},
] as const

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
		{ origins: cometBftOrigins }
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
		{ origins: cometBftOrigins }
	)
)
