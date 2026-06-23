import { getJson } from '$/lib/http.ts'
import type { EvmAddress } from '$/schema/ZeroExHex.ts'
import { zeroGMainnetStorageEndpoints } from '$/sources/ZeroG/StorageScan/Rest/endpoints.ts'
import { zeroGOrigins } from '$/sources/ZeroG/index.ts'
import type {
	ZeroGStorageScanList,
	ZeroGStorageScanMiner,
	ZeroGStorageScanMinerInfo,
	ZeroGStorageScanResponse,
	ZeroGStorageScanSummary,
	ZeroGStorageScanTransaction,
} from '$/sources/ZeroG/StorageScan/Rest/types.ts'

const storageScanUrl = ({
	path,
	searchParams,
}: {
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(path, zeroGMainnetStorageEndpoints[0].url)
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	return url.toString()
}

const getStorageScanData = async <_Data>({
	path,
	searchParams,
}: {
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const response = await getJson<ZeroGStorageScanResponse<_Data>>(
		storageScanUrl({
			path,
			searchParams,
		}),
		{ origins: zeroGOrigins }
	)
	if (response.code !== 0) throw new Error(`ZeroGStorageScan_Rest: ${response.message}`)
	return response.data
}

export const getStorageSummary = () => (
	getStorageScanData<ZeroGStorageScanSummary>({
		path: '/api/stats/summary',
	})
)

export const listStorageTransactions = ({
	limit,
	skip,
	rootHash,
	txHash,
}: {
	limit: number
	skip?: number
	rootHash?: string
	txHash?: string
}) => (
	getStorageScanData<ZeroGStorageScanList<ZeroGStorageScanTransaction>>({
		path: '/api/txs',
		searchParams: {
			limit,
			skip,
			rootHash,
			txHash,
		},
	})
)

export const getStorageTransaction = ({
	txSeq,
}: {
	txSeq: string | number | bigint
}) => (
	getStorageScanData<ZeroGStorageScanTransaction>({
		path: `/api/txs/${txSeq.toString()}`,
	})
)

export const listStorageMiners = ({
	limit,
	skip,
}: {
	limit: number
	skip?: number
}) => (
	getStorageScanData<ZeroGStorageScanList<ZeroGStorageScanMiner>>({
		path: '/api/miners',
		searchParams: {
			limit,
			skip,
		},
	})
)

export const getStorageMiner = ({
	address,
}: {
	address: typeof EvmAddress.infer
}) => (
	getStorageScanData<ZeroGStorageScanMinerInfo>({
		path: `/api/miners/${address}`,
	})
)
