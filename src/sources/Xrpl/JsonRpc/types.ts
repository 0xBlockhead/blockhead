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
