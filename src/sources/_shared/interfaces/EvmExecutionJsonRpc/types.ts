import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

export type RpcBlockHeader = {
	number?: string
	hash?: string
	parentHash?: string
	timestamp?: string
	gasUsed?: string
	gasLimit?: string
	baseFeePerGas?: string
	blobGasUsed?: string
	excessBlobGas?: string
	miner?: string
	difficulty?: string
	transactions?: (string | RpcTransaction)[]
}

export type RpcTransaction = {
	blockHash?: string | null
	blockNumber?: string | null
	blockTimestamp?: string | null
	hash?: string
	from?: string
	to?: string | null
	gas?: string
	gasPrice?: string
	maxFeePerGas?: string
	maxPriorityFeePerGas?: string
	r?: string
	s?: string
	v?: string
	input?: string
	nonce?: string
	transactionIndex?: string | null
	type?: string
	value?: string
	maxFeePerBlobGas?: string
	blobVersionedHashes?: readonly string[]
	authorizationList?: readonly {
		chainId?: string
		address?: string
		nonce?: string
		yParity?: string
		r?: string
		s?: string
	}[]
}

export type RpcLog = {
	address?: string
	topics?: string[]
	data?: string
	blockNumber?: string
	blockHash?: string
	transactionHash?: string
	transactionIndex?: string
	logIndex?: string
	removed?: boolean
}

export type RpcReceipt = {
	transactionHash?: string
	transactionIndex?: string
	blockHash?: string
	blockNumber?: string
	from?: string
	status?: string
	gasUsed?: string
	cumulativeGasUsed?: string
	effectiveGasPrice?: string
	blobGasUsed?: string
	logs?: RpcLog[]
	logsBloom?: string
	contractAddress?: string | null
}

export type RpcBlockWire = {
	number: string
	hash: string
	parentHash: string
	timestamp: string
	miner: string
	gasUsed: string
	gasLimit: string
	baseFeePerGas?: string
	transactions: (string | RpcTransactionWire)[]
	blobGasUsed?: string
	excessBlobGas?: string
}

export type RpcTransactionWire = {
	hash: string
	blockNumber: string | null
	blockHash: string | null
	blockTimestamp?: string | null
	transactionIndex: string | null
	from: string
	to?: string | null
	value: string
	nonce: string
	input: string
	gas: string
	gasPrice?: string
	maxFeePerGas?: string
	maxPriorityFeePerGas?: string
	r: string
	s: string
	v?: string
	type?: string
	maxFeePerBlobGas?: string
	blobVersionedHashes?: readonly string[]
	authorizationList?: readonly {
		chainId?: string
		address?: string
		nonce?: string
		yParity?: string
		r?: string
		s?: string
	}[]
}

export type RpcReceiptWire = {
	transactionHash: string
	transactionIndex: string
	blockHash: string
	blockNumber: string
	from: string
	status?: string
	gasUsed: string
	cumulativeGasUsed: string
	contractAddress?: string | null
	effectiveGasPrice: string
	blobGasUsed?: string
	logs: RpcLog[]
	logsBloom: string
}

/** `eth_feeHistory` result — @see https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.yaml */
export type RpcFeeHistory = {
	oldestBlock: string
	baseFeePerGas: string[]
	baseFeePerBlobGas?: string[]
	blobGasUsedRatio?: number[]
	gasUsedRatio: number[]
	reward?: string[][]
}

export type RpcTxpoolStatus = {
	pending: string
	queued: string
}

export const narrowRpcLog = (entry: JsonValue): RpcLog | null => {
	if (!isJsonObject(entry)) return null
	const transactionHash = entry['transactionHash']
	if (typeof transactionHash !== 'string') return null
	return {
		address: typeof entry['address'] === 'string' ? entry['address'] : undefined,
		topics: (
			Array.isArray(entry['topics'])
			&& entry['topics'].every((topic) => typeof topic === 'string') ?
				entry['topics']
			:
				undefined
		),
		data: typeof entry['data'] === 'string' ? entry['data'] : undefined,
		blockNumber: typeof entry['blockNumber'] === 'string' ? entry['blockNumber'] : undefined,
		blockHash: typeof entry['blockHash'] === 'string' ? entry['blockHash'] : undefined,
		transactionHash,
		transactionIndex: typeof entry['transactionIndex'] === 'string' ? entry['transactionIndex'] : undefined,
		logIndex: typeof entry['logIndex'] === 'string' ? entry['logIndex'] : undefined,
		removed: entry['removed'] === true ? true : entry['removed'] === false ? false : undefined,
	}
}

