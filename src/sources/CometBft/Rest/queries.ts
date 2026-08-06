import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	CometBftBlockResponse,
	CometBftTxResponse,
} from '$/sources/CometBft/Rest/types.ts'
import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CometBft_Rest][0]

export const getBlock = ({
	height,
}: {
	height: bigint
}) => (
	getJson<CometBftBlockResponse>(
		binding,
		`/block?height=${height.toString()}`
	)
)

export const getBlockByHash = ({
	hash,
}: {
	hash: string
}) => (
	getJson<CometBftBlockResponse>(
		binding,
		`/block_by_hash?hash=0x${hash.replace(/^0x/i, '')}`
	)
)

export const getTx = ({
	txHash,
}: {
	txHash: string
}) => (
	getJson<CometBftTxResponse>(
		binding,
		`/tx?hash=0x${txHash.replace(/^0x/i, '')}`
	)
)
