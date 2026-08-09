import {
	type as arktype,
	type Type,
} from 'arktype'

export const stellarHorizonLinkWire = arktype({
	href: 'string',
})

export type StellarHorizonLink = typeof stellarHorizonLinkWire.infer

export const stellarHorizonAssetTypeWire = arktype(
	"'native' | 'credit_alphanum4' | 'credit_alphanum12'"
)

export type StellarHorizonIssuedAssetType = typeof stellarHorizonAssetTypeWire.infer

export const stellarHorizonBalanceAssetTypeWire = arktype(
	"'native' | 'credit_alphanum4' | 'credit_alphanum12' | 'liquidity_pool_shares'"
)

export type StellarHorizonBalanceAssetType = typeof stellarHorizonBalanceAssetTypeWire.infer

export const stellarHorizonBalanceWire = arktype({
	asset_type: stellarHorizonBalanceAssetTypeWire,
	balance: 'string > 0',
	'buying_liabilities?': 'string',
	'selling_liabilities?': 'string',
	'limit?': 'string',
	'asset_code?': 'string',
	'asset_issuer?': 'string',
	'liquidity_pool_id?': 'string',
	'last_modified_ledger?': 'number.integer >= 0',
	'is_authorized?': 'boolean',
	'is_authorized_to_maintain_liabilities?': 'boolean',
	'is_clawback_enabled?': 'boolean',
})

export type StellarHorizonBalance = typeof stellarHorizonBalanceWire.infer

const stellarHorizonSignerWeightWire = arktype('number.integer >= 0 <= 255')

export const stellarHorizonSignerWire = arktype({
	key: 'string > 0',
	weight: stellarHorizonSignerWeightWire,
	type: "'ed25519_public_key' | 'sha256_hash' | 'preauth_tx'",
	'sponsor?': 'string',
}).onUndeclaredKey('delete')

export type StellarHorizonSigner = typeof stellarHorizonSignerWire.infer

export const stellarHorizonThresholdsWire = arktype({
	low_threshold: stellarHorizonSignerWeightWire,
	med_threshold: stellarHorizonSignerWeightWire,
	high_threshold: stellarHorizonSignerWeightWire,
}).onUndeclaredKey('delete')

export type StellarHorizonThresholds = typeof stellarHorizonThresholdsWire.infer

export const stellarHorizonAccountWire = arktype({
	id: 'string > 0',
	account_id: 'string > 0',
	sequence: 'string > 0',
	subentry_count: 'number.integer >= 0',
	last_modified_ledger: 'number.integer >= 0',
	last_modified_time: 'string > 0',
	thresholds: stellarHorizonThresholdsWire,
	balances: stellarHorizonBalanceWire.array(),
	signers: stellarHorizonSignerWire.array(),
})

export type StellarHorizonAccount = typeof stellarHorizonAccountWire.infer

export const stellarHorizonTransactionWire = arktype({
	id: 'string > 0',
	paging_token: 'string > 0',
	successful: 'boolean',
	hash: 'string > 0',
	ledger: 'number.integer >= 0',
	created_at: 'string > 0',
	source_account: 'string > 0',
	source_account_sequence: 'string > 0',
	fee_account: 'string > 0',
	fee_charged: 'string > 0',
	max_fee: 'string > 0',
	operation_count: 'number.integer >= 0',
	memo_type: 'string > 0',
	'memo?': 'string',
	'envelope_xdr?': 'string > 0',
	'result_xdr?': 'string > 0',
	'result_meta_xdr?': 'string > 0',
	'fee_meta_xdr?': 'string > 0',
	'signatures?': 'string[]',
})

export type StellarHorizonTransaction = typeof stellarHorizonTransactionWire.infer

export const stellarHorizonOperationWire = arktype({
	id: 'string > 0',
	paging_token: 'string > 0',
	transaction_hash: 'string > 0',
	type: 'string > 0',
	type_i: 'number.integer >= 0',
	created_at: 'string > 0',
	'transaction_successful?': 'boolean',
	'source_account?': 'string',
	'from?': 'string',
	'to?': 'string',
	'account?': 'string',
	'into?': 'string',
	'trustor?': 'string',
	'trustee?': 'string',
	'funder?': 'string',
	'amount?': 'string',
	'asset_type?': stellarHorizonAssetTypeWire,
	'asset_code?': 'string',
	'asset_issuer?': 'string',
}).and(arktype('Record<string, unknown>'))

export type StellarHorizonOperation = typeof stellarHorizonOperationWire.infer

