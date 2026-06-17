import type { RpcBlockHeader, RpcLog, RpcReceipt, RpcTransaction } from '$/sources/Evm/JsonRpc/types.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

export type VoltaireBlockRpc = {
	number: string
	hash: string
	parentHash: string
	timestamp: string | number
	miner: string
	gasUsed: string
	gasLimit: string
	baseFeePerGas?: string
	transactions?: readonly (string | VoltaireTxRpc)[]
	blobGasUsed?: string
	excessBlobGas?: string
}

export type VoltaireTxRpc = {
	hash?: string
	blockNumber?: string
	blockHash?: string
	transactionIndex?: string
	from?: string
	to?: string | null
	value?: string
	nonce?: string
	input?: string
	gas?: string
	gasPrice?: string
	maxFeePerGas?: string
	maxPriorityFeePerGas?: string
	r?: string
	s?: string
	v?: string
	type?: string
	maxFeePerBlobGas?: string
	blobVersionedHashes?: readonly string[]
}

export type VoltaireReceiptRpc = {
	status?: string
	gasUsed?: string
	cumulativeGasUsed?: string
	contractAddress?: string | null
	effectiveGasPrice?: string
	blobGasUsed?: string
	logs?: RpcLog[]
}

export type VoltaireCallTraceRpc = {
	type?: string
	from?: string
	to?: string
	value?: string
	gas?: string
	gasUsed?: string
	input?: string
	output?: string
	error?: string
	calls?: VoltaireCallTraceRpc[]
}

export const narrowRpcLog = (entry: JsonValue): RpcLog | null => {
	if (!isJsonObject(entry)) return null
	return {
		address: typeof entry['address'] === 'string' ? entry['address'] : undefined,
		topics: (
			Array.isArray(entry['topics'])
			&& entry['topics'].every((t) => typeof t === 'string') ?
				entry['topics']
			:
				undefined
		),
		data: typeof entry['data'] === 'string' ? entry['data'] : undefined,
		blockNumber: typeof entry['blockNumber'] === 'string' ? entry['blockNumber'] : undefined,
		blockHash: typeof entry['blockHash'] === 'string' ? entry['blockHash'] : undefined,
		transactionHash: typeof entry['transactionHash'] === 'string' ? entry['transactionHash'] : undefined,
		transactionIndex: typeof entry['transactionIndex'] === 'string' ? entry['transactionIndex'] : undefined,
		logIndex: typeof entry['logIndex'] === 'string' ? entry['logIndex'] : undefined,
		removed: entry['removed'] === true ? true : entry['removed'] === false ? false : undefined,
	}
}

export const narrowTxRpc = (raw: JsonValue): VoltaireTxRpc | null => {
	if (!isJsonObject(raw)) return null
	const blobRaw = raw['blobVersionedHashes']
	const blobVersionedHashes = (
		Array.isArray(blobRaw) && blobRaw.every((h) => typeof h === 'string') ?
			blobRaw
		:
			undefined
	)
	return {
		hash: typeof raw['hash'] === 'string' ? raw['hash'] : undefined,
		blockNumber: typeof raw['blockNumber'] === 'string' ? raw['blockNumber'] : undefined,
		blockHash: typeof raw['blockHash'] === 'string' ? raw['blockHash'] : undefined,
		transactionIndex: typeof raw['transactionIndex'] === 'string' ? raw['transactionIndex'] : undefined,
		from: typeof raw['from'] === 'string' ? raw['from'] : undefined,
		to: raw['to'] === null ? null : typeof raw['to'] === 'string' ? raw['to'] : undefined,
		value: typeof raw['value'] === 'string' ? raw['value'] : undefined,
		nonce: typeof raw['nonce'] === 'string' ? raw['nonce'] : undefined,
		input: typeof raw['input'] === 'string' ? raw['input'] : undefined,
		gas: typeof raw['gas'] === 'string' ? raw['gas'] : undefined,
		gasPrice: typeof raw['gasPrice'] === 'string' ? raw['gasPrice'] : undefined,
		maxFeePerGas: typeof raw['maxFeePerGas'] === 'string' ? raw['maxFeePerGas'] : undefined,
		maxPriorityFeePerGas: typeof raw['maxPriorityFeePerGas'] === 'string' ? raw['maxPriorityFeePerGas'] : undefined,
		r: typeof raw['r'] === 'string' ? raw['r'] : undefined,
		s: typeof raw['s'] === 'string' ? raw['s'] : undefined,
		v: typeof raw['v'] === 'string' ? raw['v'] : undefined,
		type: typeof raw['type'] === 'string' ? raw['type'] : undefined,
		maxFeePerBlobGas: typeof raw['maxFeePerBlobGas'] === 'string' ? raw['maxFeePerBlobGas'] : undefined,
		...(blobVersionedHashes != null && { blobVersionedHashes }),
	}
}

export const narrowBlockRpc = (raw: JsonValue): VoltaireBlockRpc | null => {
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
	const timestampRaw = raw['timestamp']
	if (typeof timestampRaw !== 'string' && typeof timestampRaw !== 'number') return null
	const baseFeePerGas = raw['baseFeePerGas']
	const blobGasUsed = raw['blobGasUsed']
	const excessBlobGas = raw['excessBlobGas']
	const txs = raw['transactions']
	const transactions = (
		!Array.isArray(txs) ?
			undefined
		:
			txs.length === 0 ?
				[]
			:
				txs.every((t) => typeof t === 'string') ?
					txs
				:
					txs.every((t) => typeof t === 'object' && t !== null && !Array.isArray(t)) ?
					txs
						.map((t) => narrowTxRpc(t))
						.filter((t): t is VoltaireTxRpc => t != null)
				:
					undefined
	)
	return {
		number,
		hash,
		parentHash,
		timestamp: timestampRaw,
		miner,
		gasUsed,
		gasLimit,
		...(typeof baseFeePerGas === 'string' && { baseFeePerGas }),
		...(typeof blobGasUsed === 'string' && { blobGasUsed }),
		...(typeof excessBlobGas === 'string' && { excessBlobGas }),
		...(transactions != null && { transactions }),
	}
}

