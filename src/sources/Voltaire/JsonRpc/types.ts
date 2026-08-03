import type {
	RpcBlockHeader,
	RpcBlockWire,
	RpcReceipt,
	RpcReceiptWire,
	RpcTransaction,
	RpcTransactionWire,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

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

export const getRpcHeader = (
	wire: RpcBlockWire
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
	transactions: [...wire.transactions],
	...(wire.blobGasUsed != null && { blobGasUsed: wire.blobGasUsed }),
	...(wire.excessBlobGas != null && { excessBlobGas: wire.excessBlobGas }),
})

export const getRpcTx = (
	tx: RpcTransactionWire
): RpcTransaction => ({
	hash: tx.hash,
	blockHash: tx.blockHash,
	blockNumber: tx.blockNumber,
	from: tx.from,
	to: tx.to,
	gas: tx.gas,
	gasPrice: tx.gasPrice,
	...(tx.maxFeePerGas != null && { maxFeePerGas: tx.maxFeePerGas }),
	...(tx.maxPriorityFeePerGas != null && { maxPriorityFeePerGas: tx.maxPriorityFeePerGas }),
	r: tx.r,
	s: tx.s,
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
	receipt: RpcReceiptWire | null
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
			logs: [...receipt.logs],
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
