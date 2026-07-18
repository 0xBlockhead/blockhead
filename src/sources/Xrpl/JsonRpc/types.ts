export type XrplServerInfoResult = {
	info: {
		complete_ledgers?: string
		load_factor?: number
		peers?: number
		validated_ledger?: {
			hash: string
			seq: number
		}
	}
}

export type XrplLedgerResult = {
	ledger_hash: string
	ledger_index: number
	validated: boolean
}

export type XrplIssuedAsset = {
	currency: string
	issuer?: string
	value?: string
}

export type XrplLedgerStateObject = {
	index: string
	LedgerEntryType: string
	Account?: string
	PreviousTxnID?: string
	PreviousTxnLgrSeq?: number
	Asset?: XrplIssuedAsset
	Asset2?: XrplIssuedAsset
	LPTokenBalance?: XrplIssuedAsset
}

export type XrplLedgerDataResult = {
	ledger_hash: string
	ledger_index: number
	state: readonly XrplLedgerStateObject[]
	marker?: string
}

export type XrplLedgerTransaction = {
	hash: string
	TransactionType: string
	Account: string
	Sequence?: number
}

export type XrplLedgerWithTransactionsResult = XrplLedgerResult & {
	transactions?: readonly XrplLedgerTransaction[]
}

export type XrplFeature = {
	name?: string
	enabled?: boolean
	supported?: boolean
	vetoed?: boolean
	default?: boolean
}

export type XrplFeatureResult = {
	readonly [amendmentId: string]: XrplFeature
}
