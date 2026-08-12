import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type BitcoinCoreScannedUtxo = {
	txid: string
	vout: number
	scriptPubKey: string
	amount: number
	height: number
}

export type BitcoinCoreScanTxOutSet = {
	success?: boolean
	unspents: BitcoinCoreScannedUtxo[]
	total_amount: number
}

export type BitcoinCoreValidatedAddress = {
	isvalid: boolean
	address?: string
}

export type BitcoinCoreBlockTemplate = {
	version: number
	rules: string[]
	previousblockhash: string
	transactions: {
		data: string
		txid: string
		hash: string
		depends: number[]
		fee: number
		sigops: number
		weight: number
	}[]
	coinbasevalue: number
	target: string
	mintime: number
	mutable: string[]
	noncerange: string
	sigoplimit: number
	sizelimit: number
	weightlimit: number
	curtime: number
	bits: string
	height: number
	default_witness_commitment?: string
}

export type BitcoinCoreSmartFeeEstimate = {
	feerate?: number
	errors?: string[]
	blocks: number
}

export type BitcoinCoreMempoolEntry = {
	vsize: number
	weight: number
	time: number
	height: number
	descendantcount: number
	descendantsize: number
	ancestorcount: number
	ancestorsize: number
	wtxid: string
	fees: {
		base: number
		modified: number
		ancestor: number
		descendant: number
	}
	depends: string[]
	spentby: string[]
	'bip125-replaceable': boolean
	unbroadcast?: boolean
}

const bitcoinCoreTransactionInput = arktype({
	'txid?': 'string',
	'vout?': 'number.integer >= 0',
	'scriptSig?': {
		asm: 'string',
		hex: 'string',
	},
	'coinbase?': 'string',
	sequence: 'number.integer >= 0',
	'txinwitness?': 'string[]',
})

const bitcoinCoreTransactionOutput = arktype({
	value: 'number',
	n: 'number.integer >= 0',
	scriptPubKey: {
		asm: 'string',
		'desc?': 'string',
		hex: 'string',
		'address?': 'string',
		type: 'string',
	},
})

export const bitcoinCoreTransaction = arktype({
	txid: 'string',
	hash: 'string',
	version: 'number.integer',
	size: 'number.integer >= 0',
	vsize: 'number.integer >= 0',
	weight: 'number.integer >= 0',
	locktime: 'number.integer >= 0',
	vin: bitcoinCoreTransactionInput.array(),
	vout: bitcoinCoreTransactionOutput.array(),
	'hex?': 'string',
	'blockhash?': 'string',
	'confirmations?': 'number.integer >= 0',
	'time?': 'number.integer >= 0',
	'blocktime?': 'number.integer >= 0',
}) satisfies Type<BitcoinCoreTransaction>

export const bitcoinCoreBlock = arktype({
	hash: 'string',
	'confirmations?': 'number.integer >= 0',
	height: 'number.integer >= 0',
	version: 'number.integer',
	versionHex: 'string',
	merkleroot: 'string',
	time: 'number.integer >= 0',
	mediantime: 'number.integer >= 0',
	nonce: 'number.integer >= 0',
	bits: 'string',
	difficulty: 'number',
	'size?': 'number.integer >= 0',
	'weight?': 'number.integer >= 0',
	chainwork: 'string',
	nTx: 'number.integer >= 0',
	'previousblockhash?': 'string',
	'nextblockhash?': 'string',
	tx: bitcoinCoreTransaction.array().or('string[]'),
}) satisfies Type<BitcoinCoreBlock>

export const bitcoinCoreMempoolInfo = arktype({
	loaded: 'boolean',
	size: 'number.integer >= 0',
	bytes: 'number.integer >= 0',
	usage: 'number.integer >= 0',
	total_fee: 'number',
	maxmempool: 'number.integer >= 0',
	mempoolminfee: 'number',
	minrelaytxfee: 'number',
}) satisfies Type<BitcoinCoreMempoolInfo>

export const bitcoinCoreValidatedAddress = arktype({
	isvalid: 'boolean',
	'address?': 'string',
}) satisfies Type<BitcoinCoreValidatedAddress>

export const bitcoinCoreScannedUtxo = arktype({
	txid: 'string',
	vout: 'number.integer >= 0',
	scriptPubKey: 'string',
	amount: 'number',
	height: 'number.integer >= 0',
}) satisfies Type<BitcoinCoreScannedUtxo>

export const bitcoinCoreScanTxOutSet = arktype({
	'success?': 'boolean',
	unspents: bitcoinCoreScannedUtxo.array(),
	total_amount: 'number',
}) satisfies Type<BitcoinCoreScanTxOutSet>

export const bitcoinCoreBlockTemplate = arktype({
	version: 'number.integer',
	rules: 'string[]',
	previousblockhash: 'string',
	transactions: arktype({
		data: 'string',
		txid: 'string',
		hash: 'string',
		depends: 'number.integer[]',
		fee: 'number.integer',
		sigops: 'number.integer >= 0',
		weight: 'number.integer >= 0',
	}).array(),
	coinbasevalue: 'number.integer >= 0',
	target: 'string',
	mintime: 'number.integer >= 0',
	mutable: 'string[]',
	noncerange: 'string',
	sigoplimit: 'number.integer >= 0',
	sizelimit: 'number.integer >= 0',
	weightlimit: 'number.integer >= 0',
	curtime: 'number.integer >= 0',
	bits: 'string',
	height: 'number.integer >= 0',
	'default_witness_commitment?': 'string',
}) satisfies Type<BitcoinCoreBlockTemplate>

export const bitcoinCoreSmartFeeEstimate = arktype({
	'feerate?': 'number',
	'errors?': 'string[]',
	blocks: 'number.integer >= 0',
}) satisfies Type<BitcoinCoreSmartFeeEstimate>

export const bitcoinCoreMempoolEntry = arktype({
	vsize: 'number.integer >= 0',
	weight: 'number.integer >= 0',
	time: 'number.integer >= 0',
	height: 'number.integer >= 0',
	descendantcount: 'number.integer >= 0',
	descendantsize: 'number.integer >= 0',
	ancestorcount: 'number.integer >= 0',
	ancestorsize: 'number.integer >= 0',
	wtxid: 'string',
	fees: {
		base: 'number >= 0',
		modified: 'number >= 0',
		ancestor: 'number >= 0',
		descendant: 'number >= 0',
	},
	depends: 'string[]',
	spentby: 'string[]',
	'bip125-replaceable': 'boolean',
	'unbroadcast?': 'boolean',
}) satisfies Type<BitcoinCoreMempoolEntry>

export const bitcoinCoreBlockHash = arktype('string')
export const bitcoinCoreBlockCount = arktype('number.integer >= 0')
export const bitcoinCoreNetworkHashrate = arktype('number >= 0')
export const bitcoinCoreMempoolTransactionIds = arktype('string[]')
