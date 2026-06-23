import { getJson } from '$/lib/http.ts'
import {
	esploraBindings,
	esploraRestBaseUrlByNetworkKey,
} from '$/sources/Esplora/bindings.ts'
import type {
	EsploraAsset,
	EsploraBlock,
	EsploraTransaction,
} from '$/sources/Esplora/Rest/types.ts'

export {
	esploraRestBaseUrlByNetworkKey,
}

export const esploraOrigins = [
	...new Map(
		esploraBindings
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
		{ origins: esploraOrigins  }
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
		{ origins: esploraOrigins  }
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
		{ origins: esploraOrigins  }
	)
)

export const getMempoolTransactionIds = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<string[]>(
		`${base(restBaseUrl)}/mempool/txids`,
		{ origins: esploraOrigins  }
	)
)

export const getAsset = ({
	restBaseUrl,
	assetId,
}: {
	restBaseUrl: string
	assetId: string
}) => (
	getJson<EsploraAsset>(
		`${base(restBaseUrl)}/asset/${assetId}`,
		{ origins: esploraOrigins }
	)
)

export const listRegistryAssets = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<EsploraAsset[]>(
		`${base(restBaseUrl)}/assets/registry`,
		{ origins: esploraOrigins }
	)
)
