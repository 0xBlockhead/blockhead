import {
	type as arktype,
	type Type,
} from 'arktype'


export const bithompUnsignedDecimal = '/^(0|[1-9]\\d*)$/'

export const bithompIssuedAmountWire = arktype({
	currency: 'string > 0',
	'issuer?': 'string > 0',
	value: 'string > 0',
})

export type BithompIssuedAmount = typeof bithompIssuedAmountWire.infer

export const bithompAmountWire = arktype(bithompUnsignedDecimal).or(bithompIssuedAmountWire)

export type BithompAmount = typeof bithompAmountWire.infer

export const bithompLedgerInfoWire = arktype({
	'activated?': 'boolean',
	'error?': arktype('string > 0').or('null'),
	ledger: 'number.integer >= 0',
	ledgerTimestamp: 'number.integer >= 0',
	balance: bithompUnsignedDecimal,
	'flags?': 'Record<string, boolean>',
	ownerCount: 'number.integer >= 0',
	sequence: 'number.integer >= 0',
	'previousTxnID?': arktype('string > 0').or('null'),
	'previousTxnLgrSeq?': arktype('number.integer >= 0').or('null'),
	'accountTxnID?': arktype('string > 0').or('null'),
	'regularKey?': arktype('string > 0').or('null'),
	'domain?': arktype('string > 0').or('null'),
	'emailHash?': arktype('string > 0').or('null'),
	'messageKey?': arktype('string > 0').or('null'),
	'tickSize?': arktype('number.integer >= 0').or('null'),
	'transferRate?': arktype('number').or('null'),
	'blackholed?': 'boolean',
	'mintedTokens?': 'number.integer >= 0',
	'burnedTokens?': 'number.integer >= 0',
	'ticketCount?': 'number.integer >= 0',
	'signerList?': 'unknown',
})

export type BithompLedgerInfo = typeof bithompLedgerInfoWire.infer

export const bithompAccountWire = arktype({
	address: 'string > 0',
	'xAddress?': 'string > 0',
	'username?': arktype('string > 0').or('null'),
	'service?': 'unknown',
	'verifiedDomain?': arktype('string > 0').or('null'),
	'inception?': 'number.integer >= 0',
	'initialBalance?': 'number',
	'genesis?': 'boolean',
	'ledgerInfo?': bithompLedgerInfoWire,
})

export type BithompAccount = typeof bithompAccountWire.infer

export const bithompAmmAuctionSlotWire = arktype({
	'account?': 'string > 0',
	'discountedFee?': 'number.integer >= 0',
	'expiration?': 'number.integer >= 0',
	'price?': bithompIssuedAmountWire,
	'accountDetails?': 'unknown',
})

export const bithompAmmVoteSlotWire = arktype({
	'account?': 'string > 0',
	'tradingFee?': 'number.integer >= 0',
	'voteWeight?': 'number.integer >= 0',
	'createdAt?': 'number.integer >= 0',
	'createdLedgerIndex?': 'number.integer >= 0',
	'createdTxHash?': 'string > 0',
	'updatedAt?': 'number.integer >= 0',
	'updatedLedgerIndex?': 'number.integer >= 0',
	'updatedTxHash?': 'string > 0',
	'accountDetails?': 'unknown',
})

export const bithompAmmWire = arktype({
	'ammID?': 'string > 0',
	account: 'string > 0',
	amount: bithompAmountWire,
	amount2: bithompAmountWire,
	'updatedAt?': 'number.integer >= 0',
	'updatedLedgerIndex?': 'number.integer >= 0',
	'updatedTxHash?': 'string > 0',
	'createdAt?': 'number.integer >= 0',
	'createdLedgerIndex?': 'number.integer >= 0',
	'createdTxHash?': 'string > 0',
	'ownerNode?': 'string',
	'tradingFee?': 'number.integer >= 0',
	'lpTokenBalance?': bithompIssuedAmountWire,
	'auctionSlot?': bithompAmmAuctionSlotWire,
	'voteSlots?': bithompAmmVoteSlotWire.array(),
	'holders?': 'number.integer >= 0',
	'accountDetails?': 'unknown',
})

