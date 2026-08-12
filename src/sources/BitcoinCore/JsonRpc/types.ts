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

export const bitcoinCoreBlockHash = arktype('string')
export const bitcoinCoreBlockCount = arktype('number.integer >= 0')
export const bitcoinCoreMempoolTransactionIds = arktype('string[]')
