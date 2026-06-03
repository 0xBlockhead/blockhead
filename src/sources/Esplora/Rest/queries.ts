import { getJson } from '$/lib/http.ts'
import Esplora from '$/sources/Esplora/index.ts'
import type {
	EsploraBlock,
	EsploraTransaction,
} from '$/sources/Esplora/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getBlock = ({
	restBaseUrl,
	blockHash,
}: {
	restBaseUrl: string
	blockHash: string
}) => (
	getJson<EsploraBlock>(
		`${base(restBaseUrl)}/block/${blockHash}`,
		{ origins: Esplora.origins  },
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
		{ origins: Esplora.origins  },
	)
)

export const getTransaction = ({
	restBaseUrl,
	txId,
}: {
	restBaseUrl: string
	txId: string
}) => (
	getJson<EsploraTransaction>(
		`${base(restBaseUrl)}/tx/${txId}`,
		{ origins: Esplora.origins  },
	)
)

export const getMempoolTransactionIds = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<string[]>(
		`${base(restBaseUrl)}/mempool/txids`,
		{ origins: Esplora.origins  },
	)
)
