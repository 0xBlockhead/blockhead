import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	BitcoinCoreBlock,
	BitcoinCoreTransactionInput,
	BitcoinCoreTransactionOutput,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'

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
