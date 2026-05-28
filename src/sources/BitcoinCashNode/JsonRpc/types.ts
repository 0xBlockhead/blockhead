import type {
	BitcoinCoreTransaction,
	BitcoinCoreTransactionOutput,
} from '$/sources/BitcoinCore/JsonRpc/types.ts'

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
