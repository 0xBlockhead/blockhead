import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	CometBftBlockResponse,
	CometBftTxResponse,
} from '$/sources/CometBft/Rest/types.ts'

export const getBlock = ({
	binding,
	height,
}: {
	binding: SourceBinding
	height: bigint
}) => (
	getJson<CometBftBlockResponse>(
		binding,
		`/block?height=${height.toString()}`
	)
)

export const getTx = ({
	binding,
	txHash,
}: {
	binding: SourceBinding
	txHash: string
}) => (
	getJson<CometBftTxResponse>(
		binding,
		`/tx?hash=0x${txHash.replace(/^0x/i, '')}`
	)
)
