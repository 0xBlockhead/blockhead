import { getJson } from '$/lib/http.ts'
import NearBlocks from '$/sources/NearBlocks/index.ts'
import type {
	NearBlocksAccountResponse,
	NearBlocksBlockResponse,
	NearBlocksTransactionResponse,
} from '$/sources/NearBlocks/Rest/types.ts'

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
		{ origins: NearBlocks.origins  }
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
		{ origins: NearBlocks.origins  }
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
		{ origins: NearBlocks.origins  }
	)
)