export type BithompAmm = typeof bithompAmmWire.infer

export const bithompAmmsWire = arktype({
	'order?': 'string > 0',
	'marker?': 'string > 0',
	amms: bithompAmmWire.array(),
})

export type BithompAmms = typeof bithompAmmsWire.infer

export const bithompTrustlineWire = arktype({
	counterparty: 'string > 0',
	currency: 'string > 0',
	balance: 'string',
	limit: 'string',
	'ripplingDisabled?': 'boolean',
	'peer?': {
		'limit?': 'string',
		'ripplingDisabled?': 'boolean',
	},
	'lock?': 'unknown',
})

export type BithompTrustline = typeof bithompTrustlineWire.infer

export const bithompTrustlinesWire = bithompTrustlineWire.array()

export type BithompTrustlines = typeof bithompTrustlinesWire.infer

export const bithompTransactionOutcomeWire = arktype({
	'result?': 'string > 0',
	'timestamp?': 'string > 0',
	'fee?': 'string > 0',
	'ledgerIndex?': 'number.integer >= 0',
	'ledgerVersion?': 'number.integer >= 0',
	'indexInLedger?': 'number.integer >= 0',
	'balanceChanges?': 'unknown',
	'deliveredAmount?': 'unknown',
})

export const bithompTransactionWire = arktype({
	'id?': 'string > 0',
	'hash?': 'string > 0',
	'type?': 'string > 0',
	'address?': 'string > 0',
	'sequence?': 'number.integer >= 0',
	'ctid?': 'string > 0',
	'specification?': 'unknown',
	'outcome?': bithompTransactionOutcomeWire,
	'rawTransaction?': 'string > 0',
})

export type BithompTransaction = typeof bithompTransactionWire.infer

export const bithompTransactionsWire = bithompTransactionWire.array()

export type BithompTransactions = typeof bithompTransactionsWire.infer

export const bithompLedgerEntryNodeWire = arktype({
	LedgerEntryType: 'string > 0',
	'Account?': 'string > 0',
	'PreviousTxnID?': 'string > 0',
	'PreviousTxnLgrSeq?': 'number.integer >= 0',
	'index?': 'string > 0',
})

export const bithompLedgerEntryWire = arktype({
	index: 'string > 0',
	ledger_hash: 'string > 0',
	ledger_index: 'number.integer >= 0',
	node: bithompLedgerEntryNodeWire,
	validated: 'boolean',
	'_nodepref?': 'string',
})

export type BithompLedgerEntry = typeof bithompLedgerEntryWire.infer

export const bithompSearchWire = arktype({
	value: 'string > 0',
	'type?': 'string > 0',
	'result?': 'unknown',
})

export type BithompSearch = typeof bithompSearchWire.infer

export const bithompUsernameWire = arktype({
	address: 'string > 0',
	'xAddress?': 'string > 0',
	'username?': arktype('string > 0').or('null'),
	'service?': 'unknown',
	'domain?': arktype('string > 0').or('null'),
	'domain_verified?': 'boolean',
	'verifiedDomain?': arktype('string > 0').or('null'),
	'created?': 'number.integer >= 0',
	'inception?': 'number.integer >= 0',
	'parent?': 'unknown',
})

export type BithompUsername = typeof bithompUsernameWire.infer

export const bithompAccount = bithompAccountWire satisfies Type<BithompAccount>
export const bithompAmm = bithompAmmWire satisfies Type<BithompAmm>
export const bithompAmms = bithompAmmsWire satisfies Type<BithompAmms>
export const bithompTrustlines = bithompTrustlinesWire satisfies Type<BithompTrustlines>
export const bithompTransactions = bithompTransactionsWire satisfies Type<BithompTransactions>
export const bithompLedgerEntry = bithompLedgerEntryWire satisfies Type<BithompLedgerEntry>
export const bithompSearch = bithompSearchWire satisfies Type<BithompSearch>
export const bithompUsername = bithompUsernameWire satisfies Type<BithompUsername>
