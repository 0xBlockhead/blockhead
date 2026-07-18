export type PetraWallet = {
	connect: () => Promise<PetraAccount>
	disconnect: () => Promise<void>
	account: PetraAccount | null
	signAndSubmitTransaction: (transaction: PetraTransaction) => Promise<PetraTransactionResponse>
	signTransaction: (transaction: PetraTransaction) => Promise<Uint8Array>
	signMessage: (message: string | Uint8Array) => Promise<PetraSignatureResponse>
	getNetwork: () => Promise<PetraNetworkInfo>
	onNetworkChange: (callback: (network: PetraNetworkInfo) => void) => void
	onAccountChange: (callback: (account: PetraAccount | null) => void) => void
}

export type PetraAccount = {
	address: string
	publicKey: string
}

export type PetraTransaction = {
	data: {
		function: string
		typeArguments: string[]
		functionArguments: (string | number | boolean | object)[]
	}
}

export type PetraTransactionResponse = {
	hash: string
}

export type PetraSignatureResponse = {
	signature: string
	bitcoinSignature?: string
	publicKey: string
}

export type PetraNetworkInfo = {
	name: string
	chainId: string
}
