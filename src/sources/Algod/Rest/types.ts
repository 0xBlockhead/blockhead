export type AlgodNodeStatus = {
	'last-round': number
	'last-version': string
	'next-version': string
	'next-version-round': number
	'next-version-supported': boolean
	'stopped-at-unsupported-round': boolean
	'catchup-time': number
	'time-since-last-round': number
	catchpoint?: string
	'last-catchpoint'?: string
	'catchpoint-acquired-blocks'?: number
	'catchpoint-processed-accounts'?: number
	'catchpoint-processed-kvs'?: number
	'catchpoint-total-accounts'?: number
	'catchpoint-total-blocks'?: number
	'catchpoint-total-kvs'?: number
	'catchpoint-verified-accounts'?: number
	'catchpoint-verified-kvs'?: number
	'upgrade-delay'?: number
	'upgrade-next-protocol-vote-before'?: number
	'upgrade-no-votes'?: number
	'upgrade-node-vote'?: boolean
	'upgrade-vote-rounds'?: number
	'upgrade-votes'?: number
	'upgrade-votes-required'?: number
	'upgrade-yes-votes'?: number
}

export type AlgodSignedTransaction = {
	sig?: string
	msig?: unknown
	lsig?: unknown
	sgnr?: string
	txn: {
		snd: string
		type: string
		fee?: number
		fv?: number
		lv?: number
		gen?: string
		gh?: string
		note?: string
		grp?: string
		lx?: string
		rekey?: string
		[key: string]: unknown
	}
}

export type AlgodPendingTransactions = {
	'top-transactions': AlgodSignedTransaction[]
	'total-transactions': number
}

export type AlgodPendingTransaction = {
	'txn': AlgodSignedTransaction
	'pool-error': string
	'confirmed-round'?: number
	'application-index'?: number
	'asset-index'?: number
	'closing-amount'?: number
	'asset-closing-amount'?: number
	'sender-rewards'?: number
	'receiver-rewards'?: number
	'close-rewards'?: number
	logs?: string[]
	'inner-txns'?: AlgodPendingTransaction[]
	'global-state-delta'?: unknown
	'local-state-delta'?: unknown
}

export type AlgodParticipationKey = {
	address: string
	id: string
	key: {
		'selection-participation-key': string
		'vote-participation-key': string
		'vote-first-valid': number
		'vote-last-valid': number
		'vote-key-dilution': number
		'state-proof-key'?: string
	}
	'effective-first-valid'?: number
	'effective-last-valid'?: number
	'last-block-proposal'?: number
	'last-state-proof'?: number
	'last-vote'?: number
}

export type AlgodTransactionParams = {
	'consensus-version': string
	fee: number
	'genesis-hash': string
	'genesis-id': string
	'last-round': number
	'min-fee': number
}

export type AlgodBlockHash = {
	blockHash: string
}

export type AlgodTransactionProof = {
	hashtype: 'sha512_256' | 'sha256'
	idx: number
	proof: string
	stibhash: string
	treedepth: number
}

export type AlgodApplicationBox = {
	name: string
	value: string
}
