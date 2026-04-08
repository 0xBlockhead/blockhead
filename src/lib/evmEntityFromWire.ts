import {
	type Entity,
	type EntityFieldValue,
	type EntityFieldValues,
	schema,
} from '$/schema/$schema.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type {
	RpcBlockHeaderWire,
	RpcReceiptWire,
	RpcTxWire,
} from '$/sources/Evm/JsonRpc/types.ts'

type EvmBlockRow = (
	Entity<typeof schema, EntityType.EvmBlock> &
	Partial<EntityFieldValues<typeof schema, EntityType.EvmBlock>>
)

type EvmTransactionRow = (
	Entity<typeof schema, EntityType.EvmTransaction> &
	Partial<EntityFieldValues<typeof schema, EntityType.EvmTransaction>>
)

export const hexToBigInt = (hex: string | undefined) => (
	hex != null && hex !== '' ?
		BigInt(hex)
	:	undefined
)

export const hexToNumber = (hex: string | undefined) => (
	hex != null && hex !== '' ?
		Number.parseInt(hex, 16)
	:	undefined
)

export const mapBlockSummary = ({
	chainId,
	blockNumber,
	wire,
}: {
	chainId: number
	blockNumber: bigint
	wire: RpcBlockHeaderWire
}): EvmBlockRow => {
	const txs = wire.transactions
	const txCount = Array.isArray(txs) ? txs.length : 0
	const hash = wire.hash != null ? (wire.hash as `0x${string}`) : undefined
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			blockNumber,
			...(hash != null ? { hash } : {}),
		},
		number: blockNumber,
		timestamp: hexToNumber(wire.timestamp),
		gasUsed: hexToBigInt(wire.gasUsed),
		gasLimit: hexToBigInt(wire.gasLimit),
		baseFeePerGas: hexToBigInt(wire.baseFeePerGas),
		transactionCount: txCount,
	}
}

export const mapLogsFromRpcReceipt = (
	logs: RpcReceiptWire['logs'] | undefined,
): EntityFieldValue<typeof schema, EntityType.EvmTransaction, 'logs'> => (
	(logs ?? []).map((log) => ({
		...(log.address != null ? { address: log.address as `0x${string}` } : {}),
		...(log.topics != null ? { topics: log.topics } : {}),
		...(log.data != null ? { data: log.data } : {}),
		...(log.blockNumber != null ? { blockNumber: log.blockNumber } : {}),
		...(log.transactionHash != null ?
			{ transactionHash: log.transactionHash as `0x${string}` }
		:	{}),
		...(log.logIndex != null ? { logIndex: log.logIndex } : {}),
	}))
)

/** `eth_getTransactionByHash` only; receipt fields come from entity field resolvers. */
export const mapTransactionEntityFromTxWire = ({
	chainId,
	txHash,
	tx,
}: {
	chainId: number
	txHash: `0x${string}`
	tx: RpcTxWire
}): EvmTransactionRow => {
	const hash = (tx.hash as `0x${string}` | undefined) ?? txHash
	const fromAddr = (tx.from ?? '') as `0x${string}`
	const toAddr = tx.to != null ? (tx.to as `0x${string}`) : undefined
	const blockNum = tx.blockNumber != null ? BigInt(tx.blockNumber) : undefined

	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			txHash: hash,
		},
		...(blockNum != null ?
			{
				$block: {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						blockNumber: blockNum,
					},
					number: blockNum,
				} as Entity<typeof schema, EntityType.EvmBlock>
			}
		:	{}),
		$from: {
			[EntityMetaKey.Id]: {
				$network: { chainId },
				address: fromAddr,
			},
		} as Entity<typeof schema, EntityType.Actor>,
		...(toAddr != null ?
			{
				$to: {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						address: toAddr,
					},
				} as Entity<typeof schema, EntityType.Actor>,
			}
		:	{}),
		transactionIndex: hexToNumber(tx.transactionIndex),
		value: tx.value != null ? BigInt(tx.value) : 0n,
		nonce: hexToNumber(tx.nonce),
		...(tx.input != null ? { input: tx.input } : {}),
		gas: hexToBigInt(tx.gas),
		gasPrice: hexToBigInt(tx.gasPrice),
		type: hexToNumber(tx.type),
	}
}

/** Hash-only / id stubs for `$$evmTransactions` lists; full rows come from `resolveEntity`. */
export const stubEvmTransactionEntitiesFromBlockTransactions = ({
	chainId,
	transactions,
	cap,
}: {
	chainId: number
	transactions: unknown[] | undefined
	cap: number
}): EvmTransactionRow[] => {
	const hashes: `0x${string}`[] = []
	if (Array.isArray(transactions) && cap > 0) {
		for (const t of transactions) {
			if (hashes.length >= cap) break
			if (typeof t === 'string' && t.startsWith('0x')) {
				hashes.push(t as `0x${string}`)
				continue
			}
			if (t != null && typeof t === 'object' && 'hash' in t) {
				const h = (t as RpcTxWire).hash
				if (typeof h === 'string' && h.startsWith('0x')) hashes.push(h as `0x${string}`)
			}
		}
	}
	return hashes.map((txHash) => ({
		[EntityMetaKey.Id]: {
			$network: { chainId },
			txHash,
		},
	}))
}
