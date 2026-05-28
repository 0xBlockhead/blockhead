export type BitcoinCoreBlock = {
	hash: string
	confirmations?: number
	height: number
	version: number
	versionHex: string
	merkleroot: string
	time: number
	mediantime: number
	nonce: number
	bits: string
	difficulty: number
	size?: number
	weight?: number
	chainwork: string
	nTx: number
	previousblockhash?: string
	nextblockhash?: string
	tx: BitcoinCoreTransaction[] | string[]
}

export type BitcoinCoreTransaction = {
	txid: string
	hash: string
	version: number
	size: number
	vsize: number
	weight: number
	locktime: number
	vin: BitcoinCoreTransactionInput[]
	vout: BitcoinCoreTransactionOutput[]
	hex?: string
	blockhash?: string
	confirmations?: number
	time?: number
	blocktime?: number
}

export type BitcoinCoreTransactionInput = {
	txid?: string
	vout?: number
	scriptSig?: {
		asm: string
		hex: string
	}
	coinbase?: string
	sequence: number
	txinwitness?: string[]
}

export type BitcoinCoreTransactionOutput = {
	value: number
	n: number
	scriptPubKey: {
		asm: string
		desc?: string
		hex: string
		address?: string
		type: string
	}
}

export type BitcoinCoreMempoolInfo = {
	loaded: boolean
	size: number
	bytes: number
	usage: number
	total_fee: number
	maxmempool: number
	mempoolminfee: number
	minrelaytxfee: number
}
