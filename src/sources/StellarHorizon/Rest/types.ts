export type StellarHorizonLink = {
	href: string
}

export type StellarHorizonPage<_Record> = {
	_links: {
		next: StellarHorizonLink
	}
	_embedded: {
		records: _Record[]
	}
}

export type StellarHorizonBalance = {
	asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12' | 'liquidity_pool_shares'
	balance: string
	buying_liabilities?: string
	selling_liabilities?: string
	limit?: string
	asset_code?: string
	asset_issuer?: string
	liquidity_pool_id?: string
	last_modified_ledger?: number
	is_authorized?: boolean
	is_authorized_to_maintain_liabilities?: boolean
	is_clawback_enabled?: boolean
}

export type StellarHorizonSigner = {
	key: string
	weight: number
	type: 'ed25519_public_key' | 'sha256_hash' | 'preauth_tx'
	sponsor?: string
}

export type StellarHorizonAccount = {
	id: string
	account_id: string
	sequence: string
	subentry_count: number
	last_modified_ledger: number
	last_modified_time: string
	balances: StellarHorizonBalance[]
	signers: StellarHorizonSigner[]
}

export type StellarHorizonTransaction = {
	id: string
	paging_token: string
	successful: boolean
	hash: string
	ledger: number
	created_at: string
	source_account: string
	source_account_sequence: string
	fee_account: string
	fee_charged: string
	max_fee: string
	operation_count: number
	memo_type: string
	memo?: string
}

export type StellarHorizonOperation = {
	id: string
	paging_token: string
	transaction_hash: string
	type: string
	type_i: number
	created_at: string
	transaction_successful?: boolean
	source_account?: string
	from?: string
	to?: string
	account?: string
	into?: string
	trustor?: string
	trustee?: string
	funder?: string
}

export type StellarHorizonPayment = StellarHorizonOperation & {
	amount?: string
	asset_type?: 'native' | 'credit_alphanum4' | 'credit_alphanum12'
	asset_code?: string
	asset_issuer?: string
}

export type StellarHorizonAssetIdentity = {
	asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12'
	asset_code?: string
	asset_issuer?: string
}

export type StellarHorizonOffer = {
	id: string
	paging_token: string
	seller: string
	selling: StellarHorizonAssetIdentity
	buying: StellarHorizonAssetIdentity
	amount: string
	price_r: {
		n: number
		d: number
	}
	price: string
	last_modified_ledger: number
	last_modified_time: string | null
	sponsor?: string
}

export type StellarHorizonTrade = {
	id: string
	paging_token: string
	ledger_close_time: string
	trade_type: 'orderbook' | 'liquidity_pool'
	base_offer_id?: string
	base_account?: string
	base_liquidity_pool_id?: string
	base_amount: string
	base_asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12'
	base_asset_code?: string
	base_asset_issuer?: string
	counter_offer_id?: string
	counter_account?: string
	counter_liquidity_pool_id?: string
	counter_amount: string
	counter_asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12'
	counter_asset_code?: string
	counter_asset_issuer?: string
	base_is_seller?: boolean
	price: {
		n: string | number
		d: string | number
	}
}