export const narrowRpcTransaction = (raw: JsonValue): RpcTransactionWire | null => {
	if (!isJsonObject(raw)) return null
	const hash = raw['hash']
	const blockHash = raw['blockHash']
	const blockNumber = raw['blockNumber']
	const transactionIndex = raw['transactionIndex']
	const from = raw['from']
	const value = raw['value']
	const nonce = raw['nonce']
	const input = raw['input']
	const gas = raw['gas']
	const r = raw['r']
	const s = raw['s']
	if (
		typeof hash !== 'string'
		|| (blockHash !== null && typeof blockHash !== 'string')
		|| (blockNumber !== null && typeof blockNumber !== 'string')
		|| (transactionIndex !== null && typeof transactionIndex !== 'string')
		|| typeof from !== 'string'
		|| typeof value !== 'string'
		|| typeof nonce !== 'string'
		|| typeof input !== 'string'
		|| typeof gas !== 'string'
		|| typeof r !== 'string'
		|| typeof s !== 'string'
	) return null
	const blobRaw = raw['blobVersionedHashes']
	const blobVersionedHashes = (
		Array.isArray(blobRaw) && blobRaw.every((hash) => typeof hash === 'string') ?
			blobRaw
		:
			undefined
	)
	return {
		hash,
		blockNumber,
		blockHash,
		...(raw['blockTimestamp'] === null || typeof raw['blockTimestamp'] === 'string' ? {
			blockTimestamp: raw['blockTimestamp'],
		} : {}),
		transactionIndex,
		from,
		to: raw['to'] === null ? null : typeof raw['to'] === 'string' ? raw['to'] : undefined,
		value,
		nonce,
		input,
		gas,
		gasPrice: typeof raw['gasPrice'] === 'string' ? raw['gasPrice'] : undefined,
		maxFeePerGas: typeof raw['maxFeePerGas'] === 'string' ? raw['maxFeePerGas'] : undefined,
		maxPriorityFeePerGas: typeof raw['maxPriorityFeePerGas'] === 'string' ? raw['maxPriorityFeePerGas'] : undefined,
		r,
		s,
		v: typeof raw['v'] === 'string' ? raw['v'] : undefined,
		type: typeof raw['type'] === 'string' ? raw['type'] : undefined,
		maxFeePerBlobGas: typeof raw['maxFeePerBlobGas'] === 'string' ? raw['maxFeePerBlobGas'] : undefined,
		...(blobVersionedHashes != null && { blobVersionedHashes }),
	}
}

export const narrowRpcBlock = (raw: JsonValue): RpcBlockWire | null => {
	if (!isJsonObject(raw)) return null
	const number = raw['number']
	const hash = raw['hash']
	const parentHash = raw['parentHash']
	const miner = raw['miner']
	const gasUsed = raw['gasUsed']
	const gasLimit = raw['gasLimit']
	if (
		typeof number !== 'string'
		|| typeof hash !== 'string'
		|| typeof parentHash !== 'string'
		|| typeof miner !== 'string'
		|| typeof gasUsed !== 'string'
		|| typeof gasLimit !== 'string'
	) return null
	const rawTimestamp = raw['timestamp']
	if (typeof rawTimestamp !== 'string' && typeof rawTimestamp !== 'number') return null
	const baseFeePerGas = raw['baseFeePerGas']
	const blobGasUsed = raw['blobGasUsed']
	const excessBlobGas = raw['excessBlobGas']
	const rawTransactions = raw['transactions']
	if (!Array.isArray(rawTransactions)) return null
	const transactions = (
		rawTransactions.every((transaction) => typeof transaction === 'string') ?
			rawTransactions
		:
			rawTransactions.map(narrowRpcTransaction)
	)
	if (transactions.some((transaction) => transaction === null))
		return null

	return {
		number,
		hash,
		parentHash,
		timestamp: (
			typeof rawTimestamp === 'number' ?
				`0x${BigInt(rawTimestamp).toString(16)}`
			:
				rawTimestamp
		),
		miner,
		gasUsed,
		gasLimit,
		...(typeof baseFeePerGas === 'string' && { baseFeePerGas }),
		...(typeof blobGasUsed === 'string' && { blobGasUsed }),
		...(typeof excessBlobGas === 'string' && { excessBlobGas }),
		transactions: transactions.filter((transaction) => transaction !== null),
	}
}

export const narrowRpcReceipt = (raw: JsonValue): RpcReceiptWire | null => {
	if (!isJsonObject(raw)) return null
	const transactionHash = raw['transactionHash']
	const transactionIndex = raw['transactionIndex']
	const blockHash = raw['blockHash']
	const blockNumber = raw['blockNumber']
	const from = raw['from']
	const gasUsed = raw['gasUsed']
	const cumulativeGasUsed = raw['cumulativeGasUsed']
	const effectiveGasPrice = raw['effectiveGasPrice']
	const logsBloom = raw['logsBloom']
	const rawLogs = raw['logs']
	if (
		typeof transactionHash !== 'string'
		|| typeof transactionIndex !== 'string'
		|| typeof blockHash !== 'string'
		|| typeof blockNumber !== 'string'
		|| typeof from !== 'string'
		|| typeof gasUsed !== 'string'
		|| typeof cumulativeGasUsed !== 'string'
		|| typeof effectiveGasPrice !== 'string'
		|| typeof logsBloom !== 'string'
		|| !Array.isArray(rawLogs)
	) return null
	const logs = rawLogs.flatMap((entry) => (
		((log) => log == null ? [] : [log])(narrowRpcLog(entry))
	))
	if (logs.length !== rawLogs.length) return null
	return {
		transactionHash,
		transactionIndex,
		blockHash,
		blockNumber,
		from,
		status: typeof raw['status'] === 'string' ? raw['status'] : undefined,
		gasUsed,
		cumulativeGasUsed,
		contractAddress: raw['contractAddress'] === null ? null : typeof raw['contractAddress'] === 'string' ? raw['contractAddress'] : undefined,
		effectiveGasPrice,
		blobGasUsed: typeof raw['blobGasUsed'] === 'string' ? raw['blobGasUsed'] : undefined,
		logs,
		logsBloom,
	}
}
