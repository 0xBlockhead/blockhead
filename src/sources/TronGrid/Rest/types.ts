import type { TronNodeTransaction } from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import { tronNodeTransactionWire } from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import { type as arktype } from 'arktype'

export type TronGridAccountTransaction = TronNodeTransaction & {
	blockNumber?: number
	block_timestamp?: number
	energy_fee?: number
	energy_usage?: number
	energy_usage_total?: number
	net_fee?: number
	net_usage?: number
	internal_transactions?: Record<string, unknown>[]
}

export type TronGridAccountTransactions = {
	data: TronGridAccountTransaction[]
	success?: boolean
	meta?: Record<string, unknown>
}

export const tronGridAccountTransactionWire = tronNodeTransactionWire
	.and(arktype({
		'blockNumber?': 'number.integer >= 0',
		'block_timestamp?': 'number.integer >= 0',
		'energy_fee?': 'number.integer >= 0',
		'energy_usage?': 'number.integer >= 0',
		'energy_usage_total?': 'number.integer >= 0',
		'net_fee?': 'number.integer >= 0',
		'net_usage?': 'number.integer >= 0',
		'internal_transactions?': arktype('Record<string, unknown>').array(),
	}))

export const tronGridAccountTransactionsWire = arktype({
	data: tronGridAccountTransactionWire.array(),
	'success?': 'boolean',
	'meta?': 'Record<string, unknown>',
}).and(arktype('Record<string, unknown>'))
