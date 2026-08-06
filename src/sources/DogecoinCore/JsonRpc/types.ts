import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type DogecoinCoreAuxPow = {
	tx: BitcoinCoreTransaction
	index: number
	chainindex: number
	merklebranch: string[]
	chainmerklebranch: string[]
	parentblock: string
}

export type DogecoinCoreBlock = BitcoinCoreBlock & {
	auxpow?: DogecoinCoreAuxPow
}

export type DogecoinCoreScannedUtxo = {
	txid: string
	vout: number
	scriptPubKey: string
	amount: number
	height: number
}

export type DogecoinCoreScanTxOutSet = {
	success?: boolean
	unspents: DogecoinCoreScannedUtxo[]
	total_amount: number
}

export type DogecoinCoreValidatedAddress = {
	isvalid: boolean
	address?: string
}

const dogecoinCoreTransactionInput = arktype({
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

const dogecoinCoreTransactionOutput = arktype({
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

export const dogecoinCoreTransaction = arktype({
	txid: 'string',
	hash: 'string',
	version: 'number.integer',
	size: 'number.integer >= 0',
	vsize: 'number.integer >= 0',
	weight: 'number.integer >= 0',
	locktime: 'number.integer >= 0',
	vin: dogecoinCoreTransactionInput.array(),
	vout: dogecoinCoreTransactionOutput.array(),
	'hex?': 'string',
	'blockhash?': 'string',
	'confirmations?': 'number.integer >= 0',
	'time?': 'number.integer >= 0',
	'blocktime?': 'number.integer >= 0',
}) satisfies Type<BitcoinCoreTransaction>

export const dogecoinCoreAuxPow = arktype({
	tx: dogecoinCoreTransaction,
	index: 'number.integer >= 0',
	chainindex: 'number.integer >= 0',
	merklebranch: 'string[]',
	chainmerklebranch: 'string[]',
	parentblock: 'string',
}) satisfies Type<DogecoinCoreAuxPow>

export const dogecoinCoreBlock = arktype({
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
	tx: dogecoinCoreTransaction.array().or('string[]'),
	'auxpow?': dogecoinCoreAuxPow,
}) satisfies Type<DogecoinCoreBlock>

export const dogecoinCoreMempoolInfo = arktype({
	loaded: 'boolean',
	size: 'number.integer >= 0',
	bytes: 'number.integer >= 0',
	usage: 'number.integer >= 0',
	total_fee: 'number',
	maxmempool: 'number.integer >= 0',
	mempoolminfee: 'number',
	minrelaytxfee: 'number',
}) satisfies Type<BitcoinCoreMempoolInfo>

export const dogecoinCoreValidatedAddress = arktype({
	isvalid: 'boolean',
	'address?': 'string',
}) satisfies Type<DogecoinCoreValidatedAddress>

export const dogecoinCoreScannedUtxo = arktype({
	txid: 'string',
	vout: 'number.integer >= 0',
	scriptPubKey: 'string',
	amount: 'number',
	height: 'number.integer >= 0',
}) satisfies Type<DogecoinCoreScannedUtxo>

export const dogecoinCoreScanTxOutSet = arktype({
	'success?': 'boolean',
	unspents: dogecoinCoreScannedUtxo.array(),
	total_amount: 'number',
}) satisfies Type<DogecoinCoreScanTxOutSet>

export const dogecoinCoreBlockHash = arktype('string')
export const dogecoinCoreBlockCount = arktype('number.integer >= 0')
