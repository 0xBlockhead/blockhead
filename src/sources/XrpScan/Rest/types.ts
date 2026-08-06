import {
	type as arktype,
	type Type,
} from 'arktype'

export const xrpScanIssuedAssetWire = arktype({
	currency: 'string > 0',
	'issuer?': 'string > 0',
	'value?': 'string > 0',
})

export type XrpScanIssuedAsset = typeof xrpScanIssuedAssetWire.infer

export const xrpScanAmountWire = arktype('string > 0').or(xrpScanIssuedAssetWire)

export const xrpScanServerInfoWire = arktype({
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

export type XrpScanServerInfo = typeof xrpScanServerInfoWire.infer

export const xrpScanAccountWire = arktype({
	Account: 'string > 0',
	Balance: 'string > 0',
	Flags: 'number.integer >= 0',
	LedgerEntryType: 'string > 0',
	OwnerCount: 'number.integer >= 0',
	Sequence: 'number.integer >= 0',
	'account?': 'string > 0',
	'index?': 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	'PreviousTxnID?': 'string > 0',
	'PreviousTxnLgrSeq?': 'number.integer >= 0',
})

export type XrpScanAccount = typeof xrpScanAccountWire.infer

export const xrpScanLedgerWire = arktype({
	ledger_index: 'number.integer >= 0',
	ledger_hash: 'string > 0',
	'close_time?': 'number.integer >= 0',
	'close_time_human?': 'string > 0',
	'parent_hash?': 'string > 0',
	'transaction_hash?': 'string > 0',
	'total_coins?': arktype('string > 0').or('number.integer >= 0'),
	'tx_count?': 'number.integer >= 0',
})

export type XrpScanLedger = typeof xrpScanLedgerWire.infer

export const xrpScanLedgersWire = arktype({
	current_ledger: 'number.integer >= 0',
	ledgers: xrpScanLedgerWire.array(),
})

export type XrpScanLedgers = typeof xrpScanLedgersWire.infer

export const xrpScanTransactionMetaWire = arktype({
	'TransactionResult?': 'string > 0',
	'TransactionIndex?': 'number.integer >= 0',
	'AffectedNodes?': 'unknown',
	'delivered_amount?': 'unknown',
})

export const xrpScanTransactionWire = arktype({
	hash: 'string > 0',
	TransactionType: 'string > 0',
	Account: 'string > 0',
	'Sequence?': 'number.integer >= 0',
	'Fee?': arktype('string').or('number.integer >= 0'),
	'ledger_index?': 'number.integer >= 0',
	'date?': 'string > 0',
	'validated?': 'boolean',
	'meta?': xrpScanTransactionMetaWire,
})

export type XrpScanTransaction = typeof xrpScanTransactionWire.infer

export const xrpScanAccountTransactionsWire = arktype({
	account: 'string > 0',
	ledger_index_min: 'number.integer',
	ledger_index_max: 'number.integer',
	'limit?': 'number.integer >= 0',
	'marker?': 'string > 0',
	transactions: xrpScanTransactionWire.array(),
})

export type XrpScanAccountTransactions = typeof xrpScanAccountTransactionsWire.infer

export const xrpScanTrustlineWire = arktype({
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

export type XrpScanTrustline = typeof xrpScanTrustlineWire.infer

export const xrpScanAccountTrustlinesWire = arktype({
	account: 'string > 0',
	'ledger_index?': 'number.integer >= 0',
	'ledger_current_index?': 'number.integer >= 0',
	'validated?': 'boolean',
	lines: xrpScanTrustlineWire.array(),
	'marker?': 'string > 0',
})

export type XrpScanAccountTrustlines = typeof xrpScanAccountTrustlinesWire.infer

export const xrpScanAmmAuctionSlotWire = arktype({
	'account?': 'string > 0',
	'expiration?': 'number.integer >= 0',
	'discounted_fee?': 'number.integer >= 0',
	'price?': xrpScanIssuedAssetWire,
	'auth_accounts?': arktype({
		'account?': 'string > 0',
	}).array(),
})

export const xrpScanAmmVoteSlotWire = arktype({
	'account?': 'string > 0',
	'trading_fee?': 'number.integer >= 0',
	'vote_weight?': 'number.integer >= 0',
})

export const xrpScanAmmWire = arktype({
	account: 'string > 0',
	amount: xrpScanAmountWire,
	amount2: xrpScanAmountWire,
	'asset_frozen?': 'boolean',
	'asset2_frozen?': 'boolean',
	'auction_slot?': xrpScanAmmAuctionSlotWire,
	'lp_token?': xrpScanIssuedAssetWire,
	'trading_fee?': 'number.integer >= 0',
	'vote_slots?': xrpScanAmmVoteSlotWire.array(),
})

export type XrpScanAmm = typeof xrpScanAmmWire.infer

export const xrpScanObjectNodeWire = arktype({
	LedgerEntryType: 'string > 0',
	'Account?': 'string > 0',
	'PreviousTxnID?': 'string > 0',
	'PreviousTxnLgrSeq?': 'number.integer >= 0',
	'index?': 'string > 0',
})

export const xrpScanObjectWire = arktype({
	index: 'string > 0',
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
	node: xrpScanObjectNodeWire,
	validated: 'boolean',
})

export type XrpScanObject = typeof xrpScanObjectWire.infer

export const xrpScanServerInfo = xrpScanServerInfoWire satisfies Type<XrpScanServerInfo>
export const xrpScanAccount = xrpScanAccountWire satisfies Type<XrpScanAccount>
export const xrpScanLedger = xrpScanLedgerWire satisfies Type<XrpScanLedger>
export const xrpScanLedgers = xrpScanLedgersWire satisfies Type<XrpScanLedgers>
export const xrpScanTransaction = xrpScanTransactionWire satisfies Type<XrpScanTransaction>
export const xrpScanAccountTransactions = xrpScanAccountTransactionsWire satisfies Type<XrpScanAccountTransactions>
export const xrpScanAccountTrustlines = xrpScanAccountTrustlinesWire satisfies Type<XrpScanAccountTrustlines>
export const xrpScanAmm = xrpScanAmmWire satisfies Type<XrpScanAmm>
export const xrpScanObject = xrpScanObjectWire satisfies Type<XrpScanObject>
