import type { EvmAddress } from '$/schema/ZeroExHex.ts'


export type ZeroGStorageScanResponse<_Data> = {
	code: number
	message: string
	data: _Data
}

export type ZeroGStorageScanList<_Item> = {
	total: number
	list: _Item[]
}

export type ZeroGStorageScanSummary = {
	storageFee: {
		chargeToken: {
			address: string
			name: string
			symbol: string
			decimals: number
			native: boolean
		}
		storageFeeTotal: string
	}
	logSync: {
		'layer1-logSyncHeight': number
		logSyncHeight: number
	}
	storageFile: {
		totalExpiredFiles: number
		totalPrunedFiles: number
	}
	minerReward: {
		avgReward24Hours: string
		totalReward: string
		totalWinCount: number
	}
}

export type ZeroGStorageScanTransaction = {
	txSeq: number | string
	from: string
	method: string
	rootHash: string
	dataSize: number
	expiration?: number
	storageFee: string
	status: number
	blockNumber: number
	txHash: string
	timestamp: number
	segments: number
	uploadedSegments: number
	startPosition?: number
	endPosition?: number
	gasFee?: number
	gasUsed?: number
	gasLimit?: number
}

export type ZeroGStorageScanMiner = {
	miner: typeof EvmAddress.infer
	totalReward: string
	winCount: number
	miningAttempts: number
	timestamp: number
}

export type ZeroGStorageScanMinerInfo = {
	balance: string
	totalReward: string
}
