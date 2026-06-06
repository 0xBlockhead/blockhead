export type EsploraBlock = {
	id: string
	height: number
	version: number
	timestamp: number
	tx_count: number
	size: number
	weight: number
	merkle_root: string
	previousblockhash?: string
	mediantime: number
	nonce: number
	bits: number
	difficulty: number
}

export type EsploraTransaction = {
	txid: string
	version: number
	locktime: number
	size: number
	weight: number
	fee?: number
	status: {
		confirmed: boolean
		block_height?: number
		block_hash?: string
		block_time?: number
	}
	vin: EsploraTransactionInput[]
	vout: EsploraTransactionOutput[]
}

export type EsploraTransactionInput = {
	txid?: string
	vout?: number
	prevout?: EsploraTransactionOutput
	scriptsig?: string
	scriptsig_asm?: string
	witness?: string[]
	is_coinbase: boolean
	sequence: number
}

export type EsploraTransactionOutput = {
	scriptpubkey: string
	scriptpubkey_asm?: string
	scriptpubkey_type: string
	scriptpubkey_address?: string
	value: number
}

export type EsploraAssetStats = {
	tx_count: number
	issuance_count?: number
	issued_amount?: number
	burned_amount?: number
	has_blinded_issuances?: boolean
	reissuance_tokens?: number | null
	burned_reissuance_tokens?: number
	peg_in_count?: number
	peg_in_amount?: number
	peg_out_count?: number
	peg_out_amount?: number
	burn_count?: number
}

export type EsploraAsset = {
	asset_id: string
	name?: string
	ticker?: string
	precision?: number
	entity?: {
		domain: string
	}
	contract?: unknown
	chain_stats: EsploraAssetStats
	mempool_stats: EsploraAssetStats
}
