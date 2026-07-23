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
