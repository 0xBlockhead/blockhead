import type {
	BitcoinCoreBlock,
	BitcoinCoreTransaction,
} from '$/sources/BitcoinCore/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type ZcashBlock = BitcoinCoreBlock & {
	finalsaplingroot?: string
	blockcommitments?: string
}

export type ZcashTransaction = BitcoinCoreTransaction & {
	vjoinsplit?: JsonValue[]
	vShieldedSpend?: {
		cv: string
		anchor: string
		nullifier: string
		rk: string
		zkproof: string
		spendAuthSig: string
	}[]
	vShieldedOutput?: {
		cv: string
		cmu: string
		ephemeralKey: string
		encCiphertext: string
		outCiphertext: string
		zkproof: string
	}[]
	orchard?: {
		actions?: {
			cv: string
			nullifier: string
			cmx: string
			ephemeralKey: string
		}[]
	}
}
