import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
	BitcoinCoreTransactionOutput,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type BitcoinCashTokenData = {
	category: string
	amount?: string
	nft?: {
		capability: 'none' | 'mutable' | 'minting'
		commitment: string
	}
}

export type BitcoinCashTransactionOutput = BitcoinCoreTransactionOutput & {
	tokenData?: BitcoinCashTokenData
}

export type BitcoinCashTransaction = Omit<BitcoinCoreTransaction, 'vout'> & {
	vout: BitcoinCashTransactionOutput[]
}

export type BitcoinCashScannedUtxo = {
	txid: string
	vout: number
	scriptPubKey: string
	amount: number
	height: number
	tokenData?: BitcoinCashTokenData
}

export type BitcoinCashScanTxOutSet = {
	success?: boolean
	unspents: BitcoinCashScannedUtxo[]
	total_amount: number
	token_total_amount?: Record<string, string>
}

export type BitcoinCashValidatedAddress = {
	isvalid: boolean
	address?: string
	istokenaware?: boolean
}

const bitcoinCashTokenNft = arktype({
	capability: "'none' | 'mutable' | 'minting'",
	commitment: 'string',
})

export const bitcoinCashTokenData = arktype({
	category: 'string',
	'amount?': 'string',
	'nft?': bitcoinCashTokenNft,
}) satisfies Type<BitcoinCashTokenData>

const bitcoinCashTransactionInput = arktype({
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

const bitcoinCashTransactionOutput = arktype({
	value: 'number',
	n: 'number.integer >= 0',
	scriptPubKey: {
		asm: 'string',
		'desc?': 'string',
		hex: 'string',
		'address?': 'string',
		type: 'string',
	},
	'tokenData?': bitcoinCashTokenData,
}) satisfies Type<BitcoinCashTransactionOutput>

export const bitcoinCashTransaction = arktype({
	txid: 'string',
	hash: 'string',
	version: 'number.integer',
	size: 'number.integer >= 0',
	vsize: 'number.integer >= 0',
	weight: 'number.integer >= 0',
	locktime: 'number.integer >= 0',
	vin: bitcoinCashTransactionInput.array(),
	vout: bitcoinCashTransactionOutput.array(),
	'hex?': 'string',
	'blockhash?': 'string',
	'confirmations?': 'number.integer >= 0',
	'time?': 'number.integer >= 0',
	'blocktime?': 'number.integer >= 0',
}) satisfies Type<BitcoinCashTransaction>

export const bitcoinCashBlock = arktype({
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
	tx: bitcoinCashTransaction.array().or('string[]'),
}) satisfies Type<BitcoinCoreBlock>

export const bitcoinCashMempoolInfo = arktype({
	loaded: 'boolean',
	size: 'number.integer >= 0',
	bytes: 'number.integer >= 0',
	usage: 'number.integer >= 0',
	total_fee: 'number',
	maxmempool: 'number.integer >= 0',
	mempoolminfee: 'number',
	minrelaytxfee: 'number',
}) satisfies Type<BitcoinCoreMempoolInfo>

export const bitcoinCashValidatedAddress = arktype({
	isvalid: 'boolean',
	'address?': 'string',
	'istokenaware?': 'boolean',
}) satisfies Type<BitcoinCashValidatedAddress>

export const bitcoinCashScannedUtxo = arktype({
	txid: 'string',
	vout: 'number.integer >= 0',
	scriptPubKey: 'string',
	amount: 'number',
	height: 'number.integer >= 0',
	'tokenData?': bitcoinCashTokenData,
}) satisfies Type<BitcoinCashScannedUtxo>

export const bitcoinCashScanTxOutSet = arktype({
	'success?': 'boolean',
	unspents: bitcoinCashScannedUtxo.array(),
	total_amount: 'number',
	'token_total_amount?': 'Record<string, string>',
}) satisfies Type<BitcoinCashScanTxOutSet>

export const bitcoinCashBlockHash = arktype('string')
export const bitcoinCashBlockCount = arktype('number.integer >= 0')
