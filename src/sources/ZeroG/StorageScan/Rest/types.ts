import { type as arktype } from 'arktype'


export const zeroGStorageScanEvmAddressWire = arktype('/^0x[0-9a-fA-F]{40}$/')

export const zeroGStorageScanUnsignedIntegerWire = arktype('number.integer >= 0')
	.or('/^(0|[1-9]\\d*)$/')

export const zeroGStorageScanChargeTokenWire = arktype({
	address: 'string',
	name: 'string',
	symbol: 'string > 0',
	decimals: 'number.integer >= 0',
	native: 'boolean',
})

export const zeroGStorageScanSummaryWire = arktype({
	storageFee: {
		chargeToken: zeroGStorageScanChargeTokenWire,
		storageFeeTotal: 'string > 0',
	},
	logSync: {
		'layer1-logSyncHeight': 'number.integer >= 0',
		logSyncHeight: 'number.integer >= 0',
	},
	storageFile: {
		totalExpiredFiles: 'number.integer >= 0',
		totalPrunedFiles: 'number.integer >= 0',
	},
	minerReward: {
		avgReward24Hours: 'string',
		totalReward: 'string > 0',
		totalWinCount: 'number.integer >= 0',
	},
})

export type ZeroGStorageScanSummary = typeof zeroGStorageScanSummaryWire.infer

export const zeroGStorageScanTransactionWire = arktype({
	txSeq: zeroGStorageScanUnsignedIntegerWire,
	from: zeroGStorageScanEvmAddressWire,
	method: 'string > 0',
	rootHash: 'string > 0',
	dataSize: 'number.integer >= 0',
	'expiration?': 'number.integer >= 0',
	storageFee: 'string',
	status: 'number.integer >= 0',
	blockNumber: 'number.integer >= 0',
	txHash: 'string > 0',
	timestamp: 'number.integer >= 0',
	segments: 'number.integer >= 0',
	uploadedSegments: 'number.integer >= 0',
	'startPosition?': 'number.integer >= 0',
	'endPosition?': 'number.integer >= 0',
	'gasFee?': 'number.integer >= 0',
	'gasUsed?': 'number.integer >= 0',
	'gasLimit?': 'number.integer >= 0',
})

export type ZeroGStorageScanTransaction = typeof zeroGStorageScanTransactionWire.infer

export const zeroGStorageScanMinerWire = arktype({
	miner: zeroGStorageScanEvmAddressWire,
	totalReward: 'string',
	winCount: 'number.integer >= 0',
	miningAttempts: 'number.integer >= 0',
	timestamp: 'number.integer >= 0',
})

export type ZeroGStorageScanMiner = typeof zeroGStorageScanMinerWire.infer

export const zeroGStorageScanMinerInfoWire = arktype({
	balance: 'string',
	totalReward: 'string',
})

export type ZeroGStorageScanMinerInfo = typeof zeroGStorageScanMinerInfoWire.infer

export const zeroGStorageScanRewardWire = arktype({
	miner: zeroGStorageScanEvmAddressWire,
	reward: 'string',
	blockNumber: 'number.integer >= 0',
	txHash: 'string > 0',
	timestamp: 'number.integer >= 0',
})

export type ZeroGStorageScanReward = typeof zeroGStorageScanRewardWire.infer

export const zeroGStorageScanSummaryResponseWire = arktype({
	code: 'number.integer',
	message: 'string',
	data: zeroGStorageScanSummaryWire,
})

export const zeroGStorageScanTransactionListResponseWire = arktype({
	code: 'number.integer',
	message: 'string',
	data: {
		total: zeroGStorageScanUnsignedIntegerWire,
		list: zeroGStorageScanTransactionWire.array(),
	},
})

export const zeroGStorageScanTransactionResponseWire = arktype({
	code: 'number.integer',
	message: 'string',
	data: zeroGStorageScanTransactionWire,
})

export const zeroGStorageScanMinerListResponseWire = arktype({
	code: 'number.integer',
	message: 'string',
	data: {
		total: zeroGStorageScanUnsignedIntegerWire,
		list: zeroGStorageScanMinerWire.array(),
	},
})

export const zeroGStorageScanMinerInfoResponseWire = arktype({
	code: 'number.integer',
	message: 'string',
	data: zeroGStorageScanMinerInfoWire,
})

export const zeroGStorageScanRewardListResponseWire = arktype({
	code: 'number.integer',
	message: 'string',
	data: {
		total: zeroGStorageScanUnsignedIntegerWire,
		list: zeroGStorageScanRewardWire.array(),
	},
})

export type ZeroGStorageScanList<_Item> = {
	total: number
	list: _Item[]
}
