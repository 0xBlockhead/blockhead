import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	ZeroGStorageScanList,
	ZeroGStorageScanMiner,
	ZeroGStorageScanMinerInfo,
	ZeroGStorageScanResponse,
	ZeroGStorageScanSummary,
	ZeroGStorageScanTransaction,
} from '$/sources/ZeroG/StorageScan/Rest/types.ts'

const storageScanUrl = ({
	binding,
	path,
	searchParams,
}: {
	binding: SourceBinding
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(path, firstHttpUrlForBinding(binding))
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	return url.toString()
}

const getStorageScanData = async <_Data>({
	binding,
	path,
	searchParams,
}: {
	binding: SourceBinding
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const response = await sourceGetJson<ZeroGStorageScanResponse<_Data>>(
		binding,
		storageScanUrl({
			binding,
			path,
			searchParams,
		})
	)
	if (response.code !== 0) throw new Error(`ZeroGStorageScan_Rest: ${response.message}`)
	return response.data
}

export const getStorageSummary = (binding: SourceBinding) => (
	getStorageScanData<ZeroGStorageScanSummary>({
		binding,
		path: '/api/stats/summary',
	})
)

export const listStorageTransactions = ({
	binding,
	limit,
	skip,
	rootHash,
	txHash,
}: {
	binding: SourceBinding
	limit: number
	skip?: number
	rootHash?: string
	txHash?: string
}) => (
	getStorageScanData<ZeroGStorageScanList<ZeroGStorageScanTransaction>>({
		binding,
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
	binding,
	txSeq,
}: {
	binding: SourceBinding
	txSeq: string | number | bigint
}) => (
	getStorageScanData<ZeroGStorageScanTransaction>({
		binding,
		path: `/api/txs/${txSeq.toString()}`,
	})
)

export const listStorageMiners = ({
	binding,
	limit,
	skip,
}: {
	binding: SourceBinding
	limit: number
	skip?: number
}) => (
	getStorageScanData<ZeroGStorageScanList<ZeroGStorageScanMiner>>({
		binding,
		path: '/api/miners',
		searchParams: {
			limit,
			skip,
		},
	})
)

export const getStorageMiner = ({
	binding,
	address,
}: {
	binding: SourceBinding
	address: `0x${string}`
}) => (
	getStorageScanData<ZeroGStorageScanMinerInfo>({
		binding,
		path: `/api/miners/${address}`,
	})
)
