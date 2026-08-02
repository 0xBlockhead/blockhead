import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import type {
	ZeroGStorageScanList,
	ZeroGStorageScanMiner,
	ZeroGStorageScanMinerInfo,
	ZeroGStorageScanResponse,
	ZeroGStorageScanSummary,
	ZeroGStorageScanTransaction,
} from '$/sources/ZeroG/StorageScan/Rest/types.ts'

const binding = bindings[Source.ZeroGStorageScan_Rest][0]

const getStorageScanData = async <_Data>({
	path,
	searchParams,
}: {
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(path, firstHttpUrlForBinding(binding))
	for (const [key, value] of Object.entries(searchParams ?? {}))
		if (value != null)
			url.searchParams.set(key, String(value))

	const response = await sourceGetJson<ZeroGStorageScanResponse<_Data>>(
		binding,
		url.toString()
	)
	if (response.code !== 0)
		throw new Error(`ZeroGStorageScan_Rest: ${response.message}`)

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
	address: `0x${string}`
}) => (
	getStorageScanData<ZeroGStorageScanMinerInfo>({
		path: `/api/miners/${address}`,
	})
)
