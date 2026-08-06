import type { TronNodeTransaction } from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import { tronNodeTransactionWire } from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import { type as arktype } from 'arktype'

export type TronGridAccountTransactions = {
	data: TronNodeTransaction[]
}

export const tronGridAccountTransactionsWire = arktype({
	data: tronNodeTransactionWire.array(),
}).and(arktype('Record<string, unknown>'))