export const narrowVoltaireReceiptRpc = (raw: JsonValue): VoltaireReceiptRpc | null => {
	if (!isJsonObject(raw)) return null
	const logsRaw = raw['logs']
	const logs = (
		Array.isArray(logsRaw) ?
			logsRaw.flatMap((entry) => (
				((log) => log == null ? [] : [log])(narrowRpcLog(entry))
			))
		:
			undefined
	)
	return {
		status: typeof raw['status'] === 'string' ? raw['status'] : undefined,
		gasUsed: typeof raw['gasUsed'] === 'string' ? raw['gasUsed'] : undefined,
		cumulativeGasUsed: typeof raw['cumulativeGasUsed'] === 'string' ? raw['cumulativeGasUsed'] : undefined,
		contractAddress: raw['contractAddress'] === null ? null : typeof raw['contractAddress'] === 'string' ? raw['contractAddress'] : undefined,
		effectiveGasPrice: typeof raw['effectiveGasPrice'] === 'string' ? raw['effectiveGasPrice'] : undefined,
		blobGasUsed: typeof raw['blobGasUsed'] === 'string' ? raw['blobGasUsed'] : undefined,
		...(logs != null && { logs }),
	}
}

export const getRpcHeader = (
	wire: VoltaireBlockRpc
): RpcBlockHeader => ({
	number: wire.number,
	hash: wire.hash,
	parentHash: wire.parentHash,
	timestamp: (
		typeof wire.timestamp === 'number' ?
			`0x${BigInt(wire.timestamp).toString(16)}`
		:
			wire.timestamp
	),
	gasUsed: wire.gasUsed,
	gasLimit: wire.gasLimit,
	baseFeePerGas: wire.baseFeePerGas,
	miner: wire.miner,
	transactions: [...(wire.transactions ?? [])],
	...(wire.blobGasUsed != null && { blobGasUsed: wire.blobGasUsed }),
	...(wire.excessBlobGas != null && { excessBlobGas: wire.excessBlobGas }),
})

export const getRpcTx = (
	tx: VoltaireTxRpc,
	txHash: `0x${string}`
): RpcTransaction => ({
	hash: tx.hash ?? txHash,
	blockHash: tx.blockHash,
	blockNumber: tx.blockNumber,
	from: tx.from,
	to: tx.to,
	gas: tx.gas,
	gasPrice: tx.gasPrice,
	...(tx.maxFeePerGas != null && { maxFeePerGas: tx.maxFeePerGas }),
	...(tx.maxPriorityFeePerGas != null && { maxPriorityFeePerGas: tx.maxPriorityFeePerGas }),
	...(tx.r != null && { r: tx.r }),
	...(tx.s != null && { s: tx.s }),
	...(tx.v != null && { v: tx.v }),
	...(tx.maxFeePerBlobGas != null && { maxFeePerBlobGas: tx.maxFeePerBlobGas }),
	...(tx.blobVersionedHashes != null && { blobVersionedHashes: tx.blobVersionedHashes }),
	input: tx.input,
	nonce: tx.nonce,
	transactionIndex: tx.transactionIndex,
	type: tx.type,
	value: tx.value,
})

export const getRpcReceipt = (
	receipt: VoltaireReceiptRpc | null
): RpcReceipt | null => (
	receipt == null ?
		null
	:
		{
			status: receipt.status,
			gasUsed: receipt.gasUsed,
			cumulativeGasUsed: receipt.cumulativeGasUsed,
			contractAddress: receipt.contractAddress,
			effectiveGasPrice: receipt.effectiveGasPrice,
			blobGasUsed: receipt.blobGasUsed,
			logs: [...(receipt.logs ?? [])],
		}
)

export const parseVoltaireCallTraceRpc = (
	raw: JsonValue
): VoltaireCallTraceRpc | null => (
	!isJsonObject(raw) ?
		null
	:
		(() => {
			const callsRaw = raw['calls']
			const calls = (
				Array.isArray(callsRaw) ?
					callsRaw
						.map((entry) => parseVoltaireCallTraceRpc(entry))
						.filter((entry): entry is VoltaireCallTraceRpc => entry != null)
				:
					undefined
			)
			return {
				...(typeof raw['type'] === 'string' && { type: raw['type'] }),
				...(typeof raw['from'] === 'string' && { from: raw['from'] }),
				...(typeof raw['to'] === 'string' && { to: raw['to'] }),
				...(typeof raw['value'] === 'string' && { value: raw['value'] }),
				...(typeof raw['gas'] === 'string' && { gas: raw['gas'] }),
				...(typeof raw['gasUsed'] === 'string' && { gasUsed: raw['gasUsed'] }),
				...(typeof raw['input'] === 'string' && { input: raw['input'] }),
				...(typeof raw['output'] === 'string' && { output: raw['output'] }),
				...(typeof raw['error'] === 'string' && { error: raw['error'] }),
				...(calls != null && calls.length > 0 && { calls }),
			}
		})()
)
