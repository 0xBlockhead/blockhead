import type {
	BitcoinCoreBlock,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'

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