export const stellarHorizonPaymentWire = stellarHorizonOperationWire

export type StellarHorizonPayment = typeof stellarHorizonPaymentWire.infer

export const stellarHorizonAssetIdentityWire = arktype({
	asset_type: stellarHorizonAssetTypeWire,
	'asset_code?': 'string',
	'asset_issuer?': 'string',
})

export type StellarHorizonAssetIdentity = typeof stellarHorizonAssetIdentityWire.infer

export const stellarHorizonOfferWire = arktype({
	id: 'string > 0',
	paging_token: 'string > 0',
	seller: 'string > 0',
	selling: stellarHorizonAssetIdentityWire,
	buying: stellarHorizonAssetIdentityWire,
	amount: 'string > 0',
	price_r: {
		n: 'number.integer >= 0',
		d: 'number.integer >= 0',
	},
	price: 'string > 0',
	last_modified_ledger: 'number.integer >= 0',
	last_modified_time: 'string | null',
	'sponsor?': 'string',
})

export type StellarHorizonOffer = typeof stellarHorizonOfferWire.infer

export const stellarHorizonTradeWire = arktype({
	id: 'string > 0',
	paging_token: 'string > 0',
	ledger_close_time: 'string > 0',
	trade_type: "'orderbook' | 'liquidity_pool'",
	'base_offer_id?': 'string',
	'base_account?': 'string',
	'base_liquidity_pool_id?': 'string',
	base_amount: 'string > 0',
	base_asset_type: stellarHorizonAssetTypeWire,
	'base_asset_code?': 'string',
	'base_asset_issuer?': 'string',
	'counter_offer_id?': 'string',
	'counter_account?': 'string',
	'counter_liquidity_pool_id?': 'string',
	counter_amount: 'string > 0',
	counter_asset_type: stellarHorizonAssetTypeWire,
	'counter_asset_code?': 'string',
	'counter_asset_issuer?': 'string',
	'base_is_seller?': 'boolean',
	price: {
		n: 'string | number',
		d: 'string | number',
	},
})

export type StellarHorizonTrade = typeof stellarHorizonTradeWire.infer

export const stellarHorizonPageWire = <_RecordWire extends Type>(
	recordWire: _RecordWire
) => (
	arktype({
		_links: {
			next: stellarHorizonLinkWire,
		},
		_embedded: {
			records: recordWire.array(),
		},
	})
)

export type StellarHorizonPage<_Record> = {
	_links: {
		next: StellarHorizonLink
	}
	_embedded: {
		records: _Record[]
	}
}

export const stellarHorizonAccountPageWire = stellarHorizonPageWire(stellarHorizonAccountWire)
export const stellarHorizonTransactionPageWire = stellarHorizonPageWire(stellarHorizonTransactionWire)
export const stellarHorizonOperationPageWire = stellarHorizonPageWire(stellarHorizonOperationWire)
export const stellarHorizonPaymentPageWire = stellarHorizonPageWire(stellarHorizonPaymentWire)
export const stellarHorizonOfferPageWire = stellarHorizonPageWire(stellarHorizonOfferWire)
export const stellarHorizonTradePageWire = stellarHorizonPageWire(stellarHorizonTradeWire)

export const stellarHorizonLink = stellarHorizonLinkWire satisfies Type<StellarHorizonLink>
export const stellarHorizonBalance = stellarHorizonBalanceWire satisfies Type<StellarHorizonBalance>
export const stellarHorizonSigner = stellarHorizonSignerWire satisfies Type<StellarHorizonSigner>
export const stellarHorizonThresholds = stellarHorizonThresholdsWire satisfies Type<StellarHorizonThresholds>
export const stellarHorizonAccount = stellarHorizonAccountWire satisfies Type<StellarHorizonAccount>
export const stellarHorizonTransaction = stellarHorizonTransactionWire satisfies Type<StellarHorizonTransaction>
export const stellarHorizonOperation = stellarHorizonOperationWire satisfies Type<StellarHorizonOperation>
export const stellarHorizonPayment = stellarHorizonPaymentWire satisfies Type<StellarHorizonPayment>
export const stellarHorizonAssetIdentity = stellarHorizonAssetIdentityWire satisfies Type<StellarHorizonAssetIdentity>
export const stellarHorizonOffer = stellarHorizonOfferWire satisfies Type<StellarHorizonOffer>
export const stellarHorizonTrade = stellarHorizonTradeWire satisfies Type<StellarHorizonTrade>
