import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import {
	zeroGStorageScanMinerInfoResponseWire,
	zeroGStorageScanMinerListResponseWire,
	zeroGStorageScanRewardListResponseWire,
	zeroGStorageScanSummaryResponseWire,
	zeroGStorageScanTransactionListResponseWire,
	zeroGStorageScanTransactionResponseWire,
	type ZeroGStorageScanList,
	type ZeroGStorageScanMiner,
	type ZeroGStorageScanMinerInfo,
	type ZeroGStorageScanReward,
	type ZeroGStorageScanSummary,
	type ZeroGStorageScanTransaction,
} from '$/sources/ZeroG/StorageScan/Rest/types.ts'

const binding = bindings[Source.ZeroGStorageScan_Rest][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`ZeroGStorageScan_Rest: invalid ${label} response envelope`)
	}
}

const assertSuccessCode = (
	code: number,
	message: string,
	label: string
) => {
	if (code !== 0)
		throw new Error(`ZeroGStorageScan_Rest: ${label}: ${message}`)
}

const unsignedInteger = (
	value: string | number,
	label: string
) => {
	const integer = typeof value === 'number' ? value : Number(value)
	if (!Number.isSafeInteger(integer) || integer < 0)
		throw new Error(`ZeroGStorageScan_Rest: invalid ${label}`)
	return integer
}

const getStorageScanJson = (
	path: string,
	searchParams?: Record<string, string | number | undefined>
) => {
	const url = new URL(path, firstHttpUrlForBinding(binding))
	for (const [key, value] of Object.entries(searchParams ?? {}))
		if (value != null)
			url.searchParams.set(key, String(value))

	return sourceGetJson<unknown>(
		binding,
		url.toString()
	)
}

export const getStorageSummary = async (): Promise<ZeroGStorageScanSummary> => {
	const response = assertEnvelope(
		'stats/summary',
		zeroGStorageScanSummaryResponseWire,
		await getStorageScanJson('/api/stats/summary')
	)
	assertSuccessCode(response.code, response.message, 'stats/summary')
	return response.data
}

export const listStorageTransactions = async ({
	limit,
	skip,
	rootHash,
	txHash,
}: {
	limit: number
	skip?: number
	rootHash?: string
	txHash?: string
}): Promise<ZeroGStorageScanList<ZeroGStorageScanTransaction>> => {
	const response = assertEnvelope(
		'txs',
		zeroGStorageScanTransactionListResponseWire,
		await getStorageScanJson('/api/txs', {
			limit,
			skip,
			rootHash,
			txHash,
		})
	)
	assertSuccessCode(response.code, response.message, 'txs')
	return {
		total: unsignedInteger(response.data.total, 'txs total'),
		list: response.data.list,
	}
}

export const getStorageTransaction = async ({
	txSeq,
}: {
	txSeq: string | number | bigint
}): Promise<ZeroGStorageScanTransaction> => {
	const response = assertEnvelope(
		`txs/${txSeq.toString()}`,
		zeroGStorageScanTransactionResponseWire,
		await getStorageScanJson(`/api/txs/${txSeq.toString()}`)
	)
	assertSuccessCode(response.code, response.message, `txs/${txSeq.toString()}`)
	if (String(response.data.txSeq) !== String(txSeq))
		throw new Error(`ZeroGStorageScan_Rest: transaction response does not match requested txSeq ${txSeq.toString()}`)

	return response.data
}

export const listStorageMiners = async ({
	limit,
	skip,
}: {
	limit: number
	skip?: number
}): Promise<ZeroGStorageScanList<ZeroGStorageScanMiner>> => {
	const response = assertEnvelope(
		'miners',
		zeroGStorageScanMinerListResponseWire,
		await getStorageScanJson('/api/miners', {
			limit,
			skip,
		})
	)
	assertSuccessCode(response.code, response.message, 'miners')
	return {
		total: unsignedInteger(response.data.total, 'miners total'),
		list: response.data.list,
	}
}

export const getStorageMiner = async ({
	address,
}: {
	address: `0x${string}`
}): Promise<ZeroGStorageScanMinerInfo> => {
	const response = assertEnvelope(
		`miners/${address}`,
		zeroGStorageScanMinerInfoResponseWire,
		await getStorageScanJson(`/api/miners/${address}`)
	)
	assertSuccessCode(response.code, response.message, `miners/${address}`)
	return response.data
}

export const listStorageRewards = async ({
	limit,
	skip,
}: {
	limit: number
	skip?: number
}): Promise<ZeroGStorageScanList<ZeroGStorageScanReward>> => {
	const response = assertEnvelope(
		'rewards',
		zeroGStorageScanRewardListResponseWire,
		await getStorageScanJson('/api/rewards', {
			limit,
			skip,
		})
	)
	assertSuccessCode(response.code, response.message, 'rewards')
	return {
		total: unsignedInteger(response.data.total, 'rewards total'),
		list: response.data.list,
	}
}
