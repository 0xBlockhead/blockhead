import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'

export type XrplLedgerSpecifier = 'validated' | number

export type XrplMarker = JsonValue

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
	marker?: XrplMarker
}

export type XrplAccountRoot = {
	Account: string
	Balance: string
	Flags: number
	LedgerEntryType: string
	OwnerCount: number
	Sequence: number
	PreviousTxnID?: string
	PreviousTxnLgrSeq?: number
	index?: string
}

export type XrplAccountInfoResult = {
	account_data: XrplAccountRoot
	ledger_hash?: string
	ledger_index?: number
	validated: boolean
}

export type XrplAccountObjectsResult = {
	account: string
	account_objects: readonly XrplLedgerStateObject[]
	ledger_hash?: string
	ledger_index?: number
	limit?: number
	marker?: XrplMarker
	validated: boolean
}

export type XrplAccountLine = {
	account: string
	balance: string
	currency: string
	limit: string
	limit_peer: string
	no_ripple?: boolean
	no_ripple_peer?: boolean
	authorized?: boolean
	peer_authorized?: boolean
}

export type XrplAccountLinesResult = {
	account: string
	ledger_hash?: string
	ledger_index?: number
	lines: readonly XrplAccountLine[]
	limit?: number
	marker?: XrplMarker
	validated: boolean
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

export type XrplAccountTransaction = {
	close_time_iso?: string
	hash?: string
	ledger_hash?: string
	ledger_index: number
	meta: XrplAccountTransactionMeta
	tx?: XrplAccountTransactionJson
	tx_json?: XrplAccountTransactionJson
	validated: boolean
}

export type XrplAccountTransactionsResult = {
	account: string
	ledger_index_min: number
	ledger_index_max: number
	limit?: number
	marker?: XrplMarker
	transactions: readonly XrplAccountTransaction[]
	validated: boolean
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
