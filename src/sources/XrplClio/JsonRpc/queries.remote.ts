import { query } from '$app/server'
import { type } from 'arktype'

import {
	getLedger as getLedgerFromClio,
	getLedgerData as getLedgerDataFromClio,
	getLedgerTransactions as getLedgerTransactionsFromClio,
	getRecentLedgers as getRecentLedgersFromClio,
	getServerInfo as getServerInfoFromClio,
	getTransaction as getTransactionFromClio,
	getValidatedLedger as getValidatedLedgerFromClio,
} from '$/sources/XrplClio/JsonRpc/queries.ts'
import type { XrplClioMarker } from '$/sources/XrplClio/JsonRpc/types.ts'

const ledgerSpecifier = type('number | "validated"').or({
	ledgerHash: 'string',
})

export const getServerInfo = query(() => getServerInfoFromClio())
export const getValidatedLedger = query(() => getValidatedLedgerFromClio())
export const getLedger = query(ledgerSpecifier, (specifier) => getLedgerFromClio(specifier))
export const getRecentLedgers = query(type('number'), (limit) => getRecentLedgersFromClio(limit))
export const getLedgerTransactions = query(ledgerSpecifier, (specifier) => getLedgerTransactionsFromClio(specifier))
export const getTransaction = query(type('string'), (hash) => getTransactionFromClio(hash))

export const getLedgerData = query(
	type({
		ledgerIndex: 'number | "validated"',
		limit: 'number',
		'marker?': 'unknown',
	}),
	({ ledgerIndex, limit, marker }) => getLedgerDataFromClio(
		limit,
		ledgerIndex,
		// SvelteKit has already constrained this input to its serializable query boundary.
		marker as XrplClioMarker | undefined
	)
)
