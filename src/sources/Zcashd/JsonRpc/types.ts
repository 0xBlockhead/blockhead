import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransactionInput,
	BitcoinCoreTransactionOutput,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type ZcashBlock = BitcoinCoreBlock & {
	finalsaplingroot?: string
	blockcommitments?: string
}

export type ZcashTransaction = {
	txid: string
	hash: string
	version: number
	overwintered?: boolean
	versiongroupid?: string
	locktime: number
	expiryheight: number
	size: number
	vsize?: number
	vin: BitcoinCoreTransactionInput[]
	vout: BitcoinCoreTransactionOutput[]
	hex?: string
	blockhash?: string
	confirmations?: number
	time?: number
	blocktime?: number
	vjoinsplit?: {
		vpub_old: number
		vpub_new: number
		anchor: string
		nullifiers: string[]
		commitments: string[]
		onetimePubKey: string
		randomSeed: string
		macs: string[]
		proof: string
		ciphertexts: string[]
	}[]
	vShieldedSpend?: {
		cv: string
		anchor: string
		nullifier: string
		rk: string
		proof: string
		spendAuthSig: string
	}[]
	vShieldedOutput?: {
		cv: string
		cmu: string
		ephemeralKey: string
		encCiphertext: string
		outCiphertext: string
		proof: string
	}[]
	orchard?: {
		actions: {
			cv: string
			nullifier: string
			cmx: string
			ephemeralKey: string
		}[]
		flags: number
		valueBalance: number
		anchor: string
		proof: string
		bindingSig: string
	}
}

export type ZcashTreeState = {
	hash: string
	height: number
	time: number
	sapling?: {
		skipHash: string
		commitments: {
			finalRoot: string
			finalState: string
		}
	}
	orchard?: {
		skipHash: string
		commitments: {
			finalRoot: string
			finalState: string
		}
	}
}

export type ZcashdScannedUtxo = {
	txid: string
	vout: number
	scriptPubKey: string
	amount: number
	height: number
}

export type ZcashdScanTxOutSet = {
	success?: boolean
	unspents: ZcashdScannedUtxo[]
	total_amount: number
}

export type ZcashdValidatedAddress = {
	isvalid: boolean
	address?: string
}

const zcashdTransactionInput = arktype({
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

const zcashdTransactionOutput = arktype({
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

const zcashdJoinSplit = arktype({
	vpub_old: 'number',
	vpub_new: 'number',
	anchor: 'string',
	nullifiers: 'string[]',
	commitments: 'string[]',
	onetimePubKey: 'string',
	randomSeed: 'string',
	macs: 'string[]',
	proof: 'string',
	ciphertexts: 'string[]',
})

const zcashdShieldedSpend = arktype({
	cv: 'string',
	anchor: 'string',
	nullifier: 'string',
	rk: 'string',
	proof: 'string',
	spendAuthSig: 'string',
})

const zcashdShieldedOutput = arktype({
	cv: 'string',
	cmu: 'string',
	ephemeralKey: 'string',
	encCiphertext: 'string',
	outCiphertext: 'string',
	proof: 'string',
})

const zcashdOrchardAction = arktype({
	cv: 'string',
	nullifier: 'string',
	cmx: 'string',
	ephemeralKey: 'string',
})

export const zcashdTransaction = arktype({
	txid: 'string',
	hash: 'string',
	version: 'number.integer',
	'overwintered?': 'boolean',
	'versiongroupid?': 'string',
	locktime: 'number.integer >= 0',
	expiryheight: 'number.integer >= 0',
	size: 'number.integer >= 0',
	'vsize?': 'number.integer >= 0',
	vin: zcashdTransactionInput.array(),
	vout: zcashdTransactionOutput.array(),
	'hex?': 'string',
	'blockhash?': 'string',
	'confirmations?': 'number.integer >= 0',
	'time?': 'number.integer >= 0',
	'blocktime?': 'number.integer >= 0',
	'vjoinsplit?': zcashdJoinSplit.array(),
	'vShieldedSpend?': zcashdShieldedSpend.array(),
	'vShieldedOutput?': zcashdShieldedOutput.array(),
	'orchard?': {
		actions: zcashdOrchardAction.array(),
		flags: 'number.integer >= 0',
		valueBalance: 'number',
		anchor: 'string',
		proof: 'string',
		bindingSig: 'string',
	},
}) satisfies Type<ZcashTransaction>

export const zcashdBlock = arktype({
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
	tx: zcashdTransaction.array().or('string[]'),
}) satisfies Type<ZcashBlock>

export const zcashdMempoolInfo = arktype({
	loaded: 'boolean',
	size: 'number.integer >= 0',
	bytes: 'number.integer >= 0',
	usage: 'number.integer >= 0',
	total_fee: 'number',
	maxmempool: 'number.integer >= 0',
	mempoolminfee: 'number',
	minrelaytxfee: 'number',
}) satisfies Type<BitcoinCoreMempoolInfo>

export const zcashdValidatedAddress = arktype({
	isvalid: 'boolean',
	'address?': 'string',
}) satisfies Type<ZcashdValidatedAddress>

export const zcashdScannedUtxo = arktype({
	txid: 'string',
	vout: 'number.integer >= 0',
	scriptPubKey: 'string',
	amount: 'number',
	height: 'number.integer >= 0',
}) satisfies Type<ZcashdScannedUtxo>

export const zcashdScanTxOutSet = arktype({
	'success?': 'boolean',
	unspents: zcashdScannedUtxo.array(),
	total_amount: 'number',
}) satisfies Type<ZcashdScanTxOutSet>

const zcashdTreeCommitments = arktype({
	finalRoot: 'string',
	finalState: 'string',
})

export const zcashdTreeState = arktype({
	hash: 'string',
	height: 'number.integer >= 0',
	time: 'number.integer >= 0',
	'sapling?': {
		skipHash: 'string',
		commitments: zcashdTreeCommitments,
	},
	'orchard?': {
		skipHash: 'string',
		commitments: zcashdTreeCommitments,
	},
}) satisfies Type<ZcashTreeState>

export const zcashdBlockHash = arktype('string')
export const zcashdBlockCount = arktype('number.integer >= 0')
