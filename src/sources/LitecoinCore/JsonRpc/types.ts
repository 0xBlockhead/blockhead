import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type LitecoinCoreBlock = BitcoinCoreBlock

export type LitecoinCoreScannedUtxo = {
	txid: string
	vout: number
	scriptPubKey: string
	amount: number
	height: number
}

export type LitecoinCoreScanTxOutSet = {
	success?: boolean
	unspents: LitecoinCoreScannedUtxo[]
	total_amount: number
}

export type LitecoinCoreValidatedAddress = {
	isvalid: boolean
	address?: string
}

const litecoinCoreTransactionInput = arktype({
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

const litecoinCoreTransactionOutput = arktype({
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

export const litecoinCoreTransaction = arktype({
	txid: 'string',
	hash: 'string',
	version: 'number.integer',
	size: 'number.integer >= 0',
	vsize: 'number.integer >= 0',
	weight: 'number.integer >= 0',
	locktime: 'number.integer >= 0',
	vin: litecoinCoreTransactionInput.array(),
	vout: litecoinCoreTransactionOutput.array(),
	'hex?': 'string',
	'blockhash?': 'string',
	'confirmations?': 'number.integer >= 0',
	'time?': 'number.integer >= 0',
	'blocktime?': 'number.integer >= 0',
}) satisfies Type<BitcoinCoreTransaction>

export const litecoinCoreBlock = arktype({
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
	tx: litecoinCoreTransaction.array().or('string[]'),
}) satisfies Type<LitecoinCoreBlock>

export const litecoinCoreMempoolInfo = arktype({
	loaded: 'boolean',
	size: 'number.integer >= 0',
	bytes: 'number.integer >= 0',
	usage: 'number.integer >= 0',
	total_fee: 'number',
	maxmempool: 'number.integer >= 0',
	mempoolminfee: 'number',
	minrelaytxfee: 'number',
}) satisfies Type<BitcoinCoreMempoolInfo>

export const litecoinCoreValidatedAddress = arktype({
	isvalid: 'boolean',
	'address?': 'string',
}) satisfies Type<LitecoinCoreValidatedAddress>

export const litecoinCoreScannedUtxo = arktype({
	txid: 'string',
	vout: 'number.integer >= 0',
	scriptPubKey: 'string',
	amount: 'number',
	height: 'number.integer >= 0',
}) satisfies Type<LitecoinCoreScannedUtxo>

export const litecoinCoreScanTxOutSet = arktype({
	'success?': 'boolean',
	unspents: litecoinCoreScannedUtxo.array(),
	total_amount: 'number',
}) satisfies Type<LitecoinCoreScanTxOutSet>

export const litecoinCoreBlockHash = arktype('string')
export const litecoinCoreBlockCount = arktype('number.integer >= 0')
