import {
	type as arktype,
	type Type,
} from 'arktype'
import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'

export type XrplClioLedgerSpecifier = 'validated' | number

export type XrplClioMarker = JsonValue

/** Ripple Epoch (2000-01-01T00:00:00Z) offset from Unix epoch, in seconds. */
export const XRPL_RIPPLE_EPOCH_OFFSET_SECONDS = 946_684_800

export const xrplClioServerInfoWire = arktype({
	info: {
		'complete_ledgers?': 'string',
		'load_factor?': 'number',
		'peers?': 'number.integer >= 0',
		'validated_ledger?': {
			hash: 'string > 0',
			seq: 'number.integer >= 0',
		},
	},
})

export type XrplClioServerInfoResult = typeof xrplClioServerInfoWire.infer

export const xrplClioLedgerClosedWire = arktype({
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
})

export type XrplClioLedgerClosedResult = typeof xrplClioLedgerClosedWire.infer

export const xrplClioLedgerBodyWire = arktype({
	'account_hash?': 'string > 0',
	'close_time?': 'number.integer >= 0',
	'close_time_human?': 'string > 0',
	'parent_hash?': 'string > 0',
	'total_coins?': 'string > 0',
	'transaction_hash?': 'string > 0',
})

export type XrplClioLedgerBody = typeof xrplClioLedgerBodyWire.infer

export const xrplClioLedgerWire = arktype({
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
	validated: 'boolean',
	'ledger?': xrplClioLedgerBodyWire,
})

export type XrplClioLedgerResult = typeof xrplClioLedgerWire.infer

export const xrplClioLedgerTransactionWire = arktype({
	hash: 'string > 0',
	TransactionType: 'string > 0',
	Account: 'string > 0',
	'Sequence?': 'number.integer >= 0',
	'Fee?': 'string',
	'date?': 'number.integer >= 0',
})

export type XrplClioLedgerTransaction = typeof xrplClioLedgerTransactionWire.infer

export const xrplClioLedgerWithTransactionsWire = xrplClioLedgerWire.and({
	'transactions?': xrplClioLedgerTransactionWire.array(),
})

export type XrplClioLedgerWithTransactionsResult = typeof xrplClioLedgerWithTransactionsWire.infer

export const xrplClioLedgerStateObjectWire = arktype({
	index: 'string > 0',
	LedgerEntryType: 'string > 0',
	'Account?': 'string > 0',
	'PreviousTxnID?': 'string > 0',
	'PreviousTxnLgrSeq?': 'number.integer >= 0',
})

export type XrplClioLedgerStateObject = typeof xrplClioLedgerStateObjectWire.infer

export const xrplClioLedgerDataWire = arktype({
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
	state: xrplClioLedgerStateObjectWire.array(),
	'marker?': 'unknown',
})

export type XrplClioLedgerDataResult = typeof xrplClioLedgerDataWire.infer & {
	marker?: XrplClioMarker
}

export const xrplClioTransactionWire = arktype({
	hash: 'string > 0',
	'ledger_hash?': 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	'meta?': arktype('Record<string, unknown>'),
	validated: 'boolean',
	'tx_json?': arktype('Record<string, unknown>'),
	'tx?': arktype('Record<string, unknown>'),
})

export type XrplClioTransactionMeta = JsonObject & {
	TransactionResult?: string
}

export type XrplClioTransactionJson = JsonObject & {
	Account: string
	Fee?: string
	Sequence?: number
	TransactionType: string
	date?: number
	hash?: string
}

export type XrplClioTransactionResult = typeof xrplClioTransactionWire.infer & {
	meta?: XrplClioTransactionMeta
	tx?: XrplClioTransactionJson
	tx_json?: XrplClioTransactionJson
}

export const xrplClioServerInfo = xrplClioServerInfoWire satisfies Type<XrplClioServerInfoResult>
export const xrplClioLedgerClosed = xrplClioLedgerClosedWire satisfies Type<XrplClioLedgerClosedResult>
export const xrplClioLedgerBody = xrplClioLedgerBodyWire satisfies Type<XrplClioLedgerBody>
export const xrplClioLedger = xrplClioLedgerWire satisfies Type<XrplClioLedgerResult>
export const xrplClioLedgerTransaction = xrplClioLedgerTransactionWire satisfies Type<XrplClioLedgerTransaction>
export const xrplClioLedgerWithTransactions = xrplClioLedgerWithTransactionsWire
export const xrplClioLedgerStateObject = xrplClioLedgerStateObjectWire satisfies Type<XrplClioLedgerStateObject>
export const xrplClioLedgerData = xrplClioLedgerDataWire
export const xrplClioTransaction = xrplClioTransactionWire
