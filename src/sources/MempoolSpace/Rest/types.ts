export type {
	EsploraBlock as MempoolSpaceBlock,
	EsploraTransaction as MempoolSpaceTransaction,
	EsploraTransactionInput as MempoolSpaceTransactionInput,
	EsploraTransactionOutput as MempoolSpaceTransactionOutput,
} from '$/sources/Esplora/Rest/types.ts'

export type MempoolSpaceMempoolStats = {
	count: number
	vsize: number
	total_fee: number
}

export type MempoolSpaceRecommendedFees = {
	fastestFee: number
	halfHourFee: number
	hourFee: number
	economyFee: number
	minimumFee: number
}
