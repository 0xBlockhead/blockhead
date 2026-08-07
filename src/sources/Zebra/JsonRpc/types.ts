import type {
	BitcoinCoreMempoolInfo,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import type {
	ZcashBlock,
	ZcashTransaction,
} from '$/sources/Zcashd/JsonRpc/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type ZebraTransparentAddressUtxo = {
	address: string
	txid: string
	height: number
	outputIndex: number
	script: string
	satoshis: number
}

export type ZebraTransparentAddressUtxos = {
	utxos: ZebraTransparentAddressUtxo[]
	hash: string
	height: number
}

export type ZebraBlock = ZcashBlock
export type ZebraTransaction = ZcashTransaction & {
	weight?: number
}

const zebraTransactionInput = arktype({
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

const zebraTransactionOutput = arktype({
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

export const zebraTransaction = arktype({
	txid: 'string',
	hash: 'string',
	version: 'number.integer',
	'overwintered?': 'boolean',
	'versiongroupid?': 'string',
	locktime: 'number.integer >= 0',
	expiryheight: 'number.integer >= 0',
	size: 'number.integer >= 0',
	'vsize?': 'number.integer >= 0',
	'weight?': 'number.integer >= 0',
	vin: zebraTransactionInput.array(),
	vout: zebraTransactionOutput.array(),
	'hex?': 'string',
	'blockhash?': 'string',
	'confirmations?': 'number.integer >= 0',
	'time?': 'number.integer >= 0',
	'blocktime?': 'number.integer >= 0',
}) satisfies Type<ZebraTransaction>

export const zebraBlock = arktype({
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
	'finalsaplingroot?': 'string',
	'blockcommitments?': 'string',
	tx: zebraTransaction.array().or('string[]'),
}) satisfies Type<ZebraBlock>

export const zebraMempoolInfo = arktype({
	loaded: 'boolean',
	size: 'number.integer >= 0',
	bytes: 'number.integer >= 0',
	usage: 'number.integer >= 0',
	total_fee: 'number',
	maxmempool: 'number.integer >= 0',
	mempoolminfee: 'number',
	minrelaytxfee: 'number',
}) satisfies Type<BitcoinCoreMempoolInfo>

export const zebraTransparentAddressUtxo = arktype({
	address: 'string',
	txid: 'string',
	height: 'number.integer >= 0',
	outputIndex: 'number.integer >= 0',
	script: 'string',
	satoshis: 'number.integer >= 0',
}) satisfies Type<ZebraTransparentAddressUtxo>

export const zebraTransparentAddressUtxos = arktype({
	utxos: zebraTransparentAddressUtxo.array(),
	hash: 'string',
	height: 'number.integer >= 0',
}) satisfies Type<ZebraTransparentAddressUtxos>

export const zebraBlockHash = arktype('string')
export const zebraBlockCount = arktype('number.integer >= 0')
