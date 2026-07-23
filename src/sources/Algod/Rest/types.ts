export type AlgodAssetHolding = {
	amount: number
	'asset-id': number
	'is-frozen': boolean
}

export type AlgodAccount = {
	address: string
	amount: number
	'amount-without-pending-rewards': number
	assets?: AlgodAssetHolding[]
	'auth-addr'?: string
	'min-balance': number
	'pending-rewards': number
	rewards: number
	round: number
	status: string
	'total-assets-opted-in': number
}

export type AlgodAccountResponse = AlgodAccount
