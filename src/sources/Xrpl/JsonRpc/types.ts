import {
	type as arktype,
	type Type,
} from 'arktype'
import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'

export type XrplLedgerSpecifier = 'validated' | number

export type XrplMarker = JsonValue

const xrplIssuedAssetWire = arktype({
	currency: 'string > 0',
	'issuer?': 'string > 0',
	'value?': 'string',
})

export type XrplIssuedAsset = typeof xrplIssuedAssetWire.infer

export const xrplServerInfoWire = arktype({
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

export type XrplServerInfoResult = typeof xrplServerInfoWire.infer

export const xrplLedgerBodyWire = arktype({
	'account_hash?': 'string > 0',
	'close_time?': 'number.integer >= 0',
	'close_time_human?': 'string > 0',
	'parent_hash?': 'string > 0',
	'total_coins?': 'string > 0',
	'transaction_hash?': 'string > 0',
})

export type XrplLedgerBody = typeof xrplLedgerBodyWire.infer

export const xrplLedgerWire = arktype({
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
	validated: 'boolean',
	'ledger?': xrplLedgerBodyWire,
})

export type XrplLedgerResult = typeof xrplLedgerWire.infer

/** Ripple Epoch (2000-01-01T00:00:00Z) offset from Unix epoch, in seconds. */
export const XRPL_RIPPLE_EPOCH_OFFSET_SECONDS = 946_684_800

export const xrplLedgerStateObjectWire = arktype({
	index: 'string > 0',
	LedgerEntryType: 'string > 0',
	'Account?': 'string > 0',
	'PreviousTxnID?': 'string > 0',
	'PreviousTxnLgrSeq?': 'number.integer >= 0',
	'Asset?': xrplIssuedAssetWire,
	'Asset2?': xrplIssuedAssetWire,
	'LPTokenBalance?': xrplIssuedAssetWire,
	'TradingFee?': 'number.integer >= 0',
	'AuctionSlot?': 'unknown',
	'VoteSlots?': 'unknown',
})

export type XrplLedgerStateObject = typeof xrplLedgerStateObjectWire.infer

export const xrplLedgerDataWire = arktype({
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
	state: xrplLedgerStateObjectWire.array(),
	'marker?': 'unknown',
})

export type XrplLedgerDataResult = typeof xrplLedgerDataWire.infer & {
	marker?: XrplMarker
}

export const xrplAccountRootWire = arktype({
	Account: 'string > 0',
	Balance: 'string',
	Flags: 'number.integer >= 0',
	LedgerEntryType: 'string > 0',
	OwnerCount: 'number.integer >= 0',
	Sequence: 'number.integer >= 0',
	'PreviousTxnID?': 'string > 0',
	'PreviousTxnLgrSeq?': 'number.integer >= 0',
	'index?': 'string > 0',
})

export type XrplAccountRoot = typeof xrplAccountRootWire.infer

export const xrplAccountInfoWire = arktype({
	account_data: xrplAccountRootWire,
	'ledger_hash?': 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	validated: 'boolean',
})

export type XrplAccountInfoResult = typeof xrplAccountInfoWire.infer

export const xrplAccountObjectsWire = arktype({
	account: 'string > 0',
	account_objects: xrplLedgerStateObjectWire.array(),
	'ledger_hash?': 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	'limit?': 'number.integer >= 0',
	'marker?': 'unknown',
	validated: 'boolean',
})

export type XrplAccountObjectsResult = typeof xrplAccountObjectsWire.infer & {
	marker?: XrplMarker
}

export const xrplAccountLineWire = arktype({
	account: 'string > 0',
	balance: 'string',
	currency: 'string > 0',
	limit: 'string',
	limit_peer: 'string',
	'no_ripple?': 'boolean',
	'no_ripple_peer?': 'boolean',
	'authorized?': 'boolean',
	'peer_authorized?': 'boolean',
})

export type XrplAccountLine = typeof xrplAccountLineWire.infer

export const xrplAccountLinesWire = arktype({
	account: 'string > 0',
	'ledger_hash?': 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	lines: xrplAccountLineWire.array(),
	'limit?': 'number.integer >= 0',
	'marker?': 'unknown',
	validated: 'boolean',
})

export type XrplAccountLinesResult = typeof xrplAccountLinesWire.infer & {
	marker?: XrplMarker
}

export type XrplAccountTransactionJson = JsonObject & {
	Account: string
	Fee?: string
	Sequence?: number
	TransactionType: string
	date?: number
	hash?: string
}

export type XrplAccountTransactionMeta = JsonObject & {
	TransactionResult?: string
}

export const xrplAccountTransactionWire = arktype({
	'close_time_iso?': 'string',
	'hash?': 'string > 0',
	'ledger_hash?': 'string > 0',
	ledger_index: 'number.integer >= 0',
	meta: arktype('Record<string, unknown>'),
	'tx?': arktype('Record<string, unknown>'),
	'tx_json?': arktype('Record<string, unknown>'),
	validated: 'boolean',
})

export type XrplAccountTransaction = typeof xrplAccountTransactionWire.infer & {
	meta: XrplAccountTransactionMeta
	tx?: XrplAccountTransactionJson
	tx_json?: XrplAccountTransactionJson
}

export const xrplAccountTransactionsWire = arktype({
	account: 'string > 0',
	ledger_index_min: 'number.integer',
	ledger_index_max: 'number.integer',
	'limit?': 'number.integer >= 0',
	'marker?': 'unknown',
	transactions: xrplAccountTransactionWire.array(),
	validated: 'boolean',
})

export type XrplAccountTransactionsResult = typeof xrplAccountTransactionsWire.infer & {
	marker?: XrplMarker
	transactions: readonly XrplAccountTransaction[]
}

export const xrplLedgerTransactionWire = arktype({
	hash: 'string > 0',
	TransactionType: 'string > 0',
	Account: 'string > 0',
	'Sequence?': 'number.integer >= 0',
})

export type XrplLedgerTransaction = typeof xrplLedgerTransactionWire.infer

export const xrplLedgerWithTransactionsWire = xrplLedgerWire.and({
	'transactions?': xrplLedgerTransactionWire.array(),
})

export type XrplLedgerWithTransactionsResult = typeof xrplLedgerWithTransactionsWire.infer

export const xrplFeatureWire = arktype({
	'name?': 'string > 0',
	'enabled?': 'boolean',
	'supported?': 'boolean',
	'vetoed?': 'boolean',
	'default?': 'boolean',
})

export type XrplFeature = typeof xrplFeatureWire.infer

export type XrplFeatureResult = {
	readonly [amendmentId: string]: XrplFeature
}

export const xrplAmmAmountWire = arktype('string').or(xrplIssuedAssetWire)

export const xrplAmmInfoAmmWire = arktype({
	account: 'string > 0',
	amount: xrplAmmAmountWire,
	amount2: xrplAmmAmountWire,
	'asset_frozen?': 'boolean',
	'asset2_frozen?': 'boolean',
	'auction_slot?': 'unknown',
	lp_token: xrplIssuedAssetWire,
	trading_fee: 'number.integer >= 0',
	'vote_slots?': 'unknown',
})

export type XrplAmmInfoAmm = typeof xrplAmmInfoAmmWire.infer

export const xrplAmmInfoWire = arktype({
	amm: xrplAmmInfoAmmWire,
	'ledger_hash?': 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	'ledger_current_index?': 'number.integer >= 0',
	validated: 'boolean',
})

export type XrplAmmInfoResult = typeof xrplAmmInfoWire.infer

export const xrplIssuedAsset = xrplIssuedAssetWire satisfies Type<XrplIssuedAsset>
export const xrplServerInfo = xrplServerInfoWire satisfies Type<XrplServerInfoResult>
export const xrplLedgerBody = xrplLedgerBodyWire satisfies Type<XrplLedgerBody>
export const xrplLedger = xrplLedgerWire satisfies Type<XrplLedgerResult>
export const xrplLedgerStateObject = xrplLedgerStateObjectWire satisfies Type<XrplLedgerStateObject>
export const xrplLedgerData = xrplLedgerDataWire
export const xrplAccountInfo = xrplAccountInfoWire satisfies Type<XrplAccountInfoResult>
export const xrplAccountObjects = xrplAccountObjectsWire
export const xrplAccountLines = xrplAccountLinesWire
export const xrplAccountTransactions = xrplAccountTransactionsWire
export const xrplLedgerWithTransactions = xrplLedgerWithTransactionsWire
export const xrplFeature = xrplFeatureWire satisfies Type<XrplFeature>
export const xrplAmmInfo = xrplAmmInfoWire satisfies Type<XrplAmmInfoResult>
